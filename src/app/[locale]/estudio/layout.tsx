import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

const meta: Record<string, { title: string; description: string }> = {
  es: {
    title: "Estudio",
    description:
      "Yutro es el estudio creativo del grupo VRYP. Producción audiovisual con IA y casting digital propio para campañas publicitarias en LATAM.",
  },
  en: {
    title: "Studio",
    description:
      "Yutro is the creative studio of the VRYP group. AI-driven audiovisual production and proprietary digital casting for advertising campaigns across LATAM.",
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
    path: "/estudio",
    locale,
  });
}

export default function EstudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
