import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { GSAPProvider } from "@/components/providers/GSAPProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
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
          <SmoothScrollProvider>
            <OrganizationJsonLd />
            <WebSiteJsonLd />
            <SkipLink />
            <Header />
            <main id="main-content" className="flex-1 pt-16 lg:pt-20">
              {children}
            </main>
            <Footer />
          </SmoothScrollProvider>
        </GSAPProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
