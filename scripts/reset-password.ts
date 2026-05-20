/**
 * Resetea la contraseña de un usuario.
 *
 * Uso (PowerShell):
 *   $env:RESET_PASSWORD="NuevaClaveSegura"; npx tsx scripts/reset-password.ts
 *
 * Uso (bash):
 *   RESET_PASSWORD="NuevaClaveSegura" npx tsx scripts/reset-password.ts
 *
 * Opcional:
 *   RESET_EMAIL="otro@email.com"   (default: yutrodimitri@gmail.com)
 *
 * NUNCA hardcodear la password en este archivo — quedaría expuesta en el
 * historial de git aunque después se borre.
 */
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { users } from "../src/db/schema";

const EMAIL = process.env.RESET_EMAIL ?? "yutrodimitri@gmail.com";
const NEW_PASSWORD = process.env.RESET_PASSWORD;

async function main() {
  if (!NEW_PASSWORD || NEW_PASSWORD.length < 8) {
    console.error("❌  RESET_PASSWORD requerido (mínimo 8 caracteres).");
    console.error("    Ejemplo (PowerShell):");
    console.error("      $env:RESET_PASSWORD=\"MiClave123\"; npx tsx scripts/reset-password.ts");
    process.exit(1);
  }

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
  console.log(`    Email: ${EMAIL}`);
  console.log(`    → http://localhost:3000/es/studio/login`);
  // No imprimimos la password — el caller ya la conoce porque la pasó.

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
