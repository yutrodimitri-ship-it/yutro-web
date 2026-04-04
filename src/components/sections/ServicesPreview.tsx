"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { FadeInOnScroll } from "@/components/animations/FadeInOnScroll";
import { CTAButton } from "@/components/shared/CTAButton";
import { services } from "@/data/services";

export function ServicesPreview() {
  const t = useTranslations("home");
  const locale = useLocale() as "es" | "en";

  return (
    <section className="relative py-20 lg:py-24">
      <Container>
        <FadeInOnScroll>
          <SectionHeader title={t("servicesTitle")} align="left" />
        </FadeInOnScroll>

        <ul className="mt-2 divide-y divide-border/40">
          {services.map((service, i) => (
            <FadeInOnScroll key={service.slug} delay={i * 0.04}>
              <li>
                <Link href="/servicios">
                  <motion.div
                    className="group flex items-center gap-6 py-5 cursor-pointer"
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  >
                    {/* Thumbnail */}
                    <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={service.image}
                        alt={service.title[locale]}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="56px"
                      />
                    </div>

                    {/* Name */}
                    <span className="flex-1 text-base font-medium text-foreground transition-colors duration-200 group-hover:text-primary sm:text-lg">
                      {service.title[locale]}
                    </span>

                    {/* Line */}
                    <div className="hidden h-px flex-1 bg-border/40 transition-colors duration-300 group-hover:bg-primary/30 md:block" />

                    {/* Arrow */}
                    <span className="shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary">
                      →
                    </span>
                  </motion.div>
                </Link>
              </li>
            </FadeInOnScroll>
          ))}
        </ul>

        <FadeInOnScroll delay={0.3}>
          <div className="mt-10">
            <CTAButton href="/servicios" variant="outline">
              {t("servicesCTA")}
            </CTAButton>
          </div>
        </FadeInOnScroll>
      </Container>
    </section>
  );
}
