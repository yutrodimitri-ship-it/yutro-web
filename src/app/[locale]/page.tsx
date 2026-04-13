import type { Metadata } from "next";
import { HeroVideo } from "@/components/sections/HeroVideo";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import { CTASection } from "@/components/sections/CTASection";
import { ScrollProgress } from "@/components/animations/ScrollProgress";
import { SectionDivider } from "@/components/animations/SectionDivider";
import { createMetadata } from "@/lib/metadata";

const meta: Record<string, { title: string; description: string }> = {
  es: {
    title: "YUTRO. — Productora Audiovisual con IA",
    description:
      "Creamos contenido audiovisual con inteligencia artificial. Producción creativa, 3D, motion graphics y postproducción avanzada.",
  },
  en: {
    title: "YUTRO. — AI Audiovisual Production",
    description:
      "We create audiovisual content with artificial intelligence. Creative production, 3D, motion graphics and advanced post-production.",
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
    path: "",
    locale,
  });
}

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <HeroVideo />
      <FeaturedProjects />
      <SectionDivider />
      <ServicesPreview />
      <SectionDivider />
      <CTASection />
    </>
  );
}
