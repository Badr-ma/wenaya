"use client";

import { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "wenaya-cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [animIn, setAnimIn] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimIn(true)));
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setAnimIn(false);
    setTimeout(() => setVisible(false), 300);
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, "declined");
    setAnimIn(false);
    setTimeout(() => setVisible(false), 300);
  };

  if (!visible) return null;

  return (
    <div
      ref={ref}
      className="fixed bottom-6 right-6 z-[200] w-[340px] transition-all duration-300 ease-out"
      style={{
        transform: animIn ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
        opacity: animIn ? 1 : 0,
      }}
    >
      <div className="bg-[#0B1220] rounded-2xl border border-white/[0.06] shadow-2xl p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="w-8 h-8 rounded-full bg-[#B88A5A]/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
            </svg>
          </div>
          <button
            onClick={decline}
            aria-label="Fermer"
            className="w-6 h-6 rounded-full flex items-center justify-center text-white/20 hover:text-white/50 hover:bg-white/[0.06] transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-sm text-white/60 leading-relaxed mb-3">
          We use cookies to improve your experience on Wenaya.
        </p>
        <p className="text-xs text-white/30 leading-relaxed mb-5">
          By accepting, you allow us to personalize content and analyze our traffic.
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={accept}
            className="flex-1 px-4 py-2.5 rounded-full text-xs font-semibold text-[#0B1220] bg-[#B88A5A] hover:bg-[#B88A5A]/90 transition-all active:scale-[0.98]"
          >
            Accept
          </button>
          <button
            onClick={decline}
            className="px-4 py-2.5 rounded-full text-xs font-medium text-white/40 hover:text-white/70 border border-white/[0.08] hover:border-white/[0.15] transition-all"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
