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
  videoUrl: string | string[];
  gallery: string[];
  featured: boolean;
}

export const projects: Project[] = [
  {
    slug: "mochilas-head",
    title: "Mochilas Head",
    client: "Head",
    partners: ["VRYP Studio", "Head Marketing"],
    categories: ["creative"],
    excerpt: {
      es: "Campaña audiovisual para la línea de mochilas Head.",
      en: "Audiovisual campaign for the Head backpack line.",
    },
    description: {
      es: "Desarrollo integral de campaña audiovisual para la línea de mochilas Head, combinando imágenes hiperrealistas generadas con IA y postproducción avanzada. El proyecto incluyó dirección creativa, generación de contenido visual para redes sociales y material publicitario impreso.",
      en: "Full audiovisual campaign development for the Head backpack line, combining AI-generated hyperrealistic images and advanced post-production. The project included creative direction, visual content generation for social media and printed advertising material.",
    },
    image: "/projects/mochilas-head.webp",
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
    slug: "super-pollo",
    title: "Super Pollo",
    client: "Super Pollo",
    partners: ["VRYP Studio"],
    categories: ["creative"],
    excerpt: {
      es: "Producción creativa con IA para Super Pollo.",
      en: "AI creative production for Super Pollo.",
    },
    description: {
      es: "Producción creativa con inteligencia artificial para Super Pollo. Se generaron escenas hiperrealistas de productos en entornos naturales, logrando un estilo visual único que combina la calidez de la marca con tecnología de vanguardia en generación de imagen.",
      en: "AI-powered creative production for Super Pollo. Hyperrealistic product scenes were generated in natural environments, achieving a unique visual style that combines the brand's warmth with cutting-edge image generation technology.",
    },
    image: "/projects/super-pollo.webp",
    videoUrl: "https://www.youtube.com/embed/x5iJpsPZxyo",
    gallery: [
      "/projects/super-pollo/01.webp",
      "/projects/super-pollo/02.webp",
      "/projects/super-pollo/03.webp",
      "/projects/super-pollo/04.webp",
    ],
    featured: true,
  },
  {
    slug: "santander",
    title: "Santander",
    client: "Santander",
    partners: ["VRYP Studio", "Santander Digital"],
    categories: ["creative"],
    excerpt: {
      es: "Contenido visual generado con IA para Banco Santander.",
      en: "AI-generated visual content for Santander Bank.",
    },
    description: {
      es: "Creación de contenido visual con IA para Banco Santander. El proyecto abarcó la generación de piezas gráficas para campañas digitales, manteniendo la identidad corporativa del banco mientras se exploraban nuevos territorios creativos con tecnología generativa.",
      en: "AI visual content creation for Santander Bank. The project covered graphic piece generation for digital campaigns, maintaining the bank's corporate identity while exploring new creative territories with generative technology.",
    },
    image: "/projects/santander.webp",
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
    partners: ["VRYP Studio", "Paris Cencosud"],
    categories: ["creative"],
    excerpt: {
      es: "Campaña electro para Paris con imágenes hiperrealistas.",
      en: "Electro campaign for Paris with hyperrealistic images.",
    },
    description: {
      es: "Campaña visual para la línea electro de Paris, con imágenes hiperrealistas generadas mediante IA. Se crearon ambientes futuristas y tecnológicos que resaltan los productos electrónicos con un acabado cinematográfico impactante.",
      en: "Visual campaign for Paris' electro line, with AI-generated hyperrealistic images. Futuristic and technological environments were created to highlight electronic products with an impactful cinematic finish.",
    },
    image: "/projects/paris-electro.webp",
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
    client: "Sprim",
    partners: ["VRYP Studio"],
    categories: ["creative"],
    excerpt: {
      es: "Producción visual creativa para Sprim.",
      en: "Creative visual production for Sprim.",
    },
    description: {
      es: "Producción visual creativa para Sprim utilizando inteligencia artificial generativa. El proyecto incluyó la creación de imágenes de producto y escenas de estilo de vida que conectan emocionalmente con el público objetivo de la marca.",
      en: "Creative visual production for Sprim using generative artificial intelligence. The project included product imagery and lifestyle scenes that emotionally connect with the brand's target audience.",
    },
    image: "/projects/sprim.webp",
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
    partners: ["The Chinetaown"],
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
    featured: true,
  },
  {
    slug: "proyecto-mg",
    title: "Proyecto MG",
    client: "MG",
    partners: ["VRYP Studio", "MG Motors"],
    categories: ["creative", "design"],
    excerpt: {
      es: "Diseño y producción creativa para MG.",
      en: "Design and creative production for MG.",
    },
    description: {
      es: "Diseño y producción creativa integral para MG Motors. El proyecto combinó diseño gráfico, modelado 3D e inteligencia artificial para crear piezas visuales de alto impacto que comunican la innovación y modernidad de la marca automotriz.",
      en: "Full design and creative production for MG Motors. The project combined graphic design, 3D modeling and artificial intelligence to create high-impact visual pieces that communicate the automotive brand's innovation and modernity.",
    },
    image: "/projects/proyecto-mg.webp",
    videoUrl: "https://www.youtube.com/embed/oyYZIqTmwlE",
    gallery: [
      "/projects/proyecto-mg/01.webp",
      "/projects/proyecto-mg/02.webp",
      "/projects/proyecto-mg/03.webp",
      "/projects/proyecto-mg/04.webp",
      "/projects/proyecto-mg/05.webp",
      "/projects/proyecto-mg/06.webp",
      "/projects/proyecto-mg/07.webp",
    ],
    featured: false,
  },
  {
    slug: "bburago-autos",
    title: "Bburago Autos",
    client: "Bburago",
    partners: ["VRYP Studio"],
    categories: ["creative"],
    excerpt: {
      es: "Producción audiovisual con IA para Bburago.",
      en: "AI audiovisual production for Bburago.",
    },
    description: {
      es: "Producción audiovisual con inteligencia artificial para Bburago. Se crearon escenas detalladas de autos a escala en entornos realistas, jugando con la percepción de escala y logrando un resultado visual cinematográfico para la marca de coleccionables.",
      en: "AI audiovisual production for Bburago. Detailed scale car scenes were created in realistic environments, playing with scale perception and achieving a cinematic visual result for the collectibles brand.",
    },
    image: "/projects/bburago-autos.webp",
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
    partners: ["VRYP Studio", "ProChile"],
    categories: ["creative"],
    excerpt: {
      es: "Campaña visual para Frutos de Chile.",
      en: "Visual campaign for Frutos de Chile.",
    },
    description: {
      es: "Campaña visual para Frutos de Chile utilizando IA generativa. Se crearon composiciones vibrantes que destacan la frescura y calidad de los frutos chilenos, combinando fotografía de producto con fondos y ambientaciones generadas por inteligencia artificial.",
      en: "Visual campaign for Frutos de Chile using generative AI. Vibrant compositions were created to highlight the freshness and quality of Chilean fruits, combining product photography with AI-generated backgrounds and settings.",
    },
    image: "/projects/frutos-de-chile.webp",
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
