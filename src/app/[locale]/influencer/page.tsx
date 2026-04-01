"use client";

import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer";
import { influencers } from "@/data/influencers";

export default function InfluencerPage() {
  const locale = useLocale();
  const isEs = locale === "es";

  return (
    <section className="py-20 lg:py-28">
      <Container>
        <SectionHeader
          title="Influencer"
          subtitle={
            isEs
              ? "Avatares digitales creados con IA para campañas de alto impacto"
              : "AI-created digital avatars for high-impact campaigns"
          }
        />

        <StaggerContainer className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {influencers.map((influencer) => (
            <StaggerItem key={influencer.slug}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Link
                  href={`/influencer/${influencer.slug}`}
                  className="group block overflow-hidden rounded-xl"
                >
                  {/* Avatar Image */}
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
                    <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-muted-foreground">
                      {influencer.name[0]}
                    </div>

                    {/* Overlay with name */}
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-6 transition-opacity">
                      <h3 className="text-2xl font-bold text-white">
                        {influencer.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  );
}
