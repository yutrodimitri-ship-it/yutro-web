import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  ssl: process.env.NODE_ENV === "production" ? true : { rejectUnauthorized: false },
});

// Disable prepared statements for Supabase transaction mode pooler (port 6543)
pool.on("connect", (client) => {
  client.query("SET plan_cache_mode = 'force_custom_plan'");
});

export const db = drizzle(pool, { schema, logger: process.env.NODE_ENV === "development" });
