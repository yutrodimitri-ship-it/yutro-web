-- Sprint 2 — Extensión de talents con campos públicos.
--
-- No-destructivo: todas las columnas son nullable o con default. El
-- roster privado existente queda intacto; solo se exponen al público
-- los talentos que un admin marca explícitamente public_visible=true.
--
-- Aplicado en Supabase via MCP el 2026-05-21 (migration
-- sprint2_talents_public_columns). Este archivo está en el repo para
-- mantener la cadena de migraciones de Drizzle en paridad.

ALTER TABLE talents
  ADD COLUMN IF NOT EXISTS public_visible BOOLEAN DEFAULT FALSE NOT NULL,
  ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'standard' NOT NULL,
  ADD COLUMN IF NOT EXISTS instagram_handle TEXT,
  ADD COLUMN IF NOT EXISTS instagram_followers INTEGER,
  ADD COLUMN IF NOT EXISTS public_bio_es TEXT,
  ADD COLUMN IF NOT EXISTS public_bio_en TEXT,
  ADD COLUMN IF NOT EXISTS public_slug TEXT;

ALTER TABLE talents DROP CONSTRAINT IF EXISTS talents_tier_check;
ALTER TABLE talents ADD CONSTRAINT talents_tier_check
  CHECK (tier IN ('standard', 'featured'));

-- Unique partial index: slug solo único cuando no es null. Patrón
-- estándar para "unique-if-present" en Postgres.
CREATE UNIQUE INDEX IF NOT EXISTS talents_public_slug_unique
  ON talents (public_slug)
  WHERE public_slug IS NOT NULL;

-- Lectura del catálogo público golpea esto en cada request del
-- lookbook. Índice parcial filtrado mantiene el roster privado fuera.
CREATE INDEX IF NOT EXISTS talents_public_visible_idx
  ON talents (public_visible, tier)
  WHERE public_visible = TRUE;
