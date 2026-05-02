"use client";

import { useEffect, useState } from "react";
import { Portrait } from "./Portrait";
import { useTalentSession } from "@/lib/talent/talent-session-context";
import type { Talent } from "@/types/talent";

export type TalentImageVariant =
  | "profile"
  | "charsheet"
  | "studio-1"
  | "studio-2"
  | "studio-3"
  | "lifestyle-1"
  | "lifestyle-2"
  | "lifestyle-3";

interface TalentImageProps {
  talent: Talent;
  variant?: TalentImageVariant;
  /** Para el fallback Portrait — replica el offset del Portrait original. */
  portraitVariant?: number;
  /** Aplica filtro grayscale + brightness reducidos (estado disabled). */
  disabled?: boolean;
  className?: string;
  /** Forza usar el placeholder SVG (utility para preview / admin). */
  forcePortrait?: boolean;
}

/**
 * Renderiza la imagen real del talent (via API protegida con watermark dinamico)
 * cuando existe en R2. Cuando no, fallback al Portrait SVG. Bloquea click derecho
 * y drag igual que Portrait.
 *
 * La existencia de imagen real se infiere de las columnas de DB:
 *   - variant=profile      → talent.imageProfileKey
 *   - variant=charsheet    → talent.imageCharsheetKey
 *   - variant=studio|lifestyle-* → talent.galleryKeys.includes(variant)
 *
 * El fetch al API pasa `x-project-slug` (necesario para construir el watermark
 * con cliente + fecha del proyecto activo).
 */
export function TalentImage({
  talent,
  variant = "profile",
  portraitVariant,
  disabled = false,
  className,
  forcePortrait = false,
}: TalentImageProps) {
  const session = useTalentSession();
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  const hasRealImage = forcePortrait
    ? false
    : variantHasKey(talent, variant);

  useEffect(() => {
    if (!hasRealImage) return;
    let aborted = false;
    let createdUrl: string | null = null;

    const url = `/api/studio/talent/image/${encodeURIComponent(
      talent.code
    )}/${encodeURIComponent(variant)}`;
    fetch(url, {
      headers: { "x-project-slug": session.projectSlug },
    })
      .then((r) => (r.ok ? r.blob() : Promise.reject(r.status)))
      .then((blob) => {
        if (aborted) return;
        createdUrl = URL.createObjectURL(blob);
        setBlobUrl(createdUrl);
      })
      .catch(() => {
        if (!aborted) setFailed(true);
      });

    return () => {
      aborted = true;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [hasRealImage, talent.code, variant, session.projectSlug]);

  if (!hasRealImage || failed) {
    return (
      <Portrait
        hue={talent.hue}
        sat={talent.sat}
        code={talent.code}
        variant={portraitVariant}
        disabled={disabled}
        className={className}
      />
    );
  }

  if (!blobUrl) {
    return (
      <div
        className={`talent-skeleton h-full w-full ${className ?? ""}`}
        aria-hidden
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={blobUrl}
      alt={`Talent ${talent.code}`}
      className={`h-full w-full object-cover transition-[filter] duration-300 ${className ?? ""}`}
      draggable={false}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      style={{
        filter: disabled ? "grayscale(0.7) brightness(0.55)" : undefined,
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
      }}
    />
  );
}

function variantHasKey(talent: Talent, variant: TalentImageVariant): boolean {
  if (variant === "profile") return Boolean(talent.imageProfileKey);
  if (variant === "charsheet") return Boolean(talent.imageCharsheetKey);
  // gallery variants stored as full key in galleryKeys; we infer presence by
  // checking if the variant name matches any key suffix.
  return (talent.galleryKeys ?? []).some((k) => k.endsWith(`/${variant}.jpg`));
}
