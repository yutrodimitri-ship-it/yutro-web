"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/Container";
import { CTAButton } from "@/components/shared/CTAButton";
import { FadeInOnScroll } from "@/components/animations/FadeInOnScroll";

const clients = [
  "Head", "Santander", "Paris", "Falabella", "Carozzi",
  "Copec · Mobil", "Frutos de Chile", "MG Motors",
];

const stats = [
  { value: "9+", label: "Proyectos" },
  { value: "100%", label: "IA Generativa" },
  { value: "8", label: "Marcas" },
  { value: "5", label: "Agencias" },
];

export function CTASection() {
  const t = useTranslations("home");

  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      {/* Background image */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src="/projects/mochilas-head.webp"
          alt=""
          fill
          className="object-cover opacity-10"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      </div>


      {/* Marquee — 4 tracks guarantee viewport coverage at all times */}
      <div className="relative mb-16 overflow-hidden">
        <div className="flex animate-[marquee-quad_30s_linear_infinite]">
          {[0, 1, 2, 3].map((track) =>
            clients.map((client, i) => (
              <span
                key={`${track}-${i}`}
                className="mx-8 shrink-0 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground/40 whitespace-nowrap"
              >
                {client}
              </span>
            ))
          )}
        </div>
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
      </div>

      {/* CTA */}
      <Container className="relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <FadeInOnScroll>
            <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              {t("ctaTitle")}
            </h2>
          </FadeInOnScroll>

          <FadeInOnScroll delay={0.2}>
            <div className="mt-8 flex justify-center">
              <CTAButton href="/contacto">{t("ctaCTA")}</CTAButton>
            </div>
          </FadeInOnScroll>
        </div>
      </Container>
    </section>
  );
}
