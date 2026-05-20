/**
 * Next.js instrumentation hook.
 *
 * Carga la config Sentry adecuada segun runtime (nodejs / edge). Se ejecuta
 * una vez al inicio del proceso. La carga es no-op si SENTRY_DSN no esta
 * configurado.
 */
export async function register() {
  if (!process.env.SENTRY_DSN && !process.env.NEXT_PUBLIC_SENTRY_DSN) return;

  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}
