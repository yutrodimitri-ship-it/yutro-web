"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CTAButton } from "@/components/shared/CTAButton";

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

  // Entrada sutil: fade + 10px translate-up, 600ms ease-out, stagger por linea.
  const fadeUp = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay: i * 0.12 },
    }),
  };

  return (
    <section className="relative h-screen overflow-hidden bg-black">
      {/* Video background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/showreel-poster.webp"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/showreel.webm" type="video/webm" />
        <source src="/showreel.mp4" type="video/mp4" />
      </video>

      {/* Overlay for text legibility */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Text content — left aligned */}
      <div className="relative z-10 flex h-full flex-col items-start justify-center px-[10%] sm:px-[12%] lg:px-[15%] text-left">
        <motion.h1
          initial="hidden"
          animate="visible"
          custom={0}
          variants={fadeUp}
          className="font-heading font-extrabold leading-[1.05] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
          style={{
            fontSize: "clamp(2rem, 5.2vw, 5rem)",
            letterSpacing: "-0.015em",
            maxWidth: "22ch",
          }}
        >
          {t("heroTitle")}
          <br />
          <span className="text-primary italic font-bold">
            {t("heroTitleAccent")}
          </span>
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="visible"
          custom={1}
          variants={fadeUp}
          className="mt-6 text-lg leading-relaxed text-white/80 drop-shadow-[0_1px_6px_rgba(0,0,0,0.4)] sm:text-xl"
          style={{ maxWidth: "38ch" }}
        >
          {t("heroSubtitle")}
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          custom={2}
          variants={fadeUp}
          className="mt-10 flex flex-wrap gap-3"
        >
          <CTAButton
            href="/casting"
            variant="primary"
            className="px-8 py-3.5 text-base shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40"
          >
            {t("heroCTAPrimary")}
          </CTAButton>
          <CTAButton
            href="/contacto"
            variant="outline"
            className="px-8 py-3.5 text-base text-white border-white/80 hover:bg-white hover:text-black"
          >
            {t("heroCTASecondary")}
          </CTAButton>
        </motion.div>
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
