import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { FeaturedBadge } from "./FeaturedBadge";
import {
  resolvePublicImage,
  type PublicTalentCard,
} from "@/lib/talents-public";

interface TalentCardPublicProps {
  talent: PublicTalentCard;
  variant?: "featured" | "standard";
  /** LCP priority — solo true para 1-2 cards arriba del fold. */
  priority?: boolean;
  locale: "es" | "en";
}

const CATEGORY_LABELS: Record<string, { es: string; en: string }> = {
  corporativo: { es: "Corporativo", en: "Corporate" },
  lifestyle: { es: "Lifestyle", en: "Lifestyle" },
  familiar: { es: "Familiar", en: "Family" },
  urbano: { es: "Urbano", en: "Urban" },
  senior: { es: "Senior", en: "Senior" },
  oficios: { es: "Oficios", en: "Trades" },
  artistico: { es: "Artístico", en: "Artistic" },
  profesional: { es: "Profesional", en: "Professional" },
};

export function TalentCardPublic({
  talent,
  variant = "standard",
  priority = false,
  locale,
}: TalentCardPublicProps) {
  const name = locale === "es" ? talent.nameEs : talent.nameEn;
  const categoryLabel =
    CATEGORY_LABELS[talent.category]?.[locale] ?? talent.category;
  const imageSrc = resolvePublicImage(talent.imageProfileKey);
  const isFeatured = variant === "featured";

  return (
    <Link
      href={`/casting/${talent.slug}`}
      className="group relative block overflow-hidden"
    >
      {/* Imagen — aspect ratio editorial 3:4 */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-foreground/5">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={name}
            fill
            sizes={
              isFeatured
                ? "(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                : "(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
            }
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            priority={priority}
          />
        ) : (
          // Placeholder editorial cuando la imagen no esta enrutada
          // publicamente todavia (R2 keys de talents standard).
          <div className="h-full w-full bg-gradient-to-br from-foreground/15 to-foreground/5" />
        )}

        {/* Watermark sutil — texto pequeno YUTRO . VOL.01 */}
        <span
          className="pointer-events-none absolute right-2 bottom-2 font-mono text-[8px] uppercase tracking-[0.18em] text-white/40 mix-blend-overlay"
          aria-hidden
        >
          Yutro · Vol. 01
        </span>

        {/* Overlay editorial bottom — meta + nombre */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-4 sm:p-5">
          <div className="mb-1 flex items-center justify-between gap-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
              {categoryLabel} · {talent.ageRange}
            </p>
            {isFeatured && <FeaturedBadge locale={locale} />}
          </div>
          <p
            className="font-heading text-lg font-bold leading-tight text-white sm:text-xl"
            style={{ letterSpacing: "-0.015em" }}
          >
            {name}
          </p>
          {isFeatured && talent.instagramFollowers && (
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
              {formatFollowers(talent.instagramFollowers)} {locale === "es" ? "seguidores" : "followers"}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

function formatFollowers(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    return `${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}K`;
  }
  return String(n);
}
