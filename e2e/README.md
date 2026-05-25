# E2E tests — Playwright

End-to-end coverage for the critical user flows of Studio Talent.

> ⚠️ **These tests mutate the database.** Do **NOT** run them against
> production. Set `DATABASE_URL` to a dedicated test database (or a
> Supabase branch) before invoking `npm run test:e2e`.

## Suite

| Spec | Flow | Mutates DB? |
|---|---|---|
| `talent-flow.spec.ts` | client login → NDA → casting submit | yes (1 `casting_submissions` row + maybe 1 `nda_acceptances` row) |
| `talent-limits.spec.ts` | client login → fill shortlist to max | no |
| `nda-persistence.spec.ts` | NDA persists in DB across sessionStorage clear | yes (1 `nda_acceptances` row) |
| `admin-lock-release.spec.ts` | admin login → locks page → release talent | yes (mutates `casting_submissions`) |

## Prerequisites

### 1. Test database

Use a dedicated test DB. Easiest option on Supabase:

```bash
# Create a branch (Supabase Pro) — copies schema + clean data
# Then set DATABASE_URL to the branch's pooler URL
```

Or use a local Postgres with the migrations applied:

```bash
# Apply drizzle/0000-0005 in order
psql $DATABASE_URL < drizzle/0000_whole_fantastic_four.sql
# ... etc
```

### 2. Seed users

Two users must exist with known passwords (use `scripts/reset-password.ts`):

```bash
# Admin
npx tsx scripts/reset-password.ts admin@test.local "strong-password-1"

# Client (also needs a row in talent_project_access for the target project)
npx tsx scripts/reset-password.ts client@test.local "strong-password-2"
```

Then grant the client access via the admin UI or directly:

```sql
INSERT INTO talent_project_access (project_slug, user_email, granted_by)
  VALUES ('libre', 'client@test.local',
          (SELECT id FROM users WHERE email='admin@test.local'));
```

### 3. Seed talents

The catalog needs at least `max_talents + 1` active talents. Run:

```bash
npm run seed:talent
```

### 4. Env vars

Copy `.env.example` and set:

```bash
PLAYWRIGHT_BASE_URL=http://localhost:3000   # default
PLAYWRIGHT_PROJECT_SLUG=libre               # default
PLAYWRIGHT_PROJECT_MAX_TALENTS=10           # must match talent_projects.max_talents

PLAYWRIGHT_CLIENT_EMAIL=client@test.local
PLAYWRIGHT_CLIENT_PASSWORD=strong-password-2

PLAYWRIGHT_ADMIN_EMAIL=admin@test.local
PLAYWRIGHT_ADMIN_PASSWORD=strong-password-1
```

## Running

```bash
# All specs (serial, hits a real DB)
npm run test:e2e

# Single spec
npx playwright test e2e/admin-lock-release.spec.ts

# Headed (see the browser)
npx playwright test --headed

# UI mode (interactive)
npx playwright test --ui
```

## What to fix when a spec fails

| Failure | Likely cause | Fix |
|---|---|---|
| `Timeout … login` | wrong credentials in env | rotate password via `reset-password.ts` |
| `waitForURL .../libre$` never matches | client has no access to the project | INSERT in `talent_project_access` |
| `Sin talentos comprometidos` skip in lock spec | no confirmed castings in DB | run `talent-flow.spec` first or seed a submission |
| `data-talent='project']` not visible | catalog has 0 active talents | `npm run seed:talent` |
| `cupo completo` not visible | `PLAYWRIGHT_PROJECT_MAX_TALENTS` doesn't match DB | sync env value with row's `max_talents` |

## Coverage gaps to add later

- Submission confirmation (admin marks a `pending` submission as `confirmed`).
- Exclusivity toggle hits its own cap (`max_exclusive`).
- Cross-project lock: client A confirms with exclusivity, client B sees that
  talent as locked in the catalog of project B.
- Email delivery via Resend webhook (requires inbox capture).

## Why specs sometimes skip

The lock-release spec uses `test.skip(true, …)` when the DB has no
confirmed submissions — that's a setup state, not a bug. To exercise it,
seed a confirmed submission first.
