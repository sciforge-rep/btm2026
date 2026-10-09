# Poster award voting

Participants get 3 votes each for the best posters, using an anonymous 8-character code (printed slip with QR code). They vote with the star buttons on the app's Posters tab and can change their votes until voting closes. Organisers see the results on a separate page.

- **Voting window:** Wed 14 Oct 2026, 08:00 – Thu 15 Oct 2026, 16:00 (Berlin time). Enforced by the server.
- **Backend:** Supabase project `btm2026-poster-voting` (Frankfurt, `eu-central-1`), organisation SciForge. Schema and functions: [`schema.sql`](schema.sql).
- **App:** `renderVotingCard` / `togglePosterVote` in `src/app.js`; settings (API URL, publishable key, window, texts) in `data/app-config.json` → `voting`.
- **Results dashboard:** [`/voting-results/`](https://sciforge-rep.github.io/btm2026/voting-results/), not linked from the app. Needs the admin key; without it the server returns nothing.
- **QR codes** link to `https://sciforge-rep.github.io/btm2026/#/vote/<CODE>`, which stores the code and opens the Posters tab.

## How it is protected

- The tables have row-level security with no policies, so the public API key cannot read or write them directly.
- Participants can only call `voting_status` (their own votes) and `set_poster_vote`. The server checks the code, the voting window and the limit of 3 (with a row lock, so parallel taps cannot exceed it).
- `voting_results` returns totals only with the correct admin key (stored as a bcrypt hash).
- Codes are not linked to names, so votes are anonymous.

## Never commit

The code list, the code slips and the admin key. They are kept by the organisers only.

## Common tasks (Supabase dashboard → SQL editor)

```sql
-- Change the voting window
update public.voting_settings set opens_at = '2026-10-14 08:00 Europe/Berlin', closes_at = '2026-10-15 16:00 Europe/Berlin';

-- Add more codes (8 characters from ABCDEFGHJKMNPQRSTUVWXYZ23456789; print slips for them)
insert into public.voting_codes (code) values ('ABCD2345'), ('EFGH6789');

-- Disable a lost code (its votes are removed too)
delete from public.voting_codes where code = 'ABCD2345';

-- Change the admin key
update public.voting_settings set admin_key_hash = extensions.crypt('new-key', extensions.gen_salt('bf', 10));

-- Clear test votes (test codes are never counted in results anyway)
delete from public.votes where code in (select code from public.voting_codes where is_test);
```
