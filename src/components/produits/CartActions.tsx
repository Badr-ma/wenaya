/**
 * CartActions — client component for product detail commerce area.
 * Displays: price, availability, quantity selection, and external links.
 *
 * SHOP LAUNCH FREEZE: Commerce interactions are temporarily disabled. Add-to-cart,
 * buy-now and the purchase link all open the shared "coming soon" dialog instead of
 * mutating the cart or navigating to checkout. The underlying cart/checkout
 * implementation (CartContext, PanierView, CheckoutView) stays intact for future
 * activation — only the interaction layer is swapped.
 * ProductDetail remains a Server Component; this is its interactive child.
 */
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLocale } from "@/contexts/LanguageContext";
import { getCurrentPatient } from "@/lib/patient-auth-client";
import { formatPrice } from "@/lib/format";

type Availability = "in_stock" | "out_of_stock" | "pre_order" | "limited";

type PurchaseStatus = "idle" | "loading" | "success" | "error";

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

export default function CartActions({
  productSlug,
  unitPrice,
  currency = "MAD",
  availability,
  hasPrice,
  hasWebsiteUrl,
  websiteUrl,
}: CartActionsProps) {
  const { t, locale } = useLocale();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [purchaseStatus, setPurchaseStatus] = useState<PurchaseStatus>("idle");
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null);

  const isOutOfStock = availability === "out_of_stock";
  const isPreOrder = availability === "pre_order";
  const isLimited = availability === "limited";
  const canAddToCart = hasPrice && !isOutOfStock;

  const purchase = useCallback(async () => {
    if (!canAddToCart || purchaseStatus === "loading") return;

    setPurchaseStatus("loading");
    setInvoiceNumber(null);

    try {
      const session = await getCurrentPatient();
      if (!session.success || session.type !== "success") {
        const returnTo = encodeURIComponent(`/produits/${productSlug}`);
        router.push(`/login?returnTo=${returnTo}`);
        return;
      }

      const res = await fetch("/api/products/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          items: [{ slug: productSlug, quantity }],
        }),
      });

      const json = (await res.json()) as {
        error?: boolean;
        message?: string;
        data?: { invoice_number?: string | null; id?: string | number } | null;
      };

      if (!res.ok || json.error) {
        setPurchaseStatus("error");
        return;
      }

      const number =
        json.data?.invoice_number ||
        (json.data?.id ? String(json.data.id) : null);
      setInvoiceNumber(number ?? null);
      setPurchaseStatus("success");
    } catch {
      setPurchaseStatus("error");
    }
  }, [canAddToCart, purchaseStatus, productSlug, quantity, router]);

  const decrementQty = useCallback(
    () => setQuantity((q) => Math.max(1, q - 1)),
    [],
  );
  const incrementQty = useCallback(() => setQuantity((q) => q + 1), []);
  const closeSuccess = useCallback(() => setPurchaseStatus("idle"), []);
  const isSubmitting = purchaseStatus === "loading";

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
            disabled={!canAddToCart || isSubmitting}
            onClick={purchase}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 bg-[#B88A5A] text-white hover:bg-[#a07a4e] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-2"
            aria-label={t("produits.detail.addToCart")}
          >
            {isSubmitting ? "…" : t("produits.detail.addToCart")}
          </button>

          {/* Buy Now */}
          <button
            type="button"
            disabled={!canAddToCart || isSubmitting}
            onClick={purchase}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 border border-[#0B1220]/[0.12] text-[#0B1220] hover:border-[#0B1220]/30 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-2"
            aria-label={t("produits.detail.buyNow")}
          >
            {isSubmitting ? "…" : t("produits.detail.buyNow")}
          </button>
        </div>
      )}

      {/* ── Purchase result ── */}
      {purchaseStatus === "success" && (
        <div
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-emerald-800">
                {t("produits.detail.purchaseSuccessTitle")}
              </p>
              <p className="mt-1 text-sm text-emerald-700">
                {t("produits.detail.purchaseSuccess")}
              </p>
              {invoiceNumber && (
                <p className="mt-2 text-sm font-medium text-emerald-800">
                  {t("produits.detail.invoiceRef").replace(
                    "{num}",
                    invoiceNumber,
                  )}
                </p>
              )}
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Link
                  href={locale === "en" ? "/en/compte" : "/compte"}
                  className="inline-flex items-center justify-center rounded-full bg-[#0B1220] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0B1220]/90"
                >
                  {t("produits.detail.viewAccount")}
                </Link>
                <button
                  type="button"
                  onClick={closeSuccess}
                  className="inline-flex items-center justify-center rounded-full border border-emerald-300 bg-white px-5 py-2.5 text-sm font-medium text-emerald-800 transition-colors hover:bg-emerald-100/50"
                >
                  {t("produits.detail.continueShopping")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {purchaseStatus === "error" && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {t("produits.detail.purchaseError")}
        </div>
      )}

      {/* ── External links (secondary) ── */}
      {hasWebsiteUrl && websiteUrl && (
        <div className="flex flex-wrap gap-3 pt-1">
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#2B2F36]/40 hover:text-[#B88A5A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-2 rounded"
          >
            {t("produits.detail.websiteLink")}
          </a>
        </div>
      )}
    </div>
  );
}
