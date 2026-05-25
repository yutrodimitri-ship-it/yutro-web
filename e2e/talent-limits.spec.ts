import { test, expect } from "@playwright/test";
import { loginAsClient } from "./helpers/login";

const PROJECT_SLUG = process.env.PLAYWRIGHT_PROJECT_SLUG ?? "libre";
const MAX_TALENTS = Number(process.env.PLAYWRIGHT_PROJECT_MAX_TALENTS ?? "10");

/**
 * Spec 2 — Cupos respetados.
 *
 * Agrega `MAX_TALENTS` talentos y verifica que la UI muestre el indicador
 * "cupo completo" en la card del siguiente o vía toast.
 *
 * Pre-requisitos: el proyecto debe tener al menos MAX_TALENTS+1 talentos
 * disponibles y MAX_TALENTS configurado igual al `max_talents` del row
 * en `talent_projects`.
 */
test.describe("Cupos respetados", () => {
  test(`max ${MAX_TALENTS} talentos en shortlist`, async ({ page }) => {
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

    // Llenar la shortlist al máximo.
    const addButtons = page.getByRole("button", {
      name: /agregar al casting|add to casting/i,
    });
    for (let i = 0; i < MAX_TALENTS; i++) {
      await addButtons.nth(i).click({ force: true });
    }

    // El indicador "cupo completo" aparece en alguna parte de la UI:
    // contador X/X en stats, badge en la card #11, o toast.
    await expect(
      page
        .getByText(
          new RegExp(
            `cupo completo|full capacity|${MAX_TALENTS} ?/ ?${MAX_TALENTS}`,
            "i"
          )
        )
        .first()
    ).toBeVisible({ timeout: 5_000 });
  });
});
