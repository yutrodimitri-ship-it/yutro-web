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
    <section className="bg-secondary/30 py-20 lg:py-28">
      <Container>
        <FadeInOnScroll>
          <SectionHeader title={t("servicesTitle")} />
        </FadeInOnScroll>

        <StaggerContainer
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
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
