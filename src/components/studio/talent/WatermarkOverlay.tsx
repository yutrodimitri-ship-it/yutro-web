interface WatermarkOverlayProps {
  /** Cliente upper case (ej. "BBDO"). */
  clientName: string;
  /** Codigo del talento (YE-W07). */
  talentCode: string;
  /** Fecha formateada (ej. "30·04·26"). */
  date: string;
  /** Si true, agrega ` · CONFIDENCIAL` al final (uso en detalle). */
  confidential?: boolean;
  confidentialLabel?: string;
}

/**
 * Watermark diagonal sutil sobreimpuesto en cada imagen del catalogo.
 *
 * - Diagonal -25deg
 * - Color foreground 15% opacidad
 * - pointer-events-none (no interfiere con clicks)
 * - aria-hidden (lectores de pantalla lo ignoran)
 */
export function WatermarkOverlay({
  clientName,
  talentCode,
  date,
  confidential = false,
  confidentialLabel = "CONFIDENCIAL",
}: WatermarkOverlayProps) {
  const text = confidential
    ? `YUTRO ESTUDIO · ${clientName} · ${talentCode} · ${confidentialLabel}`
    : `YUTRO ESTUDIO · ${clientName} · ${date} · ${talentCode}`;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[5] flex items-center justify-center"
    >
      <span
        className="whitespace-nowrap font-mono uppercase"
        style={{
          fontSize: "8px",
          letterSpacing: "0.15em",
          color: "rgba(245,241,234,0.15)",
          transform: "rotate(-25deg)",
        }}
      >
        {text}
      </span>
    </div>
  );
}
