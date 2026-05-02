"use client";

import { useTranslations } from "next-intl";
import type { TalentAgeBucket, TalentCategory, TalentGender } from "@/types/talent";

/**
 * FilterValue — uniforme para genero, edad, categoria.
 *   "all" + ("m" | "f") + age buckets + categorias.
 */
export type FilterValue =
  | "all"
  | TalentGender
  | TalentAgeBucket
  | TalentCategory;

interface FilterChipsProps {
  activeFilter: FilterValue;
  onFilterChange: (value: FilterValue) => void;
}

interface ChipDef {
  value: FilterValue;
  /** Path dentro de namespace `studio.talent.catalog`. */
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
];

export function FilterChips({ activeFilter, onFilterChange }: FilterChipsProps) {
  const t = useTranslations("studio.talent.catalog");

  return (
    <div
      className="flex items-center gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0"
      role="toolbar"
      aria-label={t("filters.label")}
    >
      <span
        className="shrink-0 pr-1 font-mono text-[11px] uppercase tracking-[0.1em] text-white/40"
      >
        {t("filters.label")}
      </span>
      {CHIPS.map((chip) => {
        const isActive = activeFilter === chip.value;
        return (
          <button
            key={chip.value}
            type="button"
            onClick={() => onFilterChange(chip.value)}
            aria-pressed={isActive}
            className="shrink-0 cursor-pointer px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors"
            style={{
              border: `1px solid ${
                isActive ? "var(--accent)" : "color-mix(in oklch, white 12%, transparent)"
              }`,
              background: isActive ? "var(--accent)" : "transparent",
              color: isActive ? "var(--accent-foreground)" : "rgba(255,255,255,0.55)",
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
