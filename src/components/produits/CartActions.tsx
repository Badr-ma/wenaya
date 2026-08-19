/**
 * CartActions — client component extracted from ProductDetail commerce area.
 * Handles quantity selection and add-to-cart via useCart().
 * ProductDetail remains a Server Component; this is its interactive commerce child.
 */
"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useLocale } from "@/contexts/LanguageContext";

interface CartActionsProps {
  productSlug: string;
  productName: string;
  image: string;
  unitPrice: number;
  currency: string;
  availability?: "in_stock" | "out_of_stock" | "pre_order" | "limited";
  hasPrice: boolean;
  hasPurchaseUrl: boolean;
  purchaseUrl?: string;
  hasWebsiteUrl: boolean;
  websiteUrl?: string;
}

export default function CartActions({
  productSlug,
  productName,
  image,
  unitPrice,
  currency,
  availability,
  hasPrice,
  hasPurchaseUrl,
  purchaseUrl,
  hasWebsiteUrl,
  websiteUrl,
}: CartActionsProps) {
  const { t } = useLocale();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const isOutOfStock = availability === "out_of_stock";

  const handleAddToCart = () => {
    if (!hasPrice || isOutOfStock) return;
    addItem({ productSlug, productName, image, unitPrice, currency }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="border-t border-[#0B1220]/[0.06] pt-6 mb-8">
      {/* Price */}
      {hasPrice && (
        <p className="text-2xl font-bold text-[#0B1220] mb-1">
          {new Intl.NumberFormat("fr-MA", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          }).format(unitPrice)}
          {currency && (
            <span className="text-sm font-normal text-[#2B2F36]/40 ml-1.5">
              {currency}
            </span>
          )}
        </p>
      )}

      {/* Quantity selector + Add to Cart */}
      {hasPrice && (
        <div className="flex flex-wrap items-center gap-3 mt-4">
          {/* Quantity selector */}
          <div className="flex items-center border border-[#0B1220]/[0.08] rounded-full">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-10 h-10 flex items-center justify-center text-[#0B1220]/60 hover:text-[#0B1220] disabled:opacity-30 transition-colors"
              aria-label="−"
            >
              −
            </button>
            <span className="w-10 text-center text-sm font-medium text-[#0B1220] tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 flex items-center justify-center text-[#0B1220]/60 hover:text-[#0B1220] transition-colors"
              aria-label="+"
            >
              +
            </button>
          </div>

          {/* Add to Cart */}
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 bg-[#B88A5A] text-white hover:bg-[#a07a4e] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-2"
            aria-label={t("produits.detail.addToCart")}
          >
            {added ? "✓" : t("produits.detail.addToCart")}
          </button>

          {/* Buy Now — only if purchaseUrl exists */}
          {hasPurchaseUrl && purchaseUrl && (
            <a
              href={purchaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 border border-[#0B1220]/[0.12] text-[#0B1220] hover:border-[#0B1220]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-2"
              aria-label={`${t("produits.detail.buyNow")} — ${t("produits.detail.externalLink")}`}
            >
              {t("produits.detail.buyNow")}
            </a>
          )}

          {/* External Website — only if websiteUrl exists and no purchaseUrl */}
          {hasWebsiteUrl && !hasPurchaseUrl && websiteUrl && (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 border border-[#0B1220]/[0.12] text-[#2B2F36]/60 hover:border-[#0B1220]/30 hover:text-[#0B1220] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-2"
              aria-label={`${t("produits.visitWebsite")} — ${t("produits.detail.externalLink")}`}
            >
              {t("produits.detail.externalLink")}
              <span className="ml-1.5">→</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
