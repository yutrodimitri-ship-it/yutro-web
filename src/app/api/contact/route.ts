export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { verifyCsrfToken } from "@/lib/csrf";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendContactEmail } from "@/lib/email";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { allowed, resetIn } = await checkRateLimit(`contact:${ip}`, 5, 60_000);

  if (!allowed) {
    return NextResponse.json(
      { error: "Demasiados intentos. Intenta de nuevo en un momento." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(resetIn / 1000)) } }
    );
  }

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
