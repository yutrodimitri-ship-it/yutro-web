"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { FadeInOnScroll } from "@/components/animations/FadeInOnScroll";
import { AIToolsSection } from "@/components/sections/AIToolsSection";
import { services } from "@/data/services";

export default function ServicesPage() {
  const t = useTranslations("services");
  const locale = useLocale() as "es" | "en";

  return (
    <>
      <section className="py-20 lg:py-24">
        <Container>
          <FadeInOnScroll>
            <SectionHeader title={t("title")} align="left" />
          </FadeInOnScroll>

          <div className="mt-4 divide-y divide-border/50">
            {services.map((service, i) => {
              const isEven = i % 2 === 0;
              return (
                <FadeInOnScroll key={service.slug} delay={i * 0.05}>
                  <div
                    className={`flex flex-col gap-8 py-12 md:flex-row md:items-center md:gap-12 lg:gap-16 ${
                      isEven ? "" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Image */}
                    <motion.div
                      className="w-full md:w-2/5 shrink-0"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                        <Image
                          src={service.image}
                          alt={service.title[locale]}
                          fill
                          className="object-cover transition-transform duration-700 hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 40vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      </div>
                    </motion.div>

                    {/* Text */}
                    <div className="flex flex-1 flex-col justify-center">
                      <span className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <h3 className="font-heading text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
                        {service.title[locale]}
                      </h3>

                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {service.description[locale]}
                      </p>

                      <div className="mt-6 h-px w-12 bg-primary" />
                    </div>
                  </div>
                </FadeInOnScroll>
              );
            })}
          </div>
        </Container>
      </section>

      <AIToolsSection />
    </>
  );
}
