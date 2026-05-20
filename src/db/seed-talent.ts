/**
 * Seed inicial del modulo Yutro Studio Talent.
 *
 * Idempotente: re-correrlo no falla. Las inserciones usan onConflictDoNothing
 * en la PK / unique index correspondiente.
 *
 * Uso:
 *   npm run seed:talent
 *
 * Pre-requisito: migracion 0001_groovy_war_machine.sql aplicada.
 */
import { config } from "dotenv";
import path from "node:path";

// Cargar .env.local antes de importar el cliente DB.
config({ path: path.resolve(process.cwd(), ".env.local") });

import { db } from "./index";
import { talents, talentProjects, talentProjectAccess } from "./schema";
import {
  TALENTS,
  PROJECT_SAMSUNG,
  TALENT_CLIENT_EMAILS,
} from "../lib/talent/mock-data";

async function seed() {
  // 1) Talents (30 rows)
  const talentRows = TALENTS.map((t) => ({
    code: t.code,
    nameEs: t.name.es,
    nameEn: t.name.en,
    shortDescEs: t.shortDesc.es,
    shortDescEn: t.shortDesc.en,
    phenotypeEs: t.phenotype.es,
    phenotypeEn: t.phenotype.en,
    archetypeEs: t.archetype.es,
    archetypeEn: t.archetype.en,
    toneCommercialEs: t.toneCommercial.es,
    toneCommercialEn: t.toneCommercial.en,
    gender: t.gender,
    ageRange: t.ageRange,
    ageBucket: t.ageBucket,
    category: t.category,
    status: t.status,
    market: t.market,
    suggestedUses: t.suggestedUses,
    hue: t.hue,
    sat: t.sat,
  }));
  await db.insert(talents).values(talentRows).onConflictDoNothing();

  // 2) Project Samsung
  const p = PROJECT_SAMSUNG;
  await db
    .insert(talentProjects)
    .values({
      slug: p.slug,
      name: p.name,
      client: p.client,
      market: p.market,
      categoryEs: p.categoryEs,
      maxTalents: p.maxTalents,
      maxExclusive: p.maxExclusive,
      rightsDurationMonths: p.rightsDurationMonths,
      startDate: p.startDate,
      status: p.status,
    })
    .onConflictDoNothing();

  // 3) Accesos (TALENT_CLIENT_EMAILS x project)
  const accessRows = TALENT_CLIENT_EMAILS.map((email) => ({
    projectSlug: p.slug,
    userEmail: email.toLowerCase(),
  }));
  await db.insert(talentProjectAccess).values(accessRows).onConflictDoNothing();

  console.log(
    `[seed-talent] OK — ${talentRows.length} talents, 1 project (${p.slug}), ${accessRows.length} accesses`
  );
  process.exit(0);
}

seed().catch((err) => {
  console.error("[seed-talent] FAILED:", err);
  process.exit(1);
});
