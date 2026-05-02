"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { TalentImage } from "./TalentImage";
import { ExclusiveToggle } from "./ExclusiveToggle";
import type { Locale, Talent } from "@/types/talent";

interface SelectedItemProps {
  talent: Talent;
  locale: Locale;
  isExclusive: boolean;
  isExclusiveDisabled: boolean;
  onToggleExclusive: () => void;
  onRemove: () => void;
}

/**
 * Item de la lista de seleccionados en la pantalla casting.
 *
 * Layout desktop: grid 4 col → thumb (80px) + meta + ExclusiveToggle + remove
 * Layout mobile:  grid 3 col → thumb (64px, 2 filas) + (meta + remove arriba) + toggle abajo
 *
 * Estado visual:
 *   - Sin exclusividad: borde lateral 2px gris
 *   - Con exclusividad: borde lateral 2px dorado + gradient sutil bg
 */
export function SelectedItem({
  talent,
  locale,
  isExclusive,
  isExclusiveDisabled,
  onToggleExclusive,
  onRemove,
}: SelectedItemProps) {
  const tCasting = useTranslations("studio.talent.casting");
  const tCommon = useTranslations("studio.talent.common");
  const reduce = useReducedMotion();

  return (
    <motion.li
      layout={!reduce}
      variants={{
        hidden: { opacity: 0, y: 8 },
        show: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="grid items-center gap-x-4 gap-y-3 p-4 transition-all duration-300 sm:grid-cols-[80px_1fr_auto_auto] sm:gap-x-5"
      style={{
        gridTemplateColumns: "64px 1fr auto",
        background: isExclusive
          ? "linear-gradient(90deg, color-mix(in oklch, var(--accent) 6%, transparent) 0%, #131313 50%)"
          : "#131313",
        borderLeft: `2px solid ${
          isExclusive
            ? "var(--accent)"
            : "color-mix(in oklch, white 8%, transparent)"
        }`,
      }}
    >
      {/* Thumb 3:4 */}
      <div
        className="row-span-2 overflow-hidden bg-[#1a1a1a] sm:row-span-1"
        style={{ aspectRatio: "3 / 4", width: "100%" }}
      >
        <TalentImage talent={talent} variant="profile" />
      </div>

      {/* Meta */}
      <div className="min-w-0 flex-1 sm:row-span-1">
        <div
          className="mb-0.5 font-mono text-[11px] uppercase tracking-[0.1em]"
          style={{ color: "var(--accent)" }}
        >
          {talent.code}
        </div>
        <div
          className="mb-0.5 truncate text-base text-white"
          style={{ fontFamily: "var(--font-heading)", fontWeight: 400 }}
        >
          {talent.name[locale]}
        </div>
        <div className="truncate text-xs text-white/55">
          {talent.shortDesc[locale]}
        </div>
      </div>

      {/* Toggle exclusivo */}
      <div className="col-span-2 sm:col-span-1">
        <ExclusiveToggle
          isExclusive={isExclusive}
          isDisabled={isExclusiveDisabled}
          onToggle={onToggleExclusive}
          label={tCommon("exclusive")}
          disabledTitle={tCasting("toggle.disabledTitle")}
        />
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={onRemove}
        title={tCasting("actions.remove")}
        aria-label={`${tCasting("actions.remove")} ${talent.code}`}
        className="grid h-9 w-9 cursor-pointer place-items-center text-white/30 transition-colors hover:text-[oklch(0.65_0.13_25)]"
      >
        <X className="h-4 w-4" strokeWidth={1.75} />
      </button>
    </motion.li>
  );
}
