import { NextResponse } from "next/server";
import { z } from "zod";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { talentAccessLogs, talentProjectAccess } from "@/db/schema";
import { verifySession } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * POST /api/studio/talent/audit
 *
 * Endpoint de audit log persistente. Llamado desde `audit-log.ts` con
 * `keepalive: true` (fire-and-forget). Cada evento del cliente queda
 * en `talent_access_logs` para trazabilidad legal y analitica.
 *
 *   401  sin sesion
 *   403  sesion ok pero sin acceso al projectSlug
 *   422  payload invalido
 *   429  rate limit (200 eventos/min/email)
 *   200  ok
 */
export const dynamic = "force-dynamic";

const AUDIT_TYPES = [
  "session_start",
  "nda_accepted",
  "welcome_seen",
  "talent_viewed",
  "talent_added",
  "talent_removed",
  "exclusive_toggled",
  "casting_submitted",
  "talent_image_viewed",
  "admin_talent_created",
  "admin_talent_updated",
  "admin_talent_deactivated",
  "admin_project_created",
  "admin_project_updated",
  "admin_access_granted",
  "admin_access_revoked",
  "admin_nda_revoked",
  "admin_submission_status_changed",
  "admin_submission_email_resent",
] as const;

const bodySchema = z.object({
  type: z.enum(AUDIT_TYPES),
  projectSlug: z.string().min(1).max(64),
  talentCode: z.string().max(16).optional(),
  payload: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: Request) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  // Rate limit alto — eventos de audit son frecuentes
  const { allowed } = await checkRateLimit(
    `audit:${session.email}`,
    200,
    60_000
  );
  if (!allowed) {
    return NextResponse.json({ error: "Rate limit" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
      { status: 422 }
    );
  }

  const { type, projectSlug, talentCode, payload } = parsed.data;

  // Ownership: no logear eventos de proyectos a los que no tiene acceso
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
  if (!access) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await db.insert(talentAccessLogs).values({
    eventType: type,
    userEmail: session.email.toLowerCase(),
    projectSlug,
    talentCode: talentCode ?? null,
    payload: payload ?? {},
    ipAddress: ip,
  });

  return NextResponse.json({ ok: true });
}
