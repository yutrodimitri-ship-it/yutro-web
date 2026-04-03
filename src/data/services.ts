export interface Service {
  slug: string;
  icon: string;
  image: string;
  title: {
    es: string;
    en: string;
  };
  description: {
    es: string;
    en: string;
  };
}

export const services: Service[] = [
  {
    slug: "imagenes-hiperrealistas",
    icon: "camera",
    image: "/services/hyperrealistic.png",
    title: {
      es: "Imágenes Hiperrealistas",
      en: "Hyperrealistic Images",
    },
    description: {
      es: "Fotografías publicitarias de calidad generadas con inteligencia artificial.",
      en: "Advertising-quality photographs generated with artificial intelligence.",
    },
  },
  {
    slug: "animacion-storytelling",
    icon: "film",
    image: "/services/animation.png",
    title: {
      es: "Animación & Storytelling",
      en: "Animation & Storytelling",
    },
    description: {
      es: "Animaciones fluidas que narran historias impactantes.",
      en: "Fluid animations that narrate compelling stories.",
    },
  },
  {
    slug: "produccion-audiovisual-ia",
    icon: "video",
    image: "/services/audiovisual.png",
    title: {
      es: "Producción Audiovisual con IA",
      en: "AI Audiovisual Production",
    },
    description: {
      es: "Contenido de video de alto impacto mezclando hiperrealismo con mundos imaginarios.",
      en: "High-impact video content blending hyperrealism with imaginative worlds.",
    },
  },
  {
    slug: "3d-motion-graphics",
    icon: "cube",
    image: "/services/3d-motion.png",
    title: {
      es: "3D & Motion Graphics",
      en: "3D & Motion Graphics",
    },
    description: {
      es: "Modelado y animación 3D cinematográfica.",
      en: "Cinematic 3D modeling and animation.",
    },
  },
  {
    slug: "postproduccion-fx",
    icon: "sparkles",
    image: "/services/postproduction.png",
    title: {
      es: "Postproducción & FX",
      en: "Post-Production & FX",
    },
    description: {
      es: "Reemplazo de personajes, cambios de entorno y efectos visuales avanzados.",
      en: "Character replacement, environment changes, and advanced visual effects.",
    },
  },
  {
    slug: "consistencia-visual",
    icon: "palette",
    image: "/services/brand.png",
    title: {
      es: "Consistencia Visual de Marca",
      en: "Brand Visual Consistency",
    },
    description: {
      es: "Coherencia visual en personajes, productos y escenarios para tu marca.",
      en: "Visual coherence across characters, products, and scenarios for your brand.",
    },
  },
];
