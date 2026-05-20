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
  exclusiveBlockedCodes?: string[];
  assignedCodes?: string[];
}

const AGE_BUCKETS = new Set<FilterValue>(["20s", "30s", "40s", "50s"]);
const CATEGORIES = new Set<FilterValue>([
  "corporativo",
  "lifestyle",
  "familiar",
  "urbano",
  "senior",
  "oficios",
  "artistico",
  "profesional",
]);

export function TalentGrid({
  talents,
  locale,
  clientName,
  watermarkDate,
  projectSlug,
  exclusiveBlockedCodes = [],
  assignedCodes = [],
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

  /** Conjunto de filtros que tienen al menos un talento. */
  const availableFilters = useMemo(() => {
    const set = new Set<FilterValue>();
    for (const tt of talents) {
      set.add(tt.gender);
      set.add(tt.ageBucket);
      set.add(tt.category);
    }
    return set;
  }, [talents]);

  const containerVariants = reduce
    ? undefined
    : {
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.04,
            staggerDirection: 1,
          },
        },
      };

  return (
    <div className="flex flex-col">
      {/* Filtros con padding lateral */}
      <div className="px-6 py-3 sm:px-10">
        <FilterChips
          activeFilter={filter}
          onFilterChange={setFilter}
          availableFilters={availableFilters}
        />
      </div>

      {filtered.length === 0 ? (
        <div
          className="mx-6 py-20 text-center text-sm sm:mx-10"
          style={{
            color: "var(--talent-ink-mute)",
            border: "1px dashed color-mix(in oklch, black 12%, transparent)",
          }}
        >
          {t("noResults")}
        </div>
      ) : (
        <motion.div
          key={filter}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-px sm:grid-cols-3 lg:grid-cols-4"
          style={{ background: "var(--talent-line)" }}
        >
          {filtered.map((talent) => (
            <TalentCard
              key={talent.code}
              talent={talent}
              locale={locale}
              clientName={clientName}
              watermarkDate={watermarkDate}
              projectSlug={projectSlug}
              isExclusiveBlocked={exclusiveBlockedCodes.includes(talent.code)}
              isAssigned={assignedCodes.includes(talent.code)}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
