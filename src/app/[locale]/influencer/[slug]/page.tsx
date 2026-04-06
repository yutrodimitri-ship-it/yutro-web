export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { influencers } from "@/data/influencers";
import { createMetadata } from "@/lib/metadata";
import InfluencerDetail from "./InfluencerDetail";

export function generateStaticParams() {
  return influencers.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const influencer = influencers.find((i) => i.slug === slug);
  if (!influencer) return {};
  const l = locale as "es" | "en";
  return createMetadata({
    title: influencer.name,
    description: influencer.bio[l].split("\n")[0],
    path: `/influencer/${slug}`,
    locale,
  });
}

export default function InfluencerDetailPage() {
  return <InfluencerDetail />;
}
