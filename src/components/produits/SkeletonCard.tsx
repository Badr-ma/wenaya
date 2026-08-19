/**
 * SkeletonCard — loading skeleton that visually matches ProductCard.
 * Server Component compatible. No "use client".
 *
 * Renders pulsing placeholder blocks in the same layout hierarchy as ProductCard
 * so the page doesn't shift when real data loads.
 */

type SkeletonCardProps = {
  variant?: "default" | "compact";
};

export default function SkeletonCard({
  variant = "default",
}: SkeletonCardProps): React.JSX.Element {
  const isCompact = variant === "compact";

  return (
    <div aria-hidden="true" className="select-none pointer-events-none">
      {/* ── Image ── */}
      <div className="aspect-square rounded-xl bg-[#E8E2D9] animate-pulse" />

      {/* ── Content ── */}
      <div className={isCompact ? "mt-3 space-y-2" : "mt-4 space-y-2.5"}>
        {/* Brand */}
        {!isCompact && (
          <div className="h-2 w-16 bg-[#E8E2D9] rounded animate-pulse" />
        )}

        {/* Title */}
        <div
          className={`bg-[#E8E2D9] rounded animate-pulse ${
            isCompact ? "h-3.5 w-3/4" : "h-5 w-4/5"
          }`}
        />

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex gap-[3px]">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`rounded-full bg-[#E8E2D9] animate-pulse ${
                  isCompact ? "w-2 h-2" : "w-2.5 h-2.5"
                }`}
              />
            ))}
          </div>
          <div className="h-2.5 w-10 bg-[#E8E2D9] rounded animate-pulse" />
        </div>

        {/* Description */}
        {!isCompact && (
          <div className="space-y-1.5 pt-0.5">
            <div className="h-3 w-full bg-[#E8E2D9] rounded animate-pulse" />
            <div className="h-3 w-full bg-[#E8E2D9] rounded animate-pulse" />
            <div className="h-3 w-2/3 bg-[#E8E2D9] rounded animate-pulse" />
          </div>
        )}

        {/* Category */}
        {!isCompact && (
          <div className="h-2 w-20 bg-[#E8E2D9] rounded animate-pulse pt-0.5" />
        )}

        {/* Price area — reserved for future */}
      </div>
    </div>
  );
}
