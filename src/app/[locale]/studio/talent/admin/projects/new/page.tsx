import { AdminPageHeader } from "@/components/studio/talent/admin/AdminPageHeader";
import { ProjectForm } from "@/components/studio/talent/admin/ProjectForm";

const today = new Date().toISOString().slice(0, 10);

const EMPTY_INITIAL = {
  slug: "",
  name: "",
  client: "",
  market: "Chile",
  categoryEs: "",
  maxTalents: 10,
  maxExclusive: 3,
  rightsDurationMonths: 12,
  startDate: today,
  status: "active" as const,
};

export const dynamic = "force-dynamic";

export default async function AdminProjectNewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const base = `/${locale}/studio/talent/admin`;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <AdminPageHeader
        eyebrow="Proyectos"
        title="Nuevo proyecto"
        backHref={`${base}/projects`}
        backLabel="← Volver a proyectos"
      />
      <ProjectForm
        initial={EMPTY_INITIAL}
        mode="create"
        onCancelHref={`${base}/projects`}
      />
    </div>
  );
}
