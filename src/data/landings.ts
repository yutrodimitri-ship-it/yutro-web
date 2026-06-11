type Locale = "es" | "en";

interface LandingCopy {
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  h1: string;
  intro: string[];
  includesTitle: string;
  includes: { title: string; desc: string }[];
  processTitle: string;
  process: { title: string; desc: string }[];
  faqTitle: string;
  faq: { q: string; a: string }[];
  projectsTitle: string;
  cta: string;
}

export interface ServiceLanding {
  slug: string;
  image: string;
  relatedProjects: string[];
  showInfluencers?: boolean;
  copy: Record<Locale, LandingCopy>;
}

export const serviceLandings: ServiceLanding[] = [
  {
    slug: "productora-ia",
    image: "/services/audiovisual.webp",
    relatedProjects: ["super-pollo", "santander", "frutos-de-chile"],
    copy: {
      es: {
        metaTitle: "Productora con IA en Chile | Yutro",
        metaDescription:
          "Productora audiovisual con inteligencia artificial en Santiago de Chile. Campañas para Super Pollo, Santander y Falabella combinando dirección de arte tradicional con IA generativa.",
        kicker: "Productora IA · Santiago de Chile",
        h1: "Productora con IA",
        intro: [
          "Yutro es una productora audiovisual con inteligencia artificial basada en Santiago de Chile. Combinamos más de 20 años de dirección de arte publicitaria —campañas para marcas como Samsung, Santander y Falabella— con pipelines de IA generativa que entregan piezas finales en días, no semanas.",
          "No somos una agencia que \"prueba\" herramientas de IA: operamos flujos de producción controlados y repetibles (ComfyUI, modelos entrenados con el ADN visual de cada marca) que cumplen los estándares de agencias como BBDO, Publicis y TBWA, con quienes ya hemos producido campañas reales emitidas en Chile.",
          "Si buscas una productora IA que entienda de publicidad —brief, dirección de arte, consistencia de marca y plazos— y no solo de prompts, esto es lo que hacemos todos los días.",
        ],
        includesTitle: "Qué hacemos como productora IA",
        includes: [
          { title: "Imágenes publicitarias hiperrealistas", desc: "Fotografía publicitaria generada y dirigida con IA que compite con producciones de alto presupuesto." },
          { title: "Video y animación con IA", desc: "Spots, animáticas y piezas para redes combinando rodaje real con activos generados." },
          { title: "Consistencia visual de marca", desc: "Entrenamos modelos con el ADN visual de tu marca: personajes, productos y escenarios siempre reconocibles." },
          { title: "Postproducción y VFX", desc: "Reemplazo de personajes, extensión de entornos, color grading y composición multicapa." },
        ],
        processTitle: "Cómo trabajamos",
        process: [
          { title: "Brief y dirección", desc: "Partimos como cualquier productora seria: objetivo, referencias, guión y dirección de arte." },
          { title: "Exploración generativa", desc: "En días tienes decenas de caminos visuales concretos, no moodboards abstractos." },
          { title: "Producción controlada", desc: "Flujos repetibles en ComfyUI con control de identidad, pose, luz y composición." },
          { title: "Postproducción y entrega", desc: "Retoque, color y masterización en los formatos que tu plan de medios necesita." },
        ],
        faqTitle: "Preguntas frecuentes",
        faq: [
          { q: "¿Qué diferencia a una productora con IA de una tradicional?", a: "La velocidad y el costo de iteración: exploramos decenas de caminos visuales en días y producimos piezas finales sin sesiones de foto o rodajes completos. La dirección de arte, el control de calidad y la atención al brief siguen siendo los de una productora tradicional." },
          { q: "¿Cuánto cuesta producir con IA?", a: "Depende del alcance, pero típicamente una fracción de una producción tradicional equivalente, porque eliminamos parte de los costos de rodaje, locaciones y casting. Enviamos cotización en 48 horas con el brief sobre la mesa." },
          { q: "¿Trabajan con agencias?", a: "Sí, gran parte de nuestro trabajo es para agencias (BBDO, Publicis, TBWA, entre otras) que necesitan un partner de producción IA confiable para sus clientes." },
          { q: "¿El resultado se nota \"hecho con IA\"?", a: "No, ese es justamente nuestro estándar: piezas indistinguibles de una producción fotográfica o audiovisual de alto presupuesto, con consistencia de marca verificada antes de entregar." },
        ],
        projectsTitle: "Campañas reales producidas con IA",
        cta: "Cuéntanos tu proyecto",
      },
      en: {
        metaTitle: "AI Production Company in Chile | Yutro",
        metaDescription:
          "AI-powered audiovisual production company in Santiago, Chile. Campaigns for Super Pollo, Santander and Falabella combining traditional art direction with generative AI.",
        kicker: "AI Production · Santiago, Chile",
        h1: "AI Production Company",
        intro: [
          "Yutro is an AI-powered audiovisual production company based in Santiago, Chile. We combine 20+ years of advertising art direction —campaigns for brands like Samsung, Santander and Falabella— with generative AI pipelines that deliver final pieces in days, not weeks.",
          "We're not an agency \"experimenting\" with AI tools: we run controlled, repeatable production workflows (ComfyUI, models trained on each brand's visual DNA) that meet the standards of agencies like BBDO, Publicis and TBWA, with whom we've already produced real campaigns aired in Chile.",
          "If you're looking for an AI production partner that understands advertising —briefs, art direction, brand consistency and deadlines— and not just prompts, this is what we do every day.",
        ],
        includesTitle: "What we do as an AI production company",
        includes: [
          { title: "Hyperrealistic advertising imagery", desc: "AI-directed advertising photography that competes with high-budget productions." },
          { title: "AI video & animation", desc: "Spots, animatics and social pieces combining live action with generated assets." },
          { title: "Brand visual consistency", desc: "We train models on your brand's visual DNA: characters, products and settings always recognizable." },
          { title: "Post-production & VFX", desc: "Character replacement, environment extension, color grading and multi-layer compositing." },
        ],
        processTitle: "How we work",
        process: [
          { title: "Brief & direction", desc: "We start like any serious production company: objective, references, script and art direction." },
          { title: "Generative exploration", desc: "Within days you have dozens of concrete visual directions, not abstract moodboards." },
          { title: "Controlled production", desc: "Repeatable ComfyUI workflows with control over identity, pose, light and composition." },
          { title: "Post & delivery", desc: "Retouching, color and mastering in every format your media plan needs." },
        ],
        faqTitle: "Frequently asked questions",
        faq: [
          { q: "How is an AI production company different from a traditional one?", a: "Iteration speed and cost: we explore dozens of visual directions in days and produce final pieces without full photo shoots. Art direction, quality control and brief discipline remain those of a traditional production house." },
          { q: "How much does AI production cost?", a: "It depends on scope, but typically a fraction of an equivalent traditional production, since we remove much of the shoot, location and casting costs. We quote within 48 hours of receiving a brief." },
          { q: "Do you work with agencies?", a: "Yes — much of our work is for agencies (BBDO, Publicis, TBWA, among others) that need a reliable AI production partner for their clients." },
          { q: "Will the result look \"AI-made\"?", a: "No — that's precisely our standard: pieces indistinguishable from high-budget photography or film, with brand consistency verified before delivery." },
        ],
        projectsTitle: "Real campaigns produced with AI",
        cta: "Tell us about your project",
      },
    },
  },
  {
    slug: "comerciales-con-ia",
    image: "/services/postproduction.webp",
    relatedProjects: ["super-pollo", "paris-electro", "sprim"],
    copy: {
      es: {
        metaTitle: "Comerciales con IA: spots publicitarios generados | Yutro",
        metaDescription:
          "Producimos comerciales con inteligencia artificial para TV y redes: spots para Super Pollo (BBDO), Paris y Sprim. Calidad broadcast en una fracción del tiempo y costo.",
        kicker: "Comerciales IA",
        h1: "Comerciales con IA",
        intro: [
          "Producimos comerciales con inteligencia artificial que ya se han emitido en Chile para marcas como Super Pollo, Paris y Sprim, trabajando junto a agencias como BBDO y TBWA. No son demos ni experimentos: son spots reales aprobados por marcas reales.",
          "Un comercial con IA bien hecho no significa renunciar al rodaje: significa decidir qué se rueda y qué se genera. Personajes imposibles, mundos completos, productos en escenarios que no existen — todo con la consistencia y el acabado que exige la pauta de TV y digital.",
          "El resultado: más versiones, más formatos y más ideas testeadas, con presupuestos que una producción tradicional no puede tocar.",
        ],
        includesTitle: "Qué incluye un comercial con IA",
        includes: [
          { title: "Desarrollo de personajes", desc: "Personajes de marca consistentes en cada plano, pose y emoción — como el mundo de Super Pollo." },
          { title: "Mundos y escenarios generados", desc: "Locaciones imposibles o carísimas, generadas con dirección de fotografía cinematográfica." },
          { title: "Híbrido rodaje + IA", desc: "Integramos material rodado con activos generados sin costuras visibles." },
          { title: "Versiones y formatos", desc: "Del spot de 30s a todos los cutdowns y formatos verticales para redes, sin re-rodar." },
        ],
        processTitle: "Del guión al aire",
        process: [
          { title: "Guión y storyboard", desc: "Animática generada con IA en días: el cliente ve el comercial antes de aprobar producción." },
          { title: "Casting y diseño visual", desc: "Exploración de personajes, estilos y paletas con decenas de opciones concretas." },
          { title: "Producción", desc: "Generación controlada plano a plano, con rodaje real donde aporta valor." },
          { title: "Post y entrega broadcast", desc: "Color, sonido y masterización lista para TV y plataformas digitales." },
        ],
        faqTitle: "Preguntas frecuentes",
        faq: [
          { q: "¿Un comercial con IA sirve para TV abierta?", a: "Sí. Hemos producido spots emitidos en TV chilena. La clave es el control de calidad: consistencia de personajes, resolución broadcast y acabado de postproducción profesional." },
          { q: "¿Cuánto se ahorra frente a un comercial tradicional?", a: "Depende del proyecto, pero al eliminar o reducir rodaje, locaciones, casting y viajes, el ahorro suele ser significativo — y el tiempo de producción se mide en semanas, no meses." },
          { q: "¿Pueden trabajar con nuestra agencia creativa?", a: "Es nuestro caso más común: la agencia trae la idea y nosotros somos el partner de producción IA, integrados a su flujo de aprobaciones." },
          { q: "¿Qué pasa con los derechos de imagen?", a: "Los personajes generados no tienen derechos de imagen de terceros ni caducidad de cesión: tu marca es dueña del personaje y puede usarlo indefinidamente." },
        ],
        projectsTitle: "Comerciales que ya están al aire",
        cta: "Cotiza tu comercial",
      },
      en: {
        metaTitle: "AI Commercials: Generated Ad Spots | Yutro",
        metaDescription:
          "We produce AI commercials for TV and social: spots for Super Pollo (BBDO), Paris and Sprim. Broadcast quality at a fraction of the time and cost.",
        kicker: "AI Commercials",
        h1: "AI Commercials",
        intro: [
          "We produce AI commercials that have already aired in Chile for brands like Super Pollo, Paris and Sprim, working with agencies such as BBDO and TBWA. These aren't demos or experiments: they're real spots approved by real brands.",
          "A well-made AI commercial doesn't mean giving up the shoot: it means deciding what gets filmed and what gets generated. Impossible characters, entire worlds, products in places that don't exist — all with the consistency and finish that TV and digital media demand.",
          "The result: more versions, more formats and more ideas tested, on budgets a traditional production can't touch.",
        ],
        includesTitle: "What an AI commercial includes",
        includes: [
          { title: "Character development", desc: "Brand characters consistent across every shot, pose and emotion — like the Super Pollo universe." },
          { title: "Generated worlds & sets", desc: "Impossible or prohibitively expensive locations, generated with cinematic photography direction." },
          { title: "Hybrid live action + AI", desc: "We integrate filmed footage with generated assets, seamlessly." },
          { title: "Versions & formats", desc: "From the 30s spot to every cutdown and vertical format — without reshooting." },
        ],
        processTitle: "From script to air",
        process: [
          { title: "Script & storyboard", desc: "AI-generated animatic in days: the client sees the commercial before approving production." },
          { title: "Casting & visual design", desc: "Character, style and palette exploration with dozens of concrete options." },
          { title: "Production", desc: "Controlled shot-by-shot generation, with live action where it adds value." },
          { title: "Post & broadcast delivery", desc: "Color, sound and mastering ready for TV and digital platforms." },
        ],
        faqTitle: "Frequently asked questions",
        faq: [
          { q: "Can an AI commercial run on broadcast TV?", a: "Yes. We've produced spots aired on Chilean TV. The key is quality control: character consistency, broadcast resolution and professional post-production finish." },
          { q: "How much does it save versus a traditional commercial?", a: "It depends on the project, but by removing or reducing shoots, locations, casting and travel, savings are usually significant — and production time is measured in weeks, not months." },
          { q: "Can you work with our creative agency?", a: "That's our most common setup: the agency brings the idea and we act as the AI production partner, integrated into their approval flow." },
          { q: "What about image rights?", a: "Generated characters carry no third-party image rights or license expirations: your brand owns the character and can use it indefinitely." },
        ],
        projectsTitle: "Commercials already on air",
        cta: "Quote your commercial",
      },
    },
  },
  {
    slug: "produccion-audiovisual-ia",
    image: "/services/animation2.webp",
    relatedProjects: ["santander", "mochilas-head", "bburago-autos"],
    copy: {
      es: {
        metaTitle: "Producción Audiovisual con IA en Chile | Yutro",
        metaDescription:
          "Producción audiovisual con inteligencia artificial: video, animación, 3D y motion graphics para marcas y agencias en Chile. Proyectos para Santander, Head y Copec-Mobil.",
        kicker: "Producción audiovisual · IA generativa",
        h1: "Producción Audiovisual con IA",
        intro: [
          "Hacemos producción audiovisual con inteligencia artificial para marcas y agencias: video, animación, 3D y motion graphics donde la IA generativa multiplica lo que un presupuesto puede lograr. Proyectos reales para Santander, Mochilas Head y Copec-Mobil nos respaldan.",
          "Nuestro equipo viene de la producción audiovisual tradicional —Cinema 4D, Blender, After Effects, dirección de fotografía— y eso se nota: la IA es una herramienta más del pipeline, no un atajo que sacrifica calidad. Storyboards, animáticas, gradación de color y entrega en formatos broadcast siguen siendo parte del proceso.",
          "Si tu marca necesita más contenido audiovisual, más rápido y sin sacrificar nivel cinematográfico, este es el modelo de producción que lo hace posible.",
        ],
        includesTitle: "Capacidades de producción",
        includes: [
          { title: "Video con IA generativa", desc: "Piezas completas o híbridas con rodaje, desde spots hasta contenido para redes." },
          { title: "Animación y storytelling", desc: "Del guión al frame final: narrativas visuales con motion design e IA." },
          { title: "3D y motion graphics", desc: "Modelado y animación en Cinema 4D y Blender con enfoque cinematográfico." },
          { title: "Música y locución", desc: "Bandas sonoras y voces generadas o dirigidas, como el caso Santander Smusic." },
        ],
        processTitle: "Nuestro pipeline",
        process: [
          { title: "Preproducción acelerada", desc: "Guión, storyboard y animática con IA: decisiones visuales concretas desde la primera semana." },
          { title: "Diseño de mundo", desc: "Estilos, personajes y escenarios definidos y bloqueados antes de producir." },
          { title: "Producción híbrida", desc: "Generación + 3D + rodaje según lo que cada plano necesita." },
          { title: "Postproducción completa", desc: "Composición, VFX, color y masterización en todos los formatos." },
        ],
        faqTitle: "Preguntas frecuentes",
        faq: [
          { q: "¿Qué tipo de piezas pueden producir?", a: "Spots publicitarios, videos de producto, contenido para redes, animación de personajes, videoclips y piezas corporativas — en cualquier mezcla de IA, 3D y rodaje real." },
          { q: "¿En qué se diferencia su producción audiovisual de una productora tradicional?", a: "En velocidad y capacidad de iteración. La preproducción que antes tomaba un mes (storyboard, animática, scouting visual) la resolvemos en días, y muchos planos que requerían rodaje hoy se generan." },
          { q: "¿Entregan en formatos broadcast?", a: "Sí: masterizamos para TV, cine digital, DOOH y todas las plataformas digitales, con los estándares de color y sonido de cada medio." },
          { q: "¿Trabajan proyectos fuera de Chile?", a: "Sí, trabajamos de forma remota con clientes y agencias de toda Latinoamérica y España; la producción con IA hace que la distancia no sea un costo." },
        ],
        projectsTitle: "Proyectos audiovisuales recientes",
        cta: "Hablemos de tu pieza",
      },
      en: {
        metaTitle: "AI Audiovisual Production in Chile | Yutro",
        metaDescription:
          "AI audiovisual production: video, animation, 3D and motion graphics for brands and agencies in Chile. Projects for Santander, Head and Copec-Mobil.",
        kicker: "Audiovisual production · Generative AI",
        h1: "AI Audiovisual Production",
        intro: [
          "We deliver AI-powered audiovisual production for brands and agencies: video, animation, 3D and motion graphics where generative AI multiplies what a budget can achieve. Real projects for Santander, Head Backpacks and Copec-Mobil back us up.",
          "Our team comes from traditional audiovisual production —Cinema 4D, Blender, After Effects, cinematography— and it shows: AI is one more tool in the pipeline, not a shortcut that sacrifices quality. Storyboards, animatics, color grading and broadcast-ready delivery remain part of the process.",
          "If your brand needs more audiovisual content, faster, without giving up cinematic quality, this is the production model that makes it possible.",
        ],
        includesTitle: "Production capabilities",
        includes: [
          { title: "Generative AI video", desc: "Fully generated or hybrid pieces, from spots to social content." },
          { title: "Animation & storytelling", desc: "From script to final frame: visual narratives with motion design and AI." },
          { title: "3D & motion graphics", desc: "Modeling and animation in Cinema 4D and Blender with a cinematic approach." },
          { title: "Music & voiceover", desc: "Generated or directed soundtracks and voices, like the Santander Smusic case." },
        ],
        processTitle: "Our pipeline",
        process: [
          { title: "Accelerated pre-production", desc: "Script, storyboard and animatic with AI: concrete visual decisions from week one." },
          { title: "World design", desc: "Styles, characters and settings defined and locked before production." },
          { title: "Hybrid production", desc: "Generation + 3D + live action, depending on what each shot needs." },
          { title: "Full post-production", desc: "Compositing, VFX, color and mastering across all formats." },
        ],
        faqTitle: "Frequently asked questions",
        faq: [
          { q: "What kind of pieces can you produce?", a: "Ad spots, product videos, social content, character animation, music videos and corporate pieces — in any mix of AI, 3D and live action." },
          { q: "How is this different from a traditional production company?", a: "Speed and iteration capacity. Pre-production that used to take a month (storyboard, animatic, visual scouting) is resolved in days, and many shots that required filming are now generated." },
          { q: "Do you deliver broadcast formats?", a: "Yes: we master for TV, digital cinema, DOOH and all digital platforms, meeting each medium's color and sound standards." },
          { q: "Do you take projects outside Chile?", a: "Yes, we work remotely with clients and agencies across Latin America and Spain; AI production makes distance cost nothing." },
        ],
        projectsTitle: "Recent audiovisual projects",
        cta: "Let's talk about your piece",
      },
    },
  },
  {
    slug: "avatares-ia",
    image: "/services/brand.webp",
    relatedProjects: ["zapatillas-falabella"],
    showInfluencers: true,
    copy: {
      es: {
        metaTitle: "Avatares IA e Influencers Virtuales para marcas | Yutro",
        metaDescription:
          "Creamos avatares con IA y talento sintético para marcas: influencers virtuales con identidad consistente, listos para campañas, e-commerce y redes sociales.",
        kicker: "Avatares · Talento sintético",
        h1: "Avatares IA y Talento Sintético",
        intro: [
          "Creamos avatares con inteligencia artificial: personajes digitales con identidad visual consistente que tu marca puede usar en campañas, redes sociales, e-commerce y atención al cliente — sin derechos de imagen, sin caducidad de contratos y sin sesiones de foto.",
          "Nuestros avatares no son caras genéricas: cada uno tiene rasgos, vestuario, entorno y personalidad definidos, y se mantiene reconocible en cientos de imágenes distintas gracias a nuestro flujo de consistencia de identidad (la misma tecnología que presentamos en Tertulias IA – Universidad Mayor).",
          "Camila, Antonia y Sofi —nuestras influencers virtuales propias— son la demo en vivo: galerías completas con cambio de outfit, locación y situación, manteniendo siempre la misma identidad.",
        ],
        includesTitle: "Qué incluye un avatar de marca",
        includes: [
          { title: "Diseño de identidad", desc: "Rasgos, edad, estilo y personalidad definidos junto a tu marca, con exploración de decenas de opciones." },
          { title: "Banco de contenido", desc: "Galerías de imágenes en distintas situaciones, outfits y locaciones, listas para calendario de redes." },
          { title: "Cambio de vestuario y escenario", desc: "El mismo avatar con la ropa de tu catálogo o en el contexto de cada campaña." },
          { title: "Propiedad total", desc: "El avatar es de tu marca: sin derechos de terceros, sin renovaciones, sin riesgo reputacional." },
        ],
        processTitle: "De brief a avatar activo",
        process: [
          { title: "Casting digital", desc: "Generamos decenas de candidatos y refinamos contigo hasta dar con la identidad correcta." },
          { title: "Anclaje de identidad", desc: "Entrenamos el flujo para que el personaje sea consistente en cualquier pose, luz o contexto." },
          { title: "Producción de contenido", desc: "Primer banco de imágenes y videos según tu calendario de publicación." },
          { title: "Operación continua", desc: "Contenido mensual recurrente: el avatar vive, publica y vende." },
        ],
        faqTitle: "Preguntas frecuentes",
        faq: [
          { q: "¿Para qué sirve un influencer virtual?", a: "Para lo mismo que uno real —campañas, contenido de marca, lanzamientos— pero con control total del mensaje, disponibilidad infinita y sin riesgo de escándalos o renegociación de contratos. Casos como Aitana López en España facturan miles de dólares mensuales en colaboraciones." },
          { q: "¿El avatar puede usar la ropa de mi catálogo?", a: "Sí — es uno de los usos más potentes: vestimos el avatar con tus productos reales para e-commerce y campañas, manteniendo el calce y los detalles del producto fieles a la prenda real." },
          { q: "¿Cuánto tarda crear un avatar?", a: "El casting digital y el anclaje de identidad toman entre 2 y 4 semanas según la complejidad; después, el contenido se produce a ritmo de calendario editorial." },
          { q: "¿Quién es dueño del avatar?", a: "Tu marca. Entregamos el personaje con su identidad anclada y los derechos completos de uso, sin licencias periódicas." },
        ],
        projectsTitle: "Nuestro talento sintético",
        cta: "Quiero un avatar para mi marca",
      },
      en: {
        metaTitle: "AI Avatars & Virtual Influencers for Brands | Yutro",
        metaDescription:
          "We create AI avatars and synthetic talent for brands: virtual influencers with consistent identity, ready for campaigns, e-commerce and social media.",
        kicker: "Avatars · Synthetic talent",
        h1: "AI Avatars & Synthetic Talent",
        intro: [
          "We create AI avatars: digital characters with consistent visual identity that your brand can use across campaigns, social media, e-commerce and customer experience — with no image rights, no contract expirations and no photo shoots.",
          "Our avatars aren't generic faces: each one has defined features, wardrobe, environment and personality, and stays recognizable across hundreds of images thanks to our identity-consistency workflow (the same technology we presented at Tertulias IA – Universidad Mayor).",
          "Camila, Antonia and Sofi —our own virtual influencers— are the live demo: full galleries with outfit, location and situation changes, always keeping the same identity.",
        ],
        includesTitle: "What a brand avatar includes",
        includes: [
          { title: "Identity design", desc: "Features, age, style and personality defined with your brand, exploring dozens of options." },
          { title: "Content bank", desc: "Image galleries across situations, outfits and locations, ready for your social calendar." },
          { title: "Outfit & scene changes", desc: "The same avatar wearing your catalog or placed in each campaign's context." },
          { title: "Full ownership", desc: "The avatar belongs to your brand: no third-party rights, no renewals, no reputational risk." },
        ],
        processTitle: "From brief to active avatar",
        process: [
          { title: "Digital casting", desc: "We generate dozens of candidates and refine with you until the identity is right." },
          { title: "Identity anchoring", desc: "We train the workflow so the character stays consistent in any pose, light or context." },
          { title: "Content production", desc: "First bank of images and videos according to your publishing calendar." },
          { title: "Ongoing operation", desc: "Recurring monthly content: the avatar lives, posts and sells." },
        ],
        faqTitle: "Frequently asked questions",
        faq: [
          { q: "What is a virtual influencer for?", a: "The same things a real one is —campaigns, branded content, launches— but with total message control, infinite availability and no scandal or contract-renewal risk. Cases like Aitana López in Spain earn thousands of dollars monthly in collaborations." },
          { q: "Can the avatar wear my catalog?", a: "Yes — it's one of the most powerful uses: we dress the avatar in your real products for e-commerce and campaigns, keeping fit and product details faithful to the real garment." },
          { q: "How long does it take to create an avatar?", a: "Digital casting and identity anchoring take 2-4 weeks depending on complexity; after that, content is produced at editorial-calendar pace." },
          { q: "Who owns the avatar?", a: "Your brand. We deliver the character with its anchored identity and full usage rights, no recurring licenses." },
        ],
        projectsTitle: "Our synthetic talent",
        cta: "I want an avatar for my brand",
      },
    },
  },
  {
    slug: "casting-digital-ia",
    image: "/services/hyperrealistic.webp",
    relatedProjects: ["frutos-de-chile", "super-pollo"],
    showInfluencers: true,
    copy: {
      es: {
        metaTitle: "Casting IA: casting digital de personajes | Yutro",
        metaDescription:
          "Casting digital con IA: explora 40 perfiles de personaje en una tarde y llega a la reunión con opciones concretas. El flujo que presentamos en Tertulias IA – Universidad Mayor.",
        kicker: "Casting digital · ComfyUI",
        h1: "Casting Digital con IA",
        intro: [
          "El casting IA abre una etapa de preproducción que antes no existía: en una tarde puedes explorar 40 perfiles de personaje distintos y llegar a la reunión con el cliente con opciones concretas, no con ideas. Es el flujo de trabajo que presentamos en Tertulias IA, el encuentro de IA creativa de la Universidad Mayor.",
          "Técnicamente, combinamos IP-Adapter, ControlNet y prompting estructurado en ComfyUI para anclar la identidad visual de cada candidato: el personaje elegido puede cambiar de ropa, fondo, iluminación y pose manteniendo coherencia reconocible en toda la campaña.",
          "El casting digital no reemplaza al casting real cuando se rueda con actores — lo que hace es eliminar semanas de incertidumbre visual en proyectos generados o híbridos, y dar a las marcas personajes propios sin derechos de imagen.",
        ],
        includesTitle: "Qué resuelve el casting IA",
        includes: [
          { title: "Exploración masiva", desc: "Decenas de perfiles de personaje en días: edades, estilos, etnias y actitudes para decidir con evidencia." },
          { title: "Identidad anclada", desc: "El candidato elegido se mantiene consistente en cualquier plano, outfit o locación." },
          { title: "Validación previa", desc: "Batería de pruebas en distintos ángulos, contextos y luces antes de aprobar producción." },
          { title: "Personajes sin derechos", desc: "El personaje es de la marca: sin cesiones de imagen, exclusividades ni renovaciones." },
        ],
        processTitle: "Los tres momentos del flujo",
        process: [
          { title: "Definición de identidad", desc: "Referencias reales o generadas para fijar rasgos: estructura facial, colorimetría, cabello y expresión base." },
          { title: "Generación con ancla", desc: "IP-Adapter conecta esa identidad a nuevas generaciones: ropa, fondo y pose cambian, la persona no." },
          { title: "Validación de consistencia", desc: "Pruebas en distintos ángulos y luces para medir cuánto se sostiene la identidad antes de producir." },
          { title: "Entrega a producción", desc: "El personaje validado entra a la campaña: imágenes, video o banco de contenido continuo." },
        ],
        faqTitle: "Preguntas frecuentes",
        faq: [
          { q: "¿Qué es el casting digital con IA?", a: "Es el proceso de explorar, seleccionar y fijar personajes generados con IA para una campaña, igual que un casting tradicional pero con candidatos sintéticos: más opciones, más rápido y sin derechos de imagen." },
          { q: "¿Reemplaza al casting de actores reales?", a: "No necesariamente: lo complementa. En producciones generadas o híbridas elimina el casting físico; en rodajes tradicionales sirve para pre-visualizar y decidir el perfil antes de buscar al actor." },
          { q: "¿Qué tan consistente queda el personaje?", a: "Validamos cada personaje con baterías de prueba en distintos ángulos, luces y contextos antes de aprobarlo. Si la identidad no se sostiene, no entra a producción." },
          { q: "¿Esto sirve para e-commerce y moda?", a: "Sí: el mismo flujo permite vestir un personaje consistente con prendas reales de catálogo, eliminando sesiones de foto por cada temporada." },
        ],
        projectsTitle: "Personajes creados con este flujo",
        cta: "Agenda un casting digital",
      },
      en: {
        metaTitle: "AI Casting: Digital Character Casting | Yutro",
        metaDescription:
          "Digital casting with AI: explore 40 character profiles in an afternoon and arrive at the meeting with concrete options. The workflow we presented at Tertulias IA – Universidad Mayor.",
        kicker: "Digital casting · ComfyUI",
        h1: "Digital Casting with AI",
        intro: [
          "AI casting opens a pre-production stage that didn't exist before: in one afternoon you can explore 40 different character profiles and arrive at the client meeting with concrete options, not just ideas. It's the workflow we presented at Tertulias IA, Universidad Mayor's creative AI forum.",
          "Technically, we combine IP-Adapter, ControlNet and structured prompting in ComfyUI to anchor each candidate's visual identity: the chosen character can change outfit, background, lighting and pose while staying recognizably coherent across the whole campaign.",
          "Digital casting doesn't replace real casting when filming with actors — what it does is remove weeks of visual uncertainty in generated or hybrid projects, and give brands proprietary characters with no image rights attached.",
        ],
        includesTitle: "What AI casting solves",
        includes: [
          { title: "Massive exploration", desc: "Dozens of character profiles in days: ages, styles, ethnicities and attitudes to decide with evidence." },
          { title: "Anchored identity", desc: "The chosen candidate stays consistent in any shot, outfit or location." },
          { title: "Pre-validation", desc: "Test batteries across angles, contexts and lighting before approving production." },
          { title: "Rights-free characters", desc: "The character belongs to the brand: no image releases, exclusivities or renewals." },
        ],
        processTitle: "The three stages of the workflow",
        process: [
          { title: "Identity definition", desc: "Real or generated references to lock features: facial structure, colorimetry, hair and base expression." },
          { title: "Anchored generation", desc: "IP-Adapter connects that identity to new generations: outfit, background and pose change — the person doesn't." },
          { title: "Consistency validation", desc: "Tests across angles and lighting to measure how well the identity holds before production." },
          { title: "Handoff to production", desc: "The validated character enters the campaign: images, video or an ongoing content bank." },
        ],
        faqTitle: "Frequently asked questions",
        faq: [
          { q: "What is digital casting with AI?", a: "The process of exploring, selecting and locking AI-generated characters for a campaign — like a traditional casting but with synthetic candidates: more options, faster, and no image rights." },
          { q: "Does it replace casting real actors?", a: "Not necessarily: it complements it. In generated or hybrid productions it removes physical casting; in traditional shoots it helps pre-visualize and decide the profile before searching for the actor." },
          { q: "How consistent is the character?", a: "We validate every character with test batteries across angles, lighting and contexts before approval. If the identity doesn't hold, it doesn't go to production." },
          { q: "Does this work for e-commerce and fashion?", a: "Yes: the same workflow lets us dress a consistent character in real catalog garments, removing photo shoots for every season." },
        ],
        projectsTitle: "Characters created with this workflow",
        cta: "Book a digital casting",
      },
    },
  },
];
