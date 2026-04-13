import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

const meta: Record<string, { title: string; description: string }> = {
  es: {
    title: "Contacto",
    description:
      "Contáctanos para tu próximo proyecto audiovisual con IA. Producción creativa, 3D, motion graphics y postproducción.",
  },
  en: {
    title: "Contact",
    description:
      "Contact us for your next AI audiovisual project. Creative production, 3D, motion graphics and post-production.",
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
    path: "/contacto",
    locale,
  });
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
