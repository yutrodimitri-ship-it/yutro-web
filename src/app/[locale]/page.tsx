import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";

export const metadata: Metadata = {
  title: "YUTRO. — Productora Audiovisual con IA",
  description:
    "Creamos contenido audiovisual con inteligencia artificial. Producción creativa, 3D, motion graphics y postproducción avanzada.",
};
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import { CTASection } from "@/components/sections/CTASection";
import { ScrollProgress } from "@/components/animations/ScrollProgress";

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <Hero />
      <FeaturedProjects />
      <ServicesPreview />
      <CTASection />
    </>
  );
}
