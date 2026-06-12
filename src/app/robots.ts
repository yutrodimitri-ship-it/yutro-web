import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.yutro.cl";

/**
 * robots.txt — generado dinamico por Next.
 *
 * Bloqueado intencionalmente (no indexar):
 *   /studio/   plataforma privada (login, NDA, casting privado, admin)
 *   /api/      endpoints, no contenido SEO-relevante
 *   /_next/    assets de build, ruido en crawlers
 *
 * Permitido todo el resto, incluyendo /casting/ y subrutas dinamicas.
 * Sprint 4 Tarea 4.2.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/studio/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
