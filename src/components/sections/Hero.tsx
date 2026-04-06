"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { CTAButton } from "@/components/shared/CTAButton";
import { TextReveal } from "@/components/animations/TextReveal";
import { FadeInOnScroll } from "@/components/animations/FadeInOnScroll";
import { Parallax } from "@/components/animations/Parallax";

export function Hero() {
  const t = useTranslations("home");

  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-background">
      {/* Background gradient with parallax */}
      <Parallax speed={-0.2} className="absolute inset-0 -top-20 -bottom-20">
        <div className="h-full w-full bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      </Parallax>

      <Container className="relative z-10 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            CREAMOS CON <span className="text-primary">IA</span>
          </h1>

          <FadeInOnScroll delay={0.8}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl md:text-2xl">
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

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
