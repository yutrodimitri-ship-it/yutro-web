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
  // SSL through pgbouncer/Supavisor needs `rejectUnauthorized: false`
  // equivalent — `prefer` enables SSL but skips cert validation.
  ssl: "prefer",
});

export const db = drizzle(queryClient, {
  schema,
  logger: process.env.NODE_ENV === "development",
});
