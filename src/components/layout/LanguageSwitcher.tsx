"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { blogPosts } from "@/data/blog";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = locale === "es" ? "en" : "es";

  const handleSwitch = () => {
    // Los posts del blog tienen slug distinto por idioma: navegar al slug traducido
    const blogMatch = pathname.match(/^\/blog\/([^/]+)$/);
    if (blogMatch) {
      const post = blogPosts.find((p) => p.slug === blogMatch[1] && p.locale === locale);
      const target = post ? `/blog/${post.altSlug}` : "/blog";
      router.replace(target, { locale: switchTo });
      return;
    }
    router.replace(pathname, { locale: switchTo });
  };

  return (
    <button
      onClick={handleSwitch}
      className="flex h-9 items-center justify-center rounded-md px-2 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
      aria-label={`Switch to ${switchTo === "es" ? "Español" : "English"}`}
    >
      <span className={locale === "es" ? "font-bold text-foreground" : ""}>ES</span>
      <span className="mx-1 text-muted-foreground">/</span>
      <span className={locale === "en" ? "font-bold text-foreground" : ""}>EN</span>
    </button>
  );
}
