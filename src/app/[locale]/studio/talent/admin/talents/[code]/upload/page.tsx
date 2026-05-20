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

  const galleryUrls: Record<string, string> = {};
  const galleryVariants: ImageVariant[] = [];
  for (const k of row.galleryKeys ?? []) {
    const m = k.match(/\/gallery-([1-8])\.(?:png|webp|jpg|jpeg)$/i);
    if (m) {
      const variant = `gallery-${m[1]}` as ImageVariant;
      galleryVariants.push(variant);
      // Si la key es local (path absoluto que empieza con /), la podemos usar como URL directa
      if (k.startsWith("/")) galleryUrls[variant] = k;
    }
  }

  const profileUrl = row.imageProfileKey?.startsWith("/") ? row.imageProfileKey : undefined;
  const charsheetUrl = row.imageCharsheetKey?.startsWith("/") ? row.imageCharsheetKey : undefined;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <AdminPageHeader
        eyebrow={`Subir imágenes · ${row.code}`}
        title={row.name}
        description="Sube las 10 imágenes producidas. Cada slot acepta JPG/PNG/WebP de hasta 12MB. El servidor las procesa con sharp (resize a 1600px max + strip EXIF) antes de guardarlas en R2."
        backHref={`${base}/talents/${code}`}
        backLabel="← Volver al talent"
      />
      <BulkUpload
        code={row.code}
        existing={{
          profile: Boolean(row.imageProfileKey),
          charsheet: Boolean(row.imageCharsheetKey),
          gallery: galleryVariants,
          localUrls: { profile: profileUrl, charsheet: charsheetUrl, ...galleryUrls },
        }}
        redirectTo={`${base}/talents/${code}`}
      />
    </div>
  );
}
