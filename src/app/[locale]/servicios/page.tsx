"use client";

import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { AIToolsSection } from "@/components/sections/AIToolsSection";
import { services } from "@/data/services";

export default function ServicesPage() {
  const t = useTranslations("services");
  const locale = useLocale();

  return (
    <>
      <section className="py-20 lg:py-28">
        <Container>
          <SectionHeader title={t("title")} />

          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <StaggerItem key={service.slug}>
                <ServiceCard service={service} locale={locale} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      <AIToolsSection />
    </>
  );
}
