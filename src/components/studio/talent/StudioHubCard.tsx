"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, Users, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

type AccentVariant = "primary" | "gold";
type IconKey = "sparkles" | "users";

const ICONS: Record<IconKey, ReactNode> = {
  sparkles: <Sparkles className="h-6 w-6" strokeWidth={1.5} />,
  users: <Users className="h-6 w-6" strokeWidth={1.5} />,
};

interface StudioHubCardProps {
  href: string;
  title: string;
  description: string;
  icon: IconKey;
  accent: AccentVariant;
  badge?: string;
  /** Texto cta debajo (ej. "Ir a Mis Avatares"). */
  cta: string;
}

/**
 * Card grande del hub Yutro Studio. Dos variantes:
 *   - primary (naranja): generador personal de avatares
 *   - gold    (dorado):  catalogo Talent (acceso premium)
 *
 * El borde se ilumina en hover con el color del accent variant.
 */
export function StudioHubCard({
  href,
  title,
  description,
  icon,
  accent,
  badge,
  cta,
}: StudioHubCardProps) {
  const reduce = useReducedMotion();
  const accentColor =
    accent === "primary" ? "var(--primary)" : "var(--accent)";
  const accentSoft =
    accent === "primary"
      ? "color-mix(in oklch, var(--primary) 12%, transparent)"
      : "var(--accent-soft)";

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={reduce ? undefined : { y: -2 }}
      className="group relative block"
    >
      <Link
        href={href}
        className="block overflow-hidden rounded-xl border border-[#222] bg-[#141414] p-8 transition-all duration-300 hover:border-[#333]"
        style={{
          // Hover ring usa el accent color via CSS variable
          ["--card-accent" as string]: accentColor,
        }}
      >
        {/* Badge superior derecho */}
        {badge && (
          <div
            className="absolute right-5 top-5 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em]"
            style={{
              background: accentSoft,
              color: accentColor,
              border: `1px solid ${accentColor}`,
              borderRadius: "999px",
            }}
          >
            {badge}
          </div>
        )}

        {/* Glow de fondo en hover */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at 30% 0%, ${accentSoft}, transparent 60%)`,
          }}
        />

        {/* Icono */}
        <div
          className="relative mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg transition-colors duration-300"
          style={{
            background: accentSoft,
            color: accentColor,
          }}
        >
          {ICONS[icon]}
        </div>

        {/* Titulo */}
        <h2
          className="relative mb-3 text-2xl font-bold tracking-tight text-white sm:text-3xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {title}
        </h2>

        {/* Descripcion */}
        <p className="relative mb-6 text-sm leading-relaxed text-white/55 sm:text-[15px]">
          {description}
        </p>

        {/* CTA */}
        <div
          className="relative inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] transition-colors duration-300"
          style={{ color: accentColor }}
        >
          <span>{cta}</span>
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={1.75}
          />
        </div>
      </Link>
    </motion.div>
  );
}
