import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/shared/Container";
import { CTAButton } from "@/components/shared/CTAButton";
import { JsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { serviceLandings } from "@/data/landings";
import { projects } from "@/data/projects";
import { influencers } from "@/data/influencers";
import { createMetadata } from "@/lib/metadata";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.yutro.cl";

export function generateStaticParams() {
  return ["es", "en"].flatMap((locale) =>
    serviceLandings.map((landing) => ({ locale, slug: landing.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const landing = serviceLandings.find((l) => l.slug === slug);
  if (!landing) return {};
  const copy = landing.copy[locale === "en" ? "en" : "es"];
  return createMetadata({
    title: copy.metaTitle,
    description: copy.metaDescription,
    path: `/servicios/${slug}`,
    locale,
  });
}

export default async function ServiceLandingPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const landing = serviceLandings.find((l) => l.slug === slug);
  if (!landing) notFound();

  const l = locale === "en" ? "en" : "es";
  const copy = landing.copy[l];
  const relatedProjects = landing.relatedProjects
    .map((s) => projects.find((p) => p.slug === s))
    .filter((p) => p !== undefined);

  return (
    <article className="py-20 lg:py-28">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: copy.h1,
          description: copy.metaDescription,
          serviceType: copy.h1,
          url: `${SITE_URL}/${l}/servicios/${slug}`,
          areaServed: [
            { "@type": "Country", name: "Chile" },
            { "@type": "AdministrativeArea", name: "Latin America" },
          ],
          provider: {
            "@type": "Organization",
            name: "YUTRO.",
            url: SITE_URL,
            address: {
              "@type": "PostalAddress",
              addressLocality: "Santiago",
              addressCountry: "CL",
            },
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: copy.faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Yutro", url: `${SITE_URL}/${l}` },
          { name: l === "es" ? "Servicios" : "Services", url: `${SITE_URL}/${l}/servicios` },
          { name: copy.h1, url: `${SITE_URL}/${l}/servicios/${slug}` },
        ]}
      />

      <Container className="max-w-5xl">
        {/* Hero */}
        <header>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            {copy.kicker}
          </span>
          <h1 className="mt-3 font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">
            {copy.h1}
          </h1>
          <div className="mt-8 space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {copy.intro.map((paragraph, i) => (
              <p key={i} className={i === 0 ? "text-foreground" : undefined}>
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-8">
            <CTAButton href="/contacto">{copy.cta}</CTAButton>
          </div>
        </header>

        {/* Imagen destacada */}
        <div className="relative mt-14 aspect-[21/9] overflow-hidden rounded-xl bg-muted">
          <Image
            src={landing.image}
            alt={copy.h1}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1024px"
            priority
          />
        </div>

        {/* Qué incluye */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold sm:text-3xl">{copy.includesTitle}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {copy.includes.map((item) => (
              <div key={item.title} className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Proceso */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold sm:text-3xl">{copy.processTitle}</h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {copy.process.map((step, i) => (
              <li key={step.title} className="relative rounded-xl border border-border bg-card p-6">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Proyectos relacionados */}
        {(relatedProjects.length > 0 || landing.showInfluencers) && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold sm:text-3xl">{copy.projectsTitle}</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/proyectos/${project.slug}`}
                  className="group overflow-hidden rounded-xl border border-border bg-card"
                >
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <Image
                      src={project.image}
                      alt={`${project.title} · ${project.client}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      {project.client}
                    </p>
                    <h3 className="mt-1 font-semibold group-hover:text-primary">
                      {project.title}
                    </h3>
                  </div>
                </Link>
              ))}
              {landing.showInfluencers &&
                influencers.map((inf) => (
                  <Link
                    key={inf.slug}
                    href={`/influencer/${inf.slug}`}
                    className="group overflow-hidden rounded-xl border border-border bg-card"
                  >
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      <Image
                        src={inf.image}
                        alt={`${inf.name}, influencer virtual creada con IA por Yutro`}
                        fill
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        {l === "es" ? "Influencer virtual" : "Virtual influencer"}
                      </p>
                      <h3 className="mt-1 font-semibold group-hover:text-primary">{inf.name}</h3>
                    </div>
                  </Link>
                ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold sm:text-3xl">{copy.faqTitle}</h2>
          <div className="mt-8 space-y-4">
            {copy.faq.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-border bg-card p-6"
              >
                <summary className="cursor-pointer list-none font-semibold marker:hidden">
                  {item.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <div className="mt-16 rounded-xl border border-border bg-card p-10 text-center">
          <h2 className="text-2xl font-bold">
            {l === "es" ? "¿Tienes un proyecto en mente?" : "Have a project in mind?"}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            {l === "es"
              ? "Cuéntanos qué necesitas y te enviamos una propuesta con tiempos y presupuesto en 48 horas."
              : "Tell us what you need and we'll send a proposal with timeline and budget within 48 hours."}
          </p>
          <div className="mt-6">
            <CTAButton href="/contacto">{copy.cta}</CTAButton>
          </div>
        </div>
      </Container>
    </article>
  );
}
