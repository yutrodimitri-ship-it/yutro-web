import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { verifyCsrfToken } from "@/lib/csrf";
import { checkRateLimit } from "@/lib/rate-limit";

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

  // Send email — for now log to console. Replace with Resend/SendGrid/Nodemailer in production.
  // eslint-disable-next-line no-console
  console.log("📧 Contact form submission:", {
    name: data.name,
    email: data.email,
    phone: data.phone,
    subject: data.subject,
    message: data.message.slice(0, 100) + (data.message.length > 100 ? "..." : ""),
    ip,
    timestamp: new Date().toISOString(),
  });

  // TODO: Uncomment when email service is configured
  // await sendEmail({
  //   to: "contacto@yutro.cl",
  //   from: "noreply@yutro.cl",
  //   replyTo: data.email,
  //   subject: `[YUTRO Web] ${data.subject}`,
  //   text: `Nombre: ${data.name}\nEmail: ${data.email}\nTeléfono: ${data.phone || "N/A"}\n\n${data.message}`,
  // });

  return NextResponse.json({ success: true });
}
