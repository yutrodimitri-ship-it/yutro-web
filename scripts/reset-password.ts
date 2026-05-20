/**
 * Script de uso único: resetea la contraseña de un usuario admin.
 * Uso: npx tsx scripts/reset-password.ts
 */
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { users } from "../src/db/schema";

const EMAIL = process.env.RESET_EMAIL ?? "yutrodimitri@gmail.com";
const NEW_PASSWORD = process.env.RESET_PASSWORD ?? "yutro2026!";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("❌  DATABASE_URL no configurado en .env.local");
    process.exit(1);
  }

  const pool = new pg.Pool({
    connectionString,
    max: 1,
    ssl: { rejectUnauthorized: false },
  });
  const db = drizzle(pool);

  const passwordHash = await hash(NEW_PASSWORD, 12);

  const result = await db
    .update(users)
    .set({ passwordHash })
    .where(eq(users.email, EMAIL.toLowerCase()))
    .returning({ id: users.id, email: users.email, role: users.role });

  if (result.length === 0) {
    console.error(`❌  Usuario ${EMAIL} no encontrado en la DB.`);
    await pool.end();
    process.exit(1);
  }

  console.log(`✅  Contraseña actualizada para ${result[0].email} (${result[0].role})`);
  console.log(`    Email:    ${EMAIL}`);
  console.log(`    Password: ${NEW_PASSWORD}`);
  console.log(`\n    → http://localhost:3000/es/studio/login`);

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
