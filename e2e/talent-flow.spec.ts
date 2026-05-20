import { test, expect } from "@playwright/test";
import { loginAsClient } from "./helpers/login";

const PROJECT_SLUG = process.env.PLAYWRIGHT_PROJECT_SLUG ?? "libre";

/**
 * Spec 1 — Cliente arma un casting de punta a punta.
 *
 * Flujo: login → redirect al proyecto activo → aceptar NDA → agregar
 * talentos → /casting → submit. Asume que en Fase 3 el cliente NO pasa
 * por un hub: /studio redirige directamente a /studio/talent y de ahí
 * al único proyecto con acceso (o muestra el mensaje "sin acceso").
 *
 * Pre-requisitos (ver e2e/README.md):
 *   - Usuario client existe con acceso activo a PROJECT_SLUG
 *   - Catálogo del proyecto tiene al menos 3 talentos activos
 *   - El usuario NO tiene NDA aceptado (o se acepta de nuevo en el test)
 *
 * Idempotencia: el test NO limpia DB. Cada corrida crea otra row de
 * `casting_submissions` (idempotency_key cambia por minuto).
 */
test.describe("Cliente arma casting end-to-end", () => {
  test("acepta NDA, agrega talentos y confirma", async ({ page }) => {
    await loginAsClient(page);

    // /studio redirige al primer (único) proyecto activo del usuario.
    await page.waitForURL(new RegExp(`/talent/${PROJECT_SLUG}$`));

    // NDA modal aparece si no se aceptó previamente para este proyecto.
    const ndaAccept = page.getByRole("button", {
      name: /acceder al catálogo|enter the catalog/i,
    });
    if (await ndaAccept.isVisible().catch(() => false)) {
      const checkbox = page.getByRole("checkbox");
      if (await checkbox.isVisible()) await checkbox.check();
      await ndaAccept.click();
    }

    // Catálogo cargado: hay al menos una card.
    await expect(page.locator("[data-talent='project']").first()).toBeVisible({
      timeout: 10_000,
    });

    // Agregar 3 talentos.
    const addButtons = page.getByRole("button", {
      name: /agregar al casting|add to casting/i,
    });
    const count = Math.min(3, await addButtons.count());
    for (let i = 0; i < count; i++) {
      await addButtons.nth(i).click({ force: true });
    }

    // Ir al casting.
    await page
      .getByRole("link", { name: /ver mi casting|view casting|casting/i })
      .click();
    await page.waitForURL(/\/casting$/);

    // Shortlist tiene items.
    await expect(page.locator("li").first()).toBeVisible();

    // Confirmar.
    await page
      .getByRole("button", {
        name: /confirmar selección|confirm selection/i,
      })
      .click();

    // Mensaje de recepción.
    await expect(
      page.getByText(/recibido|received|menos de 24/i)
    ).toBeVisible({ timeout: 10_000 });
  });
});
