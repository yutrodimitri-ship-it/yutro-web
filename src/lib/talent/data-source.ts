/**
 * Yutro Studio Talent — fuente de datos dual-mode.
 *
 * - `USE_DB_TALENT=true` → consulta Postgres via Drizzle
 * - `USE_DB_TALENT=false` (default) → lee desde mock-data.ts (Fase 1)
 *
 * El shape devuelto (`Talent`, `ProjectConfig`) es identico en ambos modos.
 * El feature flag se evalua por-llamada (no en module-load) para soportar
 * tests que cambian el env entre runs.
 */
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { talents, talentProjects, talentProjectAccess } from "@/db/schema";
import {
  TALENTS as MOCK_TALENTS,
  PROJECTS as MOCK_PROJECTS,
  TALENT_CLIENT_EMAILS as MOCK_EMAILS,
} from "./mock-data";
import type {
  ProjectConfig,
  ProjectStatus,
  Talent,
  TalentAgeBucket,
  TalentCategory,
  TalentGender,
  TalentStatus,
  ExclusivityMode,
} from "@/types/talent";

function isDbEnabled(): boolean {
  return process.env.USE_DB_TALENT === "true";
}

// ── Helpers async ─────────────────────────────────────────────

export async function getProjectBySlug(
  slug: string
): Promise<ProjectConfig | undefined> {
  if (!isDbEnabled()) return MOCK_PROJECTS.find((p) => p.slug === slug);
  const [row] = await db
    .select()
    .from(talentProjects)
    .where(eq(talentProjects.slug, slug))
    .limit(1);
  return row ? rowToProject(row) : undefined;
}

export async function userHasTalentAccess(
  email: string | null | undefined
): Promise<boolean> {
  if (!email) return false;
  const lower = email.toLowerCase();
  if (!isDbEnabled()) return MOCK_EMAILS.map((e) => e.toLowerCase()).includes(lower);

  const [row] = await db
    .select({ id: talentProjectAccess.id })
    .from(talentProjectAccess)
    .where(
      and(
        eq(talentProjectAccess.userEmail, lower),
        isNull(talentProjectAccess.revokedAt)
      )
    )
    .limit(1);
  return Boolean(row);
}

export async function getProjectsForUser(
  email: string | null | undefined
): Promise<ProjectConfig[]> {
  if (!email) return [];
  const lower = email.toLowerCase();

  if (!isDbEnabled()) {
    if (!MOCK_EMAILS.map((e) => e.toLowerCase()).includes(lower)) return [];
    return MOCK_PROJECTS.filter((p) => p.status === "active");
  }

  const rows = await db
    .select({ project: talentProjects })
    .from(talentProjectAccess)
    .innerJoin(
      talentProjects,
      eq(talentProjects.slug, talentProjectAccess.projectSlug)
    )
    .where(
      and(
        eq(talentProjectAccess.userEmail, lower),
        isNull(talentProjectAccess.revokedAt),
        eq(talentProjects.status, "active")
      )
    );
  return rows.map((r) => rowToProject(r.project));
}

export async function getAvailableTalents(
  project: ProjectConfig
): Promise<Talent[]> {
  if (!isDbEnabled()) {
    return MOCK_TALENTS.filter(
      (t) => !project.blockedTalentCodes.includes(t.code)
    );
  }
  const rows = await db
    .select()
    .from(talents)
    .where(eq(talents.isActive, true));
  return rows
    .filter((t) => !project.blockedTalentCodes.includes(t.code))
    .map(rowToTalent);
}

export async function getTalentByCode(
  code: string
): Promise<Talent | undefined> {
  if (!isDbEnabled()) return MOCK_TALENTS.find((t) => t.code === code);
  const [row] = await db
    .select()
    .from(talents)
    .where(eq(talents.code, code))
    .limit(1);
  return row ? rowToTalent(row) : undefined;
}

// ── Mappers DB row → tipo del dominio ─────────────────────────

type TalentRow = typeof talents.$inferSelect;
type ProjectRow = typeof talentProjects.$inferSelect;

function rowToTalent(row: TalentRow): Talent {
  return {
    code: row.code,
    name: { es: row.nameEs, en: row.nameEn },
    shortDesc: { es: row.shortDescEs, en: row.shortDescEn },
    gender: row.gender as TalentGender,
    ageRange: row.ageRange,
    ageBucket: row.ageBucket as TalentAgeBucket,
    phenotype: { es: row.phenotypeEs, en: row.phenotypeEn },
    archetype: { es: row.archetypeEs, en: row.archetypeEn },
    category: row.category as TalentCategory,
    toneCommercial: { es: row.toneCommercialEs, en: row.toneCommercialEn },
    market: row.market,
    suggestedUses: row.suggestedUses,
    status: row.status as TalentStatus,
    hue: row.hue,
    sat: row.sat,
    imageProfileKey: row.imageProfileKey,
    imageCharsheetKey: row.imageCharsheetKey,
    galleryKeys: row.galleryKeys,
  };
}

function rowToProject(row: ProjectRow): ProjectConfig {
  const exclusivityCategory =
    row.exclusivityCategoryEs && row.exclusivityCategoryEn
      ? { es: row.exclusivityCategoryEs, en: row.exclusivityCategoryEn }
      : undefined;
  return {
    slug: row.slug,
    name: row.name,
    client: row.client,
    contactEmail: row.contactEmail,
    contactName: row.contactName,
    market: row.market,
    rightsDuration: { es: row.rightsDurationEs, en: row.rightsDurationEn },
    exclusivityMode: row.exclusivityMode as ExclusivityMode,
    exclusivityCategory,
    exclusivityHelp: { es: row.exclusivityHelpEs, en: row.exclusivityHelpEn },
    maxTalents: row.maxTalents,
    maxExclusive: row.maxExclusive,
    startDate: row.startDate,
    blockedTalentCodes: row.blockedTalentCodes,
    status: row.status as ProjectStatus,
  };
}
