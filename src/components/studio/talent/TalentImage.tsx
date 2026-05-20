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
  | "lifestyle-3"
  | `gallery-${number}`;

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

  // Path local en /public (modo pre-R2) — se sirve estáticamente.
  const localPath = forcePortrait ? null : resolveLocalPath(talent, variant);

  const hasRealImage = forcePortrait
    ? false
    : Boolean(localPath) || variantHasKey(talent, variant);

  useEffect(() => {
    if (!hasRealImage || localPath) return;
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
  }, [hasRealImage, localPath, talent.code, variant, session.projectSlug]);

  if (!hasRealImage || failed) {
    return (
      <Portrait
        hue={talent.hue}
        sat={talent.sat}
        code={talent.code}
        variant={portraitVariant}
        disabled={disabled}
        className={className}
        category={talent.category}
        gender={talent.gender}
      />
    );
  }

  const src = localPath ?? blobUrl;
  if (!src) {
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
      src={src}
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

/**
 * Mapea el variant del image a un índice del array galleryKeys.
 * - studio-1..3 → 0, 1, 2
 * - lifestyle-1..3 → 3, 4, 5
 * - gallery-N → N (directo)
 * Retorna -1 si el variant no es de galería.
 */
function galleryIndex(variant: TalentImageVariant): number {
  if (variant.startsWith("gallery-")) {
    const n = Number(variant.split("-")[1]);
    return Number.isFinite(n) ? n : -1;
  }
  const galleryOrder: TalentImageVariant[] = [
    "studio-1", "studio-2", "studio-3",
    "lifestyle-1", "lifestyle-2", "lifestyle-3",
  ];
  return galleryOrder.indexOf(variant);
}

/**
 * Si la key del talento empieza con "/talents/" la consideramos un path local
 * en /public.
 */
function resolveLocalPath(talent: Talent, variant: TalentImageVariant): string | null {
  if (variant === "profile") {
    return isLocalKey(talent.imageProfileKey) ? talent.imageProfileKey! : null;
  }
  if (variant === "charsheet") {
    return isLocalKey(talent.imageCharsheetKey) ? talent.imageCharsheetKey! : null;
  }
  const idx = galleryIndex(variant);
  if (idx === -1) return null;
  const key = talent.galleryKeys?.[idx];
  return isLocalKey(key) ? key! : null;
}

function isLocalKey(key: string | null | undefined): boolean {
  return Boolean(key && (key.startsWith("/talents/") || key.startsWith("/talents-webp/")));
}

function variantHasKey(talent: Talent, variant: TalentImageVariant): boolean {
  if (variant === "profile") return Boolean(talent.imageProfileKey);
  if (variant === "charsheet") return Boolean(talent.imageCharsheetKey);
  const idx = galleryIndex(variant);
  if (idx === -1) return false;
  return Boolean(talent.galleryKeys?.[idx]);
}
