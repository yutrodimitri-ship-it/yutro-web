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
  videoUrl: string;
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
    image: "/projects/mochilas-head.jpg",
    videoUrl: "https://www.youtube.com/embed/VIDEO_ID",
    gallery: [
      "/projects/mochilas-head/01.jpg",
      "/projects/mochilas-head/02.jpg",
      "/projects/mochilas-head/03.jpg",
      "/projects/mochilas-head/04.jpg",
      "/projects/mochilas-head/05.jpg",
      "/projects/mochilas-head/06.jpg",
      "/projects/mochilas-head/07.jpg",
      "/projects/mochilas-head/08.jpg",
      "/projects/mochilas-head/09.jpg",
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
    image: "/projects/super-pollo.jpg",
    videoUrl: "https://www.youtube.com/embed/VIDEO_ID",
    gallery: [
      "/projects/super-pollo/01.jpg",
      "/projects/super-pollo/02.jpg",
      "/projects/super-pollo/03.jpg",
      "/projects/super-pollo/04.jpg",
      "/projects/super-pollo/05.jpg",
      "/projects/super-pollo/06.jpg",
      "/projects/super-pollo/07.jpg",
      "/projects/super-pollo/08.jpg",
      "/projects/super-pollo/09.jpg",
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
    image: "/projects/santander.jpg",
    videoUrl: "https://www.youtube.com/embed/VIDEO_ID",
    gallery: [
      "/projects/santander/01.jpg",
      "/projects/santander/02.jpg",
      "/projects/santander/03.jpg",
      "/projects/santander/04.jpg",
      "/projects/santander/05.jpg",
      "/projects/santander/06.jpg",
      "/projects/santander/07.jpg",
      "/projects/santander/08.jpg",
      "/projects/santander/09.jpg",
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
    image: "/projects/paris-electro.jpg",
    videoUrl: "https://www.youtube.com/embed/VIDEO_ID",
    gallery: [
      "/projects/paris-electro/01.jpg",
      "/projects/paris-electro/02.jpg",
      "/projects/paris-electro/03.jpg",
      "/projects/paris-electro/04.jpg",
      "/projects/paris-electro/05.jpg",
      "/projects/paris-electro/06.jpg",
      "/projects/paris-electro/07.jpg",
      "/projects/paris-electro/08.jpg",
      "/projects/paris-electro/09.jpg",
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
    image: "/projects/sprim.jpg",
    videoUrl: "https://www.youtube.com/embed/VIDEO_ID",
    gallery: [
      "/projects/sprim/01.jpg",
      "/projects/sprim/02.jpg",
      "/projects/sprim/03.jpg",
      "/projects/sprim/04.jpg",
      "/projects/sprim/05.jpg",
      "/projects/sprim/06.jpg",
      "/projects/sprim/07.jpg",
      "/projects/sprim/08.jpg",
      "/projects/sprim/09.jpg",
    ],
    featured: true,
  },
  {
    slug: "zapatillas-falabella",
    title: "Zapatillas Falabella",
    client: "Falabella",
    partners: ["VRYP Studio", "Falabella Retail"],
    categories: ["creative"],
    excerpt: {
      es: "Imágenes hiperrealistas para la línea de zapatillas Falabella.",
      en: "Hyperrealistic images for the Falabella sneaker line.",
    },
    description: {
      es: "Generación de imágenes hiperrealistas con IA para la línea de zapatillas de Falabella. Cada pieza fue creada con atención al detalle en texturas, iluminación y composición, logrando un resultado indistinguible de una fotografía profesional de estudio.",
      en: "AI-generated hyperrealistic images for Falabella's sneaker line. Each piece was created with attention to detail in textures, lighting and composition, achieving a result indistinguishable from professional studio photography.",
    },
    image: "/projects/zapatillas-falabella.jpg",
    videoUrl: "https://www.youtube.com/embed/VIDEO_ID",
    gallery: [
      "/projects/zapatillas-falabella/01.jpg",
      "/projects/zapatillas-falabella/02.jpg",
      "/projects/zapatillas-falabella/03.jpg",
      "/projects/zapatillas-falabella/04.jpg",
      "/projects/zapatillas-falabella/05.jpg",
      "/projects/zapatillas-falabella/06.jpg",
      "/projects/zapatillas-falabella/07.jpg",
      "/projects/zapatillas-falabella/08.jpg",
      "/projects/zapatillas-falabella/09.jpg",
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
    image: "/projects/proyecto-mg.jpg",
    videoUrl: "https://www.youtube.com/embed/VIDEO_ID",
    gallery: [
      "/projects/proyecto-mg/01.jpg",
      "/projects/proyecto-mg/02.jpg",
      "/projects/proyecto-mg/03.jpg",
      "/projects/proyecto-mg/04.jpg",
      "/projects/proyecto-mg/05.jpg",
      "/projects/proyecto-mg/06.jpg",
      "/projects/proyecto-mg/07.jpg",
      "/projects/proyecto-mg/08.jpg",
      "/projects/proyecto-mg/09.jpg",
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
    image: "/projects/bburago-autos.jpg",
    videoUrl: "https://www.youtube.com/embed/VIDEO_ID",
    gallery: [
      "/projects/bburago-autos/01.jpg",
      "/projects/bburago-autos/02.jpg",
      "/projects/bburago-autos/03.jpg",
      "/projects/bburago-autos/04.jpg",
      "/projects/bburago-autos/05.jpg",
      "/projects/bburago-autos/06.jpg",
      "/projects/bburago-autos/07.jpg",
      "/projects/bburago-autos/08.jpg",
      "/projects/bburago-autos/09.jpg",
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
    image: "/projects/frutos-de-chile.jpg",
    videoUrl: "https://www.youtube.com/embed/VIDEO_ID",
    gallery: [
      "/projects/frutos-de-chile/01.jpg",
      "/projects/frutos-de-chile/02.jpg",
      "/projects/frutos-de-chile/03.jpg",
      "/projects/frutos-de-chile/04.jpg",
      "/projects/frutos-de-chile/05.jpg",
      "/projects/frutos-de-chile/06.jpg",
      "/projects/frutos-de-chile/07.jpg",
      "/projects/frutos-de-chile/08.jpg",
      "/projects/frutos-de-chile/09.jpg",
    ],
    featured: false,
  },
];
