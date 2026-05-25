import { redirect } from "next/navigation";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { ndaAcceptances } from "@/db/schema";
import { verifySession } from "@/lib/auth";
import { getProjectBySlug } from "@/lib/talent/data-source";
import { CastingProvider } from "@/lib/talent/casting-context";
import { TalentSessionProvider } from "@/lib/talent/talent-session-context";
import { logAuditEventServer } from "@/lib/talent/audit-log-server";
import { ToastProvider } from "@/components/studio/talent/Toast";
import { NdaGate } from "@/components/studio/talent/NdaGate";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; projectSlug: string }>;
}) {
  const { locale: rawLocale, projectSlug } = await params;

  const session = await verifySession();
  if (!session) redirect(`/${rawLocale}/studio/login`);

  const project = await getProjectBySlug(projectSlug);
  if (!project) redirect(`/${rawLocale}/studio/talent`);

  // NDA status resuelto server-side — elimina el flash de cliente
  const [ndaRow] = await db
    .select({ id: ndaAcceptances.id })
    .from(ndaAcceptances)
    .where(
      and(
        eq(ndaAcceptances.projectSlug, project.slug),
        eq(ndaAcceptances.userEmail, session.email.toLowerCase()),
        isNull(ndaAcceptances.revokedAt)
      )
    )
    .limit(1);
  const ndaAccepted = Boolean(ndaRow);

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
            initialAccepted={ndaAccepted}
          >
            <div
              data-talent="project"
              className="studio-talent -mx-6 -mt-6 sm:-mx-10 sm:-mt-10 md:-mt-10"
            >
              {children}
            </div>
          </NdaGate>
        </ToastProvider>
      </CastingProvider>
    </TalentSessionProvider>
  );
}
