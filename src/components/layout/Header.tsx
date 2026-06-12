"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/shared/Container";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNav } from "./MobileNav";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

import { mainNavItems, clientAccessItem } from "@/data/navigation";

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const isStudio = pathname.includes("/studio");
  const locale = pathname.split("/")[1] || "es";

  // Detect if we're on the homepage (e.g. "/es", "/en", "/es/", "/en/")
  const isHome = /^\/(es|en)\/?$/.test(pathname);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (isStudio) return;
    if (latest > 80) setScrolled(true);
    else if (latest < 20) setScrolled(false);
  });

  // Hide header in Studio routes (after all hooks)
  if (isStudio) return null;

  function handleAnchorClick(e: React.MouseEvent, anchor: string) {
    e.preventDefault();
    const el = document.querySelector(anchor);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md"
          : "bg-transparent"
      }`}
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

          {/* Desktop Nav — centro */}
          <div className="hidden items-center gap-10 md:flex">
            {mainNavItems.map((item) =>
              isHome && item.anchor ? (
                <a
                  key={item.key}
                  href={item.anchor}
                  onClick={(e) => handleAnchorClick(e, item.anchor!)}
                  className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary cursor-pointer"
                >
                  {t(item.key)}
                </a>
              ) : (
                <Link
                  key={item.key}
                  href={item.href}
                  className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
                >
                  {t(item.key)}
                </Link>
              )
            )}
          </div>

          {/* Actions — derecha */}
          <div className="flex items-center gap-2 md:gap-3">
            <LanguageSwitcher />
            <ThemeSwitcher />

            {/* Divisor sutil entre toggles y CTA */}
            <span className="hidden h-5 w-px bg-foreground/15 md:block" aria-hidden />

            {/* Acceso cliente — outlined coral, visualmente separado */}
            <a
              href={`/${locale}${clientAccessItem.href}`}
              className="hidden items-center rounded-full border border-primary/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground md:inline-flex"
            >
              {t(clientAccessItem.key)}
            </a>

            <MobileNav />
          </div>
        </nav>
      </Container>
    </motion.header>
  );
}
