import { notFound } from "next/navigation";
import {
  getAvailableTalents,
  getProjectBySlug,
} from "@/lib/talent/data-source";
import { CastingPageClient } from "@/components/studio/talent/CastingPageClient";
import type { Locale } from "@/types/talent";

/**
 * Pantalla 4 — Confirmacion de casting.
 *
 * Server component. CastingProvider + ToastProvider viven en el layout padre
 * `[projectSlug]/layout.tsx` — comparte la misma instancia con catalogo y
 * detalle, asi el shortlist seleccionado en otras pantallas aparece aqui.
 */
export default async function CastingPage({
  params,
}: {
  params: Promise<{ locale: string; projectSlug: string }>;
}) {
  const { locale: rawLocale, projectSlug } = await params;
  const locale: Locale = rawLocale === "en" ? "en" : "es";

  const project = await getProjectBySlug(projectSlug);
  if (!project) notFound();

  const catalog = await getAvailableTalents(project);

  return (
    <CastingPageClient
      project={project}
      locale={locale}
      catalog={catalog}
    />
  );
}
