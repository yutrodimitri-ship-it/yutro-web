import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAssignedTalentsForProject,
  getAvailableTalents,
  getBlockedTalentsForProject,
  getProjectBySlug,
} from "@/lib/talent/data-source";
import { LandingCovers } from "@/components/studio/talent/LandingCovers";
import type { Locale } from "@/types/talent";

export default async function ProjectLandingPage({
  params,
}: {
  params: Promise<{ locale: string; projectSlug: string }>;
}) {
  const { locale: rawLocale, projectSlug } = await params;
  const locale: Locale = rawLocale === "en" ? "en" : "es";

  const project = await getProjectBySlug(projectSlug);
  if (!project) notFound();

  const [talents, exclusiveBlockedCodes, assignedCodes] = await Promise.all([
    getAvailableTalents(project),
    getBlockedTalentsForProject(project),
    getAssignedTalentsForProject(project.slug),
  ]);
  const unavailable = new Set([...exclusiveBlockedCodes, ...assignedCodes]);
  const featured = talents.filter((t) => !unavailable.has(t.code)).slice(0, 6);
  const total = talents.length - unavailable.size;

  // Categorías únicas presentes en el catálogo, formateadas
  const CATEGORY_LABELS: Record<string, string> = {
    corporativo: "Corporativo",
    lifestyle: "Lifestyle",
    familiar: "Familiar",
    urbano: "Urbano",
    senior: "Senior",
    oficios: "Oficios",
    artistico: "Artístico",
    profesional: "Profesional",
  };
  const presentCategories = Array.from(new Set(talents.map((t) => t.category)))
    .map((c) => CATEGORY_LABELS[c] ?? c);

  const catalogHref = `/${rawLocale}/studio/talent/${projectSlug}/catalog`;
  const castingHref = `/${rawLocale}/studio/talent/${projectSlug}/casting`;

  const bands = [
    {
      num: "N° 01",
      title: "Navega como un",
      em: "libro.",
      desc: "Un grid de talentos indexados por arquetipo y tipo de licencia. Alterna entre vista editorial y vista de datos.",
    },
    {
      num: "N° 02",
      title: "Lee un perfil",
      em: "completo.",
      desc: "Ficha técnica, fotos de firma, capacidad de movimiento. Todo lo que un productor necesita en una sola página.",
    },
    {
      num: "N° 03",
      title: "Selecciona con",
      em: "cantidad.",
      desc: "Arma tu shortlist y asigna cantidades por uso. Envía la selección directamente a tu productor.",
    },
    {
      num: "N° 04",
      title: "Derechos,",
      em: "resueltos.",
      desc: "Territorios despejados, ventanas de uso claras. Sin misterios de derechos al momento de entrega.",
    },
  ];

  return (
    <div className="px-6 pb-20 sm:px-10" style={{ color: "var(--talent-ink)" }}>

      {/* ── Eyebrow bar ─────────────────────────────────────── */}
      <div
        className="flex flex-wrap items-baseline gap-x-8 gap-y-2 border-t py-3"
        style={{ borderColor: "var(--talent-ink)" }}
      >
        {[
          { label: "Volumen", value: "01 · 2026" },
          { label: "Para", value: project.client },
          { label: "Catálogo", value: `${total} talentos digitales` },
        ].map((col) => (
          <div
            key={col.label}
            className="font-mono text-[13px] uppercase tracking-[0.18em]"
          >
            <span className="mb-1 block" style={{ color: "var(--talent-ink-mute)" }}>
              {col.label}
            </span>
            {col.value}
          </div>
        ))}
      </div>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="grid items-end gap-8 pt-6 pb-10 lg:grid-cols-[1.2fr_0.9fr]">
        {/* Left — headline */}
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 800,
            fontSize: "clamp(56px, 9vw, 158px)",
            lineHeight: 0.88,
            letterSpacing: "-0.035em",
            color: "var(--talent-ink)",
            margin: 0,
          }}
        >
          Un catálogo de<br />
          talentos<br />
          digitales,<br />
          editado como<br />
          una{" "}
          <em style={{ fontStyle: "italic", color: "var(--accent)", fontWeight: "inherit" }}>
            revista.
          </em>
        </h1>

        {/* Right — description + CTAs */}
        <div className="flex flex-col gap-5 pb-2">
          <p
            className="font-mono text-[11px] uppercase tracking-[0.18em]"
            style={{ color: "var(--talent-ink-mute)" }}
          >
            Yutro Estudio — Casting House
          </p>
          <p
            className="leading-relaxed"
            style={{
              fontSize: "clamp(14px, 1.4vw, 17px)",
              color: "var(--talent-ink-dim)",
              maxWidth: "46ch",
            }}
          >
            Creamos talentos digitales listos para campaña, contrato y
            continuidad. Navega el roster, selecciona con cantidad y briefia
            a tu productor en una sola vista.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href={catalogHref}
              className="inline-flex items-center gap-2 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors"
              style={{
                background: "var(--talent-ink)",
                color: "var(--talent-bg)",
                border: "1px solid var(--talent-ink)",
              }}
            >
              Abrir el Catálogo <span style={{ opacity: 0.6 }}>↗</span>
            </Link>
            <Link
              href={castingHref}
              className="inline-flex items-center gap-2 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em]"
              style={{
                color: "var(--talent-ink)",
                border: "1px solid var(--talent-line)",
              }}
            >
              Ver selección
            </Link>
          </div>
        </div>
      </section>

      {/* ── Marquee categorías rotativas — loop infinito sin saltos ─── */}
      {presentCategories.length > 0 && (
        <div
          className="overflow-hidden border-y py-4"
          style={{ borderColor: "var(--talent-ink)" }}
        >
          <div
            className="flex w-max whitespace-nowrap"
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 800,
              fontSize: "clamp(28px, 4vw, 52px)",
              letterSpacing: "-0.025em",
              lineHeight: 1,
              color: "var(--talent-ink)",
              animation: "marquee-quad 60s linear infinite",
              willChange: "transform",
            }}
          >
            {/* Cuadruplicamos la lista — animación va a -25% (= 1 copia hacia la izquierda) */}
            {Array.from({ length: 4 }).flatMap((_, dup) =>
              presentCategories.map((cat, i) => (
                <span
                  key={`${dup}-${i}`}
                  className="flex shrink-0 items-center"
                  aria-hidden={dup > 0}
                >
                  <span>{cat}</span>
                  <span className="px-10" style={{ color: "var(--accent)" }}>·</span>
                </span>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── 4 Bands ─────────────────────────────────────────── */}
      <div
        className="grid grid-cols-1 border-b sm:grid-cols-2 lg:grid-cols-4"
        style={{ borderColor: "var(--talent-line)" }}
      >
        {bands.map((band, i) => (
          <div
            key={i}
            className="px-5 pb-8 pt-6"
            style={{
              borderLeft: i === 0 ? "none" : "1px solid var(--talent-line)",
            }}
          >
            <p
              className="font-mono text-[10.5px] uppercase tracking-[0.18em]"
              style={{ color: "var(--talent-ink-mute)" }}
            >
              {band.num}
            </p>
            <h3
              className="mb-3 mt-1.5"
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 800,
                fontSize: "clamp(18px, 2vw, 26px)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: "var(--talent-ink)",
              }}
            >
              {band.title}{" "}
              <em style={{ fontStyle: "italic", color: "var(--accent)", fontWeight: "inherit" }}>
                {band.em}
              </em>
            </h3>
            <p
              style={{
                fontSize: "clamp(13px, 1.1vw, 14.5px)",
                color: "var(--talent-ink-dim)",
                margin: 0,
                maxWidth: "32ch",
                lineHeight: 1.5,
              }}
            >
              {band.desc}
            </p>
          </div>
        ))}
      </div>

      {/* ── Featured covers ─────────────────────────────────── */}
      <section className="pt-10">
        <div
          className="mb-8 flex items-baseline justify-between border-b pb-4"
          style={{ borderColor: "var(--talent-ink)" }}
        >
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 800,
              fontSize: "clamp(24px, 3vw, 36px)",
              letterSpacing: "-0.025em",
              lineHeight: 1,
              margin: 0,
              color: "var(--talent-ink)",
            }}
          >
            Los covers de{" "}
            <em style={{ fontStyle: "italic", color: "var(--accent)", fontWeight: "inherit" }}>
              esta edición.
            </em>
          </h2>
          <span
            className="hidden font-mono text-[11px] uppercase tracking-[0.14em] sm:block"
            style={{ color: "var(--talent-ink-mute)" }}
          >
            Selección del Estudio · {featured.length} de {total}
          </span>
        </div>

        <LandingCovers
          talents={featured}
          locale={locale}
          projectSlug={projectSlug}
          catalogHref={catalogHref}
        />
      </section>

      {/* ── Bottom CTA ──────────────────────────────────────── */}
      <section
        className="mt-10 grid items-end gap-6 border-t pb-2 pt-8 sm:grid-cols-[1fr_auto]"
        style={{ borderColor: "var(--talent-ink)" }}
      >
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 56px)",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            margin: 0,
            maxWidth: "18ch",
            color: "var(--talent-ink)",
          }}
        >
          Abre el catálogo y comienza el{" "}
          <em style={{ fontStyle: "italic", color: "var(--accent)", fontWeight: "inherit" }}>
            casting.
          </em>
        </h2>

        <div className="flex flex-wrap gap-3">
          <Link
            href={catalogHref}
            className="inline-flex items-center gap-2 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors"
            style={{
              background: "var(--talent-ink)",
              color: "var(--talent-bg)",
              border: "1px solid var(--talent-ink)",
            }}
          >
            Entrar al Catálogo
          </Link>
          <Link
            href={castingHref}
            className="inline-flex items-center gap-2 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em]"
            style={{
              color: "var(--talent-ink)",
              border: "1px solid var(--talent-line)",
            }}
          >
            Ver casting cart
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <div
        className="mt-10 flex items-center justify-between border-t pt-5 pb-2"
        style={{ borderColor: "var(--talent-line)" }}
      >
        <span
          className="font-mono text-[10px] uppercase tracking-[0.18em]"
          style={{ color: "var(--talent-ink-mute)" }}
        >
          Yutro Estudio — Casting House
        </span>
        <a
          href="/"
          className="font-mono text-[10px] uppercase tracking-[0.18em] transition-opacity hover:opacity-60"
          style={{ color: "var(--talent-ink-mute)" }}
        >
          yutro.cl ↗
        </a>
      </div>
    </div>
  );
}
