"use client";

import { motion, useReducedMotion } from "framer-motion";

interface ExclusiveToggleProps {
  isExclusive: boolean;
  /** True cuando el cupo de exclusivos esta lleno y este toggle NO esta activo. */
  isDisabled: boolean;
  onToggle: () => void;
  label: string;
  /** Tooltip cuando esta disabled (mensaje del cupo lleno). */
  disabledTitle?: string;
}

/**
 * Toggle custom estilizado para marcar exclusividad por talento.
 *
 * - Track 28x16 con border-radius full
 * - Knob 10x10 que se desplaza con spring
 * - OFF: track negro, knob gris a la izquierda, label muted
 * - ON:  track dorado (`--accent`), knob negro a la derecha, label dorado
 * - Disabled: opacity 0.45, cursor not-allowed, no toggle
 *
 * La palabra "Exclusivo" SIEMPRE visible (no cambia a "Compartido").
 */
export function ExclusiveToggle({
  isExclusive,
  isDisabled,
  onToggle,
  label,
  disabledTitle,
}: ExclusiveToggleProps) {
  const reduce = useReducedMotion();

  function handleClick() {
    if (isDisabled) return;
    onToggle();
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isExclusive}
      aria-disabled={isDisabled}
      title={isDisabled ? disabledTitle : undefined}
      onClick={handleClick}
      className="inline-flex select-none items-center gap-2.5 px-3 py-2 transition-colors"
      style={{
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 0.45 : 1,
        border: `1px solid ${
          isExclusive
            ? "var(--accent)"
            : "color-mix(in oklch, white 12%, transparent)"
        }`,
        background: "transparent",
      }}
    >
      {/* Switch track */}
      <span
        aria-hidden
        className="relative inline-block shrink-0 rounded-full"
        style={{
          width: "28px",
          height: "16px",
          background: isExclusive
            ? "var(--accent)"
            : "color-mix(in oklch, black 80%, transparent)",
          border: `1px solid ${
            isExclusive
              ? "var(--accent)"
              : "color-mix(in oklch, white 12%, transparent)"
          }`,
          transition: "background-color 0.25s ease, border-color 0.25s ease",
        }}
      >
        <motion.span
          className="absolute top-1/2 block rounded-full"
          initial={false}
          animate={{
            left: isExclusive ? "14px" : "2px",
            backgroundColor: isExclusive
              ? "var(--accent-foreground)"
              : "rgba(255,255,255,0.55)",
          }}
          transition={
            reduce
              ? { duration: 0 }
              : { type: "spring", stiffness: 600, damping: 32 }
          }
          style={{
            width: "10px",
            height: "10px",
            translateY: "-50%",
          }}
        />
      </span>

      {/* Label — siempre visible, color cambia con estado */}
      <span
        className="font-mono text-[10px] uppercase tracking-[0.1em]"
        style={{
          color: isExclusive ? "var(--accent)" : "rgba(255,255,255,0.55)",
          minWidth: "64px",
          transition: "color 0.2s ease",
        }}
      >
        {label}
      </span>
    </button>
  );
}
