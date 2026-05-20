import * as Sentry from "@sentry/nextjs";

/**
 * Sentry — Edge runtime (middleware, edge route handlers).
 *
 * El modulo Talent NO usa edge (sharp y pg requieren node), pero el
 * middleware general puede correr en edge. Esta config es minima.
 */
const dsn = process.env.SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? "development",
    tracesSampleRate: 0.1,
  });
}
