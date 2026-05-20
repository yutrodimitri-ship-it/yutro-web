import { test, expect } from "@playwright/test";
import { loginAsAdmin } from "./helpers/login";

/**
 * Spec 4 — Admin libera un talento comprometido.
 *
 * Flujo: admin login → /studio/talent/admin/locks → ve la tabla de
 * talentos actualmente bloqueados por castings confirmados → click en
 * "Liberar" → confirma → la row desaparece (o queda marcada).
 *
 * Pre-requisitos:
 *   - Usuario admin existe (PLAYWRIGHT_ADMIN_EMAIL / PASSWORD)
 *   - Al menos 1 casting_submission con status='confirmed' y ≥1 talento
 *     en shortlist (puede correrse el spec talent-flow.spec primero +
 *     que un admin lo confirme manualmente; o seedear vía SQL).
 *
 * Idempotencia: el test MUTA la DB (libera un talento). Re-ejecutarlo
 * intenta liberar talentos distintos hasta que la tabla queda vacía,
 * momento en que el primer expect falla con "no rows".
 */
test.describe("Admin libera talentos comprometidos", () => {
  test("ve la tabla de locks y libera el primer talento", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/es/studio/talent/admin/locks");

    // Header esperado.
    await expect(
      page.getByRole("heading", { name: /talentos comprometidos/i })
    ).toBeVisible({ timeout: 10_000 });

    // La tabla puede estar vacía si nadie tiene castings confirmados con
    // talentos. Si está vacía, marcamos el test como skip (no es un fallo
    // funcional, es un estado del entorno).
    const emptyState = page.getByText(
      /sin talentos comprometidos|no committed talents/i
    );
    if (await emptyState.isVisible().catch(() => false)) {
      test.skip(true, "Sin locks en DB: seedear un casting confirmado antes.");
      return;
    }

    // Primera row con botón "Liberar".
    const firstRelease = page
      .getByRole("button", { name: /liberar|release/i })
      .first();
    await expect(firstRelease).toBeVisible();
    await firstRelease.click();

    // Modal/dialog de confirmación.
    const confirm = page.getByRole("button", {
      name: /confirmar|sí|yes|confirm/i,
    });
    if (await confirm.isVisible().catch(() => false)) {
      await confirm.click();
    }

    // Toast de éxito o desaparición de la row.
    await expect(
      page.getByText(/talento liberado|talent released|liberado/i)
    ).toBeVisible({ timeout: 10_000 });
  });

  test("la tabla refleja sólo submissions confirmados", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/es/studio/talent/admin/locks");

    // Solo verificamos que la página carga y muestra el contador en el header.
    // El filtrado por status='confirmed' es responsabilidad de la query
    // del data-source — cubierto unit-side; acá sólo validamos render.
    await expect(
      page.getByRole("heading", { name: /talentos comprometidos/i })
    ).toBeVisible();

    const description = page.getByText(
      /\d+ talentos? actualmente comprometidos/i
    );
    await expect(description).toBeVisible();
  });

  test.skip("[manual] cuando libera el último talento, el submission pasa a rejected", async () => {
    // Este caso requiere setup determinista: una submission con UN solo
    // talento. Después del release, ese submission debe quedar
    // status='rejected'. Para automatizarlo necesitamos un fixture SQL
    // por test — pendiente cuando se monte el harness de seeds.
  });
});
