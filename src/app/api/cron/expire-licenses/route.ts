import { NextResponse } from "next/server";
import { and, eq, gt, lte } from "drizzle-orm";
import { db } from "@/db";
import { talentLicenses, talents } from "@/db/schema";
import { expireDueLicenses } from "@/lib/talent/licenses";
import { logAuditEventServer } from "@/lib/talent/audit-log-server";

/**
 * GET /api/cron/expire-licenses — agendado diario en vercel.json (06:00 UTC).
 *
 * 1. Marca 'expired' las licencias vencidas y libera sus talentos.
 * 2. Junta las que vencen en ≤7 días (aviso anticipado).
 * 3. Avisa al admin por email (best-effort — requiere Resend verificado).
 *
 * Protección: Vercel Cron envía `Authorization: Bearer ${CRON_SECRET}`.
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  // 1. Vencer + liberar
  const { expired, freedTalents } = await expireDueLicenses(today);

  // 2. Por vencer en ≤7 días
  const in7 = new Date();
  in7.setUTCDate(in7.getUTCDate() + 7);
  const soonDate = in7.toISOString().slice(0, 10);
  const expiringSoon = await db
    .select({
      talentCode: talentLicenses.talentCode,
      talentName: talents.nameEs,
      projectSlug: talentLicenses.projectSlug,
      licenseEnd: talentLicenses.licenseEnd,
    })
    .from(talentLicenses)
    .innerJoin(talents, eq(talents.code, talentLicenses.talentCode))
    .where(
      and(
        eq(talentLicenses.status, "active"),
        gt(talentLicenses.licenseEnd, today),
        lte(talentLicenses.licenseEnd, soonDate)
      )
    );

  if (expired > 0) {
    await logAuditEventServer("talent_license_expired", {
      userEmail: "system@cron",
      projectSlug: "—",
      payload: { expired, freedTalents, date: today },
    });
  }

  // 3. Aviso al admin (best-effort)
  if (expired > 0 || expiringSoon.length > 0) {
    await notifyAdmin(freedTalents, expiringSoon, today).catch((e) =>
      console.error("[cron] license notice email failed", e)
    );
  }

  return NextResponse.json({
    ok: true,
    date: today,
    expired,
    freed: freedTalents,
    expiringSoon: expiringSoon.length,
  });
}

async function notifyAdmin(
  freed: string[],
  soon: { talentName: string; projectSlug: string; licenseEnd: string }[],
  today: string
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === "re_xxx") return;
  const to = process.env.ADMIN_NOTIFY_EMAIL || process.env.EMAIL_TO || "contacto@yutro.cl";
  const from = `${process.env.EMAIL_FROM_NAME || "Yutro"} <${process.env.EMAIL_FROM_ADDRESS || "noreply@yutro.cl"}>`;

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const freedLines = freed.length
    ? `<p><strong>Liberados hoy (${freed.length}):</strong> ${freed.join(", ")}</p>`
    : "";
  const soonLines = soon.length
    ? `<p><strong>Vencen en ≤7 días (${soon.length}):</strong></p><ul>${soon
        .map((s) => `<li>${s.talentName} — ${s.projectSlug} — vence ${s.licenseEnd}</li>`)
        .join("")}</ul>`
    : "";

  await resend.emails.send({
    from,
    to,
    subject: `[Yutro Casting] Derechos — ${freed.length} liberados, ${soon.length} por vencer`,
    html: `<div style="font-family:sans-serif;color:#1a1a1a;max-width:560px">
      <p style="color:#999;font-size:11px;text-transform:uppercase;letter-spacing:0.18em;font-family:monospace">Yutro Casting · Vencimientos ${today}</p>
      ${freedLines}
      ${soonLines}
    </div>`,
    text: `Vencimientos ${today}\nLiberados: ${freed.join(", ") || "—"}\nPor vencer (≤7d): ${soon.map((s) => `${s.talentName} (${s.licenseEnd})`).join(", ") || "—"}`,
  });
}
