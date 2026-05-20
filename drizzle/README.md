# Drizzle migrations — manual sync state

> **Heads-up:** `_journal.json` is out of sync with the SQL files on disk.
> The migrations `0003_intel_access.sql` through `0006_rls_deny_all.sql`
> were authored by hand and applied through the Supabase SQL editor
> (or the `apply_migration` MCP tool), **not** via `drizzle-kit migrate`.

## Why

`drizzle-kit generate` infers diffs from the latest snapshot. Several
schema changes (Intel access flag, dropping the avatar-generation module,
talent v3 column reshape with a NOT NULL backfill, RLS policies) need
surgical SQL — explicit `IF EXISTS`, multi-step `ADD COLUMN → UPDATE →
SET NOT NULL`, RLS-and-policy creation — that `drizzle-kit` cannot express
on its own.

## Migration order

| File | Purpose | Idempotent? |
|---|---|---|
| `0000_whole_fantastic_four.sql` | Initial baseline (contact, users) | yes |
| `0001_groovy_war_machine.sql`   | Talent tables + relations | yes |
| `0002_harsh_lester.sql`         | Small follow-up | yes |
| `0003_intel_access.sql`         | `users.can_access_intel` column | yes (`IF NOT EXISTS`) |
| `0004_drop_legacy_generation.sql` | Drop avatar-generation module tables | yes (`IF EXISTS`) |
| `0005_talent_v3.sql`            | Bios, editorial score, project category | yes |
| `0006_rls_deny_all.sql`         | Defense-in-depth deny-all RLS | yes (idempotent if RLS already enabled) |

## How to apply (fresh DB)

1. Open Supabase Studio → SQL editor (or `psql $DATABASE_URL`).
2. Run the SQL files in order — each is idempotent.
3. **Before `0004`,** archive the legacy generation tables — see the
   header comment of `0004_drop_legacy_generation.sql`.
4. After `0006`, confirm via `get_advisors`: the
   `rls_disabled_in_public` errors should be gone.

## Security model — why deny-all RLS

Pick a strategy that matches your auth model. This project uses
**Strategy 1**.

### Strategy 1 — Custom JWT in cookies + service role for DB (current)

The app authenticates via a custom JWT stored in an HTTP-only cookie,
verified server-side in API routes (`verifySession`, `requireAdmin`).
All database access goes through `pg.Pool` with the service role
`DATABASE_URL`. The service role has the `BYPASSRLS` attribute, so RLS
policies do not affect the application's normal traffic.

`0006_rls_deny_all.sql` adds **`RESTRICTIVE deny-all` policies** for the
`anon` and `authenticated` roles on every public table. Purpose:
defense-in-depth against accidental PostgREST exposure (e.g. if someone
discovers the project's Supabase URL + anon key and tries
`GET /rest/v1/users`).

**Do not** spend effort designing per-row policies here — they would be
security theater for a code path (`auth.uid()` / `auth.jwt()`) that the
app does not exercise.

### Strategy 2 — Supabase Auth or PostgREST exposure (future)

If the app ever migrates to Supabase Auth, or exposes PostgREST queries
to clients via `@supabase/supabase-js`, replace `0006_rls_deny_all.sql`
with per-table per-role policies that use `auth.uid()`. Design that
migration with proper testing (each policy needs a test that proves it
denies the wrong access and allows the right one).

## Resyncing the journal afterwards

After all manual migrations are applied to **all** environments
(dev, staging, prod) you can resync the Drizzle metadata in one of two
ways:

### Option A — Adopt as official migrations (recommended)

```bash
# With your DATABASE_URL pointing at a clean DB that already has the
# manual migrations applied, run:
npx drizzle-kit generate --name=resync_after_manual_migrations
```

If the schema matches the DB, the generated SQL will be empty — delete
that empty file, and commit only the regenerated `_journal.json` +
`meta/*_snapshot.json`.

### Option B — Reset journal to current schema

If Option A produces noise, delete `drizzle/meta/_journal.json` and
`drizzle/meta/*_snapshot.json`, then:

```bash
npx drizzle-kit generate --name=baseline
```

…and mark the baseline as already-applied in the
`drizzle.__drizzle_migrations` table (so it doesn't re-run).
