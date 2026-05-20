import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { talents } from "@/db/schema";
import Link from "next/link";
import { ImageIcon } from "lucide-react";
import { AdminPageHeader } from "@/components/studio/talent/admin/AdminPageHeader";
import { TalentForm } from "@/components/studio/talent/admin/TalentForm";
import { DeleteTalentButton } from "@/components/studio/talent/admin/DeleteTalentButton";
import {
  TALENT_AGE_BUCKETS,
  TALENT_CATEGORIES,
  TALENT_GENDERS,
  TALENT_STATUSES,
} from "@/lib/talent/admin-schemas";

export const dynamic = "force-dynamic";

export default async function AdminTalentEditPage({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = await params;
  const base = `/${locale}/studio/talent/admin`;

  const [row] = await db
    .select()
    .from(talents)
    .where(eq(talents.code, code))
    .limit(1);
  if (!row) notFound();

  const initial = {
    code: row.code,
    nameEs: row.nameEs,
    nameEn: row.nameEn,
    shortDescEs: row.shortDescEs,
    shortDescEn: row.shortDescEn,
    gender: row.gender as (typeof TALENT_GENDERS)[number],
    ageRange: row.ageRange,
    ageBucket: row.ageBucket as (typeof TALENT_AGE_BUCKETS)[number],
    phenotypeEs: row.phenotypeEs,
    phenotypeEn: row.phenotypeEn,
    archetypeEs: row.archetypeEs,
    archetypeEn: row.archetypeEn,
    category: row.category as (typeof TALENT_CATEGORIES)[number],
    toneCommercialEs: row.toneCommercialEs,
    toneCommercialEn: row.toneCommercialEn,
    bioEs: row.bioEs ?? "",
    bioEn: row.bioEn ?? "",
    market: row.market,
    suggestedUses: row.suggestedUses,
    status: row.status as (typeof TALENT_STATUSES)[number],
    hue: row.hue,
    sat: row.sat,
    editorialScore: row.editorialScore,
    isActive: row.isActive,
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <AdminPageHeader
        eyebrow={`Editar · ${row.code}`}
        title={row.nameEs}
        backHref={`${base}/talents`}
        backLabel="← Volver al catálogo"
      />

      <div className="mb-8">
        <Link
          href={`${base}/talents/${row.code}/upload`}
          className="inline-flex items-center gap-2 border border-white/[0.08] bg-[#0a0a0a] px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white/70 transition-colors hover:border-[var(--accent)]/40 hover:text-white"
        >
          <ImageIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
          Subir / actualizar imágenes
        </Link>
      </div>

      <TalentForm
        initial={initial}
        mode="edit"
        onCancelHref={`${base}/talents`}
      />
      {row.isActive && (
        <div className="mt-12 border-t border-white/[0.08] pt-8">
          <h2 className="mb-3 text-[15px] text-white">Zona peligrosa</h2>
          <p className="mb-4 max-w-2xl text-[13px] text-white/55">
            Desactivar el talento lo oculta del catálogo del cliente. La data
            queda en DB y se puede reactivar desde aquí mismo (poniendo activo).
          </p>
          <DeleteTalentButton
            code={row.code}
            redirectTo={`${base}/talents`}
          />
        </div>
      )}
    </div>
  );
}
