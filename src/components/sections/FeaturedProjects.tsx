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
    <section id="proyectos" className="relative py-20 lg:py-28">
      <Container>
        <FadeInOnScroll variant="fade-blur">
          <SectionHeader title={t("featuredTitle")} align="left" />
        </FadeInOnScroll>

        {/* Asymmetric grid: first card featured full-width, rest in 2 columns */}
        <StaggerContainer className="grid gap-5 grid-cols-1 md:grid-cols-2" staggerDelay={0.12}>
          {featured.map((project, i) => (
            <StaggerItem
              key={project.slug}
              className={i === 0 ? "md:col-span-2" : ""}
            >
              <ProjectCard project={project} locale={locale} featured={i === 0} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeInOnScroll delay={0.3} variant="fade-scale">
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
