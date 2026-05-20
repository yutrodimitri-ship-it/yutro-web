import { AdminPageHeader } from "@/components/studio/talent/admin/AdminPageHeader";
import { LocksTable } from "@/components/studio/talent/admin/LocksTable";
import { getCommittedTalents } from "@/lib/talent/data-source";

export const dynamic = "force-dynamic";

export default async function AdminLocksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const base = `/${locale}/studio/talent/admin`;

  const committed = await getCommittedTalents();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 sm:px-6 sm:py-12">
      <AdminPageHeader
        eyebrow="Talent Admin"
        title="Talentos comprometidos"
        description={`${committed.length} talentos actualmente comprometidos en castings confirmados.`}
        backHref={`${base}`}
        backLabel="← Volver"
      />

      <LocksTable items={committed} />
    </div>
  );
}
