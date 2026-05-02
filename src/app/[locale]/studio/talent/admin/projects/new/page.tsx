import { eq } from "drizzle-orm";
import { db } from "@/db";
import { talents } from "@/db/schema";
import { AdminPageHeader } from "@/components/studio/talent/admin/AdminPageHeader";
import { ProjectForm } from "@/components/studio/talent/admin/ProjectForm";

const today = new Date().toISOString().slice(0, 10);

const EMPTY_INITIAL = {
  slug: "",
  name: "",
  client: "",
  contactEmail: "",
  contactName: "",
  market: "Chile",
  rightsDurationEs: "",
  rightsDurationEn: "",
  exclusivityMode: "none" as const,
  exclusivityCategoryEs: null as string | null,
  exclusivityCategoryEn: null as string | null,
  exclusivityHelpEs: "",
  exclusivityHelpEn: "",
  maxTalents: 10,
  maxExclusive: 3,
  startDate: today,
  blockedTalentCodes: [] as string[],
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

  const talentRows = await db
    .select({ code: talents.code, name: talents.nameEs })
    .from(talents)
    .where(eq(talents.isActive, true));

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
        talentOptions={talentRows}
      />
    </div>
  );
}
