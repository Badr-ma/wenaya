"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useLocale } from "@/contexts/LanguageContext";

const STORAGE_KEY = "wenaya_promo_dismissed_v2";

function isDismissed(): boolean {
  try { return localStorage.getItem(STORAGE_KEY) === "1"; } catch { return false; }
}

export default function PromoPopup() {
  const { t } = useLocale();
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(isDismissed);

  useEffect(() => {
    if (hidden) return;

    function show() {
      setVisible(true);
    }

    const onScroll = () => {
      if (window.scrollY > document.body.scrollHeight * 0.3) show();
    };
    const timer = setTimeout(show, 9000);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [hidden]);

  function close() {
    setVisible(false);
    setHidden(true);
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
  }

  if (hidden) return null;

  return (
    <div
      role="complementary"
      aria-label={t("promo.badge")}
      className={`fixed bottom-6 right-6 z-[200] w-[300px] sm:w-[320px] rounded-[20px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.18)] transition-all duration-[350ms] ease-out
        ${visible ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 translate-y-4 scale-[0.95] pointer-events-none"}
        max-sm:bottom-4 max-sm:right-4 max-sm:left-4 max-sm:w-auto`}
    >
      {/* Close button */}
      <button
        onClick={close}
        aria-label="Close"
        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center transition-colors hover:bg-black/50 z-30"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>

      {/* Rotated image inside the card */}
      <div className="relative h-[180px] sm:h-[200px] overflow-hidden">
        <div
          className="absolute inset-[-20px] sm:inset-[-24px]"
          style={{ transform: "rotate(10deg) scale(1.15)" }}
        >
          <Image
            src="/images/cours-ateliers/wellness.jpg"
            alt="Corporate wellness session"
            fill
            className="object-cover"
            sizes="(max-width: 640px) 300px, 320px"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="bg-white px-5 py-5">
        <span className="inline-block text-[10px] font-bold tracking-[0.15em] uppercase text-[#B88A5A] bg-[#B88A5A]/10 px-2.5 py-1 rounded-full mb-3">
          {t("promo.badge")}
        </span>

        <h3 className="font-[family-name:var(--font-heading)] text-[#0B1220] text-[17px] font-bold leading-snug mb-2">
          {t("promo.title")}
        </h3>

        <p className="text-[#0B1220]/60 text-[13px] leading-relaxed mb-4">
          {t("promo.desc")}
        </p>

        <a
          href={t("promo.href")}
          className="block w-full text-center bg-[#B88A5A] hover:bg-[#A07848] text-white text-[13px] font-semibold py-2.5 rounded-full transition-colors"
        >
          {t("promo.cta")}
        </a>
      </div>
    </div>
  );
}
