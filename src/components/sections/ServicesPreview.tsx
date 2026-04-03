"use client";

import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { FadeInOnScroll } from "@/components/animations/FadeInOnScroll";
import { services } from "@/data/services";

export function ServicesPreview() {
  const t = useTranslations("home");
  const locale = useLocale();

  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-primary/8 blur-[100px]" />
        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[80px]" />
      </div>

      {/* Subtle grid texture */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <Container>
        <FadeInOnScroll>
          <SectionHeader title={t("servicesTitle")} />
        </FadeInOnScroll>

        <StaggerContainer
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          staggerDelay={0.1}
        >
          {services.map((service) => (
            <StaggerItem key={service.slug}>
              <ServiceCard service={service} locale={locale} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  );
}
