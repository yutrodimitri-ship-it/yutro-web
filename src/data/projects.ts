export interface Project {
  slug: string;
  title: string;
  client: string;
  partners: string[];
  categories: string[];
  excerpt: {
    es: string;
    en: string;
  };
  description: {
    es: string;
    en: string;
  };
  image: string;
  logo?: string;
  logoDark?: string;
  logoSize?: number;
  videoUrl: string | string[];
  gallery: string[];
  featured: boolean;
}

export const projects: Project[] = [
  {
    slug: "super-pollo",
    title: "Super Pollo",
    client: "Super Pollo",
    partners: ["Agencia BBDO"],
    categories: ["creative"],
    excerpt: {
      es: "Comercial híbrido con rodaje real y animación IA para Super Pollo.",
      en: "Hybrid commercial with live footage and AI animation for Super Pollo.",
    },
    description: {
      es: "Comercial híbrido desarrollado junto a BBDO para Super Pollo, combinando rodaje real con animación generada mediante IA.",
      en: "Hybrid commercial developed with BBDO for Super Pollo, combining live footage with AI-generated animation.",
    },
    image: "/projects/super-pollo.webp",
    logo: "/projects/logos/super-pollo.webp",
    videoUrl: "https://player.vimeo.com/video/1180144720?badge=0&autopause=0&player_id=0&app_id=58479",
    gallery: [
      "/projects/super-pollo/01.webp",
      "/projects/super-pollo/02.webp",
      "/projects/super-pollo/03.webp",
      "/projects/super-pollo/04.webp",
    ],
    featured: true,
  },
  {
    slug: "mochilas-head",
    title: "Mochilas Head",
    client: "Mochilas Head",
    partners: ["Estudio Pic-Nic"],
    categories: ["creative"],
    excerpt: {
      es: "Campaña audiovisual para la línea de mochilas Head.",
      en: "Audiovisual campaign for the Head backpack line.",
    },
    description: {
      es: "Con el Estudio Pic-nic se desarrolló una serie de clips generados con IA a partir de 8 imágenes base. Cada pieza incluyó generación de tomas, construcción del movimiento y edición final sincronizada con la música del proyecto.",
      en: "With Estudio Pic-nic, a series of AI-generated clips was developed from 8 base images. Each piece included shot generation, movement construction and final editing synchronized with the project's music.",
    },
    image: "/projects/mochilas-head.webp",
    logo: "/projects/logos/mochilas-head-white.png",
    logoDark: "/projects/logos/mochilas-head-black.png",
    logoSize: 304,
    videoUrl: [
      "https://www.youtube.com/embed/qA0uK1QyskI",
      "https://www.youtube.com/embed/1yRmV3bdX2Y",
      "https://www.youtube.com/embed/7ELwd4xZTB4",
      "https://www.youtube.com/embed/lvzbvBza048",
    ],
    gallery: [
      "/projects/mochilas-head/01.webp",
      "/projects/mochilas-head/02.webp",
      "/projects/mochilas-head/03.webp",
      "/projects/mochilas-head/04.webp",
      "/projects/mochilas-head/05.webp",
      "/projects/mochilas-head/06.webp",
    ],
    featured: true,
  },
  {
    slug: "santander",
    title: "Santander",
    client: "Santander",
    partners: ["Estudio UOIEA"],
    categories: ["creative"],
    excerpt: {
      es: "Contenido generado con IA para la campaña Santander Smusic.",
      en: "AI-generated content for the Santander Smusic campaign.",
    },
    description: {
      es: "Para UOIEA y Publicis Chile, desarrollamos contenido generado con IA para complementar la campaña Santander Smusic.\nEl objetivo fue integrar imágenes y animaciones que mantuvieran el tono, la estética y la narrativa del comercial original.",
      en: "For UOIEA and Publicis Chile, we developed AI-generated content to complement the Santander Smusic campaign.\nThe goal was to integrate images and animations that maintained the tone, aesthetic and narrative of the original commercial.",
    },
    image: "/projects/santander.webp",
    logo: "/projects/logos/santander.webp",
    videoUrl: "https://www.youtube.com/embed/23v25d77MzI",
    gallery: [
      "/projects/santander/01.webp",
      "/projects/santander/02.webp",
      "/projects/santander/03.webp",
      "/projects/santander/04.webp",
      "/projects/santander/05.webp",
    ],
    featured: true,
  },
  {
    slug: "paris-electro",
    title: "Paris Electro",
    client: "Paris",
    partners: ["BBDO"],
    categories: ["creative"],
    excerpt: {
      es: "Campaña Electro Circular para Paris combinando footage real e imágenes IA.",
      en: "Electro Circular campaign for Paris combining real footage and AI images.",
    },
    description: {
      es: "Comercial desarrollado junto a BBDO para Paris en su campaña Electro Circular, combinando material audiovisual existente con imágenes generadas de notebooks mediante IA.",
      en: "Commercial developed with BBDO for Paris in their Electro Circular campaign, combining existing audiovisual material with AI-generated notebook images.",
    },
    image: "/projects/paris-electro.webp",
    logo: "/projects/logos/paris-electro-v2.png",
    videoUrl: "https://www.youtube.com/embed/YbbBMMOXRjw",
    gallery: [
      "/projects/paris-electro/01.webp",
      "/projects/paris-electro/02.webp",
      "/projects/paris-electro/03.webp",
      "/projects/paris-electro/04.webp",
    ],
    featured: true,
  },
  {
    slug: "sprim",
    title: "Sprim",
    client: "Empresas Carozzi S.A.",
    partners: ["IA Films", "TBWA\\ Frederick"],
    categories: ["creative"],
    excerpt: {
      es: "Comercial íntegramente generado con IA para Sprim Acid.",
      en: "Fully AI-generated commercial for Sprim Acid.",
    },
    description: {
      es: "Comercial creado íntegramente con IA generativa junto a IA Films para TBWA\\ Frederick y Empresas Carozzi S.A., donde adorables personajes de peluche huyen del jugo Sprim Acid en una pieza audiovisual dinámica y entretenida.",
      en: "Commercial created entirely with generative AI alongside IA Films for TBWA\\ Frederick and Empresas Carozzi S.A., featuring adorable plush characters fleeing from Sprim Acid juice in a dynamic and entertaining audiovisual piece.",
    },
    image: "/projects/sprim.webp",
    logo: "/projects/logos/sprim.webp",
    videoUrl: "https://www.youtube.com/embed/3Edx99Qyapo",
    gallery: [
      "/projects/sprim/1.webp",
      "/projects/sprim/2.webp",
      "/projects/sprim/3.webp",
      "/projects/sprim/4.webp",
      "/projects/sprim/5.webp",
    ],
    featured: true,
  },
  {
    slug: "zapatillas-falabella",
    title: "Zapatillas Falabella",
    client: "Falabella",
    partners: ["Chinatown"],
    categories: ["creative"],
    excerpt: {
      es: "Imágenes hiperrealistas para la línea de zapatillas Falabella.",
      en: "Hyperrealistic images for the Falabella sneaker line.",
    },
    description: {
      es: "Proyecto realizado junto al estudio Chinatown para Falabella, desarrollando la animación con IA, con postproducción en SI y armado final para una pieza dinámica y coherente con el tono visual de la marca.",
      en: "Project developed with Chinatown studio for Falabella, creating AI-powered animation with post-production and final assembly for a dynamic piece consistent with the brand's visual tone.",
    },
    image: "/projects/zapatillas-falabella.webp",
    logo: "/projects/logos/zapatillas-falabella.png",
    logoSize: 270,
    videoUrl: "https://www.youtube.com/embed/9ZDthZbztzk",
    gallery: [
      "/projects/zapatillas-falabella/01.webp",
      "/projects/zapatillas-falabella/02.webp",
      "/projects/zapatillas-falabella/03.webp",
      "/projects/zapatillas-falabella/04.webp",
      "/projects/zapatillas-falabella/05.webp",
      "/projects/zapatillas-falabella/06.webp",
      "/projects/zapatillas-falabella/07.webp",
    ],
    featured: false,
  },
  {
    slug: "proyecto-mg",
    title: "Proyecto MG",
    client: "Agencia Fri",
    partners: ["IA Films"],
    categories: ["creative", "design"],
    excerpt: {
      es: "Animación con IA para el manifiesto de MG.",
      en: "AI animation for the MG manifesto.",
    },
    description: {
      es: "Proyecto desarrollado para IA Films y Agencia Fri, donde se animaron imágenes para el manifiesto de MG utilizando técnicas de inteligencia artificial. Desarrollado como una exploración creativa y tecnológica.",
      en: "Project developed for IA Films and Agencia Fri, animating images for the MG manifesto using artificial intelligence techniques. Developed as a creative and technological exploration.",
    },
    image: "/projects/proyecto-mg.webp",
    logo: "/projects/logos/proyecto-mg-white-v2.png",
    logoDark: "/projects/logos/proyecto-mg-v2.png",
    videoUrl: "https://www.youtube.com/embed/oyYZIqTmwlE",
    gallery: [
      "/projects/proyecto-mg/01.webp",
      "/projects/proyecto-mg/02.webp",
      "/projects/proyecto-mg/03.webp",
      "/projects/proyecto-mg/04.webp",
      "/projects/proyecto-mg/05.webp",
      "/projects/proyecto-mg/06.webp",
    ],
    featured: false,
  },
  {
    slug: "bburago-autos",
    title: "Bburago Autos",
    client: "Copec - Mobil",
    partners: ["Estudio Dios"],
    categories: ["creative"],
    excerpt: {
      es: "IA y narrativa cinematográfica para la campaña Mobil con autos Bburago.",
      en: "AI and cinematic narrative for the Mobil campaign with Bburago toy cars.",
    },
    description: {
      es: "Proyecto desarrollado por Yutro para el estudio Dios, donde se combinó IA y narrativa cinematográfica para dar vida a autos de juguete Bburago dentro de la campaña Mobil.",
      en: "Project developed by Yutro for Estudio Dios, combining AI and cinematic narrative to bring Bburago toy cars to life within the Mobil campaign.",
    },
    image: "/projects/bburago-autos.webp",
    logo: "/projects/logos/bburago-autos-white-v2.png",
    logoDark: "/projects/logos/bburago-autos-v2.png",
    videoUrl: [
      "https://www.youtube.com/embed/5JFR-wE5x-8",
      "https://www.youtube.com/embed/rjlTWLiXIPI",
      "https://www.youtube.com/embed/I6OXytT4Q0w",
    ],
    gallery: [
      "/projects/bburago-autos/01.webp",
      "/projects/bburago-autos/02.webp",
      "/projects/bburago-autos/03.webp",
    ],
    featured: false,
  },
  {
    slug: "frutos-de-chile",
    title: "Frutos de Chile",
    client: "Frutos de Chile",
    partners: ["Somos Group"],
    categories: ["creative"],
    excerpt: {
      es: "Pieza audiovisual 100% IA para Frutos de Chile.",
      en: "100% AI audiovisual piece for Frutos de Chile.",
    },
    description: {
      es: "Proyecto audiovisual de Frutos de Chile realizado 100% con IA: casting digital de personajes, generación de imágenes con estilo y luz consistentes, postproducción, animación y entrega final de una pieza de 40 segundos con sus adaptaciones.",
      en: "Audiovisual project for Frutos de Chile made 100% with AI: digital character casting, consistent style and lighting image generation, post-production, animation and final delivery of a 40-second piece with its adaptations.",
    },
    image: "/projects/frutos-de-chile.webp",
    logo: "/projects/logos/frutos-de-chile.png",
    videoUrl: "https://www.youtube.com/embed/0NZkGhyvFFk",
    gallery: [
      "/projects/frutos-de-chile/1.webp",
      "/projects/frutos-de-chile/2.webp",
      "/projects/frutos-de-chile/3.webp",
      "/projects/frutos-de-chile/4.webp",
      "/projects/frutos-de-chile/5.webp",
      "/projects/frutos-de-chile/6.webp",
    ],
    featured: false,
  },
];
