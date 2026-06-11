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
    image: "/services/hyperrealistic.webp",
    title: {
      es: "ImÃ¡genes Hiperrealistas",
      en: "Hyperrealistic Images",
    },
    description: {
      es: "Creamos fotografÃ­as publicitarias combinando direcciÃ³n de arte tradicional con generaciÃ³n por IA. Cada imagen parte de un brief creativo donde definimos iluminaciÃ³n, composiciÃ³n y paleta antes de generar. El resultado son piezas que compiten con producciÃ³n fotogrÃ¡fica de alto presupuesto, entregadas en dÃ­as, no semanas.",
      en: "We create advertising photographs blending traditional art direction with AI generation. Every image starts with a creative brief where we define lighting, composition, and palette before generating. The result is imagery that rivals high-budget photo productions, delivered in days, not weeks.",
    },
  },
  {
    slug: "animacion-storytelling",
    icon: "film",
    image: "/services/animation2.webp",
    title: {
      es: "AnimaciÃ³n & Storytelling",
      en: "Animation & Storytelling",
    },
    description: {
      es: "Desarrollamos narrativas visuales desde el guiÃ³n hasta el frame final. Combinamos motion design y generaciÃ³n por IA para construir historias que retienen la atenciÃ³n. Trabajamos con storyboard, animÃ¡ticas y revisiones por etapa para asegurar que cada segundo comunique lo que tu marca necesita.",
      en: "We develop visual narratives from script to final frame. We combine motion design and AI generation to build stories that hold attention. We work with storyboards, animatics, and stage-by-stage reviews to ensure every second communicates what your brand needs.",
    },
  },
  {
    slug: "produccion-audiovisual-ia",
    icon: "video",
    image: "/services/audiovisual.webp",
    title: {
      es: "ProducciÃ³n Audiovisual con IA",
      en: "AI Audiovisual Production",
    },
    description: {
      es: "Producimos videos de alto impacto integrando rodaje real con activos generados por IA. Desde la preproducciÃ³n definimos quÃ© capturamos en cÃ¡mara y quÃ© construimos digitalmente, optimizando presupuesto sin sacrificar calidad. El resultado fusiona lo documental con lo cinematogrÃ¡fico.",
      en: "We produce high-impact videos integrating real footage with AI-generated assets. From pre-production we define what we capture on camera and what we build digitally, optimizing budget without sacrificing quality. The result fuses documentary with cinematic storytelling.",
    },
  },
  {
    slug: "3d-motion-graphics",
    icon: "cube",
    image: "/services/3d-motion.webp",
    title: {
      es: "3D & Motion Graphics",
      en: "3D & Motion Graphics",
    },
    description: {
      es: "Modelamos y animamos en Cinema 4D y Blender con un enfoque cinematogrÃ¡fico desde el inicio. Cada proyecto comienza con referencias de cÃ¡mara y luz antes de levantar geometrÃ­a. Integramos renders con composiciÃ³n en After Effects para piezas que se ven producidas, no simplemente renderizadas.",
      en: "We model and animate in Cinema 4D and Blender with a cinematic focus from the start. Every project begins with camera and lighting references before building geometry. We integrate renders with After Effects compositing for pieces that look produced, not just rendered.",
    },
  },
  {
    slug: "postproduccion-fx",
    icon: "sparkles",
    image: "/services/postproduction.webp",
    title: {
      es: "PostproducciÃ³n & FX",
      en: "Post-Production & FX",
    },
    description: {
      es: "Intervenimos material existente con efectos visuales avanzados: reemplazo de personajes con IA, extensiÃ³n de entornos, correcciÃ³n de color cinematogrÃ¡fica y composiciÃ³n multicapa. Trabajamos con tu footage o el nuestro, entregando piezas listas para emisiÃ³n en cualquier plataforma.",
      en: "We enhance existing material with advanced visual effects: AI character replacement, environment extension, cinematic color grading, and multilayer compositing. We work with your footage or ours, delivering broadcast-ready pieces for any platform.",
    },
  },
  {
    slug: "consistencia-visual",
    icon: "palette",
    image: "/services/brand.webp",
    title: {
      es: "Consistencia Visual de Marca",
      en: "Brand Visual Consistency",
    },
    description: {
      es: "Desarrollamos un sistema donde personajes, productos y escenarios se mantienen coherentes a travÃ©s de mÃºltiples piezas. Entrenamos modelos de referencia con el ADN visual de tu marca para que cada nuevo asset generado respete la identidad establecida. Tu marca siempre luce reconocible.",
      en: "We develop a system where characters, products, and environments stay coherent across multiple pieces. We train reference models with your brand's visual DNA so every new generated asset respects the established identity. Your brand always looks unmistakably yours.",
    },
  },
];
