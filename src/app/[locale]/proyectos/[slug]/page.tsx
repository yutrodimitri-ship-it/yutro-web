export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/shared/Container";
import { CTAButton } from "@/components/shared/CTAButton";
import { Separator } from "@/components/ui/separator";
import { projects, MODALITY_LABELS } from "@/data/projects";
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
  // notFound() aqui (y no solo en la pagina) para que el status HTTP sea 404
  // real: con streaming el 200 ya se envio cuando el body llama a notFound().
  if (!project) notFound();
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

        {/* Créditos: Modalidad + Alcance - Nuestro rol - Equipo */}
        {project.credits && (
          <div className="mt-10 grid gap-8 rounded-xl border border-border p-6 sm:grid-cols-3 sm:p-8">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {l === "es" ? "Modalidad" : "Engagement"}
              </h3>
              <p className="mt-2 inline-block rounded-full border border-foreground/20 px-3 py-1 text-sm font-medium">
                {MODALITY_LABELS[project.credits.modality][l]}
              </p>
              {project.credits.scope && (
                <>
                  <h3 className="mt-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {l === "es" ? "Alcance" : "Scope"}
                  </h3>
                  <p className="mt-2 text-base font-medium">{project.credits.scope[l]}</p>
                </>
              )}
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {l === "es" ? "Nuestro rol" : "Our role"}
              </h3>
              <ul className="mt-2 space-y-1">
                {project.credits.role[l].map((item) => (
                  <li key={item} className="text-base leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {project.credits.team && project.credits.team.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {l === "es" ? "Equipo" : "Team"}
                </h3>
                <ul className="mt-2 space-y-2">
                  {project.credits.team.map((member) => (
                    <li key={member[l]} className="text-base leading-relaxed text-muted-foreground">
                      {member[l]}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <Separator className="my-12" />

        {/* Video(s) 16:9 */}
        <div>
          <h2 className="mb-6 text-2xl font-bold">Video</h2>
          {Array.isArray(project.videoUrl) ? (
            <div className="flex flex-col gap-6">
              {project.videoUrl.map((url, idx) => (
                <div key={idx} className="aspect-video overflow-hidden rounded-xl bg-muted">
                  <iframe
                    src={`${url}?rel=0&modestbranding=1&showinfo=0&iv_load_policy=3`}
                    title={`${project.title} Video ${idx + 1}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="aspect-video overflow-hidden rounded-xl bg-muted">
              <iframe
                src={`${project.videoUrl}?rel=0&modestbranding=1&showinfo=0&iv_load_policy=3`}
                title={`${project.title} Video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          )}
        </div>

        <Separator className="my-12" />

        {/* Galería 3x3 */}
        <div>
          <h2 className="mb-6 text-2xl font-bold">
            {l === "es" ? "Proceso & Imágenes" : "Process & Images"}
          </h2>
          <ProjectGallery gallery={project.gallery} title={`${project.title} · ${project.client}`} />
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
