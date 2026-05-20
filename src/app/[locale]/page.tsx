import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { HeroVideo } from "@/components/sections/HeroVideo";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { ScrollProgress } from "@/components/animations/ScrollProgress";
import { createMetadata } from "@/lib/metadata";

// Below-the-fold components loaded dynamically
const StudioBanner = dynamic(() => import("@/components/sections/StudioBanner").then(m => ({ default: m.StudioBanner })));
const ServicesPreview = dynamic(() => import("@/components/sections/ServicesPreview").then(m => ({ default: m.ServicesPreview })));
const SectionDivider = dynamic(() => import("@/components/animations/SectionDivider").then(m => ({ default: m.SectionDivider })));
const CTASection = dynamic(() => import("@/components/sections/CTASection").then(m => ({ default: m.CTASection })));

const meta: Record<string, { title: string; description: string }> = {
  es: {
    title: "YUTRO. — Creamos con IA",
    description:
      "Creamos contenido audiovisual con inteligencia artificial. Producción creativa, 3D, motion graphics y postproducción avanzada.",
  },
  en: {
    title: "YUTRO. — We Create with AI",
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

export const revalidate = 3600; // ISR: revalidate every hour

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <HeroVideo />
      <FeaturedProjects />
      <StudioBanner />
      <ServicesPreview />
      <SectionDivider />
      <CTASection />
    </>
  );
}
