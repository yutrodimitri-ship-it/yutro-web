import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

const meta: Record<string, { title: string; description: string }> = {
  es: {
    title: "Servicios",
    description:
      "Servicios de producción audiovisual con IA: 3D, motion graphics, postproducción, influencers digitales y contenido generativo.",
  },
  en: {
    title: "Services",
    description:
      "AI audiovisual production services: 3D, motion graphics, post-production, digital influencers and generative content.",
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
    path: "/servicios",
    locale,
  });
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
