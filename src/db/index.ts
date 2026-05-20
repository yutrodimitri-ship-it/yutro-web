import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Use `postgres` (postgres-js) instead of `pg` (node-postgres) because
// drizzle's `pg` adapter relies on the extended query protocol with named
// prepared statements. Supabase's pooler (Supavisor) — even on port 5432
// in session mode — multiplexes backend connections, and named prepared
// statements collide across that multiplexing. The result is a generic
// "Failed query: select..." error on parallel queries from cold lambdas
// in production.
//
// `postgres-js` with `prepare: false` uses the simple query protocol and
// avoids prepared statements entirely. This is the configuration that
// Drizzle's own docs recommend for Supabase + Vercel.
//
// See: https://orm.drizzle.team/docs/connect-supabase
const queryClient = postgres(process.env.DATABASE_URL!, {
  prepare: false,
  // Pool sizing for serverless. Vercel Fluid Compute may run several
  // concurrent invocations sharing this module. 10 connections is a
  // reasonable budget against Supavisor's per-project limit.
  max: 10,
  idle_timeout: 30,
  connect_timeout: 15,
  // Supabase pooler requires SSL but its cert is signed by AWS RDS CA,
  // which Node doesn't trust by default. `rejectUnauthorized: false`
  // encrypts the connection but skips chain validation.
  ssl: { rejectUnauthorized: false },
  // Last-resort diagnostic: surface the underlying postgres error to
  // server logs so we can read it. postgres-js otherwise wraps errors
  // in a generic message that drizzle then re-wraps as "Failed query".
  onnotice: (notice) => console.warn("[pg-notice]", notice),
  debug: process.env.NODE_ENV === "production"
    ? (_conn, query, params, types) => {
        if (process.env.PG_DEBUG === "1") {
          console.log("[pg-debug]", { query, params, types });
        }
      }
    : undefined,
});

export const db = drizzle(queryClient, {
  schema,
  logger: process.env.NODE_ENV === "development",
});
