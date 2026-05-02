/**
 * Skeletons para los loading.tsx del modulo Talent. Coherentes con el layout
 * final de cada pantalla. Color base oscuro con shimmer dorado sutil.
 */

interface SkeletonBoxProps {
  /** Aspect ratio CSS string (ej. "3 / 4", "1 / 1"). Default: free. */
  aspect?: string;
  className?: string;
  height?: string;
}

export function SkeletonBox({ aspect, className = "", height }: SkeletonBoxProps) {
  return (
    <div
      className={`talent-skeleton relative overflow-hidden ${className}`}
      style={{
        aspectRatio: aspect,
        height,
        background: "color-mix(in oklch, white 4%, transparent)",
      }}
    />
  );
}

export function CatalogSkeleton() {
  return (
    <div className="space-y-12">
      <header className="space-y-4 border-b pb-8" style={{ borderColor: "color-mix(in oklch, white 8%, transparent)" }}>
        <SkeletonBox className="w-1/3" height="14px" />
        <SkeletonBox className="w-2/3 max-w-xl" height="48px" />
        <SkeletonBox className="w-full max-w-md" height="20px" />
      </header>
      <div className="flex gap-12">
        <SkeletonBox className="w-24" height="56px" />
        <SkeletonBox className="w-24" height="56px" />
        <SkeletonBox className="w-24" height="56px" />
      </div>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonBox key={i} aspect="3 / 4" />
        ))}
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-12">
      <SkeletonBox className="w-32" height="14px" />
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-12">
          <SkeletonBox aspect="3 / 4" />
          <div>
            <SkeletonBox className="mb-3 w-1/3" height="16px" />
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonBox key={i} aspect="1 / 1" />
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-7">
          <SkeletonBox className="w-1/4" height="14px" />
          <SkeletonBox className="w-2/3" height="44px" />
          <SkeletonBox className="w-1/2" height="20px" />
          <div className="grid grid-cols-2 gap-6 border-y py-7" style={{ borderColor: "color-mix(in oklch, white 8%, transparent)" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <SkeletonBox className="w-1/2" height="11px" />
                <SkeletonBox className="w-3/4" height="18px" />
              </div>
            ))}
          </div>
          <SkeletonBox height="48px" />
        </div>
      </div>
    </div>
  );
}

export function CastingSkeleton() {
  return (
    <div className="space-y-12">
      <SkeletonBox className="w-32" height="14px" />
      <header className="space-y-4">
        <SkeletonBox className="w-1/3" height="14px" />
        <SkeletonBox className="w-1/2 max-w-md" height="48px" />
        <SkeletonBox className="w-full max-w-xl" height="20px" />
      </header>
      <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBox key={i} height="120px" />
          ))}
        </div>
        <SkeletonBox height="500px" />
      </div>
    </div>
  );
}
