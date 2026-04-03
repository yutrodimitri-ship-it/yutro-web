"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { CTAButton } from "@/components/shared/CTAButton";
import { FadeInOnScroll } from "@/components/animations/FadeInOnScroll";
import { TextReveal } from "@/components/animations/TextReveal";

const FRAME_COUNT = 121;

function frameUrl(i: number) {
  return `/hero-frames/frame_${String(i).padStart(3, "0")}.jpg`;
}

export function HeroScrollAnimation() {
  const t = useTranslations("home");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Source image dimensions
    const SRC_W = 1280;
    const SRC_H = 712;

    function setSize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      drawFrame(currentFrameRef.current);
    }

    function drawFrame(index: number) {
      const img = imagesRef.current[index];
      if (!img?.complete || !ctx) return;
      const cw = canvas!.width;
      const ch = canvas!.height;
      const scale = Math.max(cw / SRC_W, ch / SRC_H);
      const sw = SRC_W * scale;
      const sh = SRC_H * scale;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - sw) / 2, (ch - sh) / 2, sw, sh);
    }

    setSize();
    window.addEventListener("resize", setSize);

    // Preload all frames
    const images: HTMLImageElement[] = [];
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = frameUrl(i);
      if (i === 1) img.onload = () => drawFrame(0);
      images.push(img);
    }
    imagesRef.current = images;

    function onScroll() {
      const section = document.getElementById("hero-scroll-section");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const scrolled = -rect.top;
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;
      const progress = Math.max(0, Math.min(1, scrolled / total));
      const frameIndex = Math.min(
        Math.round(progress * (FRAME_COUNT - 1)),
        FRAME_COUNT - 1
      );
      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex;
        drawFrame(frameIndex);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", setSize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section id="hero-scroll-section" className="relative" style={{ height: "350vh" }}>
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Frame canvas */}
        <canvas ref={canvasRef} className="absolute inset-0" />

        {/* Overlay for text legibility */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Text content */}
        <Container className="relative z-10 flex h-full flex-col items-center justify-center py-20">
          <div className="mx-auto max-w-4xl text-center">
            <TextReveal
              text={t("heroTitle")}
              className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
            />

            <FadeInOnScroll delay={0.8}>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 sm:text-xl md:text-2xl">
                {t("heroSubtitle")}
              </p>
            </FadeInOnScroll>

            <FadeInOnScroll delay={1.2}>
              <div className="mt-10">
                <CTAButton href="/contacto">{t("heroCTA")}</CTAButton>
              </div>
            </FadeInOnScroll>
          </div>
        </Container>

        {/* Bottom fade into page */}
        <div className="absolute bottom-0 left-0 right-0" style={{ height: "40vh" }}>
          <div className="h-full bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
      </div>
    </section>
  );
}
