import { notFound, redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import { getProjectBySlug } from "@/lib/talent/data-source";
import { CastingProvider } from "@/lib/talent/casting-context";
import { TalentSessionProvider } from "@/lib/talent/talent-session-context";
import { logAuditEventServer } from "@/lib/talent/audit-log-server";
import { ToastProvider } from "@/components/studio/talent/Toast";
import { NdaGate } from "@/components/studio/talent/NdaGate";
import { WelcomeGate } from "@/components/studio/talent/WelcomeGate";
import type { Locale } from "@/types/talent";

/**
 * Layout del proyecto Talent.
 *
 * Resuelve el proyecto desde el slug y monta UNA SOLA INSTANCIA del
 * CastingProvider + ToastProvider para todas las pantallas hijas (catalogo,
 * detalle, casting). Tambien envuelve con NdaGate (modal click-wrap previo
 * al catalogo) y WelcomeGate (splash de bienvenida la primera vez).
 *
 * Side effect server-side: loguea audit event `session_start` cada vez que
 * el cliente entra al proyecto. En Fase 1 va a console; en Fase 2 va a DB.
 */
export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; projectSlug: string }>;
}) {
  const { locale: rawLocale, projectSlug } = await params;
  const locale: Locale = rawLocale === "en" ? "en" : "es";

  const session = await verifySession();
  if (!session) redirect(`/${rawLocale}/studio/login`);

  const project = await getProjectBySlug(projectSlug);
  if (!project) notFound();

  // Audit log: session_start (server-side, persiste en talent_access_logs)
  void logAuditEventServer("session_start", {
    userEmail: session.email,
    projectSlug: project.slug,
    payload: { client: project.client, projectName: project.name },
  });

  const hubHref = `/${rawLocale}/studio`;

  return (
    <TalentSessionProvider
      userEmail={session.email}
      projectSlug={project.slug}
    >
      <CastingProvider
        projectSlug={project.slug}
        maxTalents={project.maxTalents}
        maxExclusive={project.maxExclusive}
      >
        <ToastProvider>
          <NdaGate
            projectName={project.name}
            clientName={project.client}
            hubHref={hubHref}
          >
            <WelcomeGate project={project} locale={locale}>
              <div data-talent="project">{children}</div>
            </WelcomeGate>
          </NdaGate>
        </ToastProvider>
      </CastingProvider>
    </TalentSessionProvider>
  );
}
