import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const CONTACT_EMAIL = process.env.CONTACT_EMAIL_TO || "contacto@yutro.cl";

interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  ip: string;
}

export async function sendContactEmail(data: ContactEmailData) {
  // Skip sending if no API key (development)
  if (!process.env.RESEND_API_KEY) {
    // eslint-disable-next-line no-console
    console.log("[DEV] Email skipped (no RESEND_API_KEY):", data.subject);
    return { success: true, dev: true };
  }

  const { data: result, error } = await resend.emails.send({
    from: "YUTRO Web <noreply@yutro.cl>",
    to: CONTACT_EMAIL,
    replyTo: data.email,
    subject: `[YUTRO Web] ${data.subject}`,
    text: [
      `Nombre: ${data.name}`,
      `Email: ${data.email}`,
      `Teléfono: ${data.phone || "N/A"}`,
      `IP: ${data.ip}`,
      "",
      "Mensaje:",
      data.message,
    ].join("\n"),
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 12px;">
          Nuevo mensaje de contacto
        </h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #666; width: 100px;"><strong>Nombre</strong></td>
            <td style="padding: 8px 0;">${escapeHtml(data.name)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;"><strong>Email</strong></td>
            <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;"><strong>Teléfono</strong></td>
            <td style="padding: 8px 0;">${escapeHtml(data.phone || "N/A")}</td>
          </tr>
        </table>
        <div style="margin-top: 20px; padding: 16px; background: #f9f9f9; border-radius: 8px;">
          <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(data.message)}</p>
        </div>
        <p style="margin-top: 20px; font-size: 12px; color: #999;">
          Enviado desde yutro.cl · IP: ${escapeHtml(data.ip)}
        </p>
      </div>
    `,
  });

  if (error) {
    throw new Error(`Email send failed: ${error.message}`);
  }

  return { success: true, id: result?.id };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
