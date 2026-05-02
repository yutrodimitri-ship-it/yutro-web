/**
 * Yutro Studio Talent — email transaccional via Resend.
 *
 * Disparado desde POST /api/studio/talent/castings cuando llega una
 * confirmacion de casting. El email se manda a Yutro (no al cliente):
 *
 *   from:    noreply@yutro.cl       (configurable via env)
 *   to:      contacto@yutro.cl      (configurable via env)
 *   cc:      milivoy@yutro.cl       (configurable via env)
 *   replyTo: email del cliente      (asi Yutro responde directo al cliente)
 */
import { Resend } from "resend";

const FROM_NAME = process.env.EMAIL_FROM_NAME || "Yutro Estudio";
const FROM_ADDR = process.env.EMAIL_FROM_ADDRESS || "noreply@yutro.cl";
const TO_ADDR = process.env.EMAIL_TO || "contacto@yutro.cl";
const CC_ADDR = process.env.EMAIL_CC || "milivoy@yutro.cl";

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY not configured");
    _resend = new Resend(key);
  }
  return _resend;
}

export interface CastingNotificationParams {
  projectName: string;
  projectClient: string;
  projectSlug: string;
  /** Email del cliente que envio (va al replyTo). */
  contactEmail: string;
  contactName: string;
  shortlist: string[];
  exclusives: string[];
  market: string;
  rightsDuration: string;
  exclusivityMode: string;
  submissionId: string;
  submittedAt: Date;
}

export async function sendCastingNotification(p: CastingNotificationParams) {
  const html = renderCastingEmailHtml(p);
  const text = renderCastingEmailText(p);

  const { data, error } = await getResend().emails.send({
    from: `${FROM_NAME} <${FROM_ADDR}>`,
    to: [TO_ADDR],
    cc: [CC_ADDR],
    replyTo: p.contactEmail,
    subject: `[Yutro Talent] Casting recibido — ${p.projectName}`,
    html,
    text,
    headers: {
      "X-Yutro-Submission-ID": p.submissionId,
      "X-Yutro-Project": p.projectSlug,
    },
  });

  if (error) {
    console.error("[email:casting]", error);
    throw new Error("Email delivery failed");
  }

  return data;
}

// ── Templates ─────────────────────────────────────────────────

function renderCastingEmailHtml(p: CastingNotificationParams): string {
  const exclusiveSet = new Set(p.exclusives);
  const rows = p.shortlist
    .map((code) => {
      const isExclusive = exclusiveSet.has(code);
      const tag = isExclusive
        ? `<span style="background:#d9b478;color:#0a0a0a;padding:2px 8px;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;font-family:ui-monospace,monospace">Exclusivo</span>`
        : "";
      return `<tr>
        <td style="padding:10px 12px;border-bottom:1px solid #1f1f1f;font-family:ui-monospace,monospace;color:#fff;font-size:13px">${escapeHtml(code)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #1f1f1f;text-align:right">${tag}</td>
      </tr>`;
    })
    .join("");

  const submittedLabel = formatChile(p.submittedAt);

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<title>Casting recibido — ${escapeHtml(p.projectName)}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#e5e5e5">
  <div style="max-width:600px;margin:0 auto;padding:32px 20px">
    <p style="font-family:ui-monospace,monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#d9b478;margin:0 0 8px">
      Yutro Estudio · Talent
    </p>
    <h1 style="font-size:28px;font-weight:600;color:#fff;margin:0 0 24px;line-height:1.2">
      Casting recibido
    </h1>

    <div style="background:#131313;border:1px solid #1f1f1f;padding:20px;margin-bottom:20px">
      <p style="margin:0 0 4px;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.1em;font-family:ui-monospace,monospace">Proyecto</p>
      <p style="margin:0 0 16px;font-size:18px;color:#fff">${escapeHtml(p.projectName)}</p>

      <p style="margin:0 0 4px;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.1em;font-family:ui-monospace,monospace">Cliente</p>
      <p style="margin:0 0 16px;font-size:14px;color:#fff">${escapeHtml(p.projectClient)} · ${escapeHtml(p.contactName)} &lt;${escapeHtml(p.contactEmail)}&gt;</p>

      <p style="margin:0 0 4px;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.1em;font-family:ui-monospace,monospace">Recibido</p>
      <p style="margin:0;font-size:13px;color:#bbb;font-family:ui-monospace,monospace">${escapeHtml(submittedLabel)}</p>
    </div>

    <div style="background:#131313;border:1px solid #1f1f1f;padding:20px;margin-bottom:20px">
      <p style="margin:0 0 12px;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.1em;font-family:ui-monospace,monospace">Selección · ${p.shortlist.length} talento(s) · ${p.exclusives.length} exclusivo(s)</p>
      <table style="width:100%;border-collapse:collapse">${rows}</table>
    </div>

    <div style="background:#131313;border:1px solid #1f1f1f;padding:20px;margin-bottom:20px">
      <table style="width:100%;border-collapse:collapse">
        <tr>
          <td style="padding:6px 0;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.1em;font-family:ui-monospace,monospace">Mercado</td>
          <td style="padding:6px 0;text-align:right;font-size:13px;color:#fff">${escapeHtml(p.market)}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.1em;font-family:ui-monospace,monospace">Duración</td>
          <td style="padding:6px 0;text-align:right;font-size:13px;color:#fff">${escapeHtml(p.rightsDuration)}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.1em;font-family:ui-monospace,monospace">Exclusividad</td>
          <td style="padding:6px 0;text-align:right;font-size:13px;color:#fff">${escapeHtml(p.exclusivityMode)}</td>
        </tr>
      </table>
    </div>

    <p style="margin:0 0 8px;font-size:11px;color:#666;font-family:ui-monospace,monospace">
      Submission ID: ${escapeHtml(p.submissionId)}
    </p>
    <p style="margin:0;font-size:11px;color:#666;line-height:1.5">
      Para responder al cliente, simplemente responde este email — el reply-to está
      configurado a su dirección.
    </p>
  </div>
</body>
</html>`;
}

function renderCastingEmailText(p: CastingNotificationParams): string {
  const exclusiveSet = new Set(p.exclusives);
  const lines = [
    `[Yutro Talent] Casting recibido — ${p.projectName}`,
    "",
    `Proyecto:  ${p.projectName}`,
    `Cliente:   ${p.projectClient} · ${p.contactName} <${p.contactEmail}>`,
    `Recibido:  ${formatChile(p.submittedAt)}`,
    "",
    `Selección — ${p.shortlist.length} talento(s) · ${p.exclusives.length} exclusivo(s):`,
    ...p.shortlist.map(
      (c) => `  - ${c}${exclusiveSet.has(c) ? "  [EXCLUSIVO]" : ""}`
    ),
    "",
    `Mercado:        ${p.market}`,
    `Duración:       ${p.rightsDuration}`,
    `Exclusividad:   ${p.exclusivityMode}`,
    "",
    `Submission ID:  ${p.submissionId}`,
    "",
    "Para responder al cliente, responde este email (reply-to apunta a su dirección).",
  ];
  return lines.join("\n");
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatChile(d: Date): string {
  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Santiago",
  }).format(d);
}
