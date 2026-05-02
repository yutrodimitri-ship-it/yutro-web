"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { TalentCard } from "./TalentCard";
import { FilterChips, type FilterValue } from "./FilterChips";
import type { Locale, Talent } from "@/types/talent";

interface TalentGridProps {
  talents: Talent[];
  locale: Locale;
  clientName: string;
  watermarkDate: string;
  projectSlug: string;
}

const AGE_BUCKETS = new Set<FilterValue>(["20s", "30s", "40s", "50s"]);
const CATEGORIES = new Set<FilterValue>([
  "corporativo",
  "lifestyle",
  "familiar",
  "urbano",
  "senior",
  "oficios",
]);

/**
 * Grid de talentos con FilterChips arriba.
 *
 * Filtra el array `talents` segun el chip activo:
 *   - "all"          → todos
 *   - "m" | "f"      → genero
 *   - "20s"-"50s"    → ageBucket
 *   - categoria      → category
 *
 * Stagger reveal de los cards al cargar (respeta reduced-motion).
 */
export function TalentGrid({
  talents,
  locale,
  clientName,
  watermarkDate,
  projectSlug,
}: TalentGridProps) {
  const t = useTranslations("studio.talent.catalog");
  const [filter, setFilter] = useState<FilterValue>("all");
  const reduce = useReducedMotion();

  const filtered = useMemo(() => {
    if (filter === "all") return talents;
    if (filter === "m" || filter === "f") {
      return talents.filter((tt) => tt.gender === filter);
    }
    if (AGE_BUCKETS.has(filter)) {
      return talents.filter((tt) => tt.ageBucket === filter);
    }
    if (CATEGORIES.has(filter)) {
      return talents.filter((tt) => tt.category === filter);
    }
    return talents;
  }, [filter, talents]);

  const containerVariants = reduce
    ? undefined
    : {
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.04,
            // Tope: con 22 cards y 0.04s = 0.88s, dentro del max 1s del spec
            staggerDirection: 1,
          },
        },
      };

  return (
    <div className="space-y-8">
      <FilterChips activeFilter={filter} onFilterChange={setFilter} />

      {filtered.length === 0 ? (
        <div
          className="py-20 text-center text-sm text-white/40"
          style={{
            border: "1px dashed color-mix(in oklch, white 12%, transparent)",
          }}
        >
          {t("noResults")}
        </div>
      ) : (
        <motion.div
          key={filter} // re-stagger cuando cambia el filtro
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid gap-1"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          }}
        >
          {filtered.map((talent) => (
            <TalentCard
              key={talent.code}
              talent={talent}
              locale={locale}
              clientName={clientName}
              watermarkDate={watermarkDate}
              projectSlug={projectSlug}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
