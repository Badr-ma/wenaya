/**
 * Product Detail — expanded product card showing full details, description,
 * dosage info, and ingredients. Used as a modal/expanded view within ProductsGrid.
 */
"use client";

import { useMemo } from "react";
import { useLocale } from "@/contexts/LanguageContext";
import Image from "next/image";
import Link from "next/link";

type ProductItem = {
  slug: string;
  title: string;
  desc: string;
  category: string;
  rating: number;
  reviews: number;
  image: string;
};

function DotRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
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
                <clipPath id={`dc-${dot}-${rating}`}><rect x="0" y="0" width="5" height="10" /></clipPath>
                <circle cx="5" cy="5" r="4" fill="#FEBB58" clipPath={`url(#dc-${dot}-${rating})`} />
              </>
            )}
            {fill === "empty" && <circle cx="5" cy="5" r="4" fill="#D4C9B8" />}
          </svg>
        );
      })}
    </span>
  );
}

export default function ProductDetail({ slug }: { slug: string }) {
  const { t, tRaw } = useLocale();
  const items = tRaw<ProductItem[]>("produits.items");
  const product = useMemo(() => items.find((p) => p.slug === slug), [items, slug]);
  const related = useMemo(
    () => items.filter((p) => p.slug !== slug && p.category === product?.category).slice(0, 3),
    [items, slug, product]
  );

  if (!product) {
    return (
      <section className="bg-[#F2EFE9] min-h-screen pt-36 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#2B2F36]/40 text-lg">Product not found.</p>
          <Link
            href="/produits"
            className="mt-4 inline-block text-sm text-[#B88A5A] hover:text-[#B88A5A]/70 transition-colors"
          >
            ← {t("produits.back")}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#F2EFE9] min-h-screen pt-28 sm:pt-36 pb-20 sm:pb-28 px-6">
      <div className="mx-auto max-w-7xl">
        {/* ── Back link ── */}
        <Link
          href="/produits"
          className="inline-flex items-center text-xs text-[#2B2F36]/30 hover:text-[#2B2F36]/60 transition-colors mb-12 sm:mb-16"
        >
          <span className="mr-1.5">←</span>
          {t("produits.back")}
        </Link>

        {/* ── Hero ── */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-20">
          <div className="flex-1">
            <p className="text-[11px] font-mono text-[#2B2F36]/30 uppercase tracking-[0.15em] mb-3">
              {t(`produits.filters.${product.category}`)}
            </p>
            <h1 className="heading-serif text-[clamp(2.5rem,5vw,4.5rem)] text-[#0B1220] mb-4">
              {product.title}
            </h1>
            <div className="flex items-center gap-1.5 mb-6">
              <DotRating rating={product.rating} size="md" />
              <span className="text-xs text-[#2B2F36]/40">
                <span className="text-[#2B2F36]/60 font-medium">{product.rating}</span>
                <span className="mx-1">·</span>
                {product.reviews} {t("produits.reviews")}
              </span>
            </div>
            <p className="text-sm sm:text-base text-[#2B2F36]/60 leading-[1.8] max-w-lg mb-8">
              {product.desc}
            </p>
            <Link
              href="#"
              className="inline-flex items-center text-xs text-[#B88A5A] hover:text-[#B88A5A]/70 transition-colors"
            >
              {t("produits.visitWebsite")} <span className="ml-1.5">→</span>
            </Link>
          </div>
          <div className="w-full lg:w-1/2 shrink-0">
            <div className="relative aspect-square overflow-hidden bg-[#E8E2D9] rounded-xl">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>

        {/* ── Related ── */}
        {related.length > 0 && (
          <>
            <hr className="border-[#0B1220]/[0.06] mb-10" />
            <h2 className="font-heading font-semibold text-lg text-[#0B1220] mb-8">
              {t("produits.related")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 xl:gap-x-5 gap-y-12">
              {related.map((item) => (
                <div key={item.slug} className="group relative">
                  <Link href={`/produits/${item.slug}`} className="block">
                    <div className="relative aspect-square rounded-xl overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-opacity duration-500 group-hover:opacity-90"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                    </div>
                    <h3 className="font-heading font-bold text-sm text-[#0B1220] mt-3 leading-snug">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-0.5 mt-1">
                      <DotRating rating={item.rating} />
                      <span className="text-xs text-[#2B2F36]/50 ml-1">
                        <span className="font-medium">{item.rating}</span>
                        <span className="mx-1">·</span>
                        {item.reviews} {t("produits.reviews")}
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
