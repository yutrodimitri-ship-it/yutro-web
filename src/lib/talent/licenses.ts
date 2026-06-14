import "server-only";
import { and, eq, inArray, lte } from "drizzle-orm";
import { db } from "@/db";
import {
  talentLicenses,
  castingSubmissions,
  talentProjects,
  talents,
} from "@/db/schema";

/**
 * Capa de licencias (Hito 3). Una licencia = derechos de un talento en una
 * submission confirmada, con ventana [licenseStart, licenseEnd] derivada del
 * proyecto. Estados: active | expired | released.
 *
 * - activate: al confirmar una submission (idempotente).
 * - release:  al rechazar/liberar — devuelve el talento a 'available' si no
 *             le quedan otras licencias activas.
 * - expire:   el cron diario marca las vencidas y libera talentos.
 */

/** start (yyyy-mm-dd) + months → yyyy-mm-dd. Mismo cálculo que data-source. */
function addMonths(isoDate: string, months: number): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString().slice(0, 10);
}

/**
 * Crea las licencias de una submission confirmada y marca sus talentos
 * 'in-campaign'. Idempotente: si ya existen licencias para la submission,
 * no hace nada (evita duplicar al re-confirmar).
 */
export async function activateLicensesForSubmission(submissionId: string): Promise<void> {
  const [sub] = await db
    .select({
      projectSlug: castingSubmissions.projectSlug,
      shortlist: castingSubmissions.shortlist,
      exclusives: castingSubmissions.exclusives,
      startDate: talentProjects.startDate,
      rightsDurationMonths: talentProjects.rightsDurationMonths,
    })
    .from(castingSubmissions)
    .innerJoin(talentProjects, eq(talentProjects.slug, castingSubmissions.projectSlug))
    .where(eq(castingSubmissions.id, submissionId))
    .limit(1);
  if (!sub || sub.shortlist.length === 0) return;

  const existing = await db
    .select({ id: talentLicenses.id })
    .from(talentLicenses)
    .where(eq(talentLicenses.submissionId, submissionId))
    .limit(1);
  if (existing.length > 0) return; // ya activadas

  const licenseEnd = addMonths(sub.startDate, sub.rightsDurationMonths);
  const exclusiveSet = new Set(sub.exclusives);

  await db.insert(talentLicenses).values(
    sub.shortlist.map((code) => ({
      talentCode: code,
      submissionId,
      projectSlug: sub.projectSlug,
      licenseStart: sub.startDate,
      licenseEnd,
      isExclusive: exclusiveSet.has(code),
      status: "active" as const,
    }))
  );

  await db
    .update(talents)
    .set({ status: "in-campaign", updatedAt: new Date() })
    .where(inArray(talents.code, sub.shortlist));
}

/**
 * Cierra todas las licencias activas de una submission (status='released')
 * y devuelve cada talento a 'available' si no le quedan otras activas.
 * Usado al rechazar una submission confirmada.
 */
export async function releaseLicensesForSubmission(submissionId: string): Promise<void> {
  const closed = await db
    .update(talentLicenses)
    .set({ status: "released", closedAt: new Date() })
    .where(
      and(
        eq(talentLicenses.submissionId, submissionId),
        eq(talentLicenses.status, "active")
      )
    )
    .returning({ talentCode: talentLicenses.talentCode });

  for (const talentCode of dedupe(closed.map((r) => r.talentCode))) {
    await freeTalentIfNoActiveLicenses(talentCode);
  }
}

/**
 * Cierra la licencia activa de UN talento en UNA submission (release-talent
 * individual del admin) y lo libera si corresponde.
 */
export async function releaseLicenseForTalent(
  submissionId: string,
  talentCode: string
): Promise<void> {
  await db
    .update(talentLicenses)
    .set({ status: "released", closedAt: new Date() })
    .where(
      and(
        eq(talentLicenses.submissionId, submissionId),
        eq(talentLicenses.talentCode, talentCode),
        eq(talentLicenses.status, "active")
      )
    );
  await freeTalentIfNoActiveLicenses(talentCode);
}

/**
 * Marca como 'expired' las licencias vencidas (license_end <= hoy) y libera
 * sus talentos. Devuelve los talentos efectivamente liberados (para avisos).
 * Lo invoca el cron diario.
 */
export async function expireDueLicenses(today: string): Promise<{
  expired: number;
  freedTalents: string[];
}> {
  const due = await db
    .update(talentLicenses)
    .set({ status: "expired", closedAt: new Date() })
    .where(
      and(eq(talentLicenses.status, "active"), lte(talentLicenses.licenseEnd, today))
    )
    .returning({ talentCode: talentLicenses.talentCode });

  const freed: string[] = [];
  for (const code of dedupe(due.map((r) => r.talentCode))) {
    if (await freeTalentIfNoActiveLicenses(code)) freed.push(code);
  }
  return { expired: due.length, freedTalents: freed };
}

/**
 * Devuelve un talento a 'available' si no le quedan licencias activas.
 * Retorna true si lo liberó.
 */
async function freeTalentIfNoActiveLicenses(talentCode: string): Promise<boolean> {
  const [active] = await db
    .select({ id: talentLicenses.id })
    .from(talentLicenses)
    .where(
      and(
        eq(talentLicenses.talentCode, talentCode),
        eq(talentLicenses.status, "active")
      )
    )
    .limit(1);
  if (active) return false;

  await db
    .update(talents)
    .set({ status: "available", updatedAt: new Date() })
    .where(eq(talents.code, talentCode));
  return true;
}

function dedupe(arr: string[]): string[] {
  return [...new Set(arr)];
}
