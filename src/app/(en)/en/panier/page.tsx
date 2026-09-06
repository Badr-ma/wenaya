/**
 * Basket page (EN) — client component displaying cart contents.
 * Uses useCart() for live cart state, useLocale() for translations.
 */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { h } from "@/lib/href";

export default function BasketPage() {
  const { t, locale } = useLocale();
  const { items, totalItems, subtotal, updateQuantity, removeItem, clearCart, isEmpty, hydrated } = useCart();

  const fmt = (n: number) =>
    new Intl.NumberFormat(locale === "fr" ? "fr-MA" : "en-MA", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(n);

  if (!hydrated) {
    return (
      <section className="min-h-screen bg-[#F2EFE9] pt-28 pb-20 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-10 w-48 bg-[#0B1220]/[0.04] rounded-lg animate-pulse mb-8" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-[#0B1220]/[0.03] rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#F2EFE9] pt-28 pb-20 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="heading-serif text-[clamp(1.8rem,3.5vw,2.8rem)] text-[#0B1220] mb-8">
          {t("panier.title")}
        </h1>

        {isEmpty ? (
          <div className="text-center py-20">
            <p className="text-[#2B2F36]/40 text-lg mb-2">{t("panier.empty")}</p>
            <p className="text-[#2B2F36]/25 text-sm mb-6">{t("panier.emptyDesc")}</p>
            <Link
              href={h(locale, "/produits")}
              className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium bg-[#B88A5A] text-white hover:bg-[#a07a4e] transition-colors"
            >
              {t("panier.continueShopping")}
            </Link>
          </div>
        ) : (
          <>
            {/* Items list */}
            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <div
                  key={item.productSlug}
                  className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-[#0B1220]/[0.04]"
                >
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-[#0B1220]/[0.03] shrink-0">
                    <Image
                      src={item.image}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={h(locale, `/produits/${item.productSlug}`)}
                      className="text-sm font-medium text-[#0B1220] hover:underline truncate block"
                    >
                      {item.productName}
                    </Link>
                    <p className="text-xs text-[#2B2F36]/35 mt-0.5">
                      {fmt(item.unitPrice)} {item.currency} {t("panier.perUnit")}
                    </p>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center border border-[#0B1220]/[0.08] rounded-full shrink-0">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productSlug, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-[#0B1220]/50 hover:text-[#0B1220] transition-colors"
                      aria-label="−"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-xs font-medium text-[#0B1220] tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productSlug, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-[#0B1220]/50 hover:text-[#0B1220] transition-colors"
                      aria-label="+"
                    >
                      +
                    </button>
                  </div>

                  {/* Line total */}
                  <p className="text-sm font-semibold text-[#0B1220] w-20 text-right shrink-0 tabular-nums">
                    {fmt(item.unitPrice * item.quantity)} {item.currency}
                  </p>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => removeItem(item.productSlug)}
                    className="text-[#2B2F36]/25 hover:text-red-500 transition-colors shrink-0 text-xs"
                    aria-label={t("panier.remove")}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="border-t border-[#0B1220]/[0.06] pt-6">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-sm text-[#2B2F36]/40">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
                <span className="text-sm text-[#2B2F36]/40">{t("panier.subtotal")}</span>
              </div>
              <div className="flex justify-between items-baseline mb-6">
                <span />
                <span className="text-xl font-bold text-[#0B1220]">
                  {fmt(subtotal)} {items[0]?.currency || "MAD"}
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={h(locale, "/checkout")}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium bg-[#B88A5A] text-white hover:bg-[#a07a4e] transition-colors"
                >
                  {t("panier.checkout")}
                </Link>
                <button
                  type="button"
                  onClick={clearCart}
                  className="inline-flex items-center justify-center px-5 py-3 rounded-full text-sm font-medium border border-[#0B1220]/[0.10] text-[#2B2F36]/50 hover:text-red-500 hover:border-red-500/30 transition-colors"
                >
                  {t("panier.clearCart")}
                </button>
                <Link
                  href={h(locale, "/produits")}
                  className="inline-flex items-center justify-center px-5 py-3 rounded-full text-sm font-medium text-[#2B2F36]/40 hover:text-[#0B1220] transition-colors"
                >
                  {t("panier.continueShopping")}
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
