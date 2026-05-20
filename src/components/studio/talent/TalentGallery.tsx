import { TalentImage } from "./TalentImage";
import { WatermarkOverlay } from "./WatermarkOverlay";
import type { Talent } from "@/types/talent";

interface TalentGalleryProps {
  talent: Talent;
  /** Variante visual: aplica diferentes hue offsets al SVG generator. */
  variant: "studio" | "lifestyle";
  title: string;
  /** Cliente para el watermark. */
  clientName: string;
  /** Fecha compacta para el watermark. */
  watermarkDate: string;
}

/**
 * 3 imagenes cuadradas (1:1) con SVG portraits derivados del talent base.
 *
 * - "studio": offsets pequenos del hue (mismo personaje, diferentes tomas/lighting)
 * - "lifestyle": offsets mayores y reduccion de saturacion (look mas casual)
 *
 * Las variantes 1-3 (studio) y 4-6 (lifestyle) usan diferentes seeds en el
 * generator para que cada thumbnail se vea distinto pero coherente.
 */
export function TalentGallery({
  talent,
  variant,
  title,
  clientName,
  watermarkDate,
}: TalentGalleryProps) {
  // Variants 1, 2, 3 mapean a `${variant}-1`, `-2`, `-3` keys en R2.
  const slots = [1, 2, 3] as const;

  return (
    <section>
      <h3
        className="mb-3 text-base"
        style={{
          color: "var(--talent-ink-dim)",
          fontFamily: "var(--font-heading)",
          fontWeight: 400,
          fontSize: "20px",
        }}
      >
        {renderTitleWithItalic(title)}
      </h3>

      <div className="grid grid-cols-3 gap-1">
        {slots.map((i) => {
          const imageVariant = `${variant}-${i}` as
            | "studio-1" | "studio-2" | "studio-3"
            | "lifestyle-1" | "lifestyle-2" | "lifestyle-3";
          // Si no hay imagen real, TalentImage cae al Portrait con offset i para
          // que cada slot se vea distinto pero coherente.
          return (
            <div
              key={imageVariant}
              className="relative overflow-hidden"
              style={{ aspectRatio: "1 / 1", background: "oklch(0.91 0.012 77)" }}
            >
              <TalentImage
                talent={talent}
                variant={imageVariant}
                portraitVariant={i + (variant === "lifestyle" ? 3 : 0)}
              />
              <WatermarkOverlay
                clientName={clientName}
                talentCode={talent.code}
                date={watermarkDate}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** Marca la ultima palabra del titulo en italic + accent dorado. */
function renderTitleWithItalic(title: string) {
  const trimmed = title.trim();
  const i = trimmed.lastIndexOf(" ");
  if (i === -1) return title;
  const body = trimmed.slice(0, i);
  const last = trimmed.slice(i + 1);
  return (
    <>
      {body}{" "}
      <em style={{ fontStyle: "italic", color: "var(--accent)" }}>{last}</em>
    </>
  );
}
