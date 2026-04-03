"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  locale: string;
  index?: number;
}

export function ProjectCard({ project, locale, index = 0 }: ProjectCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Link
        href={`/proyectos/${project.slug}`}
        className="group relative block overflow-hidden rounded-xl bg-card"
      >
        {/* Image */}
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Gradient overlay — always visible, deeper on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-300 group-hover:opacity-100 opacity-60" />

          {/* Project number */}
          <div className="absolute top-3 left-3 text-xs font-bold tracking-widest text-white/40 transition-colors duration-300 group-hover:text-white/70">
            {String(index + 1).padStart(2, "0")}
          </div>

          {/* Hover content */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <p className="text-xs leading-relaxed text-white/80">
              {project.excerpt[locale as "es" | "en"]}
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="flex items-center justify-between p-4">
          <h3 className="font-semibold text-card-foreground transition-colors duration-300 group-hover:text-primary">
            {project.title}
          </h3>
          <span className="text-xs text-muted-foreground transition-colors duration-300 group-hover:text-primary">
            →
          </span>
        </div>

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-primary to-primary/40 transition-all duration-500 group-hover:w-full" />
      </Link>
    </motion.div>
  );
}
