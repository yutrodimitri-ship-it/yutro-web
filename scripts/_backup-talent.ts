/** Respaldo puntual de una fila de talents → scripts/_backup-<code>.json */
import { readFile, writeFile } from "fs/promises";
import path from "path";
import postgres from "postgres";

const ROOT = process.cwd();
async function loadEnv() {
  const raw = await readFile(path.join(ROOT, ".env.local"), "utf-8");
  const v: Record<string, string> = {};
  for (const l of raw.split("\n")) { const t = l.trim(); if (!t || t.startsWith("#") || !t.includes("=")) continue; const [k, ...r] = t.split("="); v[k.trim()] = r.join("=").trim().replace(/^["']|["']$/g, ""); }
  return v;
}
async function main() {
  const code = process.argv[2];
  const e = await loadEnv();
  const sql = postgres(e.DATABASE_URL, { prepare: false });
  try {
    const rows = await sql`SELECT * FROM talents WHERE code = ${code}`;
    const out = path.join(ROOT, "scripts", `_backup-${code}.json`);
    await writeFile(out, JSON.stringify(rows[0] || null, null, 2), "utf-8");
    console.log(rows.length ? `OK Backup de ${code} -> ${out}` : `AVISO ${code} no existe en DB (no habia fila previa)`);
  } finally { await sql.end(); }
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
