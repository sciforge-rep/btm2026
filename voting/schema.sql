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
