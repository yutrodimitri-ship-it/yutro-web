# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Next.js version notice

This project runs **Next.js 16.2.1** with React 19. APIs and conventions differ from earlier versions. Read `node_modules/next/dist/docs/` before writing any Next.js-specific code. All params are now `Promise<{...}>` and must be awaited.

## Commands

```bash
npm run dev          # dev server (webpack mode, not turbopack)
npm run build        # production build
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
npm run test         # vitest run (unit tests)
npm run test:watch   # vitest watch
npm run test:e2e     # playwright
npm run seed:talent  # seed talent table from src/db/seed-talent.ts
```

Run a single unit test file:
```bash
npx vitest run src/lib/talent/__tests__/casting-reducer.test.ts
```

DB migrations (requires `.env.local` with `DATABASE_URL`):
```bash
npx drizzle-kit generate   # generate migration from schema changes
npx drizzle-kit migrate    # apply migrations to DB
```

## Architecture

### Two distinct apps in one repo

**Public site** (`src/app/[locale]/`) — marketing pages (home, proyectos, servicios, blog, contacto, influencer). Content comes from Sanity CMS. Animated with GSAP + Framer Motion. Bilingual ES/EN via `next-intl`.

**YUTRO Studio** (`src/app/[locale]/studio/`) — private B2B app behind JWT auth. No Sanity. Data comes from Supabase via Drizzle ORM. Has its own layout with a persistent sidebar (`StudioSidebar`).

### Studio auth flow

`src/lib/auth.ts` issues a `studio_session` httpOnly cookie (JWT, 7-day expiry, HS256, `jose` library). `verifySession()` is called in every Studio layout/page. Auth guards cascade: `/studio/layout.tsx` handles the unauthenticated case; `/studio/talent/layout.tsx` additionally checks project access via `userHasTalentAccess()`.

Roles: `admin` | `client`. Admins land on `/studio/talent/admin`; clients land on `/studio/talent`.

### Studio Talent module

The core B2B product. A casting house workflow:

- **Talent catalog** — `talents` table, images on Cloudflare R2, served via signed URLs through `/api/studio/talent/image/[code]/[variant]`
- **Projects** — `talent_projects` table. Clients access projects via `talent_project_access` (email allowlist per project)
- **NDA gate** — `ndaAcceptances` table. Clients must accept NDA before seeing catalog. Managed by `NdaGate` component
- **Casting cart** — client-side state via `useReducer` in `src/lib/talent/casting-reducer.ts`. Submitted as `casting_submissions`
- **Audit log** — every access event written to `talent_access_logs`

### Database

`postgres-js` with `prepare: false` (never switch to `node-postgres` / `pg` adapter). This is mandatory for Supabase Supavisor pooler compatibility. `DATABASE_URL` must point to port **6543** (transaction mode), not 5432.

Schema: `src/db/schema.ts`. Migrations: `drizzle/` directory.

### CSS / Design tokens

Tailwind v4 with CSS-first config (no `tailwind.config.js`). Tokens defined in `src/app/globals.css` as CSS custom properties. Primary brand color: `--primary` / `--accent` = YUTRO orange `oklch(0.68 0.21 42)`.

Studio Talent has its own scoped token set (`--talent-ink`, `--talent-bg`, `--talent-line`, `--talent-ink-mute`, `--talent-ink-dim`) applied at the talent layout level — editorial magazine aesthetic, separate from the main site's design system.

### i18n

`next-intl` v4. Locales: `es` (default), `en`. All public routes are under `[locale]`. Studio routes also carry `[locale]` but the UI is Spanish-only. Translation strings in `messages/es.json` and `messages/en.json`.

### Image storage

Talent images: Cloudflare R2 (`src/lib/talent/r2-client.ts`). Public site images: Sanity CDN (`cdn.sanity.io`). Both domains whitelisted in `next.config.ts`.

### Security

CSP nonce is injected dynamically in `src/proxy.ts` (Next.js middleware), not in `next.config.ts`. Rate limiting uses the `rate_limit_entries` DB table. CSRF token via `src/lib/csrf.ts`.

### Testing

Unit tests: Vitest, co-located in `src/lib/talent/__tests__/`. Cover casting business logic (reducer, idempotency, access checks, talent release).
E2E: Playwright, in `e2e/`. Cover NDA persistence, talent flow, admin lock release, and casting limits.
