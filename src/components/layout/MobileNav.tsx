"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const navItems = [
  { key: "home", href: "/" },
  { key: "projects", href: "/proyectos" },
  { key: "services", href: "/servicios" },
  { key: "influencer", href: "/influencer" },
  { key: "blog", href: "/blog" },
  { key: "contact", href: "/contacto" },
] as const;

export function MobileNav() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="flex h-9 w-9 items-center justify-center rounded-md text-foreground/70 transition-colors hover:text-foreground md:hidden"
        aria-label="Abrir menú"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetTitle className="text-2xl font-extrabold">
          YUTRO<span className="text-primary">.</span>
        </SheetTitle>
        <nav className="mt-8 flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-lg font-medium text-foreground/70 transition-colors hover:text-primary"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
