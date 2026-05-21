import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { blogPosts } from "@/data/blog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.yutro.cl";

function withAlternates(path: string) {
  return {
    languages: {
      es: `${SITE_URL}/es${path}`,
      en: `${SITE_URL}/en${path}`,
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["es", "en"];
  const now = new Date();

  // Static pages
  // NOTE: Sprint 4 rebuilds this list completely (adds /casting,
  // /casting/featured, /estudio + dynamic talent slugs).
  const staticPages = ["", "/proyectos", "/produccion", "/blog", "/contacto"];
  const staticEntries = locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${SITE_URL}/${locale}${page}`,
      lastModified: now,
      changeFrequency: page === "" ? ("weekly" as const) : ("monthly" as const),
      priority: page === "" ? 1.0 : 0.8,
      alternates: withAlternates(page),
    }))
  );

  // Project pages
  const projectEntries = locales.flatMap((locale) =>
    projects.map((project) => ({
      url: `${SITE_URL}/${locale}/proyectos/${project.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: withAlternates(`/proyectos/${project.slug}`),
    }))
  );

  // Blog pages
  const blogEntries = blogPosts.map((post) => ({
    url: `${SITE_URL}/${post.locale}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
    alternates: withAlternates(`/blog/${post.slug}`),
  }));

  // /influencer pages removed in Sprint 1.6 (301 -> /casting/featured).
  // /casting/[slug] entries will be added in Sprint 4 Tarea 4.1 once
  // talents are flagged with public_visible in DB.

  return [...staticEntries, ...projectEntries, ...blogEntries];
}
