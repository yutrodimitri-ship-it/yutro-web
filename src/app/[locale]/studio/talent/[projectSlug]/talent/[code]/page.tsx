import { notFound } from "next/navigation";
import {
  getProjectBySlug,
  getTalentByCode,
} from "@/lib/talent/data-source";
import { TalentDetail } from "@/components/studio/talent/TalentDetail";
import type { Locale } from "@/types/talent";

/**
 * Pantalla 3 — Detalle del talento dentro del proyecto.
 *
 * Server component. CastingProvider + ToastProvider viven en el layout padre
 * `[projectSlug]/layout.tsx` — esto garantiza que cuando el cliente clickea
 * "Agregar al casting" desde el detalle, el state se actualice en la misma
 * instancia que el catalogo y el casting.
 */
export default async function TalentDetailPage({
  params,
}: {
  params: Promise<{ locale: string; projectSlug: string; code: string }>;
}) {
  const { locale: rawLocale, projectSlug, code } = await params;
  const locale: Locale = rawLocale === "en" ? "en" : "es";

  const project = await getProjectBySlug(projectSlug);
  if (!project) notFound();

  const talent = await getTalentByCode(code);
  if (!talent) notFound();
  if (project.blockedTalentCodes.includes(talent.code)) notFound();

  const clientName = clientToWatermark(project.client);
  const watermarkDate = formatWatermarkDate(project.startDate);

  return (
    <TalentDetail
      talent={talent}
      locale={locale}
      projectSlug={project.slug}
      clientName={clientName}
      watermarkDate={watermarkDate}
    />
  );
}

function clientToWatermark(client: string): string {
  return client.split(" ")[0]?.toUpperCase() || client.toUpperCase();
}

function formatWatermarkDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}·${m}·${y.slice(2)}`;
}
