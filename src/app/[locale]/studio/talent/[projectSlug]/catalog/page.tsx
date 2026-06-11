import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAssignedTalentsForProject,
  getAvailableTalents,
  getBlockedTalentsForProject,
  getProjectBySlug,
} from "@/lib/talent/data-source";
import { ProjectHeader } from "@/components/studio/talent/ProjectHeader";
import { ProjectStats } from "@/components/studio/talent/ProjectStats";
import { TalentGrid } from "@/components/studio/talent/TalentGrid";
import type { Locale } from "@/types/talent";

export default async function ProjectCatalogPage({
  params,
}: {
  params: Promise<{ locale: string; projectSlug: string }>;
}) {
  const { locale: rawLocale, projectSlug } = await params;
  const locale: Locale = rawLocale === "en" ? "en" : "es";
  const project = await getProjectBySlug(projectSlug);
  if (!project) notFound();

  const [talents, exclusiveBlockedCodes, assignedCodes] = await Promise.all([
    getAvailableTalents(project),
    getBlockedTalentsForProject(project),
    getAssignedTalentsForProject(project.slug),
  ]);
  const clientName = clientToWatermark(project.client);
  const watermarkDate = formatWatermarkDate(project.startDate);
  const startDateLabel = formatStartDate(project.startDate, locale);

  const unavailable = new Set([...exclusiveBlockedCodes, ...assignedCodes]);
  const available = talents.length - unavailable.size;

  return (
    <div className="flex flex-col">
      <div
        className="grid grid-cols-[1fr_auto] items-end gap-6 border-b px-6 pb-10 pt-10 sm:px-10 sm:pt-14 sm:pb-12"
        style={{ borderColor: "var(--talent-line)" }}
      >
        <div className="flex flex-col gap-4 min-w-0">
          <ProjectHeader
            project={project}
            locale={locale}
            startDateLabel={startDateLabel}
          />
          <ProjectStats
            available={available}
            locale={locale}
            projectSlug={project.slug}
          />
        </div>

        <div className="hidden text-right sm:block shrink-0">
          <p
            className="font-mono text-[11px] uppercase tracking-[0.18em]"
            style={{ color: "var(--talent-ink-mute)" }}
          >
            Disponibles
          </p>
          <p
            className="leading-none"
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 800,
              fontSize: "clamp(64px, 8vw, 112px)",
              letterSpacing: "-0.035em",
              color: "var(--talent-ink)",
              lineHeight: 0.88,
            }}
          >
            {String(available).padStart(2, "0")}
          </p>
          <p
            className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em]"
            style={{ color: "var(--talent-ink-mute)" }}
          >
            Catálogo Vol. 01
          </p>
        </div>
      </div>

      <TalentGrid
        talents={talents}
        locale={locale}
        clientName={clientName}
        watermarkDate={watermarkDate}
        projectSlug={project.slug}
        exclusiveBlockedCodes={exclusiveBlockedCodes}
        assignedCodes={assignedCodes}
      />

      {/* ── Footer ──────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between border-t px-6 py-5 sm:px-10"
        style={{ borderColor: "var(--talent-line)" }}
      >
        <span
          className="font-mono text-[10px] uppercase tracking-[0.18em]"
          style={{ color: "var(--talent-ink-mute)" }}
        >
          Yutro Estudio — Casting House
        </span>
        <Link
          href="/"
          className="font-mono text-[10px] uppercase tracking-[0.18em] transition-opacity hover:opacity-60"
          style={{ color: "var(--talent-ink-mute)" }}
        >
          yutro.cl ↗
        </Link>
      </div>
    </div>
  );
}

function clientToWatermark(client: string): string {
  return client.split(" ")[0]?.toUpperCase() || client.toUpperCase();
}

function formatWatermarkDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}·${m}·${y.slice(2)}`;
}

function formatStartDate(iso: string, locale: Locale): string {
  const date = new Date(`${iso}T00:00:00`);
  return new Intl.DateTimeFormat(locale === "es" ? "es-CL" : "en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
