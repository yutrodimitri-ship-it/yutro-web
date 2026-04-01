import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/Container";
import { CTAButton } from "@/components/shared/CTAButton";
import { Separator } from "@/components/ui/separator";
import { projects } from "@/data/projects";
import { createMetadata } from "@/lib/metadata";
import { ProjectHeroImage, ProjectGallery } from "./ProjectDetailClient";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  const l = locale as "es" | "en";
  return createMetadata({
    title: project.title,
    description: project.description[l],
    path: `/proyectos/${slug}`,
    locale,
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const project = projects.find((p) => p.slug === slug);
  const l = locale as "es" | "en";

  if (!project) notFound();

  return (
    <section className="py-20 lg:py-28">
      <Container className="max-w-5xl">
        {/* Back */}
        <div className="relative z-10 mb-8">
          <CTAButton href="/proyectos" variant="outline" className="text-sm px-4 py-2">
            &larr; {l === "es" ? "Volver a proyectos" : "Back to projects"}
          </CTAButton>
        </div>

        {/* Hero Image with parallax */}
        <ProjectHeroImage title={project.title} image={project.image} />

        {/* Title */}
        <h1 className="mt-10 text-4xl font-bold tracking-tight sm:text-5xl">
          {project.title}
        </h1>

        <Separator className="my-8" />

        {/* Info Grid: Cliente - Partners - Descripción */}
        <div className="grid gap-8 sm:grid-cols-3">
          {/* Cliente */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {l === "es" ? "Cliente" : "Client"}
            </h3>
            <p className="mt-2 text-lg font-medium">{project.client}</p>
          </div>

          {/* Partners */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Partners
            </h3>
            <ul className="mt-2 space-y-1">
              {project.partners.map((partner) => (
                <li key={partner} className="text-lg font-medium">
                  {partner}
                </li>
              ))}
            </ul>
          </div>

          {/* Descripción */}
          <div className="sm:col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {l === "es" ? "Descripción" : "Description"}
            </h3>
            <p className="mt-2 text-base leading-relaxed text-muted-foreground">
              {project.description[l]}
            </p>
          </div>
        </div>

        <Separator className="my-12" />

        {/* Video 16:9 */}
        <div>
          <h2 className="mb-6 text-2xl font-bold">
            Video
          </h2>
          <div className="aspect-video overflow-hidden rounded-xl bg-muted">
            <iframe
              src={`${project.videoUrl}?rel=0&modestbranding=1&showinfo=0&controls=1&disablekb=0&fs=1&iv_load_policy=3`}
              title={`${project.title} Video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        </div>

        <Separator className="my-12" />

        {/* Galería 3x3 */}
        <div>
          <h2 className="mb-6 text-2xl font-bold">
            {l === "es" ? "Proceso & Imágenes" : "Process & Images"}
          </h2>
          <ProjectGallery gallery={project.gallery} />
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <CTAButton href="/contacto">
            {l === "es" ? "¿Te interesa algo similar?" : "Interested in something similar?"}
          </CTAButton>
        </div>
      </Container>
    </section>
  );
}
