import type { Metadata } from "next";
import { HeroScrollAnimation } from "@/components/sections/HeroScrollAnimation";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import { CTASection } from "@/components/sections/CTASection";
import { ScrollProgress } from "@/components/animations/ScrollProgress";
import { SectionDivider } from "@/components/animations/SectionDivider";

export const metadata: Metadata = {
  title: "YUTRO. — Productora Audiovisual con IA",
  description:
    "Creamos contenido audiovisual con inteligencia artificial. Producción creativa, 3D, motion graphics y postproducción avanzada.",
};

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <HeroScrollAnimation />
      <SectionDivider />
      <FeaturedProjects />
      <SectionDivider />
      <ServicesPreview />
      <SectionDivider />
      <CTASection />
    </>
  );
}
