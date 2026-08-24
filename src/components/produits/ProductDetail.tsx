/**
 * Product Detail — premium, data-driven product page.
 * Server Component compatible — receives all data and translation functions as props.
 * Two-column hero (desktop), stacked (mobile). Commerce-ready architecture.
 * Reuses: ProductCard, ProductRating, EntityTags. No duplicated components.
 */
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import ProductCard from "./ProductCard";
import ProductRating from "./ProductRating";
import EntityTags from "./EntityTags";
import CartActions from "./CartActions";
import { h } from "@/lib/href";

type TFn = (key: string) => string;
type TRawFn = <T>(key: string) => T;

export default function ProductDetail({
  product,
  relatedProducts,
  brandProducts,
  locale,
  t,
  tRaw,
}: {
  product: Product;
  relatedProducts: Product[];
  brandProducts: Product[];
  locale: string;
  t: TFn;
  tRaw: TRawFn;
}): React.JSX.Element {
  const imageSrc = product.images?.[0]?.src || product.thumbnail || "";
  const imageAlt = product.images?.[0]?.alt || product.name;
  const hasImage = Boolean(imageSrc);
  const hasRating = product.rating != null;
  const hasPrice = product.price != null;
  const hasAvailability = product.availability != null;
  const hasPurchaseUrl = Boolean(product.purchaseUrl);
  const hasWebsiteUrl = Boolean(product.websiteUrl);
  const hasBrand = Boolean(product.brand);
  const hasGoals = Boolean(product.goals?.length);
  const hasTopics = Boolean(product.topics?.length);
  const hasBenefits = Boolean(product.benefits?.length);
  const hasSpecifications = Boolean(product.specifications && Object.keys(product.specifications).length > 0);
  const hasIngredients = Boolean(product.ingredients?.length);
  const hasRelatedProducts = relatedProducts.length > 0;
  const hasBrandProducts = brandProducts.length > 0;
  const hasReviews = hasRating && (product.reviewCount ?? 0) > 0;
  const hasCommerce = hasPrice || hasAvailability || hasPurchaseUrl || hasWebsiteUrl;

  // Build goal tags with translated labels
  const goalTags = hasGoals
    ? product.goals.map((g) => ({
        label: t(`produits.filters.goalLabels.${g}`),
        href: h(locale as "fr" | "en", `/produits?goals=${g}`),
      }))
    : [];

  // Build topic tags with translated labels
  const topicTags = hasTopics
    ? product.topics.map((tp) => ({
        label: t(`produits.filters.topicLabels.${tp}`),
        href: h(locale as "fr" | "en", `/produits?topics=${tp}`),
      }))
    : [];

  return (
    <section className="bg-[#F2EFE9] min-h-screen pt-28 sm:pt-36 pb-20 sm:pb-28 px-6">
      <div className="mx-auto max-w-7xl">
        {/* ── Back link ── */}
        <Link
          href={h(locale as "fr" | "en", "/produits")}
          className="inline-flex items-center text-xs text-[#2B2F36]/30 hover:text-[#2B2F36]/60 transition-colors mb-10 sm:mb-14"
        >
          <span className="mr-1.5">←</span>
          {t("produits.back")}
        </Link>

        {/* ══════════════════════════════════════════════
            HERO — Two-column (desktop) / Stacked (mobile)
            ══════════════════════════════════════════════ */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 mb-20">
          {/* ── LEFT: Image ── */}
          <div className="w-full lg:w-[45%] shrink-0">
            <div className="relative aspect-square overflow-hidden bg-[#E8E2D9] rounded-xl">
              {hasImage ? (
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-[#0B1220]/[0.06]"
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
            </div>
          </div>

          {/* ── RIGHT: Content + Commerce ── */}
          <div className="flex-1 min-w-0">
            {/* Category */}
            <p className="text-[11px] font-mono text-[#2B2F36]/30 uppercase tracking-[0.15em] mb-3">
              {t(`produits.filters.${product.category}`)}
            </p>

            {/* H1 — Product Name */}
            <h1 className="heading-serif text-[clamp(2rem,4vw,3.5rem)] text-[#0B1220] mb-3 leading-[1.1]">
              {product.name}
            </h1>

            {/* Brand */}
            {hasBrand && (
              <p className="text-xs text-[#2B2F36]/35 mb-3">
                {t("produits.detail.brand")}:{" "}
                <span className="text-[#2B2F36]/60 font-medium">{product.brand}</span>
              </p>
            )}

            {/* Rating */}
            {hasRating && (
              <div
                className="flex items-center gap-1.5 mb-5"
                role="img"
                aria-label={`Note: ${product.rating} sur 5${product.reviewCount != null ? `, ${product.reviewCount} avis` : ""}`}
              >
                <ProductRating rating={product.rating!} size="md" />
                <span className="text-xs text-[#2B2F36]/40">
                  <span className="text-[#2B2F36]/60 font-medium">{product.rating}</span>
                  {product.reviewCount != null && (
                    <>
                      <span className="mx-1">·</span>
                      {product.reviewCount} {t("produits.reviews")}
                    </>
                  )}
                </span>
              </div>
            )}

            {/* Description */}
            <p className="text-sm sm:text-base text-[#2B2F36]/60 leading-[1.8] max-w-lg mb-6">
              {product.description}
            </p>

            {/* ── Commerce Area ── */}
            {hasCommerce ? (
              <CartActions
                productSlug={product.slug}
                productName={product.name}
                image={imageSrc}
                unitPrice={product.price}
                currency={product.currency}
                availability={product.availability}
                hasPrice={hasPrice}
                hasPurchaseUrl={hasPurchaseUrl}
                purchaseUrl={product.purchaseUrl}
                hasWebsiteUrl={hasWebsiteUrl}
                websiteUrl={product.websiteUrl}
              />
            ) : (
              /* No commerce data — muted info */
              <p className="text-xs text-[#2B2F36]/25 pt-2">
                {t("produits.detail.noCommerceInfo")}
              </p>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            GOALS & TOPICS
            ══════════════════════════════════════════════ */}
        {(hasGoals || hasTopics) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-16">
            {hasGoals && (
              <EntityTags
                title={t("produits.filters.goals")}
                tags={goalTags}
                variant="goal"
              />
            )}
            {hasTopics && (
              <EntityTags
                title={t("produits.filters.topics")}
                tags={topicTags}
                variant="topic"
              />
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════
            BENEFITS
            ══════════════════════════════════════════════ */}
        {hasBenefits && (
          <div className="mb-16">
            <h2 className="font-heading font-semibold text-lg text-[#0B1220] mb-5">
              {t("produits.detail.benefits")}
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.benefits!.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-[#2B2F36]/60">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#B88A5A] shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            SPECIFICATIONS
            ══════════════════════════════════════════════ */}
        {hasSpecifications && (
          <div className="mb-16">
            <h2 className="font-heading font-semibold text-lg text-[#0B1220] mb-5">
              {t("produits.detail.specifications")}
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3">
              {Object.entries(product.specifications!).map(([key, value]) => (
                <div key={key} className="flex justify-between items-baseline border-b border-[#0B1220]/[0.04] pb-2">
                  <dt className="text-xs font-mono text-[#2B2F36]/35 uppercase tracking-wider">{key}</dt>
                  <dd className="text-sm text-[#0B1220]/80">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            INGREDIENTS
            ══════════════════════════════════════════════ */}
        {hasIngredients && (
          <div className="mb-16">
            <h2 className="font-heading font-semibold text-lg text-[#0B1220] mb-5">
              {t("produits.detail.ingredients")}
            </h2>
            <p className="text-sm text-[#2B2F36]/60 leading-[1.8] max-w-2xl">
              {product.ingredients!.join(" · ")}
            </p>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            REVIEWS (aggregate only — no individual reviews)
            ══════════════════════════════════════════════ */}
        {hasReviews && (
          <div className="mb-16 border-t border-[#0B1220]/[0.06] pt-10">
            <h2 className="font-heading font-semibold text-lg text-[#0B1220] mb-5">
              {t("produits.reviews")} ({product.reviewCount})
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-[#0B1220]">{product.rating}</span>
              <ProductRating rating={product.rating!} size="md" />
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            BRAND PRODUCTS (only if data exists)
            ══════════════════════════════════════════════ */}
        {hasBrandProducts && (
          <div className="mb-16 border-t border-[#0B1220]/[0.06] pt-10">
            <h2 className="font-heading font-semibold text-lg text-[#0B1220] mb-8">
              {tRaw<(brand: string) => string>("produits.detail.brandProducts")(product.brand!)}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 xl:gap-x-5 gap-y-12">
              {brandProducts.slice(0, 6).map((item) => (
                <ProductCard
                  key={item.slug}
                  product={item}
                  locale={locale as "fr" | "en"}
                />
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            RELATED PRODUCTS (only if data exists)
            ══════════════════════════════════════════════ */}
        {hasRelatedProducts && (
          <div className="border-t border-[#0B1220]/[0.06] pt-10">
            <h2 className="font-heading font-semibold text-lg text-[#0B1220] mb-8">
              {t("produits.related")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 xl:gap-x-5 gap-y-12">
              {relatedProducts.map((item) => (
                <ProductCard
                  key={item.slug}
                  product={item}
                  locale={locale as "fr" | "en"}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
