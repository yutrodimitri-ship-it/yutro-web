"use client";

import { useTranslations } from "next-intl";
import type { TalentAgeBucket, TalentCategory, TalentGender } from "@/types/talent";

export type FilterValue =
  | "all"
  | TalentGender
  | TalentAgeBucket
  | TalentCategory;

interface FilterChipsProps {
  activeFilter: FilterValue;
  onFilterChange: (value: FilterValue) => void;
  /** Conjunto de filtros que tienen al menos un talento presente. */
  availableFilters?: Set<FilterValue>;
}

interface ChipDef {
  value: FilterValue;
  i18nPath: string;
}

const CHIPS: ReadonlyArray<ChipDef> = [
  { value: "all", i18nPath: "filters.all" },
  { value: "m", i18nPath: "filters.men" },
  { value: "f", i18nPath: "filters.women" },
  { value: "20s", i18nPath: "filters.20s" },
  { value: "30s", i18nPath: "filters.30s" },
  { value: "40s", i18nPath: "filters.40s" },
  { value: "50s", i18nPath: "filters.50s" },
  { value: "lifestyle", i18nPath: "filters.categories.lifestyle" },
  { value: "urbano", i18nPath: "filters.categories.urbano" },
  { value: "familiar", i18nPath: "filters.categories.familiar" },
  { value: "corporativo", i18nPath: "filters.categories.corporativo" },
  { value: "senior", i18nPath: "filters.categories.senior" },
  { value: "oficios", i18nPath: "filters.categories.oficios" },
  { value: "artistico", i18nPath: "filters.categories.artistico" },
  { value: "profesional", i18nPath: "filters.categories.profesional" },
];

export function FilterChips({ activeFilter, onFilterChange, availableFilters }: FilterChipsProps) {
  const t = useTranslations("studio.talent.catalog");

  const visibleChips = availableFilters
    ? CHIPS.filter((chip) => chip.value === "all" || availableFilters.has(chip.value))
    : CHIPS;

  return (
    <div
      className="flex items-center gap-6 overflow-x-auto pb-1"
      style={{ scrollbarWidth: "none" }}
      role="toolbar"
      aria-label={t("filters.label")}
    >
      {visibleChips.map((chip) => {
        const isActive = activeFilter === chip.value;
        return (
          <button
            key={chip.value}
            type="button"
            onClick={() => onFilterChange(chip.value)}
            aria-pressed={isActive}
            className="shrink-0 cursor-pointer font-mono text-[12px] uppercase tracking-[0.12em] transition-colors duration-150"
            style={{
              color: isActive ? "var(--accent)" : "rgba(0,0,0,0.45)",
              borderBottom: isActive ? "1px solid var(--accent)" : "1px solid transparent",
              paddingBottom: "2px",
            }}
          >
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(t as unknown as (k: string) => string)(chip.i18nPath)}
          </button>
        );
      })}
    </div>
  );
}
