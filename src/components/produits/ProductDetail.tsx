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

function DotRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const cls = size === "lg" ? "w-4 h-4" : size === "md" ? "w-3.5 h-3.5" : "w-2.5 h-2.5";
  return (
    <span className="inline-flex items-center gap-[3px]">
      {[1, 2, 3, 4, 5].map((dot) => {
        const remainder = rating - (dot - 1);
        let fill: "full" | "half" | "empty" = "empty";
        if (remainder >= 1) fill = "full";
        else if (remainder > 0) fill = "half";
        return (
          <svg key={dot} className={cls} viewBox="0 0 10 10">
            {fill === "full" && <circle cx="5" cy="5" r="4.5" fill="#FEBB58" />}
            {fill === "half" && (
              <>
                <circle cx="5" cy="5" r="4.5" fill="#D4C9B8" />
                <clipPath id={`dc-${dot}-${rating}`}><rect x="0" y="0" width="5" height="10" /></clipPath>
                <circle cx="5" cy="5" r="4.5" fill="#FEBB58" clipPath={`url(#dc-${dot}-${rating})`} />
              </>
            )}
            {fill === "empty" && <circle cx="5" cy="5" r="4.5" fill="#D4C9B8" />}
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
          <Link href="/produits" className="mt-4 inline-block text-sm font-semibold text-[#B88A5A] hover:text-[#B88A5A]/70 transition-colors">
            ← {t("produits.back")}
          </Link>
        </div>
      </section>
    );
  }

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const share = star === 5 ? 50 : star === 4 ? 50 : 0;
    return { star, share };
  });

  return (
    <section className="bg-[#F2EFE9] min-h-screen pt-28 sm:pt-36 pb-20 sm:pb-28">
      <div className="mx-auto max-w-7xl px-6 xl:px-8">
        {/* ── Back link ── */}
        <Link href="/produits" className="inline-flex items-center gap-2 text-xs font-semibold text-[#2B2F36]/40 hover:text-[#0B1220] transition-colors mb-8">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7-7l-7 7 7 7" />
          </svg>
          {t("produits.back")}
        </Link>

        {/* ── Hero: Text left, Image right ── */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 mb-12">
          <div className="flex-1">
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-[3.25rem] text-[#0B1220] leading-tight mb-3">
              {product.title}
            </h1>

            <div className="flex items-center gap-1.5 mb-5">
              <DotRating rating={product.rating} size="md" />
              <span className="text-sm font-semibold text-[#0B1220]">{product.rating}</span>
              <span className="text-xs text-[#2B2F36]/30">•</span>
              <span className="text-xs text-[#2B2F36]/40">{product.reviews} {t("produits.reviews")}</span>
            </div>

            <p className="text-sm sm:text-base text-[#2B2F36]/60 leading-[1.75] mb-7 max-w-xl">
              {product.desc}
            </p>

            <div className="flex flex-wrap gap-3">
              <button className="px-6 py-2.5 bg-[#0B1220] text-white rounded-full text-xs font-semibold tracking-wide hover:bg-[#0B1220]/90 transition-colors">
                {t("produits.writeReview")}
              </button>
              <a href="#" className="inline-flex items-center gap-2 px-6 py-2.5 border border-[#0B1220]/[0.12] text-[#0B1220] rounded-full text-xs font-semibold tracking-wide hover:bg-[#0B1220]/[0.04] transition-colors">
                {t("produits.visitWebsite")}
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          <div className="w-full lg:w-[320px] xl:w-[360px] shrink-0">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#E8E2D9]">
              <Image src={product.image} alt={product.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 360px" priority />
            </div>
          </div>
        </div>

        {/* ── Stats tabs ── */}
        <div className="flex items-center gap-5 mb-10 pb-5 border-b border-[#0B1220]/[0.06] font-mono text-sm">
          <span className="text-[#0B1220] font-semibold">
            {t("produits.reviews")}
            <span className="text-xs text-[#2B2F36]/40 font-normal ml-1.5">{product.reviews}</span>
          </span>
          <span className="w-px h-3 bg-[#0B1220]/[0.08]" />
          <span className="text-[#2B2F36]/40">
            {t("produits.products")}
            <span className="text-xs ml-1.5">0</span>
          </span>
          <span className="w-px h-3 bg-[#0B1220]/[0.08]" />
          <span className="text-[#2B2F36]/40">
            Discussions
            <span className="text-xs ml-1.5">0</span>
          </span>
        </div>

        {/* ── Two-column layout ── */}
        <div className="flex flex-col lg:flex-row gap-12 mb-16">
          {/* ─── Main column ─── */}
          <div className="flex-1 min-w-0">
            {/* Rating overview */}
            <div className="flex items-start gap-8 mb-10">
              <div className="text-center shrink-0">
                <span className="block text-5xl sm:text-6xl font-heading font-extrabold text-[#0B1220] leading-none">{product.rating}</span>
                <div className="flex items-center justify-center mt-2">
                  <DotRating rating={product.rating} size="md" />
                </div>
                <p className="text-xs text-[#2B2F36]/40 mt-1">{product.reviews} {t("produits.reviews")}</p>
              </div>

              <div className="flex-1 space-y-1.5 max-w-xs pt-1">
                {distribution.map((d) => (
                  <div key={d.star} className="flex items-center gap-2 text-xs text-[#2B2F36]/40">
                    <span className="w-5 text-right">{d.star}</span>
                    <div className="flex-1 h-[6px] rounded-full bg-[#E8E2D9] overflow-hidden">
                      <div className="h-full rounded-full bg-[#FEBB58]" style={{ width: `${d.share}%` }} />
                    </div>
                    <span className="w-8 text-right text-[10px]">{d.share}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Filter + Sort */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-[#0B1220]">{t("produits.filter")}</span>
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-1.5 rounded-md bg-[#E8E2D9] text-[10px] font-semibold text-[#2B2F36]/50 cursor-pointer hover:bg-[#E8E2D9]/80 transition-colors">{t("produits.rating")}</span>
                  <span className="px-2.5 py-1.5 rounded-md bg-[#E8E2D9] text-[10px] font-semibold text-[#2B2F36]/50 cursor-pointer hover:bg-[#E8E2D9]/80 transition-colors">{t("produits.products")}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-3 py-1.5 rounded-full bg-[#0B1220] text-white text-[10px] font-semibold">Most relevant</span>
                <button className="px-3 py-1.5 rounded-full bg-[#E8E2D9] text-[10px] font-semibold text-[#2B2F36]/50 hover:bg-[#E8E2D9]/80 transition-colors">Newest</button>
                <button className="px-3 py-1.5 rounded-full bg-[#E8E2D9] text-[10px] font-semibold text-[#2B2F36]/50 hover:bg-[#E8E2D9]/80 transition-colors">Oldest</button>
                <button className="px-3 py-1.5 rounded-full bg-[#E8E2D9] text-[10px] font-semibold text-[#2B2F36]/50 hover:bg-[#E8E2D9]/80 transition-colors">Best rated</button>
                <button className="px-3 py-1.5 rounded-full bg-[#E8E2D9] text-[10px] font-semibold text-[#2B2F36]/50 hover:bg-[#E8E2D9]/80 transition-colors">Lowest rated</button>
              </div>
            </div>

            {/* Reviews list */}
            <div className="space-y-1">
              {/* Review card */}
              {[1, 2].map((review) => (
                <div key={review} className="p-5 rounded-2xl bg-[#E8E2D9]/40 hover:bg-[#E8E2D9] transition-colors">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-[#D4C9B8] shrink-0 flex items-center justify-center text-xs font-semibold text-white">
                      {review === 1 ? "M" : "G"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#0B1220]">{review === 1 ? "Merlin" : "Gerhard"}</span>
                        <span className="text-[10px] text-[#2B2F36]/30">Level {review === 1 ? "0" : "2"} · {review === 1 ? "3" : "24"} Reviews</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <DotRating rating={review === 1 ? 5 : 4} size="sm" />
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-[#2B2F36]/30">
                        <span className="px-2 py-0.5 rounded-full bg-[#F2EFE9] text-[10px] font-semibold text-[#2B2F36]/40">{product.title}</span>
                        <span>Customer · {review === 1 ? "1" : "5"} month{review === 1 ? "" : "s"} ago</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#2B2F36]/40 leading-relaxed mb-3">
                    {review === 1
                      ? "Great product! Really helped me optimize my health routine. The quality is outstanding and the results speak for themselves."
                      : "Solid product with good results. Would recommend to anyone looking to improve their wellness journey."}
                  </p>

                  <div className="flex items-center gap-2 text-[10px] text-[#2B2F36]/20">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                    </svg>
                    <span>No likes received, yet.</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Sidebar ─── */}
          <aside className="w-full lg:w-[280px] shrink-0">
            <div className="space-y-5">
              <div>
                <h3 className="text-[10px] font-semibold tracking-wider uppercase text-[#2B2F36]/30 mb-2">{t("produits.category")}</h3>
                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-block px-2.5 py-1 text-xs font-semibold bg-[#E8E2D9] text-[#0B1220] rounded-full">
                    {t(`produits.filters.${product.category}`)}
                  </span>
                </div>
              </div>

              <hr className="border-[#0B1220]/[0.06]" />

              <div>
                <h3 className="text-[10px] font-semibold tracking-wider uppercase text-[#2B2F36]/30 mb-2">{t("produits.rating")}</h3>
                <div className="flex items-center gap-1.5">
                  <DotRating rating={product.rating} size="sm" />
                  <span className="text-sm font-semibold text-[#0B1220]">{product.rating}</span>
                </div>
              </div>

              <hr className="border-[#0B1220]/[0.06]" />

              <div>
                <h3 className="text-[10px] font-semibold tracking-wider uppercase text-[#2B2F36]/30 mb-2">{t("produits.reviews")}</h3>
                <p className="text-sm font-semibold text-[#0B1220]">{product.reviews}</p>
              </div>

              <hr className="border-[#0B1220]/[0.06]" />

              <div>
                <h3 className="text-[10px] font-semibold tracking-wider uppercase text-[#2B2F36]/30 mb-2">{t("produits.status")}</h3>
                <p className="text-sm font-semibold text-[#0B1220]">Available</p>
              </div>

              <hr className="border-[#0B1220]/[0.06]" />

              <div>
                <h3 className="text-[10px] font-semibold tracking-wider uppercase text-[#2B2F36]/30 mb-2">Website</h3>
                <a href="#" className="text-xs font-semibold text-[#B88A5A] hover:text-[#B88A5A]/70 transition-colors break-all">
                  www.{product.title.toLowerCase().replace(/\s+/g, "")}.com
                </a>
              </div>
            </div>
          </aside>
        </div>

        {/* ── Related products ── */}
        {related.length > 0 && (
          <div className="border-t border-[#0B1220]/[0.06] pt-10">
            <h2 className="font-heading font-extrabold text-2xl text-[#0B1220] mb-6">{t("produits.related")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/produits/${item.slug}`}
                  className="group bg-[#E8E2D9] rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-44 overflow-hidden bg-[#E8E2D9]">
                    <Image src={item.image} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading font-extrabold text-sm text-[#0B1220] leading-snug mb-2 line-clamp-2">{item.title}</h3>
                    <div className="flex items-center gap-1.5">
                      <DotRating rating={item.rating} size="sm" />
                      <span className="text-xs font-semibold text-[#0B1220]">{item.rating}</span>
                      <span className="text-xs text-[#2B2F36]/30">•</span>
                      <span className="text-xs text-[#2B2F36]/40">{item.reviews} {t("produits.reviews")}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
