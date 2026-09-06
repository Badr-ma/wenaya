/**
 * CartActions — client component for product detail commerce area.
 * Handles: price display, availability, quantity selection, add-to-cart,
 * buy now (navigates to checkout), and external website links.
 * ProductDetail remains a Server Component; this is its interactive commerce child.
 */
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useLocale } from "@/contexts/LanguageContext";
import { h } from "@/lib/href";

type Availability = "in_stock" | "out_of_stock" | "pre_order" | "limited";

interface CartActionsProps {
  productSlug: string;
  productName: string;
  image: string;
  unitPrice?: number;
  currency?: string;
  availability?: Availability;
  hasPrice: boolean;
  hasPurchaseUrl: boolean;
  purchaseUrl?: string;
  hasWebsiteUrl: boolean;
  websiteUrl?: string;
}

function formatPrice(price: number, currency: string, locale: string): string {
  const localeFmt = locale === "fr" ? "fr-MA" : "en-MA";
  const formatted = new Intl.NumberFormat(localeFmt, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
  return currency ? `${formatted} ${currency}` : formatted;
}

export default function CartActions({
  productSlug,
  productName,
  image,
  unitPrice,
  currency = "MAD",
  availability,
  hasPrice,
  hasPurchaseUrl,
  purchaseUrl,
  hasWebsiteUrl,
  websiteUrl,
}: CartActionsProps) {
  const { t } = useLocale();
  const { addItem } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const isOutOfStock = availability === "out_of_stock";
  const isPreOrder = availability === "pre_order";
  const isLimited = availability === "limited";
  const canAddToCart = hasPrice && !isOutOfStock;
  const locale = useLocale().locale;

  const handleAddToCart = useCallback(() => {
    if (!canAddToCart || unitPrice == null) return;
    addItem({ productSlug, productName, image, unitPrice, currency }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }, [canAddToCart, unitPrice, addItem, productSlug, productName, image, quantity, currency]);

  const handleBuyNow = useCallback(() => {
    if (!canAddToCart || unitPrice == null) return;
    addItem({ productSlug, productName, image, unitPrice, currency }, quantity);
    router.push(h(locale, "/checkout"));
  }, [canAddToCart, unitPrice, addItem, productSlug, productName, image, quantity, currency, router, locale]);

  const decrementQty = useCallback(() => setQuantity((q) => Math.max(1, q - 1)), []);
  const incrementQty = useCallback(() => setQuantity((q) => q + 1), []);

  return (
    <div className="space-y-4">
      {/* ── Price ── */}
      {hasPrice && unitPrice != null && (
        <p className="text-2xl font-bold text-[#0B1220]">
          {formatPrice(unitPrice, currency, locale)}
        </p>
      )}

      {/* ── Availability badge ── */}
      {availability && (
        <div className="flex items-center gap-1.5" role="status">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isOutOfStock
                ? "bg-red-400"
                : isPreOrder
                  ? "bg-amber-400"
                  : isLimited
                    ? "bg-orange-400"
                    : "bg-emerald-500"
            }`}
            aria-hidden="true"
          />
          <span className="text-xs font-medium text-[#2B2F36]/60">
            {t(`produits.detail.availability.${availability}`)}
          </span>
        </div>
      )}

      {/* ── Quantity + Add to Cart + Buy Now ── */}
      {hasPrice && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Quantity selector */}
          <div
            className="flex items-center border border-[#0B1220]/[0.08] rounded-full shrink-0"
            role="group"
            aria-label={t("produits.detail.quantity")}
          >
            <button
              type="button"
              onClick={decrementQty}
              disabled={quantity <= 1}
              className="w-11 h-11 flex items-center justify-center text-[#0B1220]/60 hover:text-[#0B1220] disabled:opacity-30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#B88A5A]"
              aria-label={t("produits.detail.decreaseQuantity")}
            >
              −
            </button>
            <span
              className="w-10 text-center text-sm font-medium text-[#0B1220] tabular-nums"
              aria-live="polite"
              aria-atomic="true"
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={incrementQty}
              className="w-11 h-11 flex items-center justify-center text-[#0B1220]/60 hover:text-[#0B1220] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#B88A5A]"
              aria-label={t("produits.detail.increaseQuantity")}
            >
              +
            </button>
          </div>

          {/* Add to Cart */}
          <button
            type="button"
            disabled={!canAddToCart}
            onClick={handleAddToCart}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 bg-[#B88A5A] text-white hover:bg-[#a07a4e] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-2"
            aria-label={added ? t("produits.detail.addedToCart") : t("produits.detail.addToCart")}
          >
            {added ? "✓ " + t("produits.detail.addedToCart") : t("produits.detail.addToCart")}
          </button>

          {/* Buy Now */}
          <button
            type="button"
            disabled={!canAddToCart}
            onClick={handleBuyNow}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 border border-[#0B1220]/[0.12] text-[#0B1220] hover:border-[#0B1220]/30 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-2"
            aria-label={t("produits.detail.buyNow")}
          >
            {t("produits.detail.buyNow")}
          </button>
        </div>
      )}

      {/* ── External links (secondary) ── */}
      {(hasPurchaseUrl || hasWebsiteUrl) && (
        <div className="flex flex-wrap gap-3 pt-1">
          {hasPurchaseUrl && purchaseUrl && (
            <a
              href={purchaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#2B2F36]/40 hover:text-[#B88A5A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-2 rounded"
            >
              {t("produits.detail.externalLink")} →
            </a>
          )}
          {hasWebsiteUrl && websiteUrl && (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#2B2F36]/40 hover:text-[#B88A5A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-2 rounded"
            >
              {t("produits.detail.websiteLink")}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
