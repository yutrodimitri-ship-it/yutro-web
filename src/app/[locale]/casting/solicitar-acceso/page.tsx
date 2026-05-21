import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/shared/Container";
import { AccessRequestForm } from "@/components/casting/AccessRequestForm";
import { createMetadata } from "@/lib/metadata";

const meta: Record<string, { title: string; description: string }> = {
  es: {
    title: "Solicitar acceso · Casting",
    description:
      "Formulario para solicitar acceso al catálogo completo del Casting Yutro. Acceso post-acuerdo, revisado por el equipo.",
  },
  en: {
    title: "Request access · Casting",
    description:
      "Form to request access to the full Yutro Casting catalog. Post-agreement access, reviewed by the team.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = meta[locale] ?? meta.es;
  return createMetadata({
    title: m.title,
    description: m.description,
    path: "/casting/solicitar-acceso",
    locale,
    noIndex: true, // form, no SEO target
  });
}

export default async function SolicitarAccesoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: "es" | "en" = rawLocale === "en" ? "en" : "es";
  const t = await getTranslations({ locale, namespace: "casting.request" });
  const tf = await getTranslations({ locale, namespace: "casting.request.form" });

  return (
    <main className="bg-background pt-32 pb-32 sm:pt-40 text-foreground">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1.4fr] lg:gap-20">
          {/* ── Lado izquierdo — copy + steps ─────────────── */}
          <div>
            <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/40">
              {t("eyebrow")}
            </p>
            <h1
              className="font-heading font-extrabold leading-[0.95] text-foreground"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                letterSpacing: "-0.035em",
              }}
            >
              {t("title")}{" "}
              <em className="italic text-primary not-italic-fallback">
                {t("titleAccent")}
              </em>
            </h1>
            <p
              className="mt-6 text-base leading-relaxed text-foreground/65 sm:text-lg"
              style={{ maxWidth: "44ch" }}
            >
              {t("intro")}
            </p>

            <div className="mt-12 border-t border-foreground/10 pt-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/40">
                {t("stepsTitle")}
              </p>
              <ol className="mt-5 space-y-3 text-sm leading-relaxed text-foreground/70 sm:text-base">
                <li>
                  <span className="font-semibold text-foreground">01.</span>{" "}
                  {t("step1")}
                </li>
                <li>
                  <span className="font-semibold text-foreground">02.</span>{" "}
                  {t("step2")}
                </li>
                <li>
                  <span className="font-semibold text-foreground">03.</span>{" "}
                  {t("step3")}
                </li>
              </ol>
            </div>
          </div>

          {/* ── Lado derecho — form ───────────────────────── */}
          <div>
            <AccessRequestForm
              locale={locale}
              labels={{
                name: tf("name"),
                email: tf("email"),
                emailHint: tf("emailHint"),
                company: tf("company"),
                role: tf("role"),
                country: tf("country"),
                projectType: tf("projectType"),
                timeline: tf("timeline"),
                budgetRange: tf("budgetRange"),
                attribution: tf("attribution"),
                notes: tf("notes"),
                notesHint: tf("notesHint"),
                submit: tf("submit"),
                submitting: tf("submitting"),
                successTitle: tf("successTitle"),
                successBody: tf("successBody"),
                back: tf("back"),
                errorBlockedEmail: tf("errorBlockedEmail"),
                errorRateLimit: tf("errorRateLimit"),
                errorGeneric: tf("errorGeneric"),
              }}
            />
          </div>
        </div>
      </Container>
    </main>
  );
}
