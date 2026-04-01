import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { blogPosts } from "@/data/blog";
import { influencers } from "@/data/influencers";

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

  // Project pages
  const projectEntries = locales.flatMap((locale) =>
    projects.map((project) => ({
      url: `${SITE_URL}/${locale}/proyectos/${project.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  // Blog pages
  const blogEntries = blogPosts.map((post) => ({
    url: `${SITE_URL}/${post.locale}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
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

  return [...staticEntries, ...projectEntries, ...blogEntries, ...influencerEntries];
}
