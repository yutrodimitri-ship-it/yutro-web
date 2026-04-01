"use client";

import { notFound, useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { influencers } from "@/data/influencers";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: 0.3 + i * 0.05, duration: 0.4, ease: "easeOut" as const },
  }),
};

export default function InfluencerDetail() {
  const { slug } = useParams<{ slug: string }>();
  const locale = useLocale();
  const influencer = influencers.find((i) => i.slug === slug);
  const isEs = locale === "es";

  if (!influencer) notFound();

  return (
    <div className="min-h-screen">
      {/* ══════════════════════════════════════════════
          HERO — Full-bleed gradient + profile
         ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pb-16 pt-28 sm:pb-24 sm:pt-36">
        {/* Background gradient mesh */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-primary/15 blur-[120px]" />
          <div className="absolute -right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/influencer"
              className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="inline-block transition-transform group-hover:-translate-x-1">&larr;</span>
              {isEs ? "Volver a influencers" : "Back to influencers"}
            </Link>
          </motion.div>

          {/* Profile header */}
          <div className="mt-10 flex flex-col items-center gap-8 sm:mt-14 sm:flex-row sm:items-start sm:gap-12">
            {/* Avatar with animated gradient ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              className="shrink-0"
            >
              <div className="relative">
                {/* Gradient ring */}
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary via-primary/60 to-primary/20 animate-[spin_6s_linear_infinite] opacity-80" />
                <div className="relative h-28 w-28 overflow-hidden rounded-full bg-card ring-4 ring-background sm:h-40 sm:w-40 flex items-center justify-center text-4xl font-bold text-muted-foreground sm:text-6xl">
                  {influencer.name[0]}
                </div>
              </div>
            </motion.div>

            {/* Info */}
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              <motion.h1
                custom={0}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
              >
                {influencer.name}
              </motion.h1>

              <motion.p
                custom={1}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="mt-1.5 text-base font-medium text-primary sm:text-lg"
              >
                {influencer.handle}
              </motion.p>

              {/* Bio */}
              <motion.p
                custom={2}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground whitespace-pre-line sm:text-base"
              >
                {influencer.bio[locale as "es" | "en"]}
              </motion.p>
            </div>
          </div>

          {/* Highlights — inline tags */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-8 flex flex-wrap justify-center gap-3 sm:justify-start"
          >
            {influencer.highlights.map((hl) => (
              <span
                key={hl.label}
                className="rounded-full border border-border/50 bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm"
              >
                {hl.label}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          GALLERY — Instagram-style grid with hover
         ══════════════════════════════════════════════ */}
      <section className="border-t border-border/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          {/* Tab bar */}
          <div className="flex border-b border-border/50">
            <button className="flex flex-1 items-center justify-center gap-2 border-t-2 border-foreground py-4 text-xs font-semibold uppercase tracking-[0.2em]">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
              {isEs ? "Publicaciones" : "Posts"}
            </button>
            <button className="flex flex-1 items-center justify-center gap-2 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Reels
            </button>
          </div>

          {/* 3x3 Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-3 gap-1 py-1 sm:gap-1.5 sm:py-1.5"
          >
            {influencer.gallery.map((img, idx) => (
              <motion.div
                key={idx}
                custom={idx}
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: (i: number) => ({
                    opacity: 1,
                    scale: 1,
                    transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" as const },
                  }),
                }}
                className="group relative aspect-square cursor-pointer overflow-hidden bg-muted"
              >
                {/* Placeholder — replace with next/image */}
                <div className="flex h-full w-full items-center justify-center text-sm font-medium text-muted-foreground transition-all duration-300 group-hover:scale-110">
                  {String(idx + 1).padStart(2, "0")}
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          VIDEO REEL — Cinematic full-width
         ══════════════════════════════════════════════ */}
      <section className="mt-16 sm:mt-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-border" />
              <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                {isEs ? "Video Reel" : "Video Reel"}
              </h2>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-muted shadow-2xl shadow-primary/5 ring-1 ring-border/50">
              <div className="aspect-video">
                <iframe
                  src={influencer.reelUrl}
                  title={`${influencer.name} Reel`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA — Gradient accent
         ══════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-xl px-4 text-center sm:px-6"
        >
          <p className="text-lg text-muted-foreground sm:text-xl">
            {isEs
              ? "Lleva tu marca al siguiente nivel con un avatar digital."
              : "Take your brand to the next level with a digital avatar."}
          </p>
          <Link
            href="/contacto"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30"
          >
            {isEs ? "Quiero mi avatar" : "I want my avatar"}
            <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
