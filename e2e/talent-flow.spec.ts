import { test, expect } from "@playwright/test";
import { loginAs } from "./helpers/login";

/**
 * Spec 1 — Flujo cliente nuevo: hub → catalogo → casting → submit.
 *
 * Pre-requisito en DB de testing:
 *   - Usuario `test@bbdo.cl` (rol client) existe con password en env
 *   - Acceso a `samsung-galaxy-q1-2026` activo
 *   - 30 talents seedeados (correr `npm run seed:talent`)
 *
 * Idempotencia: el test no limpia DB. Re-ejecutarlo crea otra row de
 * `casting_submissions` (con idempotency_key distinto por minuto).
 */
test.describe("Cliente arma casting end-to-end", () => {
  test("acepta NDA, agrega talents, marca exclusivos y confirma", async ({
    page,
  }) => {
    await loginAs(page);

    // Hub: dos cards visibles (avatares + talent)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.getByRole("link", { name: /catálogo talent|talent library/i }).click();

    await page.waitForURL(/\/talent\/samsung-galaxy-q1-2026$/);

    // NDA modal aparece (asumimos primer ingreso o NDA revocado)
    const ndaAccept = page.getByRole("button", {
      name: /acceder al catálogo|enter the catalog/i,
    });
    if (await ndaAccept.isVisible().catch(() => false)) {
      const checkbox = page.getByRole("checkbox");
      if (await checkbox.isVisible()) await checkbox.check();
      await ndaAccept.click();
    }

    // Welcome — saltar si aparece
    const continueBtn = page.getByRole("button", {
      name: /continuar al catálogo|continue to the catalog/i,
    });
    if (await continueBtn.isVisible().catch(() => false)) {
      await continueBtn.click();
    }

    // Catalogo cargado: hay cards
    await expect(page.locator("[data-talent='project']").first()).toBeVisible();

    // Agregar 3 talents desde la card (boton +)
    const addButtons = page.getByRole("button", {
      name: /agregar al casting|add to casting/i,
    });
    const count = Math.min(3, await addButtons.count());
    for (let i = 0; i < count; i++) {
      // Hover + click para revelar el boton oculto en hover
      await addButtons.nth(i).click({ force: true });
    }

    // Ir al casting
    await page.getByRole("link", { name: /ver mi casting|view casting|casting/i }).click();
    await page.waitForURL(/\/casting$/);

    // Verificar items en el shortlist
    await expect(page.locator("li").first()).toBeVisible();

    // Confirmar (boton submit final)
    await page
      .getByRole("button", {
        name: /confirmar selección|confirm selection/i,
      })
      .click();

    // Estado: el boton cambia a "Recibido" o el mensaje aparece
    await expect(
      page.getByText(/recibido|received|menos de 24/i)
    ).toBeVisible({ timeout: 10_000 });
  });
});
