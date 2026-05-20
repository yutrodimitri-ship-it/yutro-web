import { notFound } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  castingSubmissions,
  ndaAcceptances,
  talentProjectAccess,
  talentProjects,
} from "@/db/schema";
import { AdminPageHeader } from "@/components/studio/talent/admin/AdminPageHeader";
import { ProjectForm } from "@/components/studio/talent/admin/ProjectForm";
import { ProjectAccessManager } from "@/components/studio/talent/admin/ProjectAccessManager";
import { ProjectNdaManager } from "@/components/studio/talent/admin/ProjectNdaManager";
import { ProjectSubmissionsPanel } from "@/components/studio/talent/admin/ProjectSubmissionsPanel";
import { PROJECT_STATUSES } from "@/lib/talent/admin-schemas";

export const dynamic = "force-dynamic";

export default async function AdminProjectEditPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const base = `/${locale}/studio/talent/admin`;

  const [project] = await db
    .select()
    .from(talentProjects)
    .where(eq(talentProjects.slug, slug))
    .limit(1);
  if (!project) notFound();

  const [accessRows, ndaRows, submissionRows] = await Promise.all([
    db
      .select()
      .from(talentProjectAccess)
      .where(eq(talentProjectAccess.projectSlug, slug))
      .orderBy(desc(talentProjectAccess.grantedAt)),
    db
      .select()
      .from(ndaAcceptances)
      .where(eq(ndaAcceptances.projectSlug, slug))
      .orderBy(desc(ndaAcceptances.acceptedAt)),
    db
      .select()
      .from(castingSubmissions)
      .where(eq(castingSubmissions.projectSlug, slug))
      .orderBy(desc(castingSubmissions.submittedAt)),
  ]);

  const initial = {
    slug: project.slug,
    name: project.name,
    client: project.client,
    market: project.market,
    categoryEs: project.categoryEs,
    maxTalents: project.maxTalents,
    maxExclusive: project.maxExclusive,
    rightsDurationMonths: project.rightsDurationMonths,
    startDate: project.startDate,
    status: project.status as (typeof PROJECT_STATUSES)[number],
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-12 px-4 py-10 sm:px-6 sm:py-12">
      <AdminPageHeader
        eyebrow={`Proyecto · ${project.slug}`}
        title={project.name}
        description={`Cliente: ${project.client}`}
        backHref={`${base}/projects`}
        backLabel="← Volver a proyectos"
      />

      <ProjectForm
        initial={initial}
        mode="edit"
        onCancelHref={`${base}/projects`}
      />

      <hr className="border-white/[0.08]" />

      <ProjectAccessManager
        slug={slug}
        accesses={accessRows.map((a) => ({
          id: a.id,
          email: a.userEmail,
          grantedAt: a.grantedAt.toISOString(),
          revokedAt: a.revokedAt?.toISOString() ?? null,
        }))}
      />

      <hr className="border-white/[0.08]" />

      <ProjectNdaManager
        slug={slug}
        ndas={ndaRows.map((n) => ({
          id: n.id,
          email: n.userEmail,
          acceptedAt: n.acceptedAt.toISOString(),
          ipAddress: n.ipAddress,
          revokedAt: n.revokedAt?.toISOString() ?? null,
        }))}
      />

      <hr className="border-white/[0.08]" />

      <section className="space-y-4">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/40">
          Envíos de casting ({submissionRows.length})
        </h2>
        <ProjectSubmissionsPanel
          projectSlug={slug}
          submissions={submissionRows.map((s) => ({
            id: s.id,
            userEmail: s.userEmail,
            shortlist: s.shortlist,
            exclusives: s.exclusives,
            status: s.status,
            submittedAt: s.submittedAt.toISOString(),
            adminNotes: s.adminNotes ?? null,
          }))}
        />
      </section>
    </div>
  );
}
