import "server-only";
import { db } from "@/db";
import { talentAccessLogs } from "@/db/schema";
import type { AuditContext, AuditEventType } from "./audit-log";

/**
 * Audit logger server-side. Solo importable desde RSC, layouts, route handlers,
 * o cualquier ejecucion server. La importacion del archivo ya falla (via
 * `server-only`) si algun client component lo arrastra al bundle.
 *
 * Para el path client (fire-and-forget fetch a /api/studio/talent/audit), ver
 * `audit-log.ts`.
 */

interface ServerAuditParams extends AuditContext {
  payload?: Record<string, unknown>;
  talentCode?: string;
  ipAddress?: string;
}

export async function logAuditEventServer(
  type: AuditEventType,
  params: ServerAuditParams
): Promise<void> {
  if (process.env.NODE_ENV !== "production") {
     
    console.log(`[AUDIT:server] ${type}`, {
      ...params,
      timestamp: new Date().toISOString(),
    });
  }

  try {
    await db.insert(talentAccessLogs).values({
      eventType: type,
      userEmail: params.userEmail.toLowerCase(),
      projectSlug: params.projectSlug,
      talentCode: params.talentCode ?? null,
      payload: params.payload ?? {},
      ipAddress: params.ipAddress ?? null,
    });
  } catch (err) {
    // No bloqueamos el flow del usuario por un fallo de logging.
     
    console.error("[audit:server-failed]", err);
  }
}
