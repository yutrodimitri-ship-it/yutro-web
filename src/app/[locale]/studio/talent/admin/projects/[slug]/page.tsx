import { notFound } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  ndaAcceptances,
  talentProjectAccess,
  talentProjects,
  talents,
} from "@/db/schema";
import { AdminPageHeader } from "@/components/studio/talent/admin/AdminPageHeader";
import { ProjectForm } from "@/components/studio/talent/admin/ProjectForm";
import { ProjectAccessManager } from "@/components/studio/talent/admin/ProjectAccessManager";
import { ProjectNdaManager } from "@/components/studio/talent/admin/ProjectNdaManager";
import {
  EXCLUSIVITY_MODES,
  PROJECT_STATUSES,
} from "@/lib/talent/admin-schemas";

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

  const [accessRows, ndaRows, talentRows] = await Promise.all([
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
      .select({ code: talents.code, name: talents.nameEs })
      .from(talents)
      .where(eq(talents.isActive, true)),
  ]);

  const initial = {
    slug: project.slug,
    name: project.name,
    client: project.client,
    contactEmail: project.contactEmail,
    contactName: project.contactName,
    market: project.market,
    rightsDurationEs: project.rightsDurationEs,
    rightsDurationEn: project.rightsDurationEn,
    exclusivityMode: project.exclusivityMode as (typeof EXCLUSIVITY_MODES)[number],
    exclusivityCategoryEs: project.exclusivityCategoryEs,
    exclusivityCategoryEn: project.exclusivityCategoryEn,
    exclusivityHelpEs: project.exclusivityHelpEs,
    exclusivityHelpEn: project.exclusivityHelpEn,
    maxTalents: project.maxTalents,
    maxExclusive: project.maxExclusive,
    startDate: project.startDate,
    blockedTalentCodes: project.blockedTalentCodes,
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
        talentOptions={talentRows}
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
    </div>
  );
}
