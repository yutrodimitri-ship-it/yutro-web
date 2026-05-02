import { count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  castingSubmissions,
  talentProjectAccess,
  talentProjects,
} from "@/db/schema";
import { AdminPageHeader } from "@/components/studio/talent/admin/AdminPageHeader";
import { AdminTable } from "@/components/studio/talent/admin/AdminTable";

export const dynamic = "force-dynamic";

export default async function AdminProjectsListPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const base = `/${locale}/studio/talent/admin`;

  const projects = await db
    .select()
    .from(talentProjects)
    .orderBy(desc(talentProjects.createdAt));

  // Counts paralelos
  const accessCounts = await Promise.all(
    projects.map((p) =>
      db
        .select({ n: count() })
        .from(talentProjectAccess)
        .where(eq(talentProjectAccess.projectSlug, p.slug))
        .then((r) => r[0]?.n ?? 0)
    )
  );
  const submissionCounts = await Promise.all(
    projects.map((p) =>
      db
        .select({ n: count() })
        .from(castingSubmissions)
        .where(eq(castingSubmissions.projectSlug, p.slug))
        .then((r) => r[0]?.n ?? 0)
    )
  );

  const rows = projects.map((p, i) => ({
    id: p.slug,
    slug: p.slug,
    name: p.name,
    client: p.client,
    status: p.status,
    accesses: accessCounts[i],
    submissions: submissionCounts[i],
  }));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <AdminPageHeader
        eyebrow="Proyectos"
        title="Proyectos Talent"
        description={`${projects.length} proyecto(s) configurado(s).`}
        backHref={base}
        backLabel="← Volver al admin"
        newHref={`${base}/projects/new`}
        newLabel="Nuevo proyecto"
      />

      <AdminTable
        rows={rows}
        rowHref={(r) => `${base}/projects/${r.slug}`}
        columns={[
          { header: "Slug", cell: (r) => <span className="font-mono text-[12px] text-white">{r.slug}</span> },
          { header: "Nombre", cell: (r) => r.name },
          { header: "Cliente", cell: (r) => r.client },
          { header: "Status", cell: (r) => r.status },
          { header: "Accesos", cell: (r) => r.accesses },
          { header: "Submissions", cell: (r) => r.submissions },
        ]}
        emptyMessage="No hay proyectos. Crea el primero."
      />
    </div>
  );
}
