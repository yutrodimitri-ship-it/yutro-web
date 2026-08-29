import { projects } from "@/data/projects";
import { blogPosts } from "@/data/blog";
import { serviceLandings } from "@/data/landings";

/**
 * Markdown para agentes (acceptmarkdown.com).
 *
 * Cualquier página pública del sitio se puede pedir con
 * `Accept: text/markdown` y el middleware la reescribe a /md/<ruta>,
 * que responde con el markdown generado acá a partir de las mismas
 * fuentes de datos que renderizan el HTML (projects.ts, blog.ts,
 * landings.ts). Sin JS, sin app shell: solo contenido.
 */

const SITE_URL = "https://www.yutro.cl";

export type MarkdownResult = {
  markdown: string;
  status: 200 | 404;
};

/** ¿El header Accept pide markdown explícitamente? */
export function wantsMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  return /\btext\/markdown\b/i.test(accept);
}

function footer(locale: "es" | "en"): string {
  return locale === "es"
    ? `\n---\n\nYUTRO. — Productora audiovisual con IA generativa (VRYP Art & AI Solutions SpA, Santiago de Chile).\nContacto: contacto@yutro.cl · Instagram: [@yutro_ia](https://www.instagram.com/yutro_ia/)\nGuía para agentes: [llms.txt](${SITE_URL}/llms.txt) · Mapa del sitio: [sitemap.xml](${SITE_URL}/sitemap.xml)\n`
    : `\n---\n\nYUTRO. — Generative-AI audiovisual production studio (VRYP Art & AI Solutions SpA, Santiago, Chile).\nContact: contacto@yutro.cl · Instagram: [@yutro_ia](https://www.instagram.com/yutro_ia/)\nAgent guide: [llms.txt](${SITE_URL}/llms.txt) · Site map: [sitemap.xml](${SITE_URL}/sitemap.xml)\n`;
}

function homeMarkdown(locale: "es" | "en"): string {
  const featured = projects.slice(0, 6);
  if (locale === "en") {
    return `# YUTRO. — We create with AI

> Audiovisual production powered by generative artificial intelligence. We deliver broadcast-ready commercials, e-commerce catalogs, AI casting and animation for brands and agencies.

## Services

- Hyper-realistic AI imagery
- Animation & storytelling
- AI audiovisual production
- 3D & motion graphics
- Post-production & FX
- Brand visual consistency

## Featured projects

${featured.map((p) => `- [${p.title}](${SITE_URL}/en/proyectos/${p.slug}): ${p.excerpt.en}`).join("\n")}

## Explore

- [Projects](${SITE_URL}/en/proyectos)
- [Production services](${SITE_URL}/en/produccion)
- [AI casting](${SITE_URL}/en/casting)
- [Studio / About](${SITE_URL}/en/estudio)
- [Blog](${SITE_URL}/en/blog)
- [Contact](${SITE_URL}/en/contacto)
${footer("en")}`;
  }
  return `# YUTRO. — Creamos con IA

> Producción audiovisual impulsada por inteligencia artificial generativa. Entregamos comerciales listos para emisión, catálogos e-commerce, casting IA y animación para marcas y agencias.

## Servicios

- Imágenes hiperrealistas con IA
- Animación & storytelling
- Producción audiovisual con IA
- 3D & motion graphics
- Postproducción & FX
- Consistencia visual de marca

## Proyectos destacados

${featured.map((p) => `- [${p.title}](${SITE_URL}/es/proyectos/${p.slug}): ${p.excerpt.es}`).join("\n")}

## Explorar

- [Proyectos](${SITE_URL}/es/proyectos)
- [Producción](${SITE_URL}/es/produccion)
- [Casting IA](${SITE_URL}/es/casting)
- [Estudio](${SITE_URL}/es/estudio)
- [Blog](${SITE_URL}/es/blog)
- [Contacto](${SITE_URL}/es/contacto)
${footer("es")}`;
}

function projectsIndexMarkdown(locale: "es" | "en"): string {
  const title = locale === "es" ? "Proyectos" : "Projects";
  const intro =
    locale === "es"
      ? "> Portafolio de campañas producidas con IA generativa para marcas y agencias. Cada caso detalla qué entregó el cliente y qué construyó YUTRO."
      : "> Portfolio of campaigns produced with generative AI for brands and agencies. Each case details what the client provided and what YUTRO built.";
  const list = projects
    .map(
      (p) =>
        `- [${p.title}](${SITE_URL}/${locale}/proyectos/${p.slug}) — ${p.client}${p.partners.length ? ` · ${p.partners.join(", ")}` : ""}: ${p.excerpt[locale]}`
    )
    .join("\n");
  return `# ${title} — YUTRO.\n\n${intro}\n\n${list}\n${footer(locale)}`;
}

function projectMarkdown(slug: string, locale: "es" | "en"): string | null {
  const p = projects.find((x) => x.slug === slug);
  if (!p) return null;
  const labels =
    locale === "es"
      ? { client: "Cliente", partners: "Partners", videos: "Videos", back: "Todos los proyectos" }
      : { client: "Client", partners: "Partners", videos: "Videos", back: "All projects" };
  const videos = Array.isArray(p.videoUrl) ? p.videoUrl : [p.videoUrl];
  return `# ${p.title}

> ${p.excerpt[locale]}

- **${labels.client}:** ${p.client}
${p.partners.length ? `- **${labels.partners}:** ${p.partners.join(", ")}\n` : ""}
${p.description[locale]}

## ${labels.videos}

${videos.filter(Boolean).map((v, i) => `- [Video ${i + 1}](${v})`).join("\n")}

[${labels.back}](${SITE_URL}/${locale}/proyectos)
${footer(locale)}`;
}

function productionIndexMarkdown(locale: "es" | "en"): string {
  const title = locale === "es" ? "Producción" : "Production";
  const list = serviceLandings
    .map((s) => {
      const c = s.copy[locale];
      return `- [${c.h1}](${SITE_URL}/${locale}/produccion/${s.slug}): ${c.metaDescription}`;
    })
    .join("\n");
  return `# ${title} — YUTRO.\n\n${list}\n${footer(locale)}`;
}

function productionLandingMarkdown(slug: string, locale: "es" | "en"): string | null {
  const s = serviceLandings.find((x) => x.slug === slug);
  if (!s) return null;
  const c = s.copy[locale];
  return `# ${c.h1}

> ${c.metaDescription}

${c.intro.join("\n\n")}

## ${c.includesTitle}

${c.includes.map((i) => `- **${i.title}:** ${i.desc}`).join("\n")}

## ${c.processTitle}

${c.process.map((pr, i) => `${i + 1}. **${pr.title}:** ${pr.desc}`).join("\n")}

## ${c.faqTitle}

${c.faq.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n")}
${footer(locale)}`;
}

function blogIndexMarkdown(locale: "es" | "en"): string {
  const posts = blogPosts.filter((b) => b.published && b.locale === locale);
  const title = "Blog — YUTRO.";
  const list = posts
    .map((b) => `- [${b.title}](${SITE_URL}/${locale}/blog/${b.slug}) (${b.date}): ${b.excerpt}`)
    .join("\n");
  return `# ${title}\n\n${list}\n${footer(locale)}`;
}

function estudioMarkdown(locale: "es" | "en"): string {
  if (locale === "en") {
    return `# Studio — About YUTRO.

> YUTRO. is the generative-AI audiovisual production studio of VRYP Art & AI Solutions SpA (Santiago, Chile). We work for brands and with agencies and production companies as their AI animation and production partner.

We have delivered on-air work for LATAM Airlines, Santander, Carozzi/Pomarola, Super Pollo, Soprole, Parque Arauco, Head, Kross, Falabella and more — commercials, e-commerce catalogs, AI casting and multi-format campaigns. Our workflow combines AI generation (image, video, lip sync) with traditional craft: After Effects assembly, camera tracking, sound design and color-safe delivery for broadcast.

- [Projects](${SITE_URL}/en/proyectos)
- [Contact](${SITE_URL}/en/contacto)
${footer("en")}`;
  }
  return `# Estudio — Sobre YUTRO.

> YUTRO. es la productora audiovisual con IA generativa de VRYP Art & AI Solutions SpA (Santiago de Chile). Trabajamos para marcas y junto a agencias y productoras como su partner de animación y producción con IA.

Hemos entregado piezas al aire para LATAM Airlines, Santander, Carozzi/Pomarola, Super Pollo, Soprole, Parque Arauco, Head, Kross, Falabella y más — comerciales, catálogos e-commerce, casting IA y campañas multiformato. Nuestro flujo combina generación IA (imagen, video, lip sync) con oficio tradicional: armado en After Effects, tracking de cámara, sonorización y entrega en alta para emisión.

- [Proyectos](${SITE_URL}/es/proyectos)
- [Contacto](${SITE_URL}/es/contacto)
${footer("es")}`;
}

function contactoMarkdown(locale: "es" | "en"): string {
  if (locale === "en") {
    return `# Contact — YUTRO.

> To brief a project, request a quote or ask about our AI production services:

- **Email:** contacto@yutro.cl
- **Phone:** +56 9 6247 9939 / +56 9 5100 8051
- **Instagram:** [@yutro_ia](https://www.instagram.com/yutro_ia/)
- **Web form:** ${SITE_URL}/en/contacto

Include the brand, the deliverables (formats and durations) and the deadline — we reply with scope and a quote.
${footer("en")}`;
  }
  return `# Contacto — YUTRO.

> Para levantar un proyecto, pedir una cotización o consultar por nuestros servicios de producción con IA:

- **Email:** contacto@yutro.cl
- **Teléfonos:** +56 9 6247 9939 / +56 9 5100 8051
- **Instagram:** [@yutro_ia](https://www.instagram.com/yutro_ia/)
- **Formulario web:** ${SITE_URL}/es/contacto

Incluye la marca, los entregables (formatos y duraciones) y el plazo — respondemos con alcance y cotización.
${footer("es")}`;
}

function privacidadMarkdown(locale: "es" | "en"): string {
  if (locale === "en") {
    return `# Privacy Policy — YUTRO.

> How VRYP Art & AI Solutions SpA ("YUTRO.") handles personal data on yutro.cl.

- **Data we collect:** only what you submit through our contact and casting-access forms (name, email, company, project notes).
- **Purpose:** answering your request and managing casting access. We do not sell or share personal data with third parties.
- **Cookies:** only functional session cookies for the private client area. No advertising trackers.
- **Analytics:** aggregated, anonymous traffic metrics.
- **Your rights:** request access, correction or deletion of your data at contacto@yutro.cl.

[Full policy](${SITE_URL}/en/privacidad)
${footer("en")}`;
  }
  return `# Política de Privacidad — YUTRO.

> Cómo VRYP Art & AI Solutions SpA ("YUTRO.") trata los datos personales en yutro.cl.

- **Datos que recolectamos:** solo lo que envías por los formularios de contacto y de acceso al casting (nombre, email, empresa, notas del proyecto).
- **Finalidad:** responder tu solicitud y gestionar el acceso al casting. No vendemos ni compartimos datos personales con terceros.
- **Cookies:** solo cookies funcionales de sesión para el área privada de clientes. Sin trackers publicitarios.
- **Analítica:** métricas de tráfico agregadas y anónimas.
- **Tus derechos:** solicita acceso, rectificación o eliminación de tus datos en contacto@yutro.cl.

[Política completa](${SITE_URL}/es/privacidad)
${footer("es")}`;
}

function notFoundMarkdown(path: string): string {
  return `# 404 — Not found

> \`${path}\` does not exist on yutro.cl. / La ruta \`${path}\` no existe en yutro.cl.

Where to look next / Dónde buscar:

- [Home](${SITE_URL}/es) · [English](${SITE_URL}/en)
- [Proyectos / Projects](${SITE_URL}/es/proyectos)
- [Producción / Production services](${SITE_URL}/es/produccion)
- [Casting IA](${SITE_URL}/es/casting)
- [Estudio / About](${SITE_URL}/es/estudio)
- [Blog](${SITE_URL}/es/blog)
- [Contacto / Contact](${SITE_URL}/es/contacto)
- Agent guide: [llms.txt](${SITE_URL}/llms.txt)
- Site map: [sitemap.xml](${SITE_URL}/sitemap.xml)
`;
}

/**
 * Resuelve una ruta pública a su versión markdown.
 * Acepta rutas con o sin prefijo de locale (/es, /en).
 */
export function getMarkdownForPath(pathname: string): MarkdownResult {
  const clean = pathname.replace(/\/+$/, "") || "/";
  const m = clean.match(/^\/(es|en)(\/.*)?$/);
  const locale: "es" | "en" = m ? (m[1] as "es" | "en") : "es";
  const rest = m ? m[2] || "/" : clean;
  const segments = rest.split("/").filter(Boolean);

  const ok = (markdown: string): MarkdownResult => ({ markdown, status: 200 });

  if (segments.length === 0) return ok(homeMarkdown(locale));

  const [head, sub] = segments;

  if (head === "proyectos") {
    if (!sub) return ok(projectsIndexMarkdown(locale));
    const md = projectMarkdown(sub, locale);
    if (md) return ok(md);
  }
  if (head === "produccion" || head === "servicios") {
    if (!sub) return ok(productionIndexMarkdown(locale));
    const md = productionLandingMarkdown(sub, locale);
    if (md) return ok(md);
  }
  if (head === "blog" && !sub) return ok(blogIndexMarkdown(locale));
  if (head === "blog" && sub) {
    const post = blogPosts.find((b) => b.slug === sub && b.published);
    if (post) {
      return ok(
        `# ${post.title}\n\n> ${post.excerpt}\n\n(${post.date} · ${post.readingTime} min)\n\n[Leer el artículo completo](${SITE_URL}/${locale}/blog/${post.slug})\n${footer(locale)}`
      );
    }
  }
  if (head === "estudio" || head === "about") return ok(estudioMarkdown(locale));
  if (head === "contacto" || head === "contact") return ok(contactoMarkdown(locale));
  if (head === "privacidad" || head === "privacy") return ok(privacidadMarkdown(locale));
  if (head === "casting") {
    return ok(
      locale === "es"
        ? `# Casting IA — YUTRO.\n\n> Elenco de talentos generados con IA para campañas de marcas: rostros consistentes, disponibles en múltiples poses y formatos, sin restricciones de derechos de imagen tradicionales.\n\n- [Ver el casting](${SITE_URL}/es/casting)\n- [Talentos destacados](${SITE_URL}/es/casting/featured)\n${footer("es")}`
        : `# AI Casting — YUTRO.\n\n> AI-generated talent roster for brand campaigns: consistent faces, available in multiple poses and formats, without traditional image-rights restrictions.\n\n- [Browse the casting](${SITE_URL}/en/casting)\n- [Featured talent](${SITE_URL}/en/casting/featured)\n${footer("en")}`
    );
  }

  return { markdown: notFoundMarkdown(pathname), status: 404 };
}
