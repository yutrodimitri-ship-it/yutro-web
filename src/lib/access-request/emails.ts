import "server-only";
import { Resend } from "resend";
import { FIELD_LABELS, type AccessRequestInput } from "./schema";

const FROM_NAME = (process.env.EMAIL_FROM_NAME ?? "").trim() || "Yutro";
const FROM_ADDR = (process.env.EMAIL_FROM_ADDRESS ?? "").trim() || "noreply@yutro.cl";
// Acepta lista separada por comas ("a@x.cl,b@x.cl"). Resend requiere
// array para múltiples destinatarios.
const ADMIN_TO = (
  (process.env.ADMIN_NOTIFY_EMAIL ?? "").trim() ||
  (process.env.EMAIL_TO ?? "").trim() ||
  "milivoy@yutro.cl,silvana@yutro.cl"
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK_URL;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.yutro.cl";

let resendClient: Resend | null = null;
function getResend(): Resend | null {
  // trim(): un salto de linea o espacio colado en la env var rompe el
  // header Authorization (new Headers() lanza) y los envios rechazan.
  const key = (process.env.RESEND_API_KEY ?? "").trim();
  if (!key || key === "re_xxx") return null;
  if (!resendClient) resendClient = new Resend(key);
  return resendClient;
}

interface NotifyParams {
  input: AccessRequestInput;
  id: string;
  locale: "es" | "en";
  ipAddress: string | null;
}

/**
 * Mail al admin con el resumen completo del lead.
 * Subject: [Yutro Casting] Nueva solicitud — [Empresa] · [Tipo]
 */
export async function notifyAdminAccessRequest({
  input,
  id,
  locale,
  ipAddress,
}: NotifyParams): Promise<{ ok: boolean; error?: string }> {
  const resend = getResend();
  if (!resend) {
    console.warn("[access-request] RESEND_API_KEY missing — admin email skipped", { id });
    return { ok: false, error: "no_resend_key" };
  }

  const subject = `[Yutro Casting] Nueva solicitud — ${input.name}`;

  const html = renderAdminHtml(input, id, locale, ipAddress);
  const text = renderAdminText(input, id, locale, ipAddress);

  try {
    const res = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_ADDR}>`,
      to: ADMIN_TO,
      replyTo: input.email,
      subject,
      html,
      text,
    });
    if (res.error) {
      console.error("[access-request] resend admin email error", res.error);
      return { ok: false, error: res.error.message };
    }
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    console.error("[access-request] resend admin email throw", msg);
    return { ok: false, error: msg };
  }
}

/**
 * Mail de confirmacion al lead — editorial, corto.
 */
export async function sendLeadConfirmation({
  input,
  locale,
}: Pick<NotifyParams, "input" | "locale">): Promise<{ ok: boolean; error?: string }> {
  const resend = getResend();
  if (!resend) return { ok: false, error: "no_resend_key" };

  const subject =
    locale === "es" ? "Recibimos tu solicitud · Yutro" : "We received your request · Yutro";

  const html = renderLeadHtml(input, locale);
  const text = renderLeadText(input, locale);

  try {
    const res = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_ADDR}>`,
      to: input.email,
      subject,
      html,
      text,
    });
    if (res.error) {
      console.error("[access-request] resend lead email error", res.error);
      return { ok: false, error: res.error.message };
    }
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    console.error("[access-request] resend lead email throw", msg);
    return { ok: false, error: msg };
  }
}

/**
 * Slack webhook opcional. Si no esta seteado, no hace nada.
 */
export async function postToSlack({
  input,
  id,
  locale,
}: Pick<NotifyParams, "input" | "id" | "locale">): Promise<void> {
  if (!SLACK_WEBHOOK) return;

  const ptLabel = input.projectType
    ? FIELD_LABELS.projectType[locale][input.projectType]
    : null;

  const text = `:envelope: *Nueva solicitud Casting* — ${input.name}
${ptLabel ? `*Tipo:* ${ptLabel}\n` : ""}*Lead:* ${input.name} <${input.email}>
*ID:* \`${id}\``;

  try {
    await fetch(SLACK_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
  } catch (e) {
    console.error("[access-request] slack webhook failed", e);
  }
}

// ────────────────────────────────────────────────────────────────────
// Templates — markdown-ish HTML editorial. Sin assets externos, todo
// inline. Compatible con clientes que bloquean imagenes.
// ────────────────────────────────────────────────────────────────────

function renderAdminHtml(
  input: AccessRequestInput,
  id: string,
  locale: "es" | "en",
  ipAddress: string | null
): string {
  const L = locale;
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#6b6b6b;font-size:12px;text-transform:uppercase;letter-spacing:0.12em;font-family:monospace;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 0;font-size:14px;color:#1a1a1a">${escapeHtml(value)}</td></tr>`;

  return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1a1a1a;max-width:580px;padding:32px">
    <p style="margin:0 0 8px;color:#999;font-size:11px;text-transform:uppercase;letter-spacing:0.18em;font-family:monospace">Yutro Casting · ${L === "es" ? "Nueva solicitud" : "New request"}</p>
    <h1 style="margin:0 0 24px;font-size:24px;font-weight:800;letter-spacing:-0.02em">${escapeHtml(input.name)}</h1>
    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%">
      ${row("Email", input.email)}
      ${input.company ? row(L === "es" ? "Empresa" : "Company", input.company) : ""}
      ${input.projectType ? row(L === "es" ? "Proyecto" : "Project", FIELD_LABELS.projectType[L][input.projectType]) : ""}
      ${input.role ? row(L === "es" ? "Rol" : "Role", input.role) : ""}
      ${input.country ? row(L === "es" ? "País" : "Country", FIELD_LABELS.country[L][input.country]) : ""}
      ${input.timeline ? row(L === "es" ? "Plazo" : "Timeline", FIELD_LABELS.timeline[L][input.timeline]) : ""}
      ${input.budgetRange ? row(L === "es" ? "Presupuesto" : "Budget", FIELD_LABELS.budgetRange[L][input.budgetRange]) : ""}
      ${input.attribution ? row(L === "es" ? "Atribución" : "Attribution", FIELD_LABELS.attribution[L][input.attribution]) : ""}
      ${input.notes ? row(L === "es" ? "Notas" : "Notes", input.notes) : ""}
    </table>
    <hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0">
    <p style="margin:0;color:#999;font-size:11px;font-family:monospace">
      ID: ${id}<br>
      IP: ${ipAddress ?? "—"}<br>
      Locale: ${L}<br>
      <a href="${SITE_URL}/${L}/studio/admin/access-requests" style="color:#999">${L === "es" ? "Ver en admin" : "View in admin"} →</a>
    </p>
  </div>`;
}

function renderAdminText(
  input: AccessRequestInput,
  id: string,
  locale: "es" | "en",
  ipAddress: string | null
): string {
  const L = locale;
  return [
    `Yutro Casting — ${L === "es" ? "Nueva solicitud" : "New request"}`,
    "",
    `Nombre:       ${input.name}`,
    `Email:        ${input.email}`,
    input.company ? `Empresa:      ${input.company}` : "",
    input.projectType ? `Proyecto:     ${FIELD_LABELS.projectType[L][input.projectType]}` : "",
    input.role ? `Rol:          ${input.role}` : "",
    input.country ? `País:         ${FIELD_LABELS.country[L][input.country]}` : "",
    input.timeline ? `Plazo:        ${FIELD_LABELS.timeline[L][input.timeline]}` : "",
    input.budgetRange ? `Presupuesto:  ${FIELD_LABELS.budgetRange[L][input.budgetRange]}` : "",
    input.attribution ? `Atribución:   ${FIELD_LABELS.attribution[L][input.attribution]}` : "",
    input.notes ? `\nNotas:\n${input.notes}` : "",
    "",
    `ID: ${id}`,
    `IP: ${ipAddress ?? "—"}`,
  ].join("\n");
}

function renderLeadHtml(input: AccessRequestInput, locale: "es" | "en"): string {
  if (locale === "en") {
    return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1a1a1a;max-width:520px;padding:32px;line-height:1.7">
      <p style="margin:0 0 8px;color:#999;font-size:11px;text-transform:uppercase;letter-spacing:0.18em;font-family:monospace">Yutro · Casting</p>
      <h1 style="margin:0 0 16px;font-size:28px;font-weight:800;letter-spacing:-0.025em">Request received.</h1>
      <p>Hi ${escapeHtml(input.name)},</p>
      <p>We received your access request to the Yutro Casting catalog. We'll get in touch within 24 business hours to discuss your project and coordinate the next steps.</p>
      <p>Meanwhile, you can learn more about the studio at <a href="${SITE_URL}/en/estudio" style="color:#1a1a1a">yutro.cl/estudio</a>.</p>
      <hr style="border:none;border-top:1px solid #e0e0e0;margin:32px 0 16px">
      <p style="margin:0;color:#999;font-size:12px;font-family:monospace">Yutro · LATAM digital casting house</p>
    </div>`;
  }
  return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1a1a1a;max-width:520px;padding:32px;line-height:1.7">
    <p style="margin:0 0 8px;color:#999;font-size:11px;text-transform:uppercase;letter-spacing:0.18em;font-family:monospace">Yutro · Casting</p>
    <h1 style="margin:0 0 16px;font-size:28px;font-weight:800;letter-spacing:-0.025em">Solicitud recibida.</h1>
    <p>Hola ${escapeHtml(input.name)},</p>
    <p>Recibimos tu solicitud de acceso al catálogo Yutro Casting. Te contactamos dentro de las próximas 24 horas hábiles para conversar tu proyecto y coordinar los próximos pasos.</p>
    <p>Mientras tanto, podés conocer más del estudio en <a href="${SITE_URL}/es/estudio" style="color:#1a1a1a">yutro.cl/estudio</a>.</p>
    <hr style="border:none;border-top:1px solid #e0e0e0;margin:32px 0 16px">
    <p style="margin:0;color:#999;font-size:12px;font-family:monospace">Yutro · Casting house digital de LATAM</p>
  </div>`;
}

function renderLeadText(input: AccessRequestInput, locale: "es" | "en"): string {
  if (locale === "en") {
    return [
      `Hi ${input.name},`,
      "",
      "We received your access request to the Yutro Casting catalog. We'll get in touch within 24 business hours to discuss your project and coordinate the next steps.",
      "",
      `Meanwhile, you can learn more about the studio at ${SITE_URL}/en/estudio.`,
      "",
      "Yutro — LATAM digital casting house",
    ].join("\n");
  }
  return [
    `Hola ${input.name},`,
    "",
    "Recibimos tu solicitud de acceso al catálogo Yutro Casting. Te contactamos dentro de las próximas 24 horas hábiles para conversar tu proyecto y coordinar los próximos pasos.",
    "",
    `Mientras tanto, podés conocer más del estudio en ${SITE_URL}/es/estudio.`,
    "",
    "Yutro — Casting house digital de LATAM",
  ].join("\n");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
