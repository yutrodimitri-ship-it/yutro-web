import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 15_000,
  keepAlive: true,
  ssl: { rejectUnauthorized: false },
});

// Disable prepared statements for Supabase transaction mode pooler (port 6543).
//
// `options=-c plan_cache_mode=...` doesn't work via pgbouncer because the
// transaction pooler multiplexes backend connections; startup options are
// dropped or applied to the wrong backend. Setting it per-connection here
// runs the SET against the actual session pg.Pool just acquired, BEFORE
// drizzle issues any query, so the prepared-statement collision is avoided.
//
// A failed SET is non-fatal — log and continue. Without this, drizzle's
// prepared statements collide across multiplexed backends and we get the
// generic "Failed query: select..." error on every DB call.
pool.on("connect", (client) => {
  client
    .query("SET plan_cache_mode = 'force_custom_plan'")
    .catch((err) => {
      console.error("[db] SET plan_cache_mode failed:", err);
    });
});

export const db = drizzle(pool, { schema, logger: process.env.NODE_ENV === "development" });
