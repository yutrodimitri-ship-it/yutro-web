-- ─────────────────────────────────────────────────────────────────────
-- 0005 — Talent module v3: bios, editorial score, project categories
-- ─────────────────────────────────────────────────────────────────────
-- Aligns schema with the new talent_projects/talents shape after the
-- Fase 3 refactor:
--   • talents:         + bio_es, bio_en, editorial_score
--   • talent_projects: + category_es (single industry vertical, NOT NULL)
--   • talent_projects: − 11 legacy columns (contact_*, exclusivity_*,
--                       rights_duration_{es,en}, industry_sector,
--                       blocked_talent_codes)
--
-- The category_es backfill maps from the OLD exclusivity_category_es when
-- present, falling back to 'Retail' as a safe default. Verify all rows
-- afterwards:
--   SELECT slug, category_es FROM talent_projects;
-- ─────────────────────────────────────────────────────────────────────

-- ─── talents: additive (safe) ────────────────────────────────────────
ALTER TABLE "talents" ADD COLUMN IF NOT EXISTS "bio_es" text;
--> statement-breakpoint
ALTER TABLE "talents" ADD COLUMN IF NOT EXISTS "bio_en" text;
--> statement-breakpoint
ALTER TABLE "talents"
  ADD COLUMN IF NOT EXISTS "editorial_score" integer NOT NULL DEFAULT 0;
--> statement-breakpoint

-- ─── talent_projects: 3-step NOT NULL backfill ───────────────────────
-- 1) add nullable
ALTER TABLE "talent_projects" ADD COLUMN IF NOT EXISTS "category_es" text;
--> statement-breakpoint
-- 2) backfill from old exclusivity_category_es; fallback to 'Retail'
UPDATE "talent_projects"
   SET "category_es" = COALESCE(
     NULLIF("exclusivity_category_es", ''),
     'Retail'
   )
 WHERE "category_es" IS NULL;
--> statement-breakpoint
-- 3) promote to NOT NULL
ALTER TABLE "talent_projects" ALTER COLUMN "category_es" SET NOT NULL;
--> statement-breakpoint

-- Optional integrity check: keep values inside the Zod enum.
-- Comment out if you prefer to let the application be the only validator.
ALTER TABLE "talent_projects"
  ADD CONSTRAINT "talent_projects_category_es_check"
  CHECK ("category_es" IN (
    'Telco','Banca','Retail','Bebestibles','Alimentos','Belleza',
    'Automotriz','Tecnología','Salud','Educación','Inmobiliaria',
    'Turismo','Seguros','Energía','Moda','Hogar'
  ));
--> statement-breakpoint

-- ─── talent_projects: drop legacy columns ────────────────────────────
ALTER TABLE "talent_projects" DROP COLUMN IF EXISTS "contact_email";
--> statement-breakpoint
ALTER TABLE "talent_projects" DROP COLUMN IF EXISTS "contact_name";
--> statement-breakpoint
ALTER TABLE "talent_projects" DROP COLUMN IF EXISTS "rights_duration_es";
--> statement-breakpoint
ALTER TABLE "talent_projects" DROP COLUMN IF EXISTS "rights_duration_en";
--> statement-breakpoint
ALTER TABLE "talent_projects" DROP COLUMN IF EXISTS "exclusivity_mode";
--> statement-breakpoint
ALTER TABLE "talent_projects" DROP COLUMN IF EXISTS "exclusivity_category_es";
--> statement-breakpoint
ALTER TABLE "talent_projects" DROP COLUMN IF EXISTS "exclusivity_category_en";
--> statement-breakpoint
ALTER TABLE "talent_projects" DROP COLUMN IF EXISTS "exclusivity_help_es";
--> statement-breakpoint
ALTER TABLE "talent_projects" DROP COLUMN IF EXISTS "exclusivity_help_en";
--> statement-breakpoint
ALTER TABLE "talent_projects" DROP COLUMN IF EXISTS "industry_sector";
--> statement-breakpoint
ALTER TABLE "talent_projects" DROP COLUMN IF EXISTS "blocked_talent_codes";
--> statement-breakpoint

-- ─── Useful indexes for the new editorial-anchor sort ────────────────
CREATE INDEX IF NOT EXISTS "talents_editorial_score_active_idx"
  ON "talents" ("editorial_score" DESC, "is_active");
