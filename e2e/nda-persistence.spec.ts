import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers/login";

/**
 * Spec 3 — NDA persistente: la DB es la fuente de verdad.
 *
 * Pre-requisito: NDA del usuario debe estar revocado en DB antes de correr
 * este test (admin → /studio/talent/admin/projects/samsung-galaxy-q1-2026
 * → revoke NDA del email de testing). De lo contrario, el primer paso
 * salta.
 */
test.describe("NDA persistencia", () => {
  test("DB es fuente: limpiar sessionStorage no muestra modal otra vez", async ({
    page,
    context,
  }) => {
    await loginAs(page);

    await page.goto("/es/studio/talent/samsung-galaxy-q1-2026");

    // Si aparece NDA, aceptarlo
    const ndaAccept = page.getByRole("button", {
      name: /acceder al catálogo|enter the catalog/i,
    });
    if (await ndaAccept.isVisible().catch(() => false)) {
      const checkbox = page.getByRole("checkbox");
      if (await checkbox.isVisible()) await checkbox.check();
      await ndaAccept.click();
    }

    // Esperar a que el catalogo cargue (NDA aceptado)
    await expect(page.locator("[data-talent='project']")).toBeVisible({
      timeout: 10_000,
    });

    // Borrar sessionStorage
    await context.clearCookies({ name: "_cache" }).catch(() => undefined);
    await page.evaluate(() => window.sessionStorage.clear());

    // Recargar — el modal NO debe re-aparecer porque DB tiene el accept
    await page.reload();

    const ndaAcceptAfterReload = page.getByRole("button", {
      name: /acceder al catálogo|enter the catalog/i,
    });
    // Esperar 2s para asegurar que el fetch GET /nda termino
    await page.waitForTimeout(2_000);
    expect(await ndaAcceptAfterReload.isVisible().catch(() => false)).toBe(
      false
    );
  });
});
