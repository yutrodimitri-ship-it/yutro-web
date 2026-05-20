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
  // Disable prepared statements for Supabase transaction mode pooler (port 6543)
  options: "-c plan_cache_mode=force_custom_plan",
});

export const db = drizzle(pool, { schema, logger: process.env.NODE_ENV === "development" });
