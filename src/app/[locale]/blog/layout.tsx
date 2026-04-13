import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

const meta: Record<string, { title: string; description: string }> = {
  es: {
    title: "Blog",
    description:
      "Artículos sobre inteligencia artificial generativa, producción audiovisual, tendencias creativas y casos de estudio de YUTRO.",
  },
  en: {
    title: "Blog",
    description:
      "Articles about generative artificial intelligence, audiovisual production, creative trends and YUTRO case studies.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = meta[locale] ?? meta.es;
  return createMetadata({
    title: m.title,
    description: m.description,
    path: "/blog",
    locale,
  });
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
