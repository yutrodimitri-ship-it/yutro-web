import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

const meta: Record<string, { title: string; description: string }> = {
  es: {
    title: "Proyectos",
    description:
      "Explora nuestro portafolio de proyectos audiovisuales creados con inteligencia artificial. Producción 3D, motion graphics y más.",
  },
  en: {
    title: "Projects",
    description:
      "Explore our portfolio of audiovisual projects created with artificial intelligence. 3D production, motion graphics and more.",
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
    path: "/proyectos",
    locale,
  });
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
