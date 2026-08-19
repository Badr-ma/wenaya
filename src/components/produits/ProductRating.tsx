/**
 * ProductRating — shared dot-based rating component used in product cards and detail pages.
 * Renders 5 SVG circles (full, half, empty) to represent a numeric rating.
 */
"use client";

export default function ProductRating({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "md";
}): React.JSX.Element {
  const cls = size === "md" ? "w-3 h-3" : "w-2.5 h-2.5";
  return (
    <span className="inline-flex items-center gap-[2px]">
      {[1, 2, 3, 4, 5].map((dot) => {
        const remainder = rating - (dot - 1);
        let fill: "full" | "half" | "empty" = "empty";
        if (remainder >= 1) fill = "full";
        else if (remainder > 0) fill = "half";
        return (
          <svg key={dot} className={cls} viewBox="0 0 10 10">
            {fill === "full" && <circle cx="5" cy="5" r="4" fill="#FEBB58" />}
            {fill === "half" && (
              <>
                <circle cx="5" cy="5" r="4" fill="#D4C9B8" />
                <clipPath id={`pr-${size}-${dot}-${rating}`}>
                  <rect x="0" y="0" width="5" height="10" />
                </clipPath>
                <circle
                  cx="5"
                  cy="5"
                  r="4"
                  fill="#FEBB58"
                  clipPath={`url(#pr-${size}-${dot}-${rating})`}
                />
              </>
            )}
            {fill === "empty" && <circle cx="5" cy="5" r="4" fill="#D4C9B8" />}
          </svg>
        );
      })}
    </span>
  );
}
