/**
 * ProductCard — reusable product card for catalog grids, related products,
 * and brand product sections. Server Component compatible.
 *
 * Uses the shared Product type from @/types/product.ts.
 * Conditionally renders optional fields (brand, rating, price, badges, category).
 */
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import ProductRating from "./ProductRating";
import { h } from "@/lib/href";

type ProductCardProps = {
  product: Product;
  locale?: string;
  variant?: "default" | "compact";
};

function formatPrice(price: number, currency?: string): string {
  const formatted = new Intl.NumberFormat("fr-MA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
  return currency ? `${formatted} ${currency}` : formatted;
}

export default function ProductCard({
  product,
  locale = "fr",
  variant = "default",
}: ProductCardProps): React.JSX.Element {
  const imageSrc = product.images?.[0]?.src || product.thumbnail || "";
  const imageAlt = product.images?.[0]?.alt || product.name;
  const hasImage = Boolean(imageSrc);
  const hasRating = product.rating != null;
  const hasPrice = product.price != null;
  const hasBadges = Boolean(product.badges?.length);
  const isFeatured = Boolean(product.featured);
  const hasDescription = variant === "default" && Boolean(product.description);
  const hasCategory = variant === "default" && Boolean(product.category);

  const isCompact = variant === "compact";

  return (
    <article className="group relative">
      <Link
        href={h(locale as "fr" | "en", `/produits/${product.slug}`)}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-2 rounded-xl"
      >
        {/* ── Image ── */}
        <div className="relative aspect-square rounded-xl overflow-hidden bg-[#E8E2D9]">
          {hasImage ? (
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover transition-opacity duration-500 group-hover:opacity-90"
              sizes={
                isCompact
                  ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              }
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-[#0B1220]/[0.08]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
          )}

          {/* ── Badge ── */}
          {(hasBadges || isFeatured) && (
            <span className="absolute top-3 left-3 bg-[#B88A5A] text-white text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full">
              {isFeatured ? "Featured" : product.badges![0]}
            </span>
          )}
        </div>

        {/* ── Content ── */}
        <div className={isCompact ? "mt-3" : "mt-4"}>
          {/* ── Brand ── */}
          {product.brand && (
            <p className="text-[10px] font-mono uppercase tracking-[0.1em] text-[#2B2F36]/30 mb-1">
              {product.brand}
            </p>
          )}

          {/* ── Name ── */}
          <h2
            className={`font-heading font-bold text-[#0B1220] leading-snug group-hover:text-[#B88A5A] transition-colors duration-200 ${
              isCompact ? "text-sm" : "text-lg"
            }`}
          >
            {product.name}
          </h2>

          {/* ── Rating ── */}
          {hasRating && (
            <div
              className="flex items-center gap-0.5 mt-1"
              role="img"
              aria-label={`Note: ${product.rating} sur 5${product.reviewCount != null ? `, ${product.reviewCount} avis` : ""}`}
            >
              <ProductRating rating={product.rating!} />
              <span className="text-xs text-[#2B2F36]/50 ml-1">
                <span className="font-medium">{product.rating}</span>
                {product.reviewCount != null && (
                  <>
                    <span className="mx-1">·</span>
                    {product.reviewCount} avis
                  </>
                )}
              </span>
            </div>
          )}

          {/* ── Description ── */}
          {hasDescription && (
            <p className="text-sm text-[#2B2F36]/60 leading-relaxed line-clamp-3 mt-2">
              {product.description}
            </p>
          )}

          {/* ── Category ── */}
          {hasCategory && (
            <p className="text-[10px] font-mono uppercase tracking-[0.1em] text-[#B88A5A] mt-2">
              {product.category}
            </p>
          )}

          {/* ── Price ── */}
          {hasPrice && (
            <p className="text-sm font-semibold text-[#0B1220] mt-2">
              {formatPrice(product.price!, product.currency)}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
