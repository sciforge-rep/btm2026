-- Poster voting backend (Supabase project "btm2026-poster-voting", eu-central-1).
-- Applied as migration "poster_voting". Contains no codes and no admin key:
-- those are inserted separately and must never be committed (see README.md).

create extension if not exists pgcrypto with schema extensions;

-- Settings: a single row with the voting window and the admin key hash.
create table public.voting_settings (
  id smallint primary key default 1 check (id = 1),
  opens_at timestamptz not null,
  closes_at timestamptz not null,
  max_votes smallint not null default 3,
  admin_key_hash text not null
);

-- One row per anonymous voting code. Test codes ignore the voting window and are excluded from results.
create table public.voting_codes (
  code text primary key check (code ~ '^[A-Z0-9]{8}$'),
  is_test boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.votes (
  code text not null references public.voting_codes(code) on delete cascade,
  poster_number text not null check (poster_number ~ '^[A-Z][0-9]{1,3}$'),
  created_at timestamptz not null default now(),
  primary key (code, poster_number)
);

-- No policies: the tables are unreadable through the API. All access goes through the functions below.
alter table public.voting_settings enable row level security;
alter table public.voting_codes enable row level security;
alter table public.votes enable row level security;
revoke all on public.voting_settings, public.voting_codes, public.votes from anon, authenticated;

create or replace function public.normalise_voting_code(p_code text)
returns text language sql immutable set search_path = '' as $$
  select upper(regexp_replace(coalesce(p_code, ''), '[^A-Za-z0-9]', '', 'g'))
$$;

-- Participant: status of a code (own votes only, never totals).
create or replace function public.voting_status(p_code text)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  v_code text := public.normalise_voting_code(p_code);
  v_settings public.voting_settings;
  v_test boolean;
begin
  select * into v_settings from public.voting_settings where id = 1;
  select is_test into v_test from public.voting_codes where code = v_code;
  if not found then
    return jsonb_build_object('valid', false, 'opensAt', v_settings.opens_at, 'closesAt', v_settings.closes_at, 'maxVotes', v_settings.max_votes, 'now', now());
  end if;
  return jsonb_build_object(
    'valid', true,
    'test', v_test,
    'open', v_test or now() between v_settings.opens_at and v_settings.closes_at,
    'opensAt', v_settings.opens_at,
    'closesAt', v_settings.closes_at,
    'maxVotes', v_settings.max_votes,
    'now', now(),
    'votes', coalesce((select jsonb_agg(poster_number order by created_at) from public.votes where code = v_code), '[]'::jsonb)
  );
end $$;

-- Participant: add or remove a vote. Enforces the code, the window and the vote limit.
create or replace function public.set_poster_vote(p_code text, p_poster text, p_vote boolean)
returns jsonb language plpgsql volatile security definer set search_path = '' as $$
declare
  v_code text := public.normalise_voting_code(p_code);
  v_poster text := upper(trim(coalesce(p_poster, '')));
  v_settings public.voting_settings;
  v_test boolean;
  v_count int;
begin
  select * into v_settings from public.voting_settings where id = 1;
  -- Lock the code row so parallel requests cannot exceed the limit.
  select is_test into v_test from public.voting_codes where code = v_code for update;
  if not found then raise exception 'invalid_code' using errcode = 'P0001'; end if;
  if not v_test and now() < v_settings.opens_at then raise exception 'not_open' using errcode = 'P0001'; end if;
  if not v_test and now() > v_settings.closes_at then raise exception 'closed' using errcode = 'P0001'; end if;
  if v_poster !~ '^[A-Z][0-9]{1,3}$' then raise exception 'invalid_poster' using errcode = 'P0001'; end if;

  if p_vote then
    if not exists (select 1 from public.votes where code = v_code and poster_number = v_poster) then
      select count(*) into v_count from public.votes where code = v_code;
      if v_count >= v_settings.max_votes then raise exception 'limit_reached' using errcode = 'P0001'; end if;
      insert into public.votes (code, poster_number) values (v_code, v_poster);
    end if;
  else
    delete from public.votes where code = v_code and poster_number = v_poster;
  end if;
  return public.voting_status(v_code);
end $$;

-- Organisers: results, protected by the admin key.
create or replace function public.voting_results(p_admin_key text)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  v_settings public.voting_settings;
begin
  select * into v_settings from public.voting_settings where id = 1;
  if v_settings.admin_key_hash is null or extensions.crypt(coalesce(p_admin_key, ''), v_settings.admin_key_hash) <> v_settings.admin_key_hash then
    perform pg_sleep(1);
    raise exception 'forbidden' using errcode = 'P0001';
  end if;
  return jsonb_build_object(
    'generatedAt', now(),
    'opensAt', v_settings.opens_at,
    'closesAt', v_settings.closes_at,
    'maxVotes', v_settings.max_votes,
    'codesIssued', (select count(*) from public.voting_codes where not is_test),
    'codesUsed', (select count(distinct v.code) from public.votes v join public.voting_codes c using (code) where not c.is_test),
    'votesCast', (select count(*) from public.votes v join public.voting_codes c using (code) where not c.is_test),
    'posters', coalesce((select jsonb_agg(jsonb_build_object('number', poster_number, 'votes', n) order by n desc, poster_number)
      from (select v.poster_number, count(*) as n from public.votes v join public.voting_codes c using (code) where not c.is_test group by v.poster_number) t), '[]'::jsonb)
  );
end $$;

revoke all on function public.normalise_voting_code(text), public.voting_status(text), public.set_poster_vote(text, text, boolean), public.voting_results(text) from public;
grant execute on function public.voting_status(text), public.set_poster_vote(text, text, boolean), public.voting_results(text), public.normalise_voting_code(text) to anon;

-- ---------------------------------------------------------------------------
-- Participant feedback (migrations "participant_feedback" and
-- "feedback_results_exclude_test_ids"). Same project, same admin key.
-- ---------------------------------------------------------------------------
alter table public.voting_settings add column if not exists feedback_closes_at timestamptz not null default '2026-11-30 23:59 Europe/Berlin';

create table public.feedback (
  client_id uuid primary key,              -- random id stored on the participant's device
  overall smallint not null check (overall between 1 and 5),
  programme smallint check (programme between 1 and 5),
  organisation smallint check (organisation between 1 and 5),
  social smallint check (social between 1 and 5),
  app smallint check (app between 1 and 5),
  attend_again text check (attend_again in ('yes', 'maybe', 'no')),
  role text check (role in ('phd', 'postdoc', 'pi', 'clinician', 'industry', 'other')),
  liked text check (char_length(liked) <= 2000),
  improve text check (char_length(improve) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.feedback enable row level security;
revoke all on public.feedback from anon, authenticated;

create or replace function public.feedback_rating(p jsonb, p_key text)
returns smallint language sql immutable set search_path = '' as $$
  select case when jsonb_typeof(p -> p_key) = 'number' and (p ->> p_key)::numeric between 1 and 5 then (p ->> p_key)::numeric::smallint end
$$;

create or replace function public.feedback_text(p jsonb, p_key text)
returns text language sql immutable set search_path = '' as $$
  select nullif(left(btrim(coalesce(p ->> p_key, '')), 2000), '')
$$;

-- Participant: submit or update their own feedback (one entry per device).
create or replace function public.submit_feedback(p_client_id uuid, p_answers jsonb)
returns jsonb language plpgsql volatile security definer set search_path = '' as $$
declare
  v_closes timestamptz;
  v_overall smallint := public.feedback_rating(p_answers, 'overall');
begin
  select feedback_closes_at into v_closes from public.voting_settings where id = 1;
  if now() > v_closes then raise exception 'closed' using errcode = 'P0001'; end if;
  if p_client_id is null or v_overall is null then raise exception 'invalid' using errcode = 'P0001'; end if;
  insert into public.feedback as f (client_id, overall, programme, organisation, social, app, attend_again, role, liked, improve)
  values (p_client_id, v_overall,
    public.feedback_rating(p_answers, 'programme'), public.feedback_rating(p_answers, 'organisation'),
    public.feedback_rating(p_answers, 'social'), public.feedback_rating(p_answers, 'app'),
    case when p_answers ->> 'attendAgain' in ('yes', 'maybe', 'no') then p_answers ->> 'attendAgain' end,
    case when p_answers ->> 'role' in ('phd', 'postdoc', 'pi', 'clinician', 'industry', 'other') then p_answers ->> 'role' end,
    public.feedback_text(p_answers, 'liked'), public.feedback_text(p_answers, 'improve'))
  on conflict (client_id) do update set
    overall = excluded.overall, programme = excluded.programme, organisation = excluded.organisation,
    social = excluded.social, app = excluded.app, attend_again = excluded.attend_again, role = excluded.role,
    liked = excluded.liked, improve = excluded.improve, updated_at = now();
  return jsonb_build_object('saved', true, 'closesAt', v_closes);
end $$;

-- Participant: read back only their own feedback (to edit it).
create or replace function public.my_feedback(p_client_id uuid)
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object('closesAt', (select feedback_closes_at from public.voting_settings where id = 1),
    'answers', (select jsonb_build_object('overall', overall, 'programme', programme, 'organisation', organisation, 'social', social, 'app', app,
      'attendAgain', attend_again, 'role', role, 'liked', liked, 'improve', improve, 'updatedAt', updated_at)
      from public.feedback where client_id = p_client_id))
$$;

-- Organisers: all feedback, protected by the admin key. Client ids starting with
-- 00000000-0000-4000-8000- are reserved for tests and never counted.
create or replace function public.feedback_results(p_admin_key text)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  v_hash text;
begin
  select admin_key_hash into v_hash from public.voting_settings where id = 1;
  if v_hash is null or extensions.crypt(coalesce(p_admin_key, ''), v_hash) <> v_hash then
    perform pg_sleep(1);
    raise exception 'forbidden' using errcode = 'P0001';
  end if;
  return jsonb_build_object(
    'generatedAt', now(),
    'closesAt', (select feedback_closes_at from public.voting_settings where id = 1),
    'entries', coalesce((select jsonb_agg(jsonb_build_object('overall', overall, 'programme', programme, 'organisation', organisation,
      'social', social, 'app', app, 'attendAgain', attend_again, 'role', role, 'liked', liked, 'improve', improve,
      'createdAt', created_at, 'updatedAt', updated_at) order by updated_at desc)
      from public.feedback where client_id::text not like '00000000-0000-4000-8000-%'), '[]'::jsonb)
  );
end $$;

revoke all on function public.feedback_rating(jsonb, text), public.feedback_text(jsonb, text), public.submit_feedback(uuid, jsonb), public.my_feedback(uuid), public.feedback_results(text) from public;
grant execute on function public.submit_feedback(uuid, jsonb), public.my_feedback(uuid), public.feedback_results(text) to anon;
