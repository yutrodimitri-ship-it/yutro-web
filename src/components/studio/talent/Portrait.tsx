"use client";

// Portrait editorial — stripe placeholder (Yutro Design System v2)
// Warm tinted stripes with inset frame, badge, and pose label.
// Replaces the SVG abstract silhouette; integrates with the cream theme.

const TINT_MAP: Record<string, string> = {
  lifestyle:   "warm",
  urbano:      "cool",
  familiar:    "rose",
  corporativo: "slate",
  senior:      "ochre",
  oficios:     "bronze",
};

interface PortraitProps {
  hue?: number;    // legacy — unused in new design
  sat?: number;    // legacy — unused in new design
  code: string;
  variant?: number;
  disabled?: boolean;
  className?: string;
  category?: string;
  gender?: string;
  pose?: string;
}

export function Portrait({
  code,
  disabled = false,
  className = "",
  category,
  gender,
  pose,
}: PortraitProps) {
  const tint = TINT_MAP[category ?? ""] ?? "moss";
  const stripeAngle = gender === "m" ? "45deg" : "22deg";

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className}`}
      data-tint={tint}
      style={{
        background: "var(--sand)",
        filter: disabled ? "grayscale(0.6) brightness(0.75)" : undefined,
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
        "--stripe-angle": stripeAngle,
      } as React.CSSProperties}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      draggable={false}
    >
      {/* Stripes */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0,
          backgroundImage: `repeating-linear-gradient(
            var(--stripe-angle, 22deg),
            color-mix(in oklab, var(--sand-2) 75%, transparent) 0 14px,
            transparent 14px 28px
          )`,
          opacity: 0.9,
        }}
      />

      {/* Inset frame */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 14,
          border: "1px solid color-mix(in oklab, var(--talent-ink, oklch(0.13 0 0)) 14%, transparent)",
        }}
      />

      {/* Badge top-left */}
      <div
        style={{
          position: "absolute", top: 14, left: 14,
          fontFamily: "ui-monospace, monospace",
          fontSize: 9, letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--talent-ink, oklch(0.13 0 0))",
          display: "flex", flexDirection: "column", gap: 3,
        }}
      >
        <span>
          <span style={{
            width: 5, height: 5,
            background: "var(--accent, #ff7404)",
            borderRadius: "999px",
            display: "inline-block",
            marginRight: 5,
            verticalAlign: "middle",
          }} />
          YUTRO
        </span>
        <span style={{ opacity: 0.6 }}>{code}</span>
      </div>

      {/* Pose label bottom-right */}
      {pose && (
        <div
          style={{
            position: "absolute", bottom: 14, right: 14,
            fontFamily: "ui-monospace, monospace",
            fontSize: 9, letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--talent-ink, oklch(0.13 0 0))",
            opacity: 0.55,
            textAlign: "right",
          }}
        >
          {pose}
        </div>
      )}
    </div>
  );
}
