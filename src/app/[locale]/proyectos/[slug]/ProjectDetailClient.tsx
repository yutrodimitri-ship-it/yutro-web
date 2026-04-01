"use client";

import { ImageReveal } from "@/components/animations/ImageReveal";
import { Parallax } from "@/components/animations/Parallax";
import { FadeInOnScroll } from "@/components/animations/FadeInOnScroll";

const directions = ["left", "right", "up", "down"] as const;

export function ProjectHeroImage({ title }: { title: string }) {
  return (
    <Parallax speed={-0.15}>
      <div className="aspect-video overflow-hidden rounded-xl bg-muted flex items-center justify-center text-muted-foreground text-lg">
        {title}
      </div>
    </Parallax>
  );
}

export function ProjectGallery({
  gallery,
}: {
  gallery: string[];
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
      {gallery.map((img, idx) => (
        <ImageReveal
          key={idx}
          direction={directions[idx % directions.length]}
          delay={idx * 0.05}
        >
          <div className="group relative aspect-square overflow-hidden rounded-lg bg-muted">
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground transition-colors group-hover:bg-primary/5">
              {String(idx + 1).padStart(2, "0")}
            </div>
          </div>
        </ImageReveal>
      ))}
    </div>
  );
}

export function ProjectDetailClient() {
  return null;
}
