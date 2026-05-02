import { AdminPageHeader } from "@/components/studio/talent/admin/AdminPageHeader";
import { TalentForm } from "@/components/studio/talent/admin/TalentForm";

const EMPTY_INITIAL = {
  code: "",
  nameEs: "",
  nameEn: "",
  shortDescEs: "",
  shortDescEn: "",
  gender: "f" as const,
  ageRange: "",
  ageBucket: "30s" as const,
  phenotypeEs: "",
  phenotypeEn: "",
  archetypeEs: "",
  archetypeEn: "",
  category: "lifestyle" as const,
  toneCommercialEs: "",
  toneCommercialEn: "",
  market: ["CL", "LATAM"],
  suggestedUses: [],
  status: "available" as const,
  hue: 200,
  sat: 30,
  isActive: true,
};

export default async function AdminTalentNewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const base = `/${locale}/studio/talent/admin`;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <AdminPageHeader
        eyebrow="Catálogo"
        title="Nuevo talento"
        backHref={`${base}/talents`}
        backLabel="← Volver al catálogo"
      />
      <TalentForm
        initial={EMPTY_INITIAL}
        mode="create"
        onCancelHref={`${base}/talents`}
      />
    </div>
  );
}
