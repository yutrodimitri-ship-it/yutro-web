"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { ImageReveal } from "@/components/animations/ImageReveal";
import { Parallax } from "@/components/animations/Parallax";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const directions = ["left", "right", "up", "down"] as const;

export function ProjectHeroImage({
  title,
  image,
}: {
  title: string;
  image: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl">
      <Parallax speed={-0.1}>
        <div className="relative aspect-video scale-110 bg-muted">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1024px"
            priority
          />
        </div>
      </Parallax>
    </div>
  );
}

export function ProjectGallery({ gallery }: { gallery: string[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const close = useCallback(() => setLightboxIndex(null), []);

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : gallery.length - 1));
  }, [gallery.length]);

  const next = useCallback(() => {
    setLightboxIndex((i) => (i !== null && i < gallery.length - 1 ? i + 1 : 0));
  }, [gallery.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [lightboxIndex, close, prev, next]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {gallery.map((img, idx) => (
          <ImageReveal
            key={idx}
            direction={directions[idx % directions.length]}
            delay={idx * 0.05}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(idx)}
              className="group relative aspect-square w-full overflow-hidden rounded-lg bg-muted cursor-zoom-in"
            >
              <Image
                src={img}
                alt={`Imagen ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
            </button>
          </ImageReveal>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={gallery[lightboxIndex]}
            alt={`Imagen ${lightboxIndex + 1}`}
            className="max-h-[80vh] max-w-[85vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/60">
            {lightboxIndex + 1} / {gallery.length}
          </div>
        </div>
      )}
    </>
  );
}
