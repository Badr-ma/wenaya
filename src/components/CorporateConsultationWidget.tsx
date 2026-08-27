"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

function isCorporateRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/solutions/entreprises") ||
    pathname.startsWith("/en/solutions/entreprises") ||
    pathname.startsWith("/corporate-demo") ||
    pathname.startsWith("/en/corporate-demo")
  );
}

export default function CorporateConsultationWidget() {
  const pathname = usePathname();
  const isCorporate = isCorporateRoute(pathname);
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const close = useCallback(() => {
    setExpanded(false);
    setDismissed(true);
  }, []);

  useEffect(() => {
    if (!isCorporate) return;

    function show() {
      setVisible(true);
    }

    const onScroll = () => {
      const scrollPct =
        window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrollPct > 0.4) show();
    };

    const timer = setTimeout(show, 3000);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [isCorporate, pathname]);

  if (!isCorporate || dismissed || !visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[200] max-sm:bottom-4 max-sm:right-4">
      {/* Expanded panel */}
      <div
        className={`absolute bottom-0 right-0 w-[340px] max-sm:w-[300px] rounded-2xl overflow-hidden transition-all duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] origin-bottom-right ${
          expanded
            ? "opacity-100 scale-100 pointer-events-auto translate-y-0"
            : "opacity-0 scale-95 pointer-events-none translate-y-2"
        }`}
        style={{
          boxShadow: "0 20px 60px rgba(11,18,32,0.18), 0 4px 16px rgba(11,18,32,0.08)",
        }}
      >
        {/* Close button */}
        <button
          onClick={close}
          aria-label="Close"
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/20 backdrop-blur-md text-white/70 flex items-center justify-center transition-all duration-200 hover:bg-black/35 hover:text-white z-20"
        >
          <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        {/* Image */}
        <div className="relative w-full h-[140px]">
          <Image
            src="/images/wellness-stretch.jpg"
            alt="Corporate wellness"
            fill
            sizes="340px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/80 via-[#0B1220]/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="bg-white p-5">
          <h3 className="font-[family-name:var(--font-heading)] text-[#0B1220] text-[16px] font-bold leading-tight mb-1.5">
            Let&apos;s Build a Healthier Workplace
          </h3>
          <p className="text-[#0B1220]/45 text-[12px] leading-relaxed mb-4">
            Book a free consultation with our corporate wellness specialists.
          </p>
          <Link
            href={pathname.startsWith("/en") ? "/en/solutions/entreprises#contact" : "/solutions/entreprises#contact"}
            onClick={close}
            className="flex items-center justify-center w-full py-2.5 rounded-full text-white text-[13px] font-semibold transition-all duration-300 hover:-translate-y-px"
            style={{ backgroundColor: "#1A6B52" }}
          >
            Book Free Consultation
            <svg className="w-3.5 h-3.5 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Floating pill button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`relative flex items-center gap-2.5 pl-4 pr-5 py-3 rounded-full transition-all duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 ${
          expanded ? "shadow-none" : ""
        }`}
        style={{
          backgroundColor: expanded ? "#1A6B52" : "#0B1220",
          boxShadow: expanded ? "none" : "0 8px 30px rgba(11,18,32,0.25), 0 2px 8px rgba(11,18,32,0.1)",
        }}
        aria-label="Free consultation"
      >
        {/* Pulse dot */}
        {!expanded && (
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B88A5A] opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#B88A5A]" />
          </span>
        )}

        {/* Icon */}
        <svg className="w-4 h-4 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
          {expanded ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          )}
        </svg>

        {/* Label */}
        {!expanded && (
          <span className="text-white text-[12px] font-semibold whitespace-nowrap">
            Free Consultation
          </span>
        )}
      </button>
    </div>
  );
}
