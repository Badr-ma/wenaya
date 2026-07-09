"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/contexts/LanguageContext";

export default function StickyCta() {
  const { t } = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToContact = () => {
    const el = document.querySelector("[data-contact]");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-500 ease-out lg:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-[#0B1220]/95 backdrop-blur-xl border-t border-white/10 px-4 py-3">
        <button
          onClick={scrollToContact}
          className="w-full h-11 rounded-xl text-white text-sm font-semibold transition-all duration-300 active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #C99B68 0%, #9A7242 100%)",
            boxShadow: "0 1px 0 rgba(255,255,255,0.14) inset, 0 6px 28px rgba(184,138,90,0.35)",
          }}
        >
          {t("entreprises.stickyCta.cta")}
        </button>
      </div>
    </div>
  );
}

