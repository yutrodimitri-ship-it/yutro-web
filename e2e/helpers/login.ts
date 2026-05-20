import type { Page } from "@playwright/test";

const CLIENT_EMAIL =
  process.env.PLAYWRIGHT_CLIENT_EMAIL ?? "test-client@yutro.cl";
const CLIENT_PASSWORD = process.env.PLAYWRIGHT_CLIENT_PASSWORD ?? "";

const ADMIN_EMAIL =
  process.env.PLAYWRIGHT_ADMIN_EMAIL ?? "test-admin@yutro.cl";
const ADMIN_PASSWORD = process.env.PLAYWRIGHT_ADMIN_PASSWORD ?? "";

/**
 * Login helpers for the E2E suite.
 *
 * Prerequisite — see `e2e/README.md`. The test users must exist in the
 * target database with the credentials provided via env vars. Recommended
 * setup uses a dedicated test environment, NOT production.
 */

async function submitLogin(page: Page, email: string, password: string) {
  await page.goto("/es/studio/login");
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/contrase|password/i).fill(password);
  await page.getByRole("button", { name: /iniciar sesi|sign in/i }).click();
  // /studio redirects by role; we just wait until we're no longer on /login
  await page.waitForURL(/\/es\/studio(?!\/login)/);
}

export async function loginAsClient(
  page: Page,
  email: string = CLIENT_EMAIL,
  password: string = CLIENT_PASSWORD
): Promise<void> {
  await submitLogin(page, email, password);
}

export async function loginAsAdmin(
  page: Page,
  email: string = ADMIN_EMAIL,
  password: string = ADMIN_PASSWORD
): Promise<void> {
  await submitLogin(page, email, password);
}

/** @deprecated Use loginAsClient(). Kept temporarily for spec compatibility. */
export const loginAs = loginAsClient;
