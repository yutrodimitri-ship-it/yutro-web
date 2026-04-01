"use client";

import { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/shared/Container";
import { CTAButton } from "@/components/shared/CTAButton";
import { FadeInOnScroll } from "@/components/animations/FadeInOnScroll";

export function CTASection() {
  const t = useTranslations("home");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const bg = sectionRef.current.querySelector(".cta-bg");
    if (!bg) return;

    gsap.to(bg, {
      yPercent: -20,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === sectionRef.current) st.kill();
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 lg:py-32"
    >
      {/* Parallax background */}
      <div className="cta-bg absolute inset-0 -top-20 -bottom-20 bg-gradient-to-br from-primary/10 via-primary/5 to-background" />

      <Container className="relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <FadeInOnScroll>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t("ctaTitle")}
            </h2>
          </FadeInOnScroll>

          <FadeInOnScroll delay={0.2}>
            <div className="mt-8">
              <CTAButton href="/contacto">{t("ctaCTA")}</CTAButton>
            </div>
          </FadeInOnScroll>
        </div>
      </Container>
    </section>
  );
}
