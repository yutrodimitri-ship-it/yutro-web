"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { CTAButton } from "@/components/shared/CTAButton";
import { FadeInOnScroll } from "@/components/animations/FadeInOnScroll";

export function HeroVideo() {
  const t = useTranslations("home");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scrollOpacity, setScrollOpacity] = useState(1);

  useEffect(() => {
    function onScroll() {
      const progress = window.scrollY / window.innerHeight;
      setScrollOpacity(Math.max(0, 1 - progress * 4));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Video background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/showreel.webm" type="video/webm" />
        <source src="/showreel.mp4" type="video/mp4" />
      </video>

      {/* Overlay for text legibility */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Text content — left aligned */}
      <div className="relative z-10 flex h-full flex-col items-start justify-center px-[12%] sm:px-[15%] lg:px-[18%] text-left">
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
        className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        style={{ opacity: scrollOpacity, transition: "opacity 0.3s ease" }}
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">
          Scroll
        </span>
        <div className="relative h-10 w-px overflow-hidden bg-white/15">
          <div
            className="absolute top-0 h-1/2 w-full bg-white/50"
            style={{ animation: "scroll-line 1.6s ease-in-out infinite" }}
          />
        </div>
      </div>

    </section>
  );
}
