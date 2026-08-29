import type { Metadata } from "next";
import { Container } from "@/components/shared/Container";
import { createMetadata } from "@/lib/metadata";

/**
 * /privacidad — Política de privacidad.
 *
 * Página de confianza (trust anchor): los agentes y usuarios la
 * consultan para verificar que el negocio es legítimo. Contenido
 * inline ES/EN (sin next-intl namespace: es texto legal largo que
 * no se reutiliza en ningún otro lugar).
 */

const meta: Record<string, { title: string; description: string }> = {
  es: {
    title: "Política de Privacidad",
    description:
      "Cómo VRYP Art & AI Solutions SpA (YUTRO.) recolecta, usa y protege los datos personales en yutro.cl.",
  },
  en: {
    title: "Privacy Policy",
    description:
      "How VRYP Art & AI Solutions SpA (YUTRO.) collects, uses and protects personal data on yutro.cl.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = meta[locale] ?? meta.es;
  return createMetadata({
    title: m.title,
    description: m.description,
    path: "/privacidad",
    locale,
  });
}

type Section = { title: string; body: string[] };

const content: Record<string, { h1: string; updated: string; intro: string; sections: Section[] }> = {
  es: {
    h1: "Política de Privacidad",
    updated: "Última actualización: agosto de 2026",
    intro:
      "Esta política describe cómo VRYP Art & AI Solutions SpA (“YUTRO.”, “nosotros”), con domicilio en Santiago de Chile, trata los datos personales de quienes visitan yutro.cl o se comunican con nosotros. Aplicamos la legislación chilena sobre protección de la vida privada (Ley 19.628 y sus modificaciones).",
    sections: [
      {
        title: "Qué datos recolectamos",
        body: [
          "Solo recolectamos los datos que tú nos entregas voluntariamente a través de los formularios del sitio: nombre, correo electrónico, empresa y las notas que escribas sobre tu proyecto (formulario de contacto), o los datos de acceso al casting privado (nombre y correo). La navegación pública del sitio no requiere registro ni entrega de datos personales.",
        ],
      },
      {
        title: "Para qué los usamos",
        body: [
          "Usamos tus datos exclusivamente para responder tu solicitud, preparar cotizaciones, gestionar el acceso al área privada de casting y mantener la relación comercial que tú inicies con nosotros. No vendemos, arrendamos ni compartimos datos personales con terceros con fines publicitarios.",
        ],
      },
      {
        title: "Cookies y analítica",
        body: [
          "El sitio público funciona sin cookies de rastreo publicitario. Usamos únicamente cookies funcionales de sesión para el área privada de clientes (autenticación) y métricas de tráfico agregadas y anónimas para entender el uso del sitio. No hacemos perfiles individuales de visitantes.",
        ],
      },
      {
        title: "Almacenamiento y seguridad",
        body: [
          "Los datos de formularios se transmiten cifrados (HTTPS) y se almacenan en proveedores de infraestructura con estándares de seguridad de la industria. El acceso interno está restringido al equipo que necesita responder tu solicitud. Conservamos los datos solo mientras exista una relación comercial activa o una obligación legal de retención.",
        ],
      },
      {
        title: "Tus derechos",
        body: [
          "Puedes solicitar en cualquier momento el acceso, la rectificación o la eliminación de tus datos personales escribiendo a contacto@yutro.cl. Respondemos dentro de un plazo razonable y sin costo para ti.",
        ],
      },
      {
        title: "Contacto",
        body: [
          "Ante cualquier duda sobre esta política escríbenos a contacto@yutro.cl o llámanos al +56 9 6247 9939. Responsable del tratamiento: VRYP Art & AI Solutions SpA, Santiago de Chile.",
        ],
      },
    ],
  },
  en: {
    h1: "Privacy Policy",
    updated: "Last updated: August 2026",
    intro:
      "This policy describes how VRYP Art & AI Solutions SpA (“YUTRO.”, “we”), based in Santiago, Chile, handles the personal data of visitors to yutro.cl and of those who contact us. We comply with Chilean privacy legislation (Law 19.628 as amended).",
    sections: [
      {
        title: "What data we collect",
        body: [
          "We only collect the data you voluntarily submit through the site's forms: name, email, company and the notes you write about your project (contact form), or the private casting access data (name and email). Browsing the public site requires no registration or personal data.",
        ],
      },
      {
        title: "How we use it",
        body: [
          "We use your data exclusively to answer your request, prepare quotes, manage access to the private casting area and maintain the business relationship you initiate with us. We do not sell, rent or share personal data with third parties for advertising purposes.",
        ],
      },
      {
        title: "Cookies and analytics",
        body: [
          "The public site works without advertising trackers. We only use functional session cookies for the private client area (authentication) and aggregated, anonymous traffic metrics to understand site usage. We do not build individual visitor profiles.",
        ],
      },
      {
        title: "Storage and security",
        body: [
          "Form data travels encrypted (HTTPS) and is stored with infrastructure providers that meet industry security standards. Internal access is restricted to the team that needs to answer your request. We keep data only while an active business relationship or a legal retention obligation exists.",
        ],
      },
      {
        title: "Your rights",
        body: [
          "You can request access to, correction of, or deletion of your personal data at any time by writing to contacto@yutro.cl. We respond within a reasonable time and at no cost to you.",
        ],
      },
      {
        title: "Contact",
        body: [
          "For any questions about this policy, write to contacto@yutro.cl or call +56 9 6247 9939. Data controller: VRYP Art & AI Solutions SpA, Santiago, Chile.",
        ],
      },
    ],
  },
};

export default async function PrivacidadPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const c = content[locale] ?? content.es;

  return (
    <main className="bg-background pt-32 pb-24 sm:pt-40 sm:pb-32">
      <Container className="max-w-3xl">
        <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">
          {c.h1}
        </h1>
        <p className="mt-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {c.updated}
        </p>
        <p className="mt-8 text-muted-foreground leading-relaxed">{c.intro}</p>
        {c.sections.map((s) => (
          <section key={s.title} className="mt-10">
            <h2 className="text-xl font-bold">{s.title}</h2>
            {s.body.map((p, i) => (
              <p key={i} className="mt-3 text-muted-foreground leading-relaxed">
                {p}
              </p>
            ))}
          </section>
        ))}
      </Container>
    </main>
  );
}
