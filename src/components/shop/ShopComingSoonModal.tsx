/**
 * ShopComingSoonModal — accessible "shop coming soon" dialog.
 * Follows the project's dialog conventions (mirrors RecruitmentModal): role="dialog",
 * aria-modal="true", aria-labelledby, focus trap + restore to trigger, Escape / X /
 * backdrop close, body scroll lock.
 *
 * SHOP LAUNCH FREEZE: Commerce interactions are temporarily disabled — any purchase
 * action opens this dialog instead of mutating the cart or navigating to checkout.
 * The underlying cart/checkout implementation stays intact for future activation;
 * this only swaps the interaction layer.
 */
"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "@/contexts/LanguageContext";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface ShopComingSoonModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ShopComingSoonModal({ open, onClose }: ShopComingSoonModalProps): React.JSX.Element | null {
  const { t } = useLocale();
  const dialogRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const getFocusable = () =>
      Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter(
        (el) => !el.hasAttribute("disabled"),
      );

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = getFocusable();
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const inside = dialogRef.current?.contains(active) ?? false;
      if (e.shiftKey) {
        if (active === first || !inside) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last || !inside) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    requestAnimationFrame(() => {
      ctaRef.current?.focus();
    });

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      (returnFocusRef.current as HTMLElement | null)?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shop-coming-soon-title"
      aria-label={t("shop.comingSoon.ariaLabel")}
    >
      {/* Backdrop — non-focusable so the tab order stays inside the dialog */}
      <div
        className="absolute inset-0 bg-[#0B1220]/55 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className="relative w-full max-w-[440px] bg-[#FAF8F4] rounded-2xl border border-[#B88A5A]/20 p-7 sm:p-9 shadow-[0_24px_64px_rgba(11,18,32,0.28)]"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full text-[#2B2F36]/40 hover:text-[#0B1220] hover:bg-[#0B1220]/[0.04] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-2"
          aria-label={t("shop.comingSoon.close")}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="w-5 h-5"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          <span className="text-[#B88A5A] text-[11px] font-semibold uppercase tracking-[0.22em] block mb-4">
            {t("shop.comingSoon.eyebrow")}
          </span>

          <div className="mx-auto flex items-center justify-center w-14 h-14 rounded-xl bg-[#B88A5A]/10 mb-5">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#B88A5A"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-7 h-7"
            >
              <path d="M6 7l1.5-3.5h9L18 7" />
              <path d="M6 7h12l-1.4 12.1a2 2 0 01-2 1.9H9.4a2 2 0 01-2-1.9L6 7z" />
              <path d="M9 10v1a3 3 0 006 0v-1" />
            </svg>
          </div>

          <h2
            id="shop-coming-soon-title"
            className="heading-serif text-[clamp(1.6rem,2.6vw,2.1rem)] text-[#0B1220] mb-3"
          >
            {t("shop.comingSoon.title")}
          </h2>

          <p className="text-[15px] leading-relaxed text-[#2B2F36]/60 mb-7">
            {t("shop.comingSoon.body")}
          </p>

          <button
            ref={ctaRef}
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center px-7 py-3.5 rounded-full text-sm font-medium bg-[#B88A5A] text-white hover:bg-[#a07a4e] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A5A] focus-visible:ring-offset-2"
          >
            {t("shop.comingSoon.button")}
          </button>
        </div>
      </div>
    </div>
  );
}