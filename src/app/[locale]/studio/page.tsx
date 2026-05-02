import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { verifySession } from "@/lib/auth";
import { userHasTalentAccess } from "@/lib/talent/data-source";
import { StudioHubCard } from "@/components/studio/talent/StudioHubCard";

/**
 * Hub Yutro Studio — landing page tras el login.
 *
 * Renderiza dos puertas condicionadas:
 *   1. Mis Avatares     (siempre visible) → /studio/dashboard
 *   2. Catalogo Talent  (solo clientes con proyecto activo) → /studio/talent
 *
 * En Fase 1 la visibilidad se calcula con TALENT_CLIENT_EMAILS (lista mock).
 * En Fase 2 se reemplaza por query a la tabla `projects`.
 */
export default async function StudioHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await verifySession();
  if (!session) redirect(`/${locale}/studio/login`);

  const t = await getTranslations({ locale, namespace: "studio.talent.hub" });
  const showTalentLibrary = await userHasTalentAccess(session.email);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <header className="mb-12 sm:mb-16">
        <p
          className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white/40"
          style={{ fontFamily: "ui-monospace, monospace" }}
        >
          {t("eyebrow")}
        </p>
        <h1
          className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {t("title")}
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-white/55 sm:text-lg">
          {t("subtitle")}
        </p>
      </header>

      <div
        className={`grid gap-5 sm:gap-6 ${
          showTalentLibrary
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1 max-w-2xl"
        }`}
      >
        <StudioHubCard
          href={`/${locale}/studio/dashboard`}
          title={t("avatars.title")}
          description={t("avatars.description")}
          cta={t("avatars.cta")}
          icon="sparkles"
          accent="primary"
        />

        {showTalentLibrary && (
          <StudioHubCard
            href={`/${locale}/studio/talent`}
            title={t("library.title")}
            description={t("library.description")}
            cta={t("library.cta")}
            icon="users"
            accent="gold"
            badge={t("library.badge")}
          />
        )}
      </div>

      {!showTalentLibrary && (
        <p className="mt-8 max-w-2xl text-xs leading-relaxed text-white/30">
          {t("noTalentAccessNote")}
        </p>
      )}
    </div>
  );
}
