"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  locale: string;
  index?: number;
  featured?: boolean;
}

export function ProjectCard({ project, locale, index = 0, featured = false }: ProjectCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
    >
      <Link
        href={`/proyectos/${project.slug}`}
        className="group relative block overflow-hidden rounded-xl bg-card"
      >
        {/* Image — featured gets wider cinematic ratio */}
        <div className={`relative overflow-hidden ${featured ? "aspect-[21/9]" : "aspect-video"}`}>
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Gradient overlay — always visible, deeper on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-300 group-hover:opacity-100 opacity-60" />

          {/* Hover content */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <p className="text-xs leading-relaxed text-white/80">
              {project.excerpt[locale as "es" | "en"]}
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="flex items-center justify-between p-4">
          <div>
            <h3 className={`font-semibold text-card-foreground transition-colors duration-300 group-hover:text-primary ${featured ? "text-lg" : ""}`}>
              {project.title}
            </h3>
            {featured && (
              <p className="mt-0.5 text-xs text-muted-foreground">{project.client}</p>
            )}
          </div>
          <span className="text-sm text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary">
            →
          </span>
        </div>

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-primary to-primary/40 transition-all duration-500 group-hover:w-full" />
      </Link>
    </motion.div>
  );
}
