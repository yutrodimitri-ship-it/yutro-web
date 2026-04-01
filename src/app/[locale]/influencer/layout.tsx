import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Influencer",
  description:
    "Avatares digitales creados con IA para campañas de alto impacto. Conoce nuestros influencers virtuales.",
};

export default function InfluencerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
