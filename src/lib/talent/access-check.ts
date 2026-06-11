import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { talentProjectAccess } from "@/db/schema";

/**
 * Comparte la política de acceso a un proyecto Talent entre todos los
 * endpoints que la verificaban inline (audit, nda, castings, image,
 * projects/[slug]) — antes cada uno duplicaba el query y NINGUNO incluía
 * el bypass por rol admin que ya hace TalentLayout (server-side).
 *
 * Resultado: un admin con acceso al UI vía role-bypass se topaba con 403s
 * desde las APIs porque su email no estaba en `talent_project_access`.
 *
 * Política unificada:
 *   - role === "admin"  → siempre tiene acceso.
 *   - resto             → debe tener una row activa (revoked_at IS NULL)
 *                         en talent_project_access.
 *
 * Tests viven en `__tests__/access-check.test.ts` y cubren la decisión de
 * pura lógica (sin DB) — `policyAllows` es la unidad testeable.
 */
export interface SessionForAccess {
  email: string;
  role: string;
}

/**
 * Decisión pura sobre si la sesión debe pasar el chequeo de acceso,
 * dada una `accessRowExists` ya resuelta por el caller. Separar la
 * decisión del query DB hace la lógica testeable sin mocks.
 */
export function policyAllows(
  session: SessionForAccess,
  accessRowExists: boolean
): boolean {
  if (session.role === "admin") return true;
  return accessRowExists;
}

/**
 * Versión completa: hace el query + aplica la política. Útil en route
 * handlers que tienen una `session` y un `projectSlug` y solo quieren
 * un boolean.
 */
export async function hasProjectAccess(
  session: SessionForAccess,
  projectSlug: string
): Promise<boolean> {
  if (session.role === "admin") return true;
  const [access] = await db
    .select({ id: talentProjectAccess.id })
    .from(talentProjectAccess)
    .where(
      and(
        eq(talentProjectAccess.projectSlug, projectSlug),
        eq(talentProjectAccess.userEmail, session.email.toLowerCase()),
        isNull(talentProjectAccess.revokedAt)
      )
    )
    .limit(1);
  return Boolean(access);
}
