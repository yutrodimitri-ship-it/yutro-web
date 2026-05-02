"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCasting } from "@/lib/talent/casting-context";
import { useTalentSession } from "@/lib/talent/talent-session-context";
import { logAuditEvent } from "@/lib/talent/audit-log";
import { useToast } from "./Toast";
import { SelectedItem } from "./SelectedItem";
import { LicenseTerms } from "./LicenseTerms";
import { EmptyState } from "./EmptyState";
import type { Locale, ProjectConfig, Talent } from "@/types/talent";

interface CastingPageClientProps {
  project: ProjectConfig;
  locale: Locale;
  /**
   * Catalogo del proyecto serializado desde el server component. El client lo
   * usa para resolver `code → Talent` al renderizar el shortlist guardado en
   * sessionStorage.
   */
  catalog: Talent[];
}

/**
 * Client wrapper que:
 *   - Lee shortlist + exclusives del CastingContext
 *   - Resuelve cada code → Talent completo
 *   - Renderiza header + (lista | empty state) + panel terms
 */
export function CastingPageClient({ project, locale, catalog }: CastingPageClientProps) {
  const tCasting = useTranslations("studio.talent.casting");
  const tCommon = useTranslations("studio.talent.common");
  const reduce = useReducedMotion();
  const {
    state,
    limits,
    isExclusive,
    isExclusiveFull,
    remove,
    toggleExclusive,
  } = useCasting();
  const session = useTalentSession();
  const toast = useToast();
  const catalogHref = `/${locale}/studio/talent/${project.slug}`;

  // Mapea codes a talents completos preservando el orden de seleccion
  const selectedTalents = useMemo(
    () =>
      state.shortlist
        .map((code) => catalog.find((t) => t.code === code))
        .filter((t): t is NonNullable<typeof t> => Boolean(t)),
    [state.shortlist, catalog]
  );

  function handleToggleExclusive(code: string) {
    const wasExclusive = isExclusive(code);
    const ok = toggleExclusive(code);
    if (!ok) {
      toast.show(
        tCasting("toast.exclusiveFull", { max: limits.maxExclusive })
      );
      return;
    }
    logAuditEvent("exclusive_toggled", session, {
      talentCode: code,
      isExclusive: !wasExclusive,
    });
  }

  function handleRemove(code: string) {
    remove(code);
    logAuditEvent("talent_removed", session, {
      talentCode: code,
      source: "casting",
    });
  }

  const containerVariants = reduce
    ? undefined
    : {
        hidden: {},
        show: {
          transition: { staggerChildren: 0.05 },
        },
      };

  return (
    <div className="space-y-12">
      {/* Boton volver al catalogo */}
      <Link
        href={catalogHref}
        className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-white/40 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
        {tCommon("backToCatalog")}
      </Link>

      {/* Header */}
      <header className="space-y-4">
        <p
          className="font-mono text-[11px] uppercase tracking-[0.18em]"
          style={{ color: "var(--accent)" }}
        >
          {tCasting("subtitle")}
        </p>
        <h1
          className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
          style={{
            fontFamily: "var(--font-heading)",
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
          }}
        >
          {renderTitleItalic(tCasting("title"))}
        </h1>
        <p className="max-w-[620px] text-base leading-relaxed text-white/55 sm:text-lg">
          {tCasting("intro")}
        </p>
      </header>

      {/* Layout: en mobile el panel terms va PRIMERO (info legal antes del CTA);
          en lg se invierte para layout 1.5fr / 1fr con terms a la derecha. */}
      <div className="flex flex-col gap-12 lg:grid lg:grid-cols-[1.5fr_1fr]">
        {/* Lista — orden 2 en mobile, 1 en desktop */}
        <div className="order-2 min-w-0 lg:order-1">
          {selectedTalents.length === 0 ? (
            <EmptyState
              title={tCasting("empty.title")}
              description={tCasting("empty.description")}
              ctaLabel={tCasting("empty.cta")}
              ctaHref={`/${locale}/studio/talent/${project.slug}`}
            />
          ) : (
            <motion.ul
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-1"
            >
              {selectedTalents.map((talent) => {
                const exclusive = isExclusive(talent.code);
                const disabled = isExclusiveFull && !exclusive;
                return (
                  <SelectedItem
                    key={talent.code}
                    talent={talent}
                    locale={locale}
                    isExclusive={exclusive}
                    isExclusiveDisabled={disabled}
                    onToggleExclusive={() => handleToggleExclusive(talent.code)}
                    onRemove={() => handleRemove(talent.code)}
                  />
                );
              })}
            </motion.ul>
          )}
        </div>

        {/* Panel terms — orden 1 en mobile (arriba del CTA), 2 en desktop */}
        <div className="order-1 lg:order-2">
          <LicenseTerms
            project={project}
            locale={locale}
            backHref={`/${locale}/studio`}
            catalogHref={catalogHref}
          />
        </div>
      </div>
    </div>
  );
}

function renderTitleItalic(title: string) {
  const trimmed = title.trim();
  const i = trimmed.lastIndexOf(" ");
  if (i === -1) return title;
  return (
    <>
      {trimmed.slice(0, i)}{" "}
      <em
        style={{
          fontStyle: "italic",
          fontWeight: 400,
          color: "var(--accent)",
        }}
      >
        {trimmed.slice(i + 1)}
      </em>
    </>
  );
}
