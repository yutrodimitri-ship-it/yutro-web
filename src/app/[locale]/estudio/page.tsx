import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/shared/Container";
import { contactInfo } from "@/data/contact";

/**
 * /estudio — Manifiesto del estudio.
 *
 * Pagina publica, indexable, sin dependencias de auth. Estructura:
 *   1. Hero editorial con H1 + subtitulo
 *   2. Manifiesto (3 parrafos)
 *   3. Las dos lineas (Casting / Produccion)
 *   4. Equipo (placeholder de 1-3 personas)
 *   5. Contacto (mirror del footer)
 *
 * El copy actual es un primer draft basado en el brief. Marketing
 * ajustara el copy final en una iteracion posterior.
 */
export default async function EstudioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "estudio" });

  // TODO: cuando marketing entregue el equipo real, reemplazar este
  // placeholder con foto + nombre + rol. Por ahora 1 persona generica.
  const team = [
    {
      name: "Milivoy Dimitrijevic",
      role: t("team.role.founder"),
      photo: null, // sin foto por ahora
    },
  ];

  return (
    <main className="bg-background pt-32 pb-24 sm:pt-40 sm:pb-32">
      <Container>
        {/* ── Hero editorial ─────────────────────────────────── */}
        <section className="border-b border-foreground/10 pb-16">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/40">
            {t("eyebrow")}
          </p>
          <h1
            className="font-heading font-extrabold leading-[0.95] text-foreground"
            style={{
              fontSize: "clamp(3.5rem, 9vw, 8.5rem)",
              letterSpacing: "-0.04em",
            }}
          >
            Yutro<span className="text-primary">.</span>
          </h1>
          <p
            className="mt-6 max-w-2xl text-xl leading-snug text-foreground/70 sm:text-2xl"
            style={{ letterSpacing: "-0.01em" }}
          >
            {t("subtitle")}
          </p>
        </section>

        {/* ── Manifiesto ─────────────────────────────────────── */}
        <section className="grid gap-10 border-b border-foreground/10 py-20 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/40">
            {t("manifesto.label")}
          </h2>
          <div className="space-y-6 text-lg leading-relaxed text-foreground/70 sm:text-xl">
            <p>{t("manifesto.p1")}</p>
            <p>{t("manifesto.p2")}</p>
            <p>{t("manifesto.p3")}</p>
          </div>
        </section>

        {/* ── Las dos lineas ─────────────────────────────────── */}
        <section className="border-b border-foreground/10 py-20">
          <h2 className="mb-12 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/40">
            {t("lines.label")}
          </h2>
          <div className="grid gap-px bg-foreground/10 sm:grid-cols-2">
            <Link
              href="/casting"
              className="group block bg-background p-8 transition-colors hover:bg-foreground/[0.02] sm:p-10"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                01
              </p>
              <h3
                className="mt-3 font-heading text-3xl font-bold sm:text-4xl"
                style={{ letterSpacing: "-0.02em" }}
              >
                {t("lines.casting.title")}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-foreground/60">
                {t("lines.casting.body")}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-primary">
                {t("lines.casting.cta")}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
            <Link
              href="/produccion"
              className="group block bg-background p-8 transition-colors hover:bg-foreground/[0.02] sm:p-10"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                02
              </p>
              <h3
                className="mt-3 font-heading text-3xl font-bold sm:text-4xl"
                style={{ letterSpacing: "-0.02em" }}
              >
                {t("lines.production.title")}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-foreground/60">
                {t("lines.production.body")}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-primary">
                {t("lines.production.cta")}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          </div>
        </section>

        {/* ── Equipo ──────────────────────────────────────────── */}
        <section className="border-b border-foreground/10 py-20">
          <h2 className="mb-12 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/40">
            {t("team.label")}
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <div key={member.name}>
                {/* Placeholder de foto — se reemplaza cuando llegue
                    el material visual del equipo. */}
                <div
                  className="aspect-[4/5] w-full"
                  style={{
                    background:
                      "linear-gradient(180deg, hsl(15, 25%, 22%), hsl(15, 15%, 12%))",
                  }}
                />
                <p
                  className="mt-4 font-heading text-xl font-bold"
                  style={{ letterSpacing: "-0.015em" }}
                >
                  {member.name}
                </p>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground/40">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Contacto ──────────────────────────────────────── */}
        <section className="grid gap-10 py-20 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/40">
            {t("contact.label")}
          </h2>
          <dl className="space-y-6 text-lg text-foreground/70">
            <div>
              <dt className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/40">
                {t("contact.emailLabel")}
              </dt>
              <dd>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="underline decoration-foreground/30 underline-offset-4 hover:text-primary hover:decoration-primary"
                >
                  {contactInfo.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/40">
                {t("contact.phoneLabel")}
              </dt>
              <dd className="space-y-1">
                {contactInfo.phones.map((p) => (
                  <a
                    key={p.number}
                    href={`tel:${p.number.replace(/\s/g, "")}`}
                    className="block hover:text-primary"
                  >
                    {p.number}
                  </a>
                ))}
              </dd>
            </div>
            <div>
              <dt className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/40">
                {t("contact.instagramLabel")}
              </dt>
              <dd>
                <a
                  href={contactInfo.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-foreground/30 underline-offset-4 hover:text-primary hover:decoration-primary"
                >
                  {contactInfo.instagram.handle}
                </a>
              </dd>
            </div>
          </dl>
        </section>
      </Container>
    </main>
  );
}
