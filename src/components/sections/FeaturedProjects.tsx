"use client";

import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { CTAButton } from "@/components/shared/CTAButton";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { FadeInOnScroll } from "@/components/animations/FadeInOnScroll";
import { projects } from "@/data/projects";

export function FeaturedProjects() {
  const t = useTranslations("home");
  const locale = useLocale();
  const featured = projects.filter((p) => p.featured).slice(0, 6);

  return (
    <section className="py-20 lg:py-28">
      <Container>
        <FadeInOnScroll>
          <SectionHeader title={t("featuredTitle")} />
        </FadeInOnScroll>

        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <StaggerItem key={project.slug}>
              <ProjectCard project={project} locale={locale} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeInOnScroll>
          <div className="mt-12 text-center">
            <CTAButton href="/proyectos" variant="outline">
              {t("featuredCTA")}
            </CTAButton>
          </div>
        </FadeInOnScroll>
      </Container>
    </section>
  );
}
