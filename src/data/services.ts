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
      es: "Creamos fotografías publicitarias combinando dirección de arte tradicional con generación por IA. Cada imagen parte de un brief creativo donde definimos iluminación, composición y paleta antes de generar. El resultado son piezas que compiten con producción fotográfica de alto presupuesto, entregadas en días, no semanas.",
      en: "We create advertising photographs blending traditional art direction with AI generation. Every image starts with a creative brief where we define lighting, composition, and palette before generating. The result is imagery that rivals high-budget photo productions, delivered in days, not weeks.",
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
      es: "Desarrollamos narrativas visuales desde el guión hasta el frame final. Combinamos motion design y generación por IA para construir historias que retienen la atención. Trabajamos con storyboard, animáticas y revisiones por etapa para asegurar que cada segundo comunique lo que tu marca necesita.",
      en: "We develop visual narratives from script to final frame. We combine motion design and AI generation to build stories that hold attention. We work with storyboards, animatics, and stage-by-stage reviews to ensure every second communicates what your brand needs.",
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
      es: "Producimos videos de alto impacto integrando rodaje real con activos generados por IA. Desde la preproducción definimos qué capturamos en cámara y qué construimos digitalmente, optimizando presupuesto sin sacrificar calidad. El resultado fusiona lo documental con lo cinematográfico.",
      en: "We produce high-impact videos integrating real footage with AI-generated assets. From pre-production we define what we capture on camera and what we build digitally, optimizing budget without sacrificing quality. The result fuses documentary with cinematic storytelling.",
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
      es: "Modelamos y animamos en Cinema 4D y Blender con un enfoque cinematográfico desde el inicio. Cada proyecto comienza con referencias de cámara y luz antes de levantar geometría. Integramos renders con composición en After Effects para piezas que se ven producidas, no simplemente renderizadas.",
      en: "We model and animate in Cinema 4D and Blender with a cinematic focus from the start. Every project begins with camera and lighting references before building geometry. We integrate renders with After Effects compositing for pieces that look produced, not just rendered.",
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
      es: "Intervenimos material existente con efectos visuales avanzados: reemplazo de personajes con IA, extensión de entornos, corrección de color cinematográfica y composición multicapa. Trabajamos con tu footage o el nuestro, entregando piezas listas para emisión en cualquier plataforma.",
      en: "We enhance existing material with advanced visual effects: AI character replacement, environment extension, cinematic color grading, and multilayer compositing. We work with your footage or ours, delivering broadcast-ready pieces for any platform.",
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
      es: "Desarrollamos un sistema donde personajes, productos y escenarios se mantienen coherentes a través de múltiples piezas. Entrenamos modelos de referencia con el ADN visual de tu marca para que cada nuevo asset generado respete la identidad establecida. Tu marca siempre luce reconocible.",
      en: "We develop a system where characters, products, and environments stay coherent across multiple pieces. We train reference models with your brand's visual DNA so every new generated asset respects the established identity. Your brand always looks unmistakably yours.",
    },
  },
];
