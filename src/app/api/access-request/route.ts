import { NextRequest, NextResponse } from "next/server";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { accessRequests } from "@/db/schema";
import { accessRequestSchema } from "@/lib/access-request/schema";
import {
  notifyAdminAccessRequest,
  sendLeadConfirmation,
  postToSlack,
} from "@/lib/access-request/emails";

/**
 * POST /api/access-request
 *
 * Recibe el form de /casting/solicitar-acceso, valida, persiste y
 * dispara notificaciones (admin + lead + slack opcional).
 *
 * Response codes:
 *   200 { ok: true, id }
 *   400 { ok: false, error: "validation", details: [...] }
 *   429 { ok: false, error: "rate_limit" }
 *   500 { ok: false, error: "server" }
 */
export const dynamic = "force-dynamic";

const RATE_LIMIT_WINDOW_HOURS = 1;
const RATE_LIMIT_MAX_PER_WINDOW = 3;

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_body" },
      { status: 400 }
    );
  }

  const parsed = accessRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "validation",
        details: parsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 }
    );
  }

  const input = parsed.data;

  // Honeypot — si "website" venia lleno, fingimos exito sin guardar.
  // No le decimos al bot que lo detectamos.
  if (input.website && input.website.length > 0) {
    console.warn("[access-request] honeypot triggered", {
      email: input.email,
      ip: getClientIp(request),
    });
    return NextResponse.json({ ok: true, id: "honeypot" });
  }

  // Locale del request (querystring o header)
  const url = new URL(request.url);
  const localeParam = url.searchParams.get("locale");
  const locale: "es" | "en" = localeParam === "en" ? "en" : "es";

  const ipAddress = getClientIp(request);
  const userAgent = request.headers.get("user-agent") ?? null;

  // ── Rate limit por IP ────────────────────────────────────────
  if (ipAddress) {
    try {
      const windowStart = new Date(
        Date.now() - RATE_LIMIT_WINDOW_HOURS * 60 * 60 * 1000
      );
      const recent = await db
        .select({ id: accessRequests.id })
        .from(accessRequests)
        .where(
          and(
            eq(accessRequests.ipAddress, ipAddress),
            gt(accessRequests.createdAt, windowStart)
          )
        )
        .limit(RATE_LIMIT_MAX_PER_WINDOW);
      if (recent.length >= RATE_LIMIT_MAX_PER_WINDOW) {
        console.warn("[access-request] rate limit exceeded", {
          ip: ipAddress,
          count: recent.length,
        });
        return NextResponse.json(
          { ok: false, error: "rate_limit" },
          { status: 429 }
        );
      }
    } catch (e) {
      // Si el rate-limit query falla, no bloqueamos la solicitud
      // (fail-open). Mejor un duplicado ocasional que perder un lead.
      console.error("[access-request] rate limit check failed", e);
    }
  }

  // ── Persistencia ─────────────────────────────────────────────
  let insertedId: string;
  try {
    const [row] = await db
      .insert(accessRequests)
      .values({
        name: input.name,
        email: input.email,
        // company es NOT NULL en DB; el form simplificado ya no lo pide.
        company: input.company || "",
        role: input.role || null,
        country: input.country || null,
        projectType: input.projectType || null,
        timeline: input.timeline || null,
        budgetRange: input.budgetRange || null,
        attribution: input.attribution || null,
        notes: input.notes || null,
        ipAddress,
        userAgent,
        locale,
      })
      .returning({ id: accessRequests.id });
    insertedId = row.id;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    console.error("[access-request] db insert failed", msg);
    return NextResponse.json(
      { ok: false, error: "server" },
      { status: 500 }
    );
  }

  // ── Notificaciones ──────────────────────────────────────────
  // Esperamos los envios antes de responder: si la lambda se congela
  // tras el response, las promises in-flight se pierden sin log.
  // Si Resend falla, ya guardamos el lead en DB — el admin lo ve
  // igual en la pagina de listado.
  const [adminRes, leadRes] = await Promise.allSettled([
    notifyAdminAccessRequest({ input, id: insertedId, locale, ipAddress }),
    sendLeadConfirmation({ input, locale }),
    postToSlack({ input, id: insertedId, locale }),
  ]);
  console.log("[access-request] notify results", {
    id: insertedId,
    admin:
      adminRes.status === "fulfilled"
        ? adminRes.value
        : `rejected: ${String(adminRes.reason)}`,
    lead:
      leadRes.status === "fulfilled"
        ? leadRes.value
        : `rejected: ${String(leadRes.reason)}`,
  });

  return NextResponse.json({ ok: true, id: insertedId }, { status: 200 });
}

/**
 * Best-effort IP capture. En Vercel x-forwarded-for trae una lista
 * separada por comas; el primer elemento es el cliente real.
 */
function getClientIp(request: NextRequest): string | null {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  return null;
}
