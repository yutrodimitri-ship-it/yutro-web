import { getTranslations } from "next-intl/server";
import type { Locale, ProjectConfig } from "@/types/talent";

interface ProjectHeaderProps {
  project: ProjectConfig;
  locale: Locale;
  /** Fecha de inicio formateada para el locale (ej. "30/04/2026" o "30·04·26"). */
  startDateLabel: string;
}

/**
 * Server component. Renderiza la cabecera del catalogo:
 *   - Linea meta superior (cliente · inicia)
 *   - Titulo grande "Casting {projectName}" con la ultima palabra italic dorada
 *   - Subtitulo descriptivo (interpola la categoria de exclusividad si existe)
 *
 * La ultima palabra del nombre del proyecto se renderiza en italic + accent.
 * Esto da el toque editorial sin necesidad de cargar Fraunces (usa Outfit 400 italic).
 */
export async function ProjectHeader({
  project,
  locale,
  startDateLabel,
}: ProjectHeaderProps) {
  const t = await getTranslations({
    locale,
    namespace: "studio.talent.catalog",
  });

  const title = t("title", { projectName: project.name });
  const { body, last } = splitLastWord(title);

  const subtitleCategory = project.exclusivityCategory?.[locale];
  const subtitle = subtitleCategory
    ? t("subtitle", { category: subtitleCategory })
    : t("subtitleNoCategory");

  return (
    <header
      className="border-b pb-8"
      style={{ borderColor: "color-mix(in oklch, white 8%, transparent)" }}
    >
      <p
        className="mb-4 font-mono text-[11px] uppercase tracking-[0.1em] text-white/40"
      >
        {t("metaProject", {
          client: project.client,
          date: startDateLabel,
        })}
      </p>

      <h1
        className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
        style={{
          fontFamily: "var(--font-heading)",
          letterSpacing: "-0.02em",
          lineHeight: 1.05,
        }}
      >
        {body}{" "}
        <em
          style={{
            fontStyle: "italic",
            fontWeight: 400,
            color: "var(--accent)",
          }}
        >
          {last}
        </em>
      </h1>

      <p className="max-w-[620px] text-base leading-relaxed text-white/55 sm:text-lg">
        {subtitle}
      </p>
    </header>
  );
}

function splitLastWord(s: string): { body: string; last: string } {
  const trimmed = s.trim();
  const i = trimmed.lastIndexOf(" ");
  if (i === -1) return { body: "", last: trimmed };
  return { body: trimmed.slice(0, i), last: trimmed.slice(i + 1) };
}
