import Image from "next/image";
import { Link } from "@/i18n/navigation";
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

export function TalentCardPublic({
  talent,
  variant = "standard",
  priority = false,
  locale,
}: TalentCardPublicProps) {
  const name = locale === "es" ? talent.nameEs : talent.nameEn;
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

        {/* Overlay editorial bottom — solo el nombre */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-4 sm:p-5">
          <p
            className="font-heading text-lg font-bold leading-tight text-white sm:text-xl"
            style={{ letterSpacing: "-0.015em" }}
          >
            {name}
          </p>
        </div>
      </div>
    </Link>
  );
}
