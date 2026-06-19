"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import Image from "next/image";
import HiggsField from "@/components/HiggsField";

const bullets = [
  "Réduire l'absentéisme et les risques psychosociaux",
  "Renforcer l'engagement et la productivité des équipes",
  "Attirer et fidéliser les talents",
];

export default function EntreprisesHero(): React.JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        "#eh-badge, #eh-title, #eh-desc, #eh-bullets, #eh-cta, #eh-stats",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#0B1220] min-h-screen flex items-center overflow-hidden">
      {/* Full-bleed background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/entreprises/scans-hero.webp"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220]/85 via-[#0B1220]/60 to-[#0B1220]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/40 via-transparent to-[#0B1220]/20" />
      </div>

      <HiggsField parentRef={sectionRef as React.RefObject<HTMLElement | null>} />

      {/* Ambient glows */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#159AA9]/6 to-transparent pointer-events-none z-[2]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#B88A5A]/20 to-transparent z-[2]" />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pt-36 pb-20 lg:pt-40 lg:pb-28">
        <div className="max-w-2xl">
          <div id="eh-badge">
            <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase">
              <span className="w-6 h-px bg-[#B88A5A]/40" />
              Wenaya pour l&apos;entreprise
            </span>
          </div>

          <h1 id="eh-title" className="heading-serif text-white mt-6" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}>
            Cultivez le bien-être.<br />
            <span className="text-[#B88A5A]">Récoltez la performance.</span>
          </h1>

          <p id="eh-desc" className="text-white/50 text-base sm:text-lg leading-relaxed mt-6 max-w-lg">
            Un partenaire santé et bien-être au travail qui s&apos;adapte à vos équipes,
            à vos rythmes et à vos enjeux RH. Pas l&apos;inverse.
          </p>

          {/* Value bullets */}
          <ul id="eh-bullets" className="mt-8 space-y-3">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-3 text-white/70 text-sm sm:text-base">
                <svg className="w-4 h-4 mt-0.5 shrink-0 text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {b}
              </li>
            ))}
          </ul>

          <div id="eh-cta" className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-10">
            <a
              href="https://calendar.app.google/YyAirdPSc2ugGbnh9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl text-white text-sm font-semibold transition-all duration-300 hover:-translate-y-px active:translate-y-0 sm:w-auto w-full"
              style={{
                background: "linear-gradient(135deg, #C99B68 0%, #9A7242 100%)",
                boxShadow: "0 1px 0 rgba(255,255,255,0.14) inset, 0 6px 28px rgba(184,138,90,0.35)",
              }}
            >
              Réserver un audit gratuit
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl text-white/45 text-sm font-medium border border-white/[0.08] transition-all duration-300 hover:text-white hover:border-white/[0.16] hover:bg-white/[0.03] sm:w-auto w-full"
            >
              Télécharger notre catalogue
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 16v4h16v-4" />
              </svg>
            </a>
          </div>

          <div id="eh-stats" className="flex flex-wrap gap-6 sm:gap-12 mt-14">
            <div>
              <p className="text-white text-2xl sm:text-3xl font-bold font-heading tracking-tight">35</p>
              <p className="text-white/35 text-xs sm:text-sm mt-1">thérapeutes certifiés</p>
            </div>
            <div>
              <p className="text-white text-2xl sm:text-3xl font-bold font-heading tracking-tight">+2 000</p>
              <p className="text-white/35 text-xs sm:text-sm mt-1">collaborateurs accompagnés</p>
            </div>
            <div>
              <p className="text-white text-2xl sm:text-3xl font-bold font-heading tracking-tight">4/4</p>
              <p className="text-white/35 text-xs sm:text-sm mt-1">piliers d&apos;intervention</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
