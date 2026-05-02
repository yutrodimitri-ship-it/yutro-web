import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { talents } from "@/db/schema";
import { AdminPageHeader } from "@/components/studio/talent/admin/AdminPageHeader";
import { BulkUpload } from "@/components/studio/talent/admin/BulkUpload";
import type { ImageVariant } from "@/lib/talent/image-variants";

export const dynamic = "force-dynamic";

export default async function AdminTalentUploadPage({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = await params;
  const base = `/${locale}/studio/talent/admin`;

  const [row] = await db
    .select({
      code: talents.code,
      name: talents.nameEs,
      imageProfileKey: talents.imageProfileKey,
      imageCharsheetKey: talents.imageCharsheetKey,
      galleryKeys: talents.galleryKeys,
    })
    .from(talents)
    .where(eq(talents.code, code))
    .limit(1);
  if (!row) notFound();

  const galleryVariants: ImageVariant[] = (row.galleryKeys ?? [])
    .map((k) => k.match(/\/(studio-[123]|lifestyle-[123])\.jpg$/)?.[1] ?? null)
    .filter((v): v is ImageVariant => Boolean(v));

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <AdminPageHeader
        eyebrow={`Subir imágenes · ${row.code}`}
        title={row.name}
        description="Sube las 8 imágenes producidas. Cada slot acepta JPG/PNG/WebP de hasta 12MB. El servidor las procesa con sharp (resize a 1600px max + strip EXIF) antes de guardarlas en R2."
        backHref={`${base}/talents/${code}`}
        backLabel="← Volver al talent"
      />
      <BulkUpload
        code={row.code}
        existing={{
          profile: Boolean(row.imageProfileKey),
          charsheet: Boolean(row.imageCharsheetKey),
          gallery: galleryVariants,
        }}
        redirectTo={`${base}/talents/${code}`}
      />
    </div>
  );
}
