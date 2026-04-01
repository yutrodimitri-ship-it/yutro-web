"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  locale: string;
}

export function ProjectCard({ project, locale }: ProjectCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Link
        href={`/proyectos/${project.slug}`}
        className="group relative block overflow-hidden rounded-lg bg-card"
      >
        {/* Image */}
        <div className="relative aspect-video overflow-hidden">
          <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
            {/* Placeholder until real images */}
            {project.title}
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <h3 className="text-lg font-bold text-white">{project.title}</h3>
            <p className="mt-1 text-sm text-white/80">
              {project.excerpt[locale as "es" | "en"]}
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
            {project.title}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
}
