import { test, expect } from "@playwright/test";
import { loginAsClient } from "./helpers/login";

const PROJECT_SLUG = process.env.PLAYWRIGHT_PROJECT_SLUG ?? "libre";

/**
 * Spec 3 — NDA persistente: la DB es la fuente de verdad.
 *
 * Después de aceptar el NDA, limpiar sessionStorage y recargar NO debe
 * mostrar el modal de nuevo — el server-side fetch a /nda devuelve el
 * accept persistido.
 *
 * Pre-requisito: el NDA del usuario debe estar revocado en DB antes de
 * empezar (admin → /studio/talent/admin/projects/[slug] → revoke NDA del
 * email de testing). Si ya está aceptado, el primer paso simplemente
 * salta el modal.
 */
test.describe("NDA persistencia", () => {
  test("DB es la fuente: limpiar sessionStorage no muestra modal otra vez", async ({
    page,
    context,
  }) => {
    await loginAsClient(page);
    await page.goto(`/es/studio/talent/${PROJECT_SLUG}`);

    const ndaAccept = page.getByRole("button", {
      name: /acceder al catálogo|enter the catalog/i,
    });
    if (await ndaAccept.isVisible().catch(() => false)) {
      const checkbox = page.getByRole("checkbox");
      if (await checkbox.isVisible()) await checkbox.check();
      await ndaAccept.click();
    }

    // Esperar a que cargue el catálogo (NDA aceptado).
    await expect(page.locator("[data-talent='project']")).toBeVisible({
      timeout: 10_000,
    });

    // Limpiar todo el estado client-side.
    await context.clearCookies({ name: "_cache" }).catch(() => undefined);
    await page.evaluate(() => window.sessionStorage.clear());

    // Recargar: el modal NO debe volver porque la DB tiene el accept.
    await page.reload();
    await page.waitForTimeout(2_000); // dar tiempo al GET /nda

    const ndaAcceptAfterReload = page.getByRole("button", {
      name: /acceder al catálogo|enter the catalog/i,
    });
    expect(
      await ndaAcceptAfterReload.isVisible().catch(() => false)
    ).toBe(false);
  });
});
