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
  credits?: ProjectCredits;
}

type Localized = { es: string; en: string };

// Cómo participamos en el proyecto. Se muestra siempre, para que quede claro
// qué hizo YUTRO y qué hizo el resto del equipo.
export type Modality = "full" | "team" | "partner" | "in-house" | "own";

export const MODALITY_LABELS: Record<Modality, Localized> = {
  full: { es: "Producción completa", en: "Full production" },
  team: { es: "Producción IA en equipo", en: "AI production as part of a team" },
  partner: { es: "Partner de producción", en: "Production partner" },
  "in-house": { es: "Como parte de un equipo", en: "As part of an in-house team" },
  own: { es: "Proyecto propio", en: "Original project" },
};

export interface ProjectCredits {
  modality: Modality;
  /** Lo que hizo YUTRO, en orden de proceso. */
  role: { es: string[]; en: string[] };
  /** Cuánto de la campaña es nuestro, si no es todo (ej. "4 de las 10 cápsulas"). */
  scope?: Localized;
  /** Quién más participó y con qué. */
  team?: Localized[];
}

export const projects: Project[] = [
  {
    slug: "latam-pass",
    title: "LATAM Pass",
    client: "LATAM Airlines",
    partners: ["Productora Chinatown"],
    categories: ["creative"],
    excerpt: {
      es: "Cuatro cápsulas de 15\" para LATAM Pass: animación IA, tomas extra y tracking de pantallas sobre material base de Chinatown.",
      en: "Four 15\" spots for LATAM Pass: AI animation, extra shots and screen tracking over Chinatown's base material.",
    },
    description: {
      es: "Cuatro cápsulas de LATAM Pass encargadas por Chinatown, que debían leerse como una sola campaña. Sobre su material base construimos toda la animación, generamos tomas extra, hicimos tracking de cámara para reemplazar las pantallas de los celulares y armamos las piezas en After Effects con salida en alta para emisión.",
      en: "Four LATAM Pass spots commissioned by Chinatown, meant to read as a single campaign. Building on their base material, we created all the animation, generated extra shots, camera-tracked the phone screens for replacement, and assembled the pieces in After Effects for broadcast delivery.",
    },
    image: "/projects/latam-pass.webp",
    logo: "/projects/logos/latam-pass.png",
    videoUrl: [
      "https://www.youtube.com/embed/w3Erhonij9A",
      "https://www.youtube.com/embed/gRVB1PXYdT4",
      "https://www.youtube.com/embed/o7SnEfIIZPE",
      "https://www.youtube.com/embed/k5s_Wqobwg8",
    ],
    gallery: [
      "/projects/latam-pass/01.webp",
      "/projects/latam-pass/02.webp",
      "/projects/latam-pass/03.webp",
      "/projects/latam-pass/04.webp",
      "/projects/latam-pass/05.webp",
      "/projects/latam-pass/06.webp",
      "/projects/latam-pass/07.webp",
      "/projects/latam-pass/08.webp",
      "/projects/latam-pass/09.webp",
    ],
    featured: false,
    credits: {
      modality: "team",
      role: {
        es: ["Consistencia de personaje", "Animación", "Tomas extra", "Tracking de cámara para reemplazar pantallas", "Montaje en After Effects", "Entrega del editable"],
        en: ["Character consistency", "Animation", "Extra shots", "Camera tracking for screen replacement", "Assembly in After Effects", "Editable project delivery"],
      },
      scope: { es: "4 de las 10 cápsulas de la campaña", en: "4 of the campaign's 10 spots" },
      team: [
        { es: "Chinatown — imágenes base, sobreimpresiones, locución y música", en: "Chinatown — base images, supers, voiceover and music" },
      ],
    },
  },
  {
    slug: "soprole-zerolacto",
    title: "Soprole ZeroLacto",
    client: "Soprole",
    partners: ["Productora Chinatown"],
    categories: ["creative"],
    excerpt: {
      es: "Comercial de 19\" para ZeroLacto: animación de imágenes, tomas extra y montaje sobre material de Chinatown.",
      en: "19\" spot for ZeroLacto: image animation, extra shots and editing over Chinatown's material.",
    },
    description: {
      es: "Comercial para la línea ZeroLacto de Soprole, encargado por Chinatown. Sobre las imágenes trabajadas por la productora, animamos cada plano, generamos imágenes adicionales e hicimos el montaje con efectos de corte, integrando la locución y el mix entregados.",
      en: "Spot for Soprole's ZeroLacto line, commissioned by Chinatown. Working from the production company's images, we animated every shot, generated additional images and edited the piece with cut effects, integrating the delivered voiceover and mix.",
    },
    image: "/projects/soprole-zerolacto.webp",
    logo: "/projects/logos/soprole-zerolacto.png",
    videoUrl: "https://www.youtube.com/embed/h58XZJ6qrH8",
    gallery: [
      "/projects/soprole-zerolacto/01.webp",
      "/projects/soprole-zerolacto/02.webp",
      "/projects/soprole-zerolacto/03.webp",
      "/projects/soprole-zerolacto/04.webp",
      "/projects/soprole-zerolacto/05.webp",
      "/projects/soprole-zerolacto/06.webp",
      "/projects/soprole-zerolacto/07.webp",
      "/projects/soprole-zerolacto/08.webp",
      "/projects/soprole-zerolacto/09.webp",
    ],
    featured: false,
    credits: {
      modality: "team",
      role: {
        es: ["Animación de cada plano", "Imágenes adicionales", "Montaje con efectos de corte"],
        en: ["Animation of every shot", "Additional images", "Editing with cut effects"],
      },
      team: [
        { es: "Chinatown — imágenes base, locución y mezcla", en: "Chinatown — base images, voiceover and mix" },
      ],
    },
  },
  {
    slug: "pomarola",
    title: "Pomarola",
    client: "Carozzi",
    partners: ["Agencia BBDO", "Bravo Studio"],
    categories: ["creative"],
    excerpt: {
      es: "Dos comerciales para Pomarola: bocetos recreados en alta, animación, efectos de sonido y lip sync.",
      en: "Two spots for Pomarola: sketches recreated in high res, animation, sound design and lip sync.",
    },
    description: {
      es: "Campaña \"¡Tómate un viaje!\" de Pomarola para BBDO, en conjunto con Bravo Studio. Recreamos los bocetos en alta con los ajustes de cliente y agencia, animamos las piezas, las sonorizamos con efectos e hicimos el lip sync sobre la locución. Bravo realizó la edición, el cierre de pack y las adaptaciones.",
      en: "Pomarola's \"¡Tómate un viaje!\" campaign for BBDO, together with Bravo Studio. We recreated the sketches in high res with client and agency adjustments, animated the pieces, added sound effects and lip-synced the voiceover. Bravo handled editing, pack shots and adaptations.",
    },
    image: "/projects/pomarola.webp",
    logo: "/projects/logos/pomarola.png",
    videoUrl: [
      "https://www.youtube.com/embed/jFzyW17T1C8",
      "https://www.youtube.com/embed/ygGny2Dfewg",
    ],
    gallery: [
      "/projects/pomarola/01.webp",
      "/projects/pomarola/02.webp",
      "/projects/pomarola/03.webp",
      "/projects/pomarola/04.webp",
      "/projects/pomarola/05.webp",
      "/projects/pomarola/06.webp",
      "/projects/pomarola/07.webp",
      "/projects/pomarola/08.webp",
      "/projects/pomarola/09.webp",
    ],
    featured: true,
    credits: {
      modality: "team",
      role: {
        es: ["Imágenes rehechas y adaptadas a cliente y agencia", "Altas para print", "Retoque en alta de 2 imágenes", "Animación", "Lip sync sobre la locución", "Upscaling de 2 videos", "Efectos de sonido"],
        en: ["Images remade to client and agency requirements", "High-res files for print", "High-res retouching of 2 images", "Animation", "Lip sync over the voiceover", "Upscaling of 2 videos", "Sound effects"],
      },
      team: [
        { es: "Bravo Studio — locuciones, edición, cierre de pack y adaptaciones", en: "Bravo Studio — voiceovers, editing, pack shot and adaptations" },
      ],
    },
  },
  {
    slug: "parque-arauco-ddm",
    title: "Parque Arauco · Día de la Madre",
    client: "Parque Arauco",
    partners: ["Agencia BBDO", "Bravo Studio"],
    categories: ["creative"],
    excerpt: {
      es: "Lip sync en dos formatos: imágenes rehechas al detalle en 9:16 y 16:9 con el mismo sincro para dos personajes.",
      en: "Lip sync in two formats: images rebuilt in detail for 9:16 and 16:9 with matching sync for two characters.",
    },
    description: {
      es: "Campaña Día de la Madre para BBDO, con Bravo Studio en el audio. Rehicimos las imágenes al pie de la letra para tener el material en 9:16 y 16:9 respetando los encuadres, adaptamos y preparamos cada locución para los motores de lip sync, y armamos ambas versiones manteniendo el mismo sincro en los dos personajes.",
      en: "Mother's Day campaign for BBDO, with Bravo Studio on audio. We faithfully rebuilt the images to deliver both 9:16 and 16:9 respecting every framing, adapted and prepared each voiceover for the lip sync engines, and assembled both versions keeping the same sync across two characters.",
    },
    image: "/projects/parque-arauco-ddm.webp",
    logo: "/projects/logos/parque-arauco.png",
    videoUrl: "https://www.youtube.com/embed/to92WWgh5Ok",
    gallery: [
      "/projects/parque-arauco-ddm/01.webp",
      "/projects/parque-arauco-ddm/02.webp",
      "/projects/parque-arauco-ddm/03.webp",
      "/projects/parque-arauco-ddm/04.webp",
      "/projects/parque-arauco-ddm/05.webp",
      "/projects/parque-arauco-ddm/06.webp",
      "/projects/parque-arauco-ddm/07.webp",
      "/projects/parque-arauco-ddm/08.webp",
      "/projects/parque-arauco-ddm/09.webp",
    ],
    featured: true,
    credits: {
      modality: "team",
      role: {
        es: ["Imágenes rehechas en 9:16 y 16:9", "Preparación de las locuciones para lip sync", "Lip sync de dos personajes", "Armado de ambas versiones"],
        en: ["Images remade in 9:16 and 16:9", "Voiceover prep for lip sync", "Lip sync for two characters", "Assembly of both versions"],
      },
      team: [
        { es: "Bravo Studio — audio", en: "Bravo Studio — audio" },
      ],
    },
  },
  {
    slug: "kross",
    title: "Cerveza Kross",
    client: "Kross",
    partners: ["Agencia Raya"],
    categories: ["creative"],
    excerpt: {
      es: "Ilustración animada tipo novela gráfica: el estilo visual como decisión de dirección, no hiperrealismo.",
      en: "Graphic-novel animated illustration: visual style as a directorial choice, not hyperrealism.",
    },
    description: {
      es: "Pieza para Cerveza Kross con la agencia Raya, resuelta en ilustración animada, no en fotorrealismo. Recreamos las imágenes respetando el look & feel de los bocetos —personaje consistente, logos revisados, post digital— animamos en 9:16 y llevamos la pieza a 16:9 con reframe para no perder la animación ya construida.",
      en: "Piece for Kross beer with Raya agency, resolved in animated illustration rather than photorealism. We recreated the images honoring the sketches' look & feel —consistent character, checked logos, digital post— animated in 9:16 and reframed to 16:9 without losing the built animation.",
    },
    image: "/projects/kross.webp",
    logo: "/projects/logos/kross.png",
    videoUrl: "https://www.youtube.com/embed/ECQeaKUyFbs",
    gallery: [
      "/projects/kross/01.webp",
      "/projects/kross/02.webp",
      "/projects/kross/03.webp",
      "/projects/kross/04.webp",
      "/projects/kross/05.webp",
      "/projects/kross/06.webp",
      "/projects/kross/07.webp",
      "/projects/kross/08.webp",
      "/projects/kross/09.webp",
    ],
    featured: false,
    credits: {
      modality: "full",
      role: {
        es: ["Imágenes recreadas desde los bocetos", "Personaje consistente", "Revisión de logos", "Post digital", "Animación en 9:16", "Reframe a 16:9"],
        en: ["Images recreated from the sketches", "Consistent character", "Logo review", "Digital post", "Animation in 9:16", "Reframe to 16:9"],
      },
    },
  },
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
    credits: {
      modality: "team",
      role: {
        es: ["Tupper generado a partir del producto real", "Consistencia del personaje", "Animación en todas sus escenas", "Seguimiento de cámara y reemplazo por logo vectorial", "Integración de color", "Packshot de la línea"],
        en: ["Tupper character generated from the real product", "Character consistency", "Animation in every scene", "Camera tracking and vector logo replacement", "Color integration", "Product line packshot"],
      },
      scope: { es: "100% de las tomas de producto", en: "100% of the product shots" },
      team: [
        { es: "Productora interna de video — rodaje", en: "In-house video production — live-action shoot" },
      ],
    },
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
    credits: {
      modality: "team",
      role: {
        es: ["Generación de tomas", "Construcción del movimiento", "Edición sincronizada con la música"],
        en: ["Shot generation", "Motion design", "Editing synced to the music"],
      },
      team: [
        { es: "Estudio Pic-Nic — 8 imágenes base", en: "Estudio Pic-Nic — 8 base images" },
      ],
    },
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
    credits: {
      modality: "team",
      role: {
        es: ["Intro con las \"S\" apareciendo en distintas texturas", "Tomas de concierto generadas con IA como inserts del material filmado"],
        en: ["Intro with the \"S\" appearing in different textures", "AI-generated concert shots as inserts for the filmed footage"],
      },
      team: [
        { es: "UOIEA y Publicis Chile — comercial original", en: "UOIEA and Publicis Chile — original commercial" },
      ],
    },
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
    featured: false,
    credits: {
      modality: "team",
      role: {
        es: ["Generación de las tomas con el notebook que habla", "Animación", "Post para que el notebook hable", "Sonidos", "Másters con cierres"],
        en: ["Generation of the talking-notebook shots", "Animation", "Post to make the notebook talk", "Sound", "Masters with end cards"],
      },
      scope: { es: "5 tomas nuevas dentro de un comercial existente", en: "5 new shots inside an existing commercial" },
      team: [
        { es: "BBDO — comercial original", en: "BBDO — original commercial" },
      ],
    },
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
    featured: false,
    credits: {
      modality: "partner",
      role: {
        es: ["Personajes y locaciones regenerados", "Casting de la familia", "Animación", "Montaje", "Voces", "Pack final"],
        en: ["Characters and locations regenerated", "Family casting", "Animation", "Editing", "Voices", "Final pack shot"],
      },
      team: [
        { es: "IA Films — productora que nos contrató para llevar el proyecto", en: "IA Films — production company that hired us to lead the project" },
      ],
    },
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
    credits: {
      modality: "team",
      role: {
        es: ["Animación con IA", "Postproducción", "Armado final"],
        en: ["AI animation", "Post-production", "Final assembly"],
      },
      team: [
        { es: "Chinatown — imágenes base", en: "Chinatown — base images" },
      ],
    },
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
    credits: {
      modality: "team",
      role: {
        es: ["Animación de todas las imágenes", "Montaje", "Corrección de color", "Cierre"],
        en: ["Animation of every image", "Editing", "Color correction", "End card"],
      },
      team: [
        { es: "IA Films — imágenes", en: "IA Films — images" },
      ],
    },
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
    credits: {
      modality: "team",
      role: {
        es: ["Cuadro de cada punto de corte del rodaje", "Imágenes regeneradas para cada auto", "Animación de las secuencias fantásticas de cada auto"],
        en: ["Frame pulled at every cut point of the shoot", "Images regenerated for each car", "Animation of each car's fantasy sequence"],
      },
      scope: { es: "Los inserts de los autos", en: "The car inserts" },
      team: [
        { es: "Estudio Dios — rodaje", en: "Estudio Dios — live-action shoot" },
      ],
    },
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
    credits: {
      modality: "full",
      role: {
        es: ["Casting digital de personajes", "Imágenes con estilo y luz consistentes", "Animación", "Postproducción", "Pieza de 40\" y sus adaptaciones"],
        en: ["Digital character casting", "Images with consistent style and light", "Animation", "Post-production", "40\" spot and its adaptations"],
      },
    },
  },
];
