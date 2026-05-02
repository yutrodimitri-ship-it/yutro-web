import { notFound } from "next/navigation";
import {
  getAvailableTalents,
  getProjectBySlug,
} from "@/lib/talent/data-source";
import { ProjectHeader } from "@/components/studio/talent/ProjectHeader";
import { ProjectStats } from "@/components/studio/talent/ProjectStats";
import { TalentGrid } from "@/components/studio/talent/TalentGrid";
import type { Locale } from "@/types/talent";

/**
 * Pantalla 2 — Catalogo del proyecto.
 *
 * Server component. CastingProvider + ToastProvider viven en el layout padre
 * `[projectSlug]/layout.tsx` para preservar el estado entre catalogo, detalle
 * y casting durante la navegacion.
 */
export default async function ProjectCatalogPage({
  params,
}: {
  params: Promise<{ locale: string; projectSlug: string }>;
}) {
  const { locale: rawLocale, projectSlug } = await params;
  const locale: Locale = rawLocale === "en" ? "en" : "es";
  const project = await getProjectBySlug(projectSlug);
  if (!project) notFound();

  const talents = await getAvailableTalents(project);
  const clientName = clientToWatermark(project.client);
  const watermarkDate = formatWatermarkDate(project.startDate);
  const startDateLabel = formatStartDate(project.startDate, locale);

  return (
    <div className="space-y-12">
      <ProjectHeader
        project={project}
        locale={locale}
        startDateLabel={startDateLabel}
      />
      <ProjectStats
        available={talents.length}
        locale={locale}
        projectSlug={project.slug}
      />
      <TalentGrid
        talents={talents}
        locale={locale}
        clientName={clientName}
        watermarkDate={watermarkDate}
        projectSlug={project.slug}
      />
    </div>
  );
}

/** "BBDO Chile" → "BBDO" para el watermark. */
function clientToWatermark(client: string): string {
  return client.split(" ")[0]?.toUpperCase() || client.toUpperCase();
}

/** ISO yyyy-mm-dd → "30·04·26" (compacto editorial). */
function formatWatermarkDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}·${m}·${y.slice(2)}`;
}

/** ISO yyyy-mm-dd → "30/04/2026" (es) o "04/30/2026" (en). */
function formatStartDate(iso: string, locale: Locale): string {
  const date = new Date(`${iso}T00:00:00`);
  return new Intl.DateTimeFormat(locale === "es" ? "es-CL" : "en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
