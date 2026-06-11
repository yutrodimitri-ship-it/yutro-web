import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.yutro.cl";
const SITE_NAME = "YUTRO.";

export function createMetadata({
  title,
  description,
  path,
  locale,
  image,
  type = "website",
  noIndex = false,
  alternatePaths,
}: {
  title: string;
  description: string;
  path: string;
  locale: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  /**
   * Ruta por idioma cuando los slugs difieren (p. ej. el blog).
   * Por defecto se usa `path` para ambos idiomas.
   */
  alternatePaths?: { es?: string; en?: string };
}): Metadata {
  const url = `${SITE_URL}/${locale}${path}`;
  const esPath = alternatePaths?.es ?? path;
  const enPath = alternatePaths?.en ?? path;
  const ogImage = image || `${SITE_URL}/api/og?title=${encodeURIComponent(title)}&locale=${locale}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        es: `${SITE_URL}/es${esPath}`,
        en: `${SITE_URL}/en${enPath}`,
        "x-default": `${SITE_URL}/es${esPath}`,
      },
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      locale: locale === "es" ? "es_CL" : "en_US",
      alternateLocale: locale === "es" ? "en_US" : "es_CL",
      type,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [ogImage],
    },
    ...(noIndex && { robots: { index: false, follow: false } }),
  };
}
