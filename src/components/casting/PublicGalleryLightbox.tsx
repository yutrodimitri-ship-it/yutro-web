"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

interface PublicGalleryLightboxProps {
  /** Imagen hero (3:4). Clickeable: abre el lightbox en el indice 0. */
  heroSrc: string | null;
  /** Resto de la galeria (cuadradas). */
  gallerySrcs: string[];
  name: string;
}

/**
 * Columna de galeria de la ficha publica con lightbox.
 *
 * - Muestra TODAS las imagenes de galeria (grid 3 col).
 * - Click en cualquier imagen (hero incluido) abre overlay a pantalla
 *   completa con navegacion: flechas, teclado (←/→/Esc) y click fuera.
 * - Sin dependencias nuevas: estado React + next/image.
 */
export function PublicGalleryLightbox({
  heroSrc,
  gallerySrcs,
  name,
}: PublicGalleryLightboxProps) {
  // Lista unica para navegar: hero primero, luego galeria
  const images = heroSrc ? [heroSrc, ...gallerySrcs] : gallerySrcs;
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (delta: number) => {
      setOpen((cur) =>
        cur === null ? cur : (cur + delta + images.length) % images.length
      );
    },
    [images.length]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    // Bloquear scroll del body mientras el lightbox esta abierto
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, step]);

  return (
    <div>
      {/* Hero 3:4 */}
      <button
        type="button"
        onClick={heroSrc ? () => setOpen(0) : undefined}
        className="relative block aspect-[3/4] w-full cursor-zoom-in overflow-hidden bg-foreground/5"
        aria-label={`${name} — ampliar imagen`}
      >
        {heroSrc ? (
          <Image
            src={heroSrc}
            alt={name}
            fill
            sizes="(max-width:1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-foreground/15 to-foreground/5" />
        )}
        <span
          className="pointer-events-none absolute right-3 bottom-3 font-mono text-[9px] uppercase tracking-[0.18em] text-white/40 mix-blend-overlay"
          aria-hidden
        >
          Yutro · Vol. 01
        </span>
      </button>

      {/* Galeria completa */}
      {gallerySrcs.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-3">
          {gallerySrcs.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setOpen(heroSrc ? i + 1 : i)}
              className="relative aspect-square cursor-zoom-in overflow-hidden bg-foreground/5 transition-opacity hover:opacity-85"
              aria-label={`${name} — foto ${i + 1}, ampliar`}
            >
              <Image
                src={src}
                alt={`${name} — ${i + 1}`}
                fill
                sizes="(max-width:1024px) 33vw, 16vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${name} — galeria ampliada`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 backdrop-blur-sm"
          onClick={close}
        >
          <div
            className="relative h-[86vh] w-[92vw] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[open]}
              alt={`${name} — ${open + 1}/${images.length}`}
              fill
              sizes="92vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Contador */}
          <span className="pointer-events-none absolute top-5 left-1/2 -translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">
            {open + 1} / {images.length}
          </span>

          {/* Cerrar */}
          <button
            type="button"
            onClick={close}
            aria-label="Cerrar"
            className="absolute top-4 right-5 p-2 font-mono text-xl text-white/70 transition-colors hover:text-white"
          >
            ✕
          </button>

          {/* Navegacion */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); step(-1); }}
                aria-label="Anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 p-3 text-2xl text-white/60 transition-colors hover:text-white sm:left-6"
              >
                ←
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); step(1); }}
                aria-label="Siguiente"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-3 text-2xl text-white/60 transition-colors hover:text-white sm:right-6"
              >
                →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
