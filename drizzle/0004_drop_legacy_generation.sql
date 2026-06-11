-- ─────────────────────────────────────────────────────────────────────
-- 0004 — Drop legacy avatar-generation module (Studio v1)
-- ─────────────────────────────────────────────────────────────────────
-- Removes tables and columns no longer used after migrating Studio from
-- local ComfyUI/Gemini avatar generation to the Talent licensing module.
--
-- ⚠️  DATA LOSS WARNING
-- Before running this in production, archive the data:
--
--   CREATE SCHEMA IF NOT EXISTS archive_2026_05;
--   CREATE TABLE archive_2026_05.generations         AS TABLE generations;
--   CREATE TABLE archive_2026_05.generation_images   AS TABLE generation_images;
--   CREATE TABLE archive_2026_05.credit_transactions AS TABLE credit_transactions;
--   -- users.credits is just an int column; export with:
--   --   COPY (SELECT id, email, credits FROM users WHERE credits > 0) TO ...
--
-- ─────────────────────────────────────────────────────────────────────

-- Drop FKs implicitly via CASCADE on the child tables
DROP TABLE IF EXISTS "credit_transactions" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "generation_images" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "generations" CASCADE;
--> statement-breakpoint

-- users.credits is gone from schema.ts
ALTER TABLE "users" DROP COLUMN IF EXISTS "credits";
