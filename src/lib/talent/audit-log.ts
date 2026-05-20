/**
 * Audit log — path client.
 *
 * Este modulo es client-safe: NO importa `@/db` ni `pg`. Los client
 * components lo usan via `logAuditEvent`, que hace fire-and-forget fetch a
 * /api/studio/talent/audit con `keepalive: true`.
 *
 * Para escribir directo a DB desde RSC / API routes, importar
 * `audit-log-server.ts` (marcado con `server-only`, levanta build error
 * si algun client component intenta importarlo).
 */

export type AuditEventType =
  | "session_start"
  | "nda_accepted"
  | "welcome_seen"
  | "talent_viewed"
  | "talent_added"
  | "talent_removed"
  | "exclusive_toggled"
  | "casting_submitted"
  | "talent_image_viewed"
  // Admin actions (Sprint 7)
  | "admin_talent_created"
  | "admin_talent_updated"
  | "admin_talent_deactivated"
  | "admin_project_created"
  | "admin_project_updated"
  | "admin_project_deleted"
  | "admin_access_granted"
  | "admin_access_revoked"
  | "admin_nda_revoked"
  | "admin_submission_status_changed"
  | "admin_submission_email_resent"
  | "admin_talent_released";

export interface AuditContext {
  userEmail: string;
  projectSlug: string;
}

export interface AuditEvent {
  type: AuditEventType;
  userEmail: string;
  projectSlug: string;
  /** ISO timestamp generado al llamar la funcion. */
  timestamp: string;
  /** Datos especificos del evento (talentCode, isExclusive, counts, etc.). */
  [key: string]: unknown;
}

/**
 * Loguea un evento desde un client component.
 * Fire-and-forget: la respuesta del endpoint no se espera.
 * En SSR no hace nada (los call-sites server deben usar logAuditEventServer).
 */
export function logAuditEvent(
  type: AuditEventType,
  ctx: AuditContext,
  extra: Record<string, unknown> = {}
): void {
  if (typeof window === "undefined") {
    return;
  }

  const event: AuditEvent = {
    type,
    userEmail: ctx.userEmail,
    projectSlug: ctx.projectSlug,
    timestamp: new Date().toISOString(),
    ...extra,
  };

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log(`[AUDIT] ${type}`, event);
  }

  const talentCode =
    typeof extra.talentCode === "string" ? extra.talentCode : undefined;

  void fetch("/api/studio/talent/audit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type,
      projectSlug: ctx.projectSlug,
      talentCode,
      payload: extra,
    }),
    keepalive: true,
  }).catch(() => undefined);
}
