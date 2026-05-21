import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { blogPosts } from "@/data/blog";
import { getAllPublicSlugs } from "@/lib/talents-public";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.yutro.cl";

function withAlternates(path: string) {
  return {
    languages: {
      es: `${SITE_URL}/es${path}`,
      en: `${SITE_URL}/en${path}`,
    },
  };
}

/**
 * Sitemap dinamico. Cubre:
 *   - Rutas estaticas publicas (home, /proyectos, /produccion,
 *     /estudio, /casting, /casting/featured, /blog, /contacto)
 *   - Rutas dinamicas: /proyectos/[slug], /casting/[slug] (publicos),
 *     /blog/[slug]
 *   - Mirror ES/EN via alternates.languages
 *
 * Excluye intencionalmente:
 *   - /studio/* (plataforma privada, robots.txt tambien lo bloquea)
 *   - /api/*
 *   - /casting/solicitar-acceso (form, noIndex en meta)
 *
 * Sprint 4 Tarea 4.1.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ["es", "en"];
  const now = new Date();

  // ── Rutas estaticas ─────────────────────────────────────────
  // Priority y changeFrequency calibrados:
  //   home: weekly/1.0
  //   casting (lanzamiento + producto principal): weekly/0.95
  //   estudio, produccion, proyectos: monthly/0.85
  //   blog, contacto: monthly/0.7
  const staticPages: {
    path: string;
    priority: number;
    changeFreq: "weekly" | "monthly";
  }[] = [
    { path: "", priority: 1.0, changeFreq: "weekly" },
    { path: "/casting", priority: 0.95, changeFreq: "weekly" },
    { path: "/casting/featured", priority: 0.9, changeFreq: "weekly" },
    { path: "/estudio", priority: 0.85, changeFreq: "monthly" },
    { path: "/produccion", priority: 0.85, changeFreq: "monthly" },
    { path: "/proyectos", priority: 0.85, changeFreq: "monthly" },
    { path: "/blog", priority: 0.7, changeFreq: "monthly" },
    { path: "/contacto", priority: 0.7, changeFreq: "monthly" },
  ];
  const staticEntries = locales.flatMap((locale) =>
    staticPages.map((p) => ({
      url: `${SITE_URL}/${locale}${p.path}`,
      lastModified: now,
      changeFrequency: p.changeFreq,
      priority: p.priority,
      alternates: withAlternates(p.path),
    }))
  );

  // ── /proyectos/[slug] ───────────────────────────────────────
  const projectEntries = locales.flatMap((locale) =>
    projects.map((project) => ({
      url: `${SITE_URL}/${locale}/proyectos/${project.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: withAlternates(`/proyectos/${project.slug}`),
    }))
  );

  // ── /casting/[slug] (talentos publicos) ────────────────────
  // getAllPublicSlugs trae solo talentos con public_visible=true y
  // public_slug no-null. Si la DB falla, sitemap no se rompe — solo
  // omite las entradas de talents.
  let talentSlugs: string[] = [];
  try {
    talentSlugs = await getAllPublicSlugs();
  } catch (e) {
    console.warn("[sitemap] failed to fetch public talents", e);
  }
  const talentEntries = locales.flatMap((locale) =>
    talentSlugs.map((slug) => ({
      url: `${SITE_URL}/${locale}/casting/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: withAlternates(`/casting/${slug}`),
    }))
  );

  // ── /blog/[slug] ────────────────────────────────────────────
  // El blog tiene posts marcados con su locale propio (no es mirror).
  const blogEntries = blogPosts.map((post) => ({
    url: `${SITE_URL}/${post.locale}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
    alternates: withAlternates(`/blog/${post.slug}`),
  }));

  return [
    ...staticEntries,
    ...projectEntries,
    ...talentEntries,
    ...blogEntries,
  ];
}
