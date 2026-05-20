/**
 * Lee el SQL generado por gen-women-inserts.ts y lo ejecuta directo contra Supabase.
 */
import "dotenv/config";
import { readFile } from "fs/promises";
import pg from "pg";

async function main() {
  const conn = process.env.DATABASE_URL;
  if (!conn) throw new Error("DATABASE_URL not set");

  const sql = await readFile("scripts/_women.sql", "utf-8");

  const pool = new pg.Pool({
    connectionString: conn,
    max: 1,
    ssl: { rejectUnauthorized: false },
  });

  const res = await pool.query(sql);
  console.log(`✅  ${res.rowCount ?? 0} rows insertados/actualizados`);

  const verify = await pool.query(
    "SELECT count(*) AS total, count(*) FILTER (WHERE gender = 'f') AS women FROM talents WHERE is_active = true"
  );
  console.log("Total activos:", verify.rows[0]);

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
