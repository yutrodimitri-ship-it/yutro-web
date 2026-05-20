import * as Sentry from "@sentry/nextjs";

/**
 * Sentry — runtime Node (server components, API routes, server actions).
 *
 * Tag default `module:talent` se inyecta dinamicamente desde los call-sites
 * criticos (API casting submit, email send, sharp watermark, R2 fetch).
 * No agregamos un tag global porque el modulo Talent comparte el deploy
 * con el resto del studio.
 */
const dsn = process.env.SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? "development",
    tracesSampleRate: 0.1,
    debug: false,
    ignoreErrors: [
      // Ruido cliente que escapa al server
      "ResizeObserver loop limit exceeded",
      "Non-Error promise rejection captured",
    ],
  });
}
