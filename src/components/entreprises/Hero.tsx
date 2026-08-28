/**
 * Corporate Hero — full-width hero section for the /solutions/entreprises page.
 * Two-column layout: left has headline, description, CTA button, and trust indicators;
 * right has a rounded image of a corporate wellness session. GSAP entrance animations.
 */
"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { useLocale } from "@/contexts/LanguageContext";

const reducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

export default function EntreprisesHero(): React.JSX.Element {
  const { t, tRaw } = useLocale();
  const bullets = tRaw<string[]>("entreprises.hero.bullets");
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(".eh-fade", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 })
        .fromTo(".eh-hl", { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: "power4.out" }, 0.05);

      gsap.fromTo(imageRef.current, { scale: 1.14, yPercent: -3 }, {
        scale: 1, yPercent: 3, ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[80vh] sm:min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <div ref={imageRef} className="absolute inset-0 will-change-transform">
          <Image
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=2400&q=100"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220]/45 via-[#0B1220]/20 to-transparent" />
      </div>

      <div className="relative z-10 w-full px-6 pt-40 pb-20 lg:pt-48 lg:pb-28">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-xl">
            <div className="eh-fade">
              <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase">
                <span className="w-8 h-px bg-[#B88A5A]/40" />
                {t("entreprises.hero.badge")}
              </span>
            </div>

            <h1 className="mt-7 text-white leading-[1.08] tracking-[-0.03em] font-serif"
              style={{ fontSize: "clamp(2.8rem, 5.5vw, 5.2rem)", fontWeight: 500 }}
            >
              <span className="eh-hl-wrap inline-block overflow-hidden align-top">
                <span className="eh-hl block will-change-transform pb-[0.12em] -mb-[0.12em]">
                  {t("entreprises.hero.heading1")}
                </span>
              </span>{" "}
              <span className="eh-hl-wrap inline-block overflow-hidden align-top">
                <span
                  className="eh-hl block will-change-transform text-transparent bg-clip-text pb-[0.12em] -mb-[0.12em]"
                  style={{ backgroundImage: "linear-gradient(135deg, #B88A5A 0%, #D4A574 50%, #B88A5A 100%)" }}
                >
                  {t("entreprises.hero.heading2")}
                </span>
              </span>
            </h1>

            <p className="eh-fade text-white/60 text-base sm:text-lg leading-relaxed mt-6 max-w-md">
              {t("entreprises.hero.desc")}
            </p>

            <ul className="eh-fade mt-8 space-y-3">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-white/50 text-sm sm:text-base">
                  <svg className="w-4 h-4 mt-0.5 shrink-0 text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {b}
                </li>
              ))}
            </ul>

            <div className="eh-fade flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-11">
              <a
                href="https://calendar.app.google/YyAirdPSc2ugGbnh9"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2.5 h-14 px-9 rounded-full text-white text-base font-semibold shadow-[0_10px_30px_-10px_rgba(184,138,90,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-12px_rgba(184,138,90,0.85)] active:translate-y-0 sm:w-auto w-full"
                style={{ background: "#B88A5A" }}
              >
                {t("entreprises.hero.cta1")}
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="#downloads"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full text-white/80 text-sm font-medium border border-white/25 transition-all duration-300 hover:text-white hover:border-white/50 hover:bg-white/10 sm:w-auto w-full"
              >
                {t("entreprises.hero.cta2")}
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 16v4h16v-4" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
