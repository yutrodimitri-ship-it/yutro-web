import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/shared/Container";
import { createMetadata } from "@/lib/metadata";

const meta: Record<string, { title: string; description: string }> = {
  es: {
    title: "Solicitar acceso · Casting",
    description:
      "Formulario de solicitud para acceder al catálogo completo del Casting Yutro. Acceso post-acuerdo, revisado por el equipo.",
  },
  en: {
    title: "Request access · Casting",
    description:
      "Request access form for the full Yutro Casting catalog. Post-agreement access, reviewed by the team.",
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

/**
 * Stub Sprint 2. El form completo + endpoint + email se construye en
 * Sprint 3 (Tareas 3.1 + 3.2). Por ahora, copy editorial + placeholder
 * visual para que los CTAs de /casting y /casting/featured no caigan
 * en 404.
 */
export default async function SolicitarAccesoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: "es" | "en" = rawLocale === "en" ? "en" : "es";

  return (
    <main className="bg-background pt-32 pb-32 sm:pt-40 text-foreground">
      <Container>
        <div className="mx-auto max-w-2xl">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/40">
            {locale === "es" ? "Casting · Solicitar acceso" : "Casting · Request access"}
          </p>
          <h1
            className="font-heading font-extrabold leading-[0.95] text-foreground"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              letterSpacing: "-0.035em",
            }}
          >
            {locale === "es" ? (
              <>
                Acceso al{" "}
                <em className="italic text-primary not-italic-fallback">catálogo completo.</em>
              </>
            ) : (
              <>
                Access to the{" "}
                <em className="italic text-primary not-italic-fallback">full catalog.</em>
              </>
            )}
          </h1>

          <p className="mt-6 text-base leading-relaxed text-foreground/65 sm:text-lg">
            {locale === "es"
              ? "El formulario de acceso se publica esta semana. Mientras tanto, escríbenos directamente y agendamos una conversación."
              : "The access form launches this week. In the meantime, write to us directly and we'll set up a call."}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="mailto:contacto@yutro.cl?subject=Solicitud%20de%20acceso%20Casting%20Yutro"
              className="inline-flex items-center gap-3 bg-primary px-7 py-4 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {locale === "es" ? "Escribir a contacto@yutro.cl" : "Email contacto@yutro.cl"}
              <span>→</span>
            </a>
            <Link
              href="/casting"
              className="inline-flex items-center px-5 py-4 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground/70 hover:text-primary"
            >
              {locale === "es" ? "← Volver al Casting" : "← Back to Casting"}
            </Link>
          </div>

          <div className="mt-16 border-t border-foreground/10 pt-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/40">
              {locale === "es" ? "Lo que sigue" : "What happens next"}
            </p>
            <ol className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/65 sm:text-base">
              <li>
                <span className="font-semibold text-foreground">01.</span>{" "}
                {locale === "es"
                  ? "Revisamos tu solicitud dentro de 24 horas hábiles."
                  : "We review your request within 24 business hours."}
              </li>
              <li>
                <span className="font-semibold text-foreground">02.</span>{" "}
                {locale === "es"
                  ? "Agendamos una llamada de 30 minutos para entender tu proyecto."
                  : "We schedule a 30-minute call to understand your project."}
              </li>
              <li>
                <span className="font-semibold text-foreground">03.</span>{" "}
                {locale === "es"
                  ? "Te entregamos credenciales del catálogo completo bajo contrato."
                  : "We provide full catalog credentials under contract."}
              </li>
            </ol>
          </div>
        </div>
      </Container>
    </main>
  );
}
