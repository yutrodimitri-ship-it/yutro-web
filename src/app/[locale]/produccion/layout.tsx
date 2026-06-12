import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

const meta: Record<string, { title: string; description: string }> = {
  es: {
    title: "Producción",
    description:
      "Producción audiovisual con IA: 3D, motion graphics, postproducción y contenido generativo para campañas publicitarias.",
  },
  en: {
    title: "Production",
    description:
      "AI-driven audiovisual production: 3D, motion graphics, post-production and generative content for advertising campaigns.",
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
    path: "/produccion",
    locale,
  });
}

export default function ProduccionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
