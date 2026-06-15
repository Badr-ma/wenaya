"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";

/* ── Hero Section ──────────────────────────────────────────── */
export default function HeroSection(): React.JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.set([".hero-eyebrow", ".hero-line", ".hero-sub", ".hero-cta", trustRef.current], {
        opacity: 0,
      });

      gsap.timeline({ defaults: { ease: "power3.out" } })
        .to(".hero-eyebrow", { opacity: 1, y: 0, duration: 0.55 })
        .fromTo(".hero-line", { y: 32 }, { opacity: 1, y: 0, duration: 0.75, stagger: 0.1 }, "-=0.25")
        .to(".hero-sub", { opacity: 1, y: 0, duration: 0.5 }, "-=0.35")
        .to(".hero-cta", { opacity: 1, y: 0, duration: 0.45 }, "-=0.25")
        .to(trustRef.current, { opacity: 1, duration: 0.5 }, "-=0.25");
    }, el);

    return () => ctx.revert();
  }, []);

  const stats = [
    { value: "35", label: "thérapeutes certifiés" },
    { value: "+2 000", label: "patients accompagnés" },
    { value: "4,7 ★", label: "avis Google Maps" },
    { value: "6", label: "disciplines cliniques" },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* ── Video background ── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: "center 30%" }}
      >
        <source src="/videos/forest.mp4" type="video/mp4" />
      </video>

      {/* ── Directional overlay: dark-left for text, lighter-right for video depth ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(108deg, rgba(6,10,22,0.94) 0%, rgba(6,10,22,0.88) 38%, rgba(6,10,22,0.65) 60%, rgba(6,10,22,0.50) 80%, rgba(6,10,22,0.58) 100%)",
        }}
      />
      {/* Top dark fade (hides video at nav level) */}
      <div
        className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(6,10,22,0.7) 0%, transparent 100%)" }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 pt-28 pb-20">
        <div className="max-w-2xl">
          <div>
            {/* Eyebrow */}
            <div className="hero-eyebrow inline-flex items-center gap-2.5 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-[#B88A5A] shrink-0" />
              <span className="text-[#B88A5A]/75 text-[11px] font-semibold tracking-[0.24em] uppercase">
                Casablanca · Maroc
              </span>
              <div className="w-8 h-px bg-[#B88A5A]/30" />
              <span className="text-white/28 text-[11px] tracking-[0.14em] uppercase">Depuis 2019</span>
            </div>

            {/* Headline */}
            <h1
              className="text-white leading-[1.04]"
              style={{
                fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(3rem, 5.5vw, 5.2rem)",
                fontWeight: 500,
                letterSpacing: "-0.02em",
              }}
            >
              <span className="hero-line block">Vous méritez</span>
              <span className="hero-line block">
                une santé{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #D4A870 0%, #B88A5A 45%, #E8C99A 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontStyle: "italic",
                  }}
                >
                  complète.
                </span>
              </span>
            </h1>

            {/* Sub */}
            <p
              className="hero-sub mt-7 max-w-[480px] leading-[1.78]"
              style={{ color: "rgba(255,255,255,0.5)", fontSize: "clamp(0.93rem, 1.4vw, 1.05rem)" }}
            >
              Wenaya réunit kinésithérapie, psychologie clinique, nutrition et Yolo AI sous un seul écosystème — pour une santé préventive, personnalisée et durable, à Casablanca.
            </p>

            {/* CTAs */}
            <div className="hero-cta flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-10">
              <Link
                href="#"
                onClick={(e) => e.preventDefault()}
                className="inline-flex items-center justify-center h-11 px-7 rounded-xl text-white text-[13.5px] font-semibold transition-all duration-300 hover:-translate-y-px active:translate-y-0"
                style={{
                  background: "linear-gradient(135deg, #C99B68 0%, #9A7242 100%)",
                  boxShadow: "0 1px 0 rgba(255,255,255,0.16) inset, 0 6px 24px rgba(184,138,90,0.35)",
                }}
              >
                Réserver une évaluation
              </Link>
              <Link
                href="/yolo"
                className="inline-flex items-center gap-2 h-11 px-6 rounded-xl text-white/55 text-[13.5px] font-medium border border-white/[0.12] transition-all duration-300 hover:text-white hover:border-white/[0.22] hover:bg-white/[0.04]"
                style={{ backdropFilter: "blur(8px)" }}
              >
                Découvrir Yolo AI
                <svg className="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>

        </div>

        {/* Trust bar */}
        <div
          ref={trustRef}
          className="mt-20 pt-8 grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="font-heading font-bold text-[22px] tracking-tight text-white/90">
                {s.value}
              </div>
              <div className="text-[11.5px] text-white/32">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade to page background */}
      <div
        className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #F2EFE9)" }}
      />
    </section>
  );
}
