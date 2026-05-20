/**
 * Yutro Studio Talent — fuente de datos.
 *
 * Lee siempre desde Postgres vía Drizzle. El módulo está en Fase 3 (producción),
 * el modo "mock" que existía en Fase 1 (lectura desde `mock-data.ts`) fue
 * retirado. `mock-data.ts` queda como fuente para los scripts de seed
 * (`scripts/dump-talent-seed-sql.ts`, `src/db/seed-talent.ts`), pero ningún
 * code-path de runtime lo usa.
 */
import { and, eq, isNull, ne } from "drizzle-orm";
import { db } from "@/db";
import { castingSubmissions, talents, talentProjects, talentProjectAccess, users } from "@/db/schema";
import type {
  ProjectConfig,
  ProjectStatus,
  Talent,
  TalentAgeBucket,
  TalentCategory,
  TalentGender,
  TalentStatus,
} from "@/types/talent";

// ── Helpers async ─────────────────────────────────────────────

export async function getProjectBySlug(
  slug: string
): Promise<ProjectConfig | undefined> {
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

/**
 * Talentos actualmente comprometidos: un row por (talento × casting confirmado).
 * Para el panel admin de gestión global de bloqueos.
 */
export interface CommittedTalent {
  submissionId: string;
  talentCode: string;
  talentName: string | null;
  isExclusive: boolean;
  projectSlug: string;
  projectName: string;
  projectCategory: string;
  submitterEmail: string;
  submittedAt: string;
  rightsDurationMonths: number;
  projectStartDate: string;
}

export async function getCommittedTalents(): Promise<CommittedTalent[]> {
  const rows = await db
    .select({
      submissionId: castingSubmissions.id,
      shortlist: castingSubmissions.shortlist,
      exclusives: castingSubmissions.exclusives,
      submitterEmail: castingSubmissions.userEmail,
      submittedAt: castingSubmissions.submittedAt,
      projectSlug: talentProjects.slug,
      projectName: talentProjects.name,
      projectCategory: talentProjects.categoryEs,
      projectStartDate: talentProjects.startDate,
      rightsDurationMonths: talentProjects.rightsDurationMonths,
    })
    .from(castingSubmissions)
    .innerJoin(talentProjects, eq(talentProjects.slug, castingSubmissions.projectSlug))
    .where(eq(castingSubmissions.status, "confirmed"));

  // Fetch names de todos los talents involucrados
  const allCodes = Array.from(new Set(rows.flatMap((r) => r.shortlist)));
  const nameRows = allCodes.length
    ? await db
        .select({ code: talents.code, nameEs: talents.nameEs })
        .from(talents)
        .where(eq(talents.isActive, true))
    : [];
  const nameByCode = new Map(nameRows.map((r) => [r.code, r.nameEs]));

  const result: CommittedTalent[] = [];
  for (const row of rows) {
    const exclusiveSet = new Set(row.exclusives);
    for (const code of row.shortlist) {
      result.push({
        submissionId: row.submissionId,
        talentCode: code,
        talentName: nameByCode.get(code) ?? null,
        isExclusive: exclusiveSet.has(code),
        projectSlug: row.projectSlug,
        projectName: row.projectName,
        projectCategory: row.projectCategory,
        submitterEmail: row.submitterEmail,
        submittedAt: row.submittedAt.toISOString(),
        rightsDurationMonths: row.rightsDurationMonths,
        projectStartDate: row.projectStartDate,
      });
    }
  }
  return result;
}

/** Todos los proyectos activos del sistema (para el rol admin). */
export async function getAllActiveProjects(): Promise<ProjectConfig[]> {
  const rows = await db
    .select()
    .from(talentProjects)
    .where(eq(talentProjects.status, "active"));
  return rows.map(rowToProject);
}

export async function getAvailableTalents(
  project: ProjectConfig
): Promise<Talent[]> {
  const list = (
    await db.select().from(talents).where(eq(talents.isActive, true))
  ).map(rowToTalent);

  // Seed estable por día + proyecto: el orden cambia cada día pero es consistente durante la sesión.
  const today = new Date().toISOString().slice(0, 10); // yyyy-mm-dd
  const seed = hashSeed(`${today}:${project.slug}`);
  return balancedShuffle(list, seed);
}

// ── Shuffle balanceado por neurociencia/UX ─────────────────────
// - Seed determinístico (mismo orden durante el día, cambia mañana)
// - Anti-clustering: maximiza variedad de gender+age+category entre cards vecinas
// - Anclas: talents con editorialScore >= 4 se distribuyen como "picos" cada ~12 posiciones

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h * 31 + s.charCodeAt(i)) | 0);
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function diversityDistance(a: Talent, b: Talent): number {
  let d = 0;
  if (a.gender !== b.gender) d += 3;
  if (a.ageBucket !== b.ageBucket) d += 2;
  if (a.category !== b.category) d += 2;
  return d;
}

function balancedShuffle(items: Talent[], seed: number): Talent[] {
  if (items.length <= 1) return items;
  const rnd = mulberry32(seed);
  const pool = [...items];
  // Fisher-Yates seedeado inicial — base estable
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // Separar anclas (score >= 4) y resto
  const anchors = pool.filter((t) => (t.editorialScore ?? 0) >= 4);
  const rest = pool.filter((t) => (t.editorialScore ?? 0) < 4);
  const result: Talent[] = [];

  // Slot 0: una ancla si hay (la más fuerte randomizada por el shuffle inicial)
  if (anchors.length > 0) {
    result.push(anchors.shift()!);
  } else if (rest.length > 0) {
    result.push(rest.shift()!);
  }

  const ANCHOR_EVERY = 12;
  while (rest.length > 0 || anchors.length > 0) {
    // ¿Toca ancla? cada N posiciones plantamos una si queda
    if (result.length % ANCHOR_EVERY === 0 && anchors.length > 0) {
      result.push(anchors.shift()!);
      continue;
    }

    // De lo contrario, elegir el candidate con mayor diversidad respecto a los últimos N
    const last = result[result.length - 1];
    const last2 = result[result.length - 2];
    const last3 = result[result.length - 3];

    const candidates = rest.length > 0 ? rest : anchors;
    if (candidates.length === 0) break;

    let bestIdx = 0;
    let bestScore = -Infinity;
    // Limitamos la búsqueda a los primeros 8 candidates para no ser O(N²) puro
    const lookahead = Math.min(8, candidates.length);
    for (let i = 0; i < lookahead; i++) {
      const c = candidates[i];
      let score = 0;
      if (last) score += diversityDistance(c, last) * 3;
      if (last2) score += diversityDistance(c, last2) * 2;
      if (last3) score += diversityDistance(c, last3) * 1;
      // Pequeño ruido seedeado para evitar ties siempre igual
      score += rnd() * 0.5;
      if (score > bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    }
    result.push(candidates.splice(bestIdx, 1)[0]);
  }

  return result;
}

export async function getUsersForProject(
  projectSlug: string
): Promise<{ email: string; name: string }[]> {
  const rows = await db
    .select({
      email: talentProjectAccess.userEmail,
      name: users.name,
      role: users.role,
    })
    .from(talentProjectAccess)
    .leftJoin(users, eq(users.email, talentProjectAccess.userEmail))
    .where(
      and(
        eq(talentProjectAccess.projectSlug, projectSlug),
        isNull(talentProjectAccess.revokedAt)
      )
    );
  return rows
    .filter((r) => r.role !== "admin")
    .map((r) => ({ email: r.email, name: r.name ?? r.email }));
}

/**
 * Talentos bloqueados en el catálogo de `project` por castings confirmados
 * de OTROS proyectos cuya ventana de derechos solapa la del proyecto actual:
 *
 *  - Talentos marcados como exclusivos en cualquier otro casting → bloqueados siempre.
 *  - Talentos no exclusivos (shortlist ∖ exclusives) en otro casting → bloqueados
 *    solo si el otro proyecto comparte categoría con el actual.
 */
export async function getBlockedTalentsForProject(
  project: ProjectConfig
): Promise<string[]> {
  const rows = await db
    .select({
      shortlist: castingSubmissions.shortlist,
      exclusives: castingSubmissions.exclusives,
      projectStartDate: talentProjects.startDate,
      rightsDurationMonths: talentProjects.rightsDurationMonths,
      categoryEs: talentProjects.categoryEs,
    })
    .from(castingSubmissions)
    .innerJoin(talentProjects, eq(talentProjects.slug, castingSubmissions.projectSlug))
    .where(
      and(
        eq(castingSubmissions.status, "confirmed"),
        ne(castingSubmissions.projectSlug, project.slug)
      )
    );

  const projectStart = new Date(`${project.startDate}T00:00:00`);
  const projectEnd = addMonths(projectStart, project.rightsDurationMonths);

  const blocked = new Set<string>();
  for (const row of rows) {
    const approvedStart = new Date(`${row.projectStartDate}T00:00:00`);
    const approvedEnd = addMonths(approvedStart, row.rightsDurationMonths);

    if (approvedStart >= projectEnd || approvedEnd <= projectStart) continue;

    // Exclusivos del casting: bloqueados en cualquier proyecto.
    for (const code of row.exclusives) blocked.add(code);

    // No exclusivos: bloqueados solo si comparten categoría.
    if (row.categoryEs === project.categoryEs) {
      const exclusiveSet = new Set(row.exclusives);
      for (const code of row.shortlist) {
        if (!exclusiveSet.has(code)) blocked.add(code);
      }
    }
  }

  return [...blocked];
}

/**
 * Talentos exclusivos ya comprometidos en castings confirmed del mismo proyecto.
 * Se muestran como "asignados" en el catálogo del propio proyecto y no cuentan
 * como disponibles. Los talentos no-exclusivos del shortlist NO se descuentan
 * (pueden re-seleccionarse en otros castings del mismo proyecto).
 */
export async function getAssignedTalentsForProject(
  projectSlug: string
): Promise<string[]> {
  const rows = await db
    .select({ exclusives: castingSubmissions.exclusives })
    .from(castingSubmissions)
    .where(
      and(
        eq(castingSubmissions.status, "confirmed"),
        eq(castingSubmissions.projectSlug, projectSlug)
      )
    );

  const assigned = new Set<string>();
  for (const row of rows) {
    for (const code of row.exclusives) assigned.add(code);
  }
  return [...assigned];
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export async function getTalentByCode(
  code: string
): Promise<Talent | undefined> {
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
    bio:
      row.bioEs || row.bioEn
        ? {
            ...(row.bioEs ? { es: row.bioEs } : {}),
            ...(row.bioEn ? { en: row.bioEn } : {}),
          }
        : undefined,
    market: row.market,
    suggestedUses: row.suggestedUses,
    status: row.status as TalentStatus,
    hue: row.hue,
    sat: row.sat,
    imageProfileKey: row.imageProfileKey,
    imageCharsheetKey: row.imageCharsheetKey,
    galleryKeys: row.galleryKeys,
    editorialScore: row.editorialScore,
  };
}

function rowToProject(row: ProjectRow): ProjectConfig {
  return {
    slug: row.slug,
    name: row.name,
    client: row.client,
    market: row.market,
    categoryEs: row.categoryEs,
    maxTalents: row.maxTalents,
    maxExclusive: row.maxExclusive,
    rightsDurationMonths: row.rightsDurationMonths,
    startDate: row.startDate,
    status: row.status as ProjectStatus,
  };
}
