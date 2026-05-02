"use client";

import { useMemo } from "react";
import { buildPortraitSVG } from "@/lib/talent/portrait-svg";

interface PortraitProps {
  hue: number;
  sat: number;
  /** Codigo del talento — usado como seed deterministico del SVG. */
  code: string;
  /** Variante (offset al seed) — para galerias multi-imagen del detalle. */
  variant?: number;
  /** Aplica filtro grayscale + brightness reducidos. */
  disabled?: boolean;
  className?: string;
}

/**
 * Componente portrait: renderiza el SVG abstracto del talento.
 *
 * - Bloquea click derecho (`onContextMenu={e.preventDefault()}`)
 * - Bloquea drag (`onDragStart={e.preventDefault()}`, `draggable={false}`)
 * - Si `disabled`, aplica filtro grayscale para el estado "cupo lleno" (Opcion C)
 */
export function Portrait({
  hue,
  sat,
  code,
  variant = 0,
  disabled = false,
  className = "",
}: PortraitProps) {
  // El SVG es deterministico — memo para evitar regen en cada render
  const svg = useMemo(
    () => buildPortraitSVG({ hue, sat, code, variant }),
    [hue, sat, code, variant]
  );

  return (
    <div
      className={`relative h-full w-full transition-[filter] duration-300 ${className}`}
      style={{
        filter: disabled ? "grayscale(0.7) brightness(0.55)" : undefined,
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
      }}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      draggable={false}
      // dangerouslySetInnerHTML es seguro: el input es matematica HSL del codigo,
      // no contiene datos del usuario ni deriva de URL params.
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
