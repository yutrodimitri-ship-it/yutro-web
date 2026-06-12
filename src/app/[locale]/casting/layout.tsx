import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

const meta: Record<string, { title: string; description: string }> = {
  es: {
    title: "Casting",
    description:
      "Catálogo público de talentos digitales Yutro. Identidad consistente, tono comercial definido y derechos resueltos por contrato. Para campañas publicitarias en LATAM.",
  },
  en: {
    title: "Casting",
    description:
      "Public catalog of Yutro digital talents. Consistent identity, defined commercial tone and rights cleared by contract. For advertising campaigns in LATAM.",
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
    path: "/casting",
    locale,
  });
}

export default function CastingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
