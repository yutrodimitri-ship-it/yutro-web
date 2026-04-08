"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { CTAButton } from "@/components/shared/CTAButton";
import { FadeInOnScroll } from "@/components/animations/FadeInOnScroll";
import { TextReveal } from "@/components/animations/TextReveal";

const FRAME_COUNT = 60;

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
    const SRC_H = 726;

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
        // Only animate frames if reduced-motion is NOT set
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          drawFrame(frameIndex);
        }
      }
      // Fade out scroll indicator
      const indicator = document.getElementById("hero-scroll-indicator");
      if (indicator) {
        indicator.style.opacity = String(Math.max(0, 1 - progress * 8));
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
      {/* Sticky viewport — min-h-[100dvh] prevents iOS Safari layout jumping */}
      <div className="sticky top-0 min-h-[100dvh]" style={{ overflow: "clip" }}>
        {/* Frame canvas */}
        <canvas ref={canvasRef} className="absolute inset-0" />

        {/* Overlay for text legibility */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Text content — left aligned */}
        <div className="relative z-10 flex min-h-[100dvh] flex-col items-start justify-center px-[12%] sm:px-[15%] lg:px-[18%] text-left">
          <h1
            className="font-heading font-extrabold leading-none text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
            style={{ fontSize: "clamp(2.5rem, 6vw, 6rem)", letterSpacing: "0.02em" }}
          >
            CREAMOS<br />CON <span className="text-primary">IA</span>
          </h1>

          <div className="max-w-md">
            <FadeInOnScroll delay={0.6} variant="fade-blur" duration={1}>
              <p className="mt-6 text-lg leading-relaxed text-white/80 drop-shadow-[0_1px_6px_rgba(0,0,0,0.4)] sm:text-xl">
                {t("heroSubtitle")}
              </p>
            </FadeInOnScroll>

            <FadeInOnScroll delay={1} variant="fade-scale" duration={0.8}>
              <div className="mt-10">
                <CTAButton href="/contacto" className="px-10 py-4 text-base shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40">
                  {t("heroCTA")}
                </CTAButton>
              </div>
            </FadeInOnScroll>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          id="hero-scroll-indicator"
          className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
          style={{ transition: "opacity 0.4s ease" }}
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">
            Scroll
          </span>
          {/* Animated line */}
          <div className="relative h-10 w-px overflow-hidden bg-white/15">
            <div
              className="absolute top-0 h-1/2 w-full bg-white/50"
              style={{
                animation: "scroll-line 1.6s ease-in-out infinite",
              }}
            />
          </div>
        </div>

        {/* Small bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent" />
      </div>
    </section>
  );
}
