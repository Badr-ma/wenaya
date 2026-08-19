/**
 * Checkout page (FR) — foundation page for future payment integration.
 * Shows order summary from cart, with a "coming soon" notice for payment.
 */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";

export default function CheckoutPage() {
  const { t, locale } = useLocale();
  const { items, totalItems, subtotal, isEmpty, hydrated } = useCart();
  const hh = (p: string) => (locale === "en" ? `/en${p}` : p);
  const fmt = (n: number) =>
    new Intl.NumberFormat(locale === "fr" ? "fr-MA" : "en-MA", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(n);

  if (!hydrated) {
    return (
      <section className="min-h-screen bg-[#F2EFE9] pt-28 pb-20 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="h-10 w-48 bg-[#0B1220]/[0.04] rounded-lg animate-pulse mb-8" />
        </div>
      </section>
    );
  }

  if (isEmpty) {
    return (
      <section className="min-h-screen bg-[#F2EFE9] pt-28 pb-20 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto text-center py-20">
          <p className="text-[#2B2F36]/40 text-lg mb-2">{t("panier.empty")}</p>
          <Link
            href={hh("/produits")}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium bg-[#B88A5A] text-white hover:bg-[#a07a4e] transition-colors mt-4"
          >
            {t("panier.continueShopping")}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#F2EFE9] pt-28 pb-20 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <Link
          href={hh("/panier")}
          className="inline-flex items-center gap-1.5 text-sm text-[#2B2F36]/40 hover:text-[#0B1220] transition-colors mb-6"
        >
          ← {t("checkout.back")}
        </Link>

        <h1 className="heading-serif text-[clamp(1.8rem,3.5vw,2.8rem)] text-[#0B1220] mb-8">
          {t("checkout.title")}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Coming soon notice */}
          <div className="lg:col-span-3">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-[#0B1220]/[0.04] p-6 sm:p-8">
              <h2 className="font-heading font-semibold text-lg text-[#0B1220] mb-4">
                {t("checkout.paymentMethod")}
              </h2>
              <p className="text-sm text-[#2B2F36]/50 leading-[1.8] mb-6">
                {t("checkout.comingSoon")}
              </p>
              <a
                href="mailto:contact@wenaya.com"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium bg-[#B88A5A] text-white hover:bg-[#a07a4e] transition-colors"
              >
                {t("checkout.contactUs")}
              </a>
            </div>
          </div>

          {/* Right: Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-[#0B1220]/[0.04] p-6 sticky top-28">
              <h2 className="font-heading font-semibold text-sm text-[#2B2F36]/40 uppercase tracking-wider mb-4">
                {t("checkout.orderSummary")}
              </h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.productSlug} className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-md overflow-hidden bg-[#0B1220]/[0.03] shrink-0">
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#0B1220] truncate">{item.productName}</p>
                      <p className="text-[10px] text-[#2B2F36]/30">×{item.quantity}</p>
                    </div>
                    <p className="text-xs font-semibold text-[#0B1220] tabular-nums">
                      {fmt(item.unitPrice * item.quantity)} {item.currency}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#0B1220]/[0.06] pt-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-[#2B2F36]/40">{totalItems} {totalItems === 1 ? "article" : "articles"}</span>
                  <span className="text-lg font-bold text-[#0B1220]">
                    {fmt(subtotal)} {items[0]?.currency || "MAD"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
