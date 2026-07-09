"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { useLocale } from "@/contexts/LanguageContext";

export default function EntreprisesHero(): React.JSX.Element {
  const { t, tRaw } = useLocale();
  const bullets = tRaw<string[]>("entreprises.hero.bullets");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(".eh-fade", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[80vh] sm:min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=2400&q=100"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220]/85 via-[#0B1220]/60 to-[#0B1220]/30" />
      </div>

      <div className="relative z-10 w-full px-6 pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-xl">
            <div className="eh-fade">
              <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase">
                <span className="w-8 h-px bg-[#B88A5A]/40" />
                {t("entreprises.hero.badge")}
              </span>
            </div>

            <h1 className="eh-fade mt-8 text-white leading-[1.04] tracking-[-0.03em] font-serif"
              style={{ fontSize: "clamp(2.8rem, 5.5vw, 5rem)", fontWeight: 500 }}
            >
              {t("entreprises.hero.heading1")}{" "}
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(135deg, #B88A5A 0%, #D4A574 50%, #B88A5A 100%)" }}
              >
                {t("entreprises.hero.heading2")}
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

            <div className="eh-fade flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-10">
              <a
                href="https://calendar.app.google/YyAirdPSc2ugGbnh9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full text-white text-sm font-semibold transition-all duration-300 hover:-translate-y-px active:translate-y-0 sm:w-auto w-full"
                style={{
                  background: "linear-gradient(135deg, #C99B68 0%, #9A7242 100%)",
                  boxShadow: "0 1px 0 rgba(255,255,255,0.14) inset, 0 6px 28px rgba(184,138,90,0.35)",
                }}
              >
                {t("entreprises.hero.cta1")}
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="#downloads"
                className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full text-white/30 text-sm font-medium border border-white/[0.1] transition-all duration-300 hover:text-white hover:border-white/[0.2] sm:w-auto w-full"
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
