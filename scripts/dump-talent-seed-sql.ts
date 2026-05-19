/**
 * Dump del seed Talent como SQL plano para aplicar via Supabase MCP.
 * Uso: npx tsx scripts/dump-talent-seed-sql.ts > /tmp/seed.sql
 */
import {
  TALENTS,
  PROJECT_SAMSUNG,
  TALENT_CLIENT_EMAILS,
} from "../src/lib/talent/mock-data";

function quote(v: string | null | undefined): string {
  if (v === null || v === undefined) return "NULL";
  return "'" + v.replace(/'/g, "''") + "'";
}

function jsonbArr(arr: unknown[]): string {
  return "'" + JSON.stringify(arr).replace(/'/g, "''") + "'::jsonb";
}

const lines: string[] = [];

// Talents
for (const t of TALENTS) {
  lines.push(
    `INSERT INTO talents (code, name_es, name_en, short_desc_es, short_desc_en, phenotype_es, phenotype_en, archetype_es, archetype_en, tone_commercial_es, tone_commercial_en, gender, age_range, age_bucket, category, status, market, suggested_uses, hue, sat) VALUES (` +
      [
        quote(t.code),
        quote(t.name.es),
        quote(t.name.en),
        quote(t.shortDesc.es),
        quote(t.shortDesc.en),
        quote(t.phenotype.es),
        quote(t.phenotype.en),
        quote(t.archetype.es),
        quote(t.archetype.en),
        quote(t.toneCommercial.es),
        quote(t.toneCommercial.en),
        quote(t.gender),
        quote(t.ageRange),
        quote(t.ageBucket),
        quote(t.category),
        quote(t.status),
        jsonbArr(t.market),
        jsonbArr(t.suggestedUses),
        String(t.hue),
        String(t.sat),
      ].join(", ") +
      `) ON CONFLICT (code) DO NOTHING;`
  );
}

// Project
const p = PROJECT_SAMSUNG;
lines.push(
  `INSERT INTO talent_projects (slug, name, client, market, category_es, max_talents, max_exclusive, rights_duration_months, start_date, status) VALUES (` +
    [
      quote(p.slug),
      quote(p.name),
      quote(p.client),
      quote(p.market),
      quote(p.categoryEs),
      String(p.maxTalents),
      String(p.maxExclusive),
      String(p.rightsDurationMonths),
      quote(p.startDate),
      quote(p.status),
    ].join(", ") +
    `) ON CONFLICT (slug) DO NOTHING;`
);

// Accesses
for (const email of TALENT_CLIENT_EMAILS) {
  lines.push(
    `INSERT INTO talent_project_access (project_slug, user_email) VALUES (${quote(p.slug)}, ${quote(email.toLowerCase())}) ON CONFLICT (project_slug, user_email) DO NOTHING;`
  );
}

console.log(lines.join("\n"));
