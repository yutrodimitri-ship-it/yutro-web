import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { GSAPProvider } from "@/components/providers/GSAPProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipLink } from "@/components/layout/SkipLink";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "es" | "en")) {
    notFound();
  }

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider>
        <GSAPProvider>
          <OrganizationJsonLd />
          <WebSiteJsonLd />
          <SkipLink />
          {/* Global ambient gradient — CSS radial-gradient (GPU composited, no scroll jank) */}
          <div
            className="pointer-events-none fixed inset-0 z-0 will-change-transform"
            style={{
              background:
                "radial-gradient(ellipse 700px 600px at -5% -5%, color-mix(in srgb, var(--primary) 22%, transparent) 0%, transparent 70%), radial-gradient(ellipse 600px 500px at 105% 100%, color-mix(in srgb, var(--primary) 16%, transparent) 0%, transparent 70%)",
            }}
          />
          <Header />
          <main id="main-content" className="relative z-10 flex-1">
            {children}
          </main>
          <Footer />
        </GSAPProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
