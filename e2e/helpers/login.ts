import type { Page } from "@playwright/test";

const TEST_EMAIL =
  process.env.PLAYWRIGHT_CLIENT_EMAIL ?? "test@bbdo.cl";
const TEST_PASSWORD = process.env.PLAYWRIGHT_CLIENT_PASSWORD ?? "";

/**
 * Login utility para los tests E2E.
 *
 * Pre-requisito: el usuario debe existir en la DB de testing con la
 * password en `PLAYWRIGHT_CLIENT_PASSWORD`. Para CI: seedea un usuario
 * fixed antes de correr los tests, o usa una DB resetada por ejecucion.
 */
export async function loginAs(
  page: Page,
  email: string = TEST_EMAIL,
  password: string = TEST_PASSWORD
) {
  await page.goto("/es/studio/login");
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/contrase|password/i).fill(password);
  await page.getByRole("button", { name: /iniciar sesi|sign in/i }).click();
  await page.waitForURL(/\/es\/studio(?!\/login)/);
}
