# Drizzle migrations — manual sync state

> **Heads-up:** `_journal.json` is out of sync with the SQL files on disk.
> The migrations `0003_intel_access.sql`, `0004_drop_legacy_generation.sql`,
> and `0005_talent_v3.sql` were authored by hand and are intended to be
> applied through the Supabase SQL editor / `psql`, **not** via
> `drizzle-kit migrate`.

## Why

`drizzle-kit generate` infers diffs from the latest snapshot. Several
schema changes (Intel access flag, dropping the avatar-generation module,
talent v3 column reshape with a NOT NULL backfill) needed surgical SQL —
explicit `IF EXISTS`, multi-step `ADD COLUMN → UPDATE → SET NOT NULL`,
and archival warnings — that `drizzle-kit` cannot express on its own.

## How to apply

1. Open Supabase Studio → SQL editor (or `psql $DATABASE_URL`).
2. Run the SQL files in order (`0003`, `0004`, `0005`) — each is
   idempotent (`IF EXISTS` / `IF NOT EXISTS`).
3. **Before `0004`,** archive the generation-pipeline tables — see the
   header comment of `0004_drop_legacy_generation.sql`.

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
