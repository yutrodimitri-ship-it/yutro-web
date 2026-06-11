import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { blogPosts } from "@/data/blog";
import { influencers } from "@/data/influencers";
import { serviceLandings } from "@/data/landings";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.yutro.cl";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["es", "en"];
  const now = new Date();

  // Static pages
  const staticPages = ["", "/proyectos", "/servicios", "/blog", "/influencer", "/contacto"];
  const staticEntries = locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${SITE_URL}/${locale}${page}`,
      lastModified: now,
      changeFrequency: page === "" ? ("weekly" as const) : ("monthly" as const),
      priority: page === "" ? 1.0 : 0.8,
    }))
  );

  // Landings SEO de servicios
  const landingEntries = locales.flatMap((locale) =>
    serviceLandings.map((landing) => ({
      url: `${SITE_URL}/${locale}/servicios/${landing.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
      alternates: {
        languages: {
          es: `${SITE_URL}/es/servicios/${landing.slug}`,
          en: `${SITE_URL}/en/servicios/${landing.slug}`,
        },
      },
    }))
  );

  // Project pages
  const projectEntries = locales.flatMap((locale) =>
    projects.map((project) => ({
      url: `${SITE_URL}/${locale}/proyectos/${project.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  // Blog pages (solo posts con contenido real)
  const blogEntries = blogPosts
    .filter((post) => post.published)
    .map((post) => ({
      url: `${SITE_URL}/${post.locale}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: {
        languages: {
          es: `${SITE_URL}/es/blog/${post.locale === "es" ? post.slug : post.altSlug}`,
          en: `${SITE_URL}/en/blog/${post.locale === "en" ? post.slug : post.altSlug}`,
        },
      },
    }));

  // Influencer pages
  const influencerEntries = locales.flatMap((locale) =>
    influencers.map((inf) => ({
      url: `${SITE_URL}/${locale}/influencer/${inf.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  return [...staticEntries, ...landingEntries, ...projectEntries, ...blogEntries, ...influencerEntries];
}
