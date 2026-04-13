import type { BlogPost } from "@/components/cards/BlogCard";

export const blogPosts: (BlogPost & { locale: string })[] = [
  {
    slug: "seedance-2-bytedance-video-ia-escandalo-hollywood-benchmarks",
    title:
      "Seedance 2.0: el modelo de video de ByteDance que escandalizó a Hollywood y lidera los benchmarks mundiales",
    excerpt:
      "ByteDance lanzó Seedance 2.0 en febrero 2026. En 48 horas generó clips tan realistas que Hollywood reaccionó con cartas de cese. Hoy está disponible en CapCut con el Elo más alto del mundo en generación de video.",
    image: "/blog/seedance-2-bytedance.webp",
    date: "2026-04-01",
    readingTime: 9,
    locale: "es",
  },
  {
    slug: "seedance-2-bytedance-video-ai-hollywood-scandal-benchmarks",
    title:
      "Seedance 2.0: ByteDance's video model that scandalized Hollywood and leads global benchmarks",
    excerpt:
      "ByteDance launched Seedance 2.0 in February 2026. Within 48 hours it generated clips so realistic that Hollywood responded with cease-and-desist letters. Today it's available on CapCut with the world's highest Elo in video generation.",
    image: "/blog/seedance-2-bytedance.webp",
    date: "2026-04-01",
    readingTime: 9,
    locale: "en",
  },
  {
    slug: "tertulias-ia-universidad-mayor-comfyui-casting-digital",
    title: "Casting digital con ComfyUI en Tertulias IA – Universidad Mayor",
    excerpt:
      "Yutro fue parte de Tertulias IA en la Universidad Mayor: una jornada de 7 horas con 12 panelistas que exploró el estado actual de la inteligencia artificial creativa en Chile. Compartimos nuestro flujo de trabajo en ComfyUI para casting digital de personajes consistentes.",
    image: "/blog/tertulias-ia-umayor.webp",
    date: "2026-03-27",
    readingTime: 7,
    locale: "es",
  },
  {
    slug: "tertulias-ia-universidad-mayor-comfyui-digital-casting",
    title: "Digital Casting with ComfyUI at Tertulias IA – Universidad Mayor",
    excerpt:
      "Yutro was part of Tertulias IA at Universidad Mayor: a 7-hour event with 12 panelists exploring the current state of creative AI in Chile. We shared our ComfyUI workflow for consistent digital character casting.",
    image: "/blog/tertulias-ia-umayor.webp",
    date: "2026-03-27",
    readingTime: 7,
    locale: "en",
  },
];
