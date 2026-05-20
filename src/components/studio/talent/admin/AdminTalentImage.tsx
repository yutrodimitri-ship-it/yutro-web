"use client";

import { useEffect, useState } from "react";
import { Portrait } from "../Portrait";
import type { Talent } from "@/types/talent";

type Variant =
  | "profile"
  | "charsheet"
  | "studio-1"
  | "studio-2"
  | "studio-3"
  | "lifestyle-1"
  | "lifestyle-2"
  | "lifestyle-3";

interface AdminTalentImageProps {
  talent: Pick<Talent, "code" | "hue" | "sat"> &
    Partial<
      Pick<Talent, "imageProfileKey" | "imageCharsheetKey" | "galleryKeys">
    >;
  variant?: Variant;
  className?: string;
}

/**
 * Variante del TalentImage para admin: usa el endpoint admin (sin watermark,
 * sin ownership check, requireAdmin). Falls back to Portrait SVG.
 */
export function AdminTalentImage({
  talent,
  variant = "profile",
  className,
}: AdminTalentImageProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  const hasKey = variantHasKey(talent, variant);

  useEffect(() => {
    if (!hasKey) return;
    let aborted = false;
    let createdUrl: string | null = null;

    const url = `/api/studio/talent/admin/images/${encodeURIComponent(
      talent.code
    )}/${encodeURIComponent(variant)}`;
    fetch(url)
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
  }, [hasKey, talent.code, variant]);

  if (!hasKey || failed) {
    return (
      <Portrait
        hue={talent.hue}
        sat={talent.sat}
        code={talent.code}
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
      alt={`Admin preview ${talent.code} ${variant}`}
      className={`h-full w-full object-cover ${className ?? ""}`}
      draggable={false}
    />
  );
}

function variantHasKey(
  talent: AdminTalentImageProps["talent"],
  variant: Variant
): boolean {
  if (variant === "profile") return Boolean(talent.imageProfileKey);
  if (variant === "charsheet") return Boolean(talent.imageCharsheetKey);
  return (talent.galleryKeys ?? []).some((k) =>
    k.endsWith(`/${variant}.jpg`)
  );
}
