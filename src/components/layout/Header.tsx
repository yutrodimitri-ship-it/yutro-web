"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/shared/Container";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNav } from "./MobileNav";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

const navItems = [
  { key: "projects", href: "/proyectos" },
  { key: "services", href: "/servicios" },
  { key: "influencer", href: "/influencer" },
  { key: "blog", href: "/blog" },
  { key: "contact", href: "/contacto" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(latest > 100 && latest > previous);
    setScrolled(latest > 50);
  });

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border/50"
          : "bg-transparent"
      }`}
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.3 }}
    >
      <Container>
        <nav className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight text-foreground"
          >
            YUTRO<span className="text-primary">.</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
              >
                {t(item.key)}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
            <MobileNav />
          </div>
        </nav>
      </Container>
    </motion.header>
  );
}
