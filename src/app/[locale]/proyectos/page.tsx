"use client";

import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { projects } from "@/data/projects";

export default function ProjectsPage() {
  const t = useTranslations("projects");
  const locale = useLocale();

  return (
    <section className="py-20 lg:py-28">
      <Container>
        <SectionHeader title={t("title")} />

        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <StaggerItem key={project.slug}>
              <ProjectCard project={project} locale={locale} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  );
}
