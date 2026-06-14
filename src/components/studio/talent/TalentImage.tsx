"use client";

import { useState } from "react";
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
  /**
   * Tamaño del derivado a pedir: `thumb` (grilla, default) o `preview` (ficha).
   * El backend genera y cachea cada tamaño una sola vez.
   */
  size?: "thumb" | "preview";
  /** Prioriza la carga (sin lazy) — solo para imágenes sobre el fold. */
  priority?: boolean;
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
 * Usa un <img> nativo con lazy-loading apuntando a la ruta protegida, pasando
 * el slug del proyecto por query (`?p=`) — necesario para el watermark con
 * cliente + fecha. La ruta valida sesión + acceso server-side igual que antes.
 */
export function TalentImage({
  talent,
  variant = "profile",
  portraitVariant,
  disabled = false,
  className,
  forcePortrait = false,
  size = "thumb",
  priority = false,
}: TalentImageProps) {
  const session = useTalentSession();
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Path local en /public (modo pre-R2) — se sirve estáticamente.
  const localPath = forcePortrait ? null : resolveLocalPath(talent, variant);

  const hasRealImage = forcePortrait
    ? false
    : Boolean(localPath) || variantHasKey(talent, variant);

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

  // La variante que entiende la API es la del NOMBRE DEL ARCHIVO en la key
  // (gallery-1..8): los componentes usan alias (studio-1, gallery-0 base-0),
  // asi que se deriva de la key real en vez de confiar en el alias.
  // El slug del proyecto va por query (`?p=`) para poder usar <img> nativo
  // con lazy-loading — la ruta sigue validando sesión + acceso server-side.
  const src =
    localPath ??
    `/api/studio/talent/image/${encodeURIComponent(
      talent.code
    )}/${encodeURIComponent(
      resolveStorageVariant(talent, variant)
    )}?p=${encodeURIComponent(session.projectSlug)}&size=${size}`;

  return (
    <>
      {/* Skeleton detrás hasta que la imagen carga (evita salto de layout). */}
      {!loaded && (
        <div
          className={`talent-skeleton absolute inset-0 h-full w-full ${className ?? ""}`}
          aria-hidden
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`Talent ${talent.code}`}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover transition-[filter,opacity] duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        } ${className ?? ""}`}
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
    </>
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
 * Si la key del talento es un path absoluto de /public (ej. /influencers/...
 * de las featured) la servimos local; si no, va por el endpoint del bucket.
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
  // Cualquier path absoluto de /public es local (talents, talents-webp,
  // influencers, etc). Las keys de storage no llevan "/" inicial.
  return Boolean(key && key.startsWith("/"));
}

/**
 * Variante canonica para la API protegida: el basename de la key en storage
 * (`talents/{code}/{variant}.jpg`). Si la key no es parseable, devuelve el
 * alias recibido tal cual.
 */
function resolveStorageVariant(talent: Talent, variant: TalentImageVariant): string {
  let key: string | null | undefined;
  if (variant === "profile") key = talent.imageProfileKey;
  else if (variant === "charsheet") key = talent.imageCharsheetKey;
  else {
    const idx = galleryIndex(variant);
    key = idx >= 0 ? talent.galleryKeys?.[idx] : null;
  }
  const m = key?.match(/\/([^/]+)\.[a-z]+$/i);
  return m ? m[1] : variant;
}

function variantHasKey(talent: Talent, variant: TalentImageVariant): boolean {
  if (variant === "profile") return Boolean(talent.imageProfileKey);
  if (variant === "charsheet") return Boolean(talent.imageCharsheetKey);
  const idx = galleryIndex(variant);
  if (idx === -1) return false;
  return Boolean(talent.galleryKeys?.[idx]);
}
