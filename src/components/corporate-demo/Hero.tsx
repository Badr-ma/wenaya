"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { useLocale } from "@/contexts/LanguageContext";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";

export default function DemoHero() {
  const { t } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const { elRef: animRef, ready } = useIntersectionDeferred("0px 0px");
  const prefersReduced = useRef(false);

  useEffect(() => {
    prefersReduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (!ready) return;
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      if (prefersReduced.current) {
        gsap.set([".h-mask", ".h-badge", ".h-line-draw", ".h-title span", ".h-sub", ".h-cta"], { opacity: 1, y: 0, scaleX: 1, clipPath: "inset(0% 0 0 0)" });
        return;
      }
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(".h-mask", { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.4, ease: "power4.inOut" })
        .fromTo(".h-badge", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.6")
        .fromTo(".h-line-draw", { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power2.inOut" }, "-=0.3")
        .fromTo(".h-title .line1", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.5")
        .fromTo(".h-title .line2", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.4")
        .fromTo(".h-sub", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3")
        .fromTo(".h-cta", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2");
      if (window.innerWidth < 1024) {
        // Mobile: subtle image scale as the mask opens (transform-only, cheap)
        tl.fromTo(".h-mask img", { scale: 1.18 }, { scale: 1.06, duration: 1.7, ease: "power2.out" }, 0);
      }
    }, el);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={(el) => { sectionRef.current = el; animRef.current = el; }}
      className="relative h-[100vh] min-h-[600px] flex items-end overflow-hidden"
      data-section-bg="dark"
    >
      {/* Background image with mask reveal */}
      <div className="h-mask absolute inset-0" style={{ clipPath: "inset(100% 0 0 0)" }}>
        <Image
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=2400&q=85"
          alt=""
          fill
          className="object-cover scale-105"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/50 to-[#0B1220]/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-6 pb-20 sm:pb-28 lg:pb-36 pt-48">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="h-badge overflow-hidden">
              <span className="inline-flex items-center gap-4 text-[#B88A5A] text-xs font-semibold tracking-[0.25em] uppercase">
                <span className="h-line-draw w-12 h-px bg-[#B88A5A] inline-block origin-left" style={{ transform: "scaleX(0)" }} />
                {t("entreprises.hero.badge")}
              </span>
            </div>

            {/* Title — line by line */}
            <h1
              className="h-title mt-10 text-white leading-[1.0] tracking-[-0.03em] font-serif"
              style={{ fontSize: "clamp(2.8rem, 6vw, 6rem)", fontWeight: 500 }}
            >
                <span className="line1 block overflow-hidden">
                <span className="block">{t("entreprises.hero.heading1")}</span>
              </span>
              <span className="line2 block text-transparent bg-clip-text mt-2 overflow-hidden" style={{
                backgroundImage: "linear-gradient(135deg, #B88A5A 0%, #D4A574 50%, #B88A5A 100%)",
              }}>
                <span className="block">{t("entreprises.hero.heading2")}</span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="h-sub text-white/50 text-lg sm:text-xl leading-relaxed mt-8 max-w-xl">
              {t("entreprises.hero.desc")}
            </p>

            {/* CTAs — no card, just text links */}
            <div className="flex flex-col sm:flex-row items-start gap-5 mt-12">
              <a
                href="https://calendar.app.google/YyAirdPSc2ugGbnh9"
                target="_blank"
                rel="noopener noreferrer"
                className="h-cta inline-flex items-center gap-3 text-white text-sm font-semibold group"
              >
                <span className="border-b border-[#B88A5A] pb-0.5 group-hover:border-white transition-colors">{t("entreprises.hero.cta1")}</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="#contact"
                className="h-cta inline-flex items-center gap-3 text-white/60 text-sm font-semibold group"
              >
                <span className="border-b border-white/20 pb-0.5 group-hover:border-white/50 transition-colors">{t("entreprises.hero.cta2")}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade for continuity */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0B1220] to-transparent pointer-events-none" />
    </section>
  );
}
