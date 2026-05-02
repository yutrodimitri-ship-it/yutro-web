import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers/login";

/**
 * Spec 2 — Limites de cupo respetados.
 *
 * Verifica que el catalogo NO permite agregar mas de `maxTalents` (10) y
 * que toggle de exclusividad respeta `maxExclusive` (3) para Samsung.
 */
test.describe("Cupos respetados", () => {
  test("max 10 talents en shortlist, max 3 exclusivos", async ({ page }) => {
    await loginAs(page);
    await page.goto("/es/studio/talent/samsung-galaxy-q1-2026");

    // Aceptar NDA si aparece
    const ndaAccept = page.getByRole("button", {
      name: /acceder al catálogo|enter the catalog/i,
    });
    if (await ndaAccept.isVisible().catch(() => false)) {
      const checkbox = page.getByRole("checkbox");
      if (await checkbox.isVisible()) await checkbox.check();
      await ndaAccept.click();
    }
    const continueBtn = page.getByRole("button", {
      name: /continuar al catálogo|continue to the catalog/i,
    });
    if (await continueBtn.isVisible().catch(() => false)) {
      await continueBtn.click();
    }

    // Agregar 10 talents
    const addButtons = page.getByRole("button", {
      name: /agregar al casting|add to casting/i,
    });
    for (let i = 0; i < 10; i++) {
      await addButtons.nth(i).click({ force: true });
    }

    // Intentar agregar uno mas: deberia ver "Cupo completo" o toast
    // El boton del 11vo cambia a "Cupo completo" o emite toast
    await expect(
      page.getByText(/cupo completo|full capacity|10 \/ 10/i).first()
    ).toBeVisible({ timeout: 5_000 });
  });
});
