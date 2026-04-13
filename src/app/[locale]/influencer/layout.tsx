import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

const meta: Record<string, { title: string; description: string }> = {
  es: {
    title: "Influencer",
    description:
      "Avatares digitales creados con IA para campañas de alto impacto. Influencers virtuales personalizados por YUTRO.",
  },
  en: {
    title: "Influencer",
    description:
      "AI-created digital avatars for high-impact campaigns. Custom virtual influencers by YUTRO.",
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
    path: "/influencer",
    locale,
  });
}

export default function InfluencerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
