"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { FadeInOnScroll } from "@/components/animations/FadeInOnScroll";
import { CTAButton } from "@/components/shared/CTAButton";
import { Link } from "@/i18n/navigation";
import { services } from "@/data/services";

const cardReveal = {
  hidden: { opacity: 0, y: 50, scale: 0.93 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export function ServicesPreview() {
  const t = useTranslations("home");
  const locale = useLocale() as "es" | "en";

  return (
    <section id="servicios" className="relative py-20 lg:py-24">
      <Container>
        <FadeInOnScroll variant="fade-blur">
          <SectionHeader title={t("servicesTitle")} align="left" />
        </FadeInOnScroll>

        <motion.div
          className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-80px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {services.map((service) => (
            <motion.div key={service.slug} variants={cardReveal}>
              <Link href="/servicios" className="group relative block h-64 overflow-hidden rounded-xl sm:h-72">
                {/* Background image */}
                <Image
                  src={service.image}
                  alt={service.title[locale]}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Default state: dark overlay + title at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-0" />

                {/* Hover state: deeper overlay + "Ver más" */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all group-hover:gap-2">
                    {locale === "es" ? "Ver más" : "Learn more"} →
                  </span>
                </div>

                {/* Title — visible by default, moves up on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-5 transition-transform duration-500 group-hover:-translate-y-full group-hover:opacity-0">
                  <h3 className="text-base font-semibold text-white sm:text-lg">
                    {service.title[locale]}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <FadeInOnScroll delay={0.3} variant="fade-scale">
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
