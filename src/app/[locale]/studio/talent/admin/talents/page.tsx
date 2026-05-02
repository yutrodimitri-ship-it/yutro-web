import { desc } from "drizzle-orm";
import { db } from "@/db";
import { talents } from "@/db/schema";
import { AdminPageHeader } from "@/components/studio/talent/admin/AdminPageHeader";
import { AdminTable } from "@/components/studio/talent/admin/AdminTable";

export const dynamic = "force-dynamic";

export default async function AdminTalentsListPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const base = `/${locale}/studio/talent/admin`;

  const rows = await db.select().from(talents).orderBy(desc(talents.createdAt));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <AdminPageHeader
        eyebrow="Catálogo"
        title="Talents"
        description={`${rows.length} talentos en el catálogo (activos e inactivos).`}
        backHref={base}
        backLabel="← Volver al admin"
        newHref={`${base}/talents/new`}
        newLabel="Nuevo talento"
      />

      <AdminTable
        rows={rows.map((r) => ({
          id: r.code,
          code: r.code,
          name: r.nameEs,
          gender: r.gender === "f" ? "Mujer" : "Hombre",
          age: r.ageRange,
          category: r.category,
          status: r.status,
          isActive: r.isActive,
        }))}
        rowHref={(r) => `${base}/talents/${r.code}`}
        columns={[
          { header: "Código", cell: (r) => <span className="font-mono text-[12px] text-white">{r.code}</span> },
          { header: "Nombre", cell: (r) => r.name },
          { header: "Género", cell: (r) => r.gender },
          { header: "Edad", cell: (r) => r.age },
          { header: "Categoría", cell: (r) => r.category },
          { header: "Status", cell: (r) => r.status },
          {
            header: "Activo",
            cell: (r) =>
              r.isActive ? (
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              ) : (
                <span className="inline-block h-2 w-2 rounded-full bg-white/20" />
              ),
          },
        ]}
        emptyMessage="No hay talentos. Crea el primero."
      />
    </div>
  );
}
