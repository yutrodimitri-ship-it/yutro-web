export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { verifyCsrfToken } from "@/lib/csrf";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendContactEmail } from "@/lib/email";

export async function POST(request: Request) {
  // Rate limiting: 5 requests per minute per IP
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { allowed, resetIn } = await checkRateLimit(`contact:${ip}`, 5, 60_000);

  if (!allowed) {
    return NextResponse.json(
      { error: "Demasiados intentos. Intenta de nuevo en un momento." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(resetIn / 1000)) } }
    );
  }

  // CSRF validation
  const csrfToken = request.headers.get("x-csrf-token");
  const cookies = request.headers.get("cookie") || "";
  const csrfSigMatch = cookies.match(/csrf_sig=([a-f0-9]+)/);
  const csrfSig = csrfSigMatch?.[1];

  if (!csrfToken || !csrfSig || !verifyCsrfToken(csrfToken, csrfSig)) {
    return NextResponse.json(
      { error: "Token de seguridad inválido. Recarga la página e intenta de nuevo." },
      { status: 403 }
    );
  }

  // Parse and validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const result = contactSchema.safeParse(body);
  if (!result.success) {
    const errors = result.error.issues.map((i) => i.message);
    return NextResponse.json({ error: errors[0], errors }, { status: 422 });
  }

  const data = result.data;
  const userAgent = request.headers.get("user-agent") || undefined;

  // Save to database (only if DATABASE_URL is configured)
  if (process.env.DATABASE_URL) {
    try {
      const { db } = await import("@/db");
      const { contactSubmissions } = await import("@/db/schema");
      await db.insert(contactSubmissions).values({
        name: data.name,
        email: data.email,
        company: undefined,
        phone: data.phone,
        message: data.message,
        ipAddress: ip === "unknown" ? undefined : ip,
        userAgent,
      });
    } catch (err) {
      console.error("DB insert failed:", err);
    }
  }

  // Send email notification
  try {
    await sendContactEmail({
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      ip,
    });
  } catch (err) {
    console.error("Email send failed:", err);
  }

  return NextResponse.json({ success: true });
}
