export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const SITE_URL = "https://www.yutro.cl";

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "YUTRO.",
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        description:
          "Productora audiovisual especializada en inteligencia artificial generativa. Parte de VRYP - Art & AI Solutions.",
        parentOrganization: {
          "@type": "Organization",
          name: "VRYP - Art & AI Solutions",
        },
        contactPoint: {
          "@type": "ContactPoint",
          email: "contacto@yutro.cl",
          telephone: "+56962479939",
          contactType: "customer service",
          availableLanguage: ["Spanish", "English"],
        },
        sameAs: ["https://www.instagram.com/yutro_ia/"],
        address: {
          "@type": "PostalAddress",
          addressCountry: "CL",
          addressLocality: "Santiago",
        },
      }}
    />
  );
}

export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "YUTRO.",
        url: SITE_URL,
        inLanguage: ["es", "en"],
        publisher: {
          "@type": "Organization",
          name: "YUTRO.",
        },
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}
