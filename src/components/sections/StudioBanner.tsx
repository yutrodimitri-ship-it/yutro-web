"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Sparkles, ArrowRight } from "lucide-react";

export function StudioBanner() {
  const pathname = usePathname();
  const t = useTranslations("studio.banner");
  const locale = pathname.split("/")[1] || "es";

  if (pathname.includes("/studio")) return null;

  return (
    <section className="relative z-10 px-6 py-12 sm:py-16">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl bg-[#141414] px-8 py-12 sm:px-12 sm:py-16">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-between">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <span className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                YUTRO<span className="text-primary">.</span>
              </span>
              <span className="text-xl text-white/30 sm:text-2xl">studio</span>
            </div>
            <p className="mt-3 max-w-md text-base text-white/50">
              {t("description")}
            </p>
          </div>

          <a
            href={`/${locale}/studio/login`}
            className="group inline-flex items-center gap-3 rounded-xl bg-primary px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-primary/90"
          >
            <Sparkles className="h-5 w-5" />
            {t("cta")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <div
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--primary)" }}
        />
      </div>
    </section>
  );
}
