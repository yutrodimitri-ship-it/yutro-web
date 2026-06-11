-- ─────────────────────────────────────────────────────────────────────
-- 0006 — Row-Level Security: deny-all on all public tables
-- ─────────────────────────────────────────────────────────────────────
-- Closes Supabase advisor errors (rls_disabled_in_public) and adds
-- defense-in-depth against accidental PostgREST exposure via the anon
-- key.
--
-- WHY DENY-ALL (and not per-row policies):
--   The application authenticates via a custom JWT stored in an
--   HTTP-only cookie and accesses the DB through pg.Pool + DATABASE_URL
--   (service role pooler). It does NOT use Supabase Auth, so the
--   `auth.uid()` / `auth.jwt()` claims used by typical RLS policies
--   would be empty — designing per-row policies for that code path
--   would be writing security theater for a flow that doesn't exist.
--
--   The service_role role used by the app has the BYPASSRLS attribute,
--   so these policies do NOT affect normal application traffic.
--
--   What they DO protect against: someone discovering the project's
--   Supabase URL + anon key and querying PostgREST directly
--   (e.g. `GET /rest/v1/users` with the anon key). Without this
--   migration, those queries succeed and leak data.
--
-- WHEN TO REPLACE THIS WITH PER-ROW POLICIES:
--   Only when the application starts using Supabase Auth or exposing
--   PostgREST queries to clients (e.g. via @supabase/supabase-js). At
--   that point, design real policies per table per role; this file
--   becomes a baseline to override.
--
-- ─────────────────────────────────────────────────────────────────────

-- ─── users ───────────────────────────────────────────────────────────
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY deny_all_anon_auth ON public.users
  AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false);
--> statement-breakpoint

-- ─── contact_submissions ─────────────────────────────────────────────
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY deny_all_anon_auth ON public.contact_submissions
  AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false);
--> statement-breakpoint

-- ─── rate_limit_entries ──────────────────────────────────────────────
ALTER TABLE public.rate_limit_entries ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY deny_all_anon_auth ON public.rate_limit_entries
  AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false);
--> statement-breakpoint

-- ─── talent_project_access ───────────────────────────────────────────
ALTER TABLE public.talent_project_access ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY deny_all_anon_auth ON public.talent_project_access
  AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false);
--> statement-breakpoint

-- ─── nda_acceptances ─────────────────────────────────────────────────
ALTER TABLE public.nda_acceptances ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY deny_all_anon_auth ON public.nda_acceptances
  AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false);
--> statement-breakpoint

-- ─── talents ─────────────────────────────────────────────────────────
ALTER TABLE public.talents ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY deny_all_anon_auth ON public.talents
  AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false);
--> statement-breakpoint

-- ─── casting_submissions ─────────────────────────────────────────────
ALTER TABLE public.casting_submissions ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY deny_all_anon_auth ON public.casting_submissions
  AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false);
--> statement-breakpoint

-- ─── talent_projects ─────────────────────────────────────────────────
ALTER TABLE public.talent_projects ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY deny_all_anon_auth ON public.talent_projects
  AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false);
--> statement-breakpoint

-- ─── talent_access_logs ──────────────────────────────────────────────
ALTER TABLE public.talent_access_logs ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE POLICY deny_all_anon_auth ON public.talent_access_logs
  AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false);
