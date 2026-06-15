"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";

/* ── Health dashboard card ─────────────────────────────────── */
function HealthCard(): React.JSX.Element {
  const cardRef = useRef<HTMLDivElement>(null);
  const circumference = 2 * Math.PI * 34;

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const arcEl = card.querySelector<SVGCircleElement>(".hc-arc");
    const scoreEl = card.querySelector<HTMLElement>(".hc-score");
    const bars = card.querySelectorAll<HTMLElement>(".hc-bar");
    const trendEl = card.querySelector<SVGPathElement>(".hc-trend");
    const targets = [82, 68, 74];

    gsap.timeline({ delay: 0.9 })
      .to({}, {
        duration: 1.4,
        ease: "power2.out",
        onUpdate: function () {
          const v = Math.round(73 * this.progress());
          if (scoreEl) scoreEl.textContent = String(v);
          if (arcEl) arcEl.style.strokeDashoffset = String(circumference - (circumference * v) / 100);
        },
      })
      .to(bars, {
        width: (i: number) => `${targets[i]}%`,
        duration: 0.9,
        stagger: 0.14,
        ease: "power2.out",
      }, "-=0.9")
      .to(trendEl, {
        strokeDashoffset: 0,
        duration: 1.4,
        ease: "power2.inOut",
      }, "-=1.0");
  }, []);

  return (
    <div className="relative">
      {/* Ambient glow */}
      <div
        className="absolute -inset-10 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(184,138,90,0.1) 0%, transparent 65%)" }}
      />

      <div
        className="relative rounded-2xl p-6"
        style={{
          background: "linear-gradient(145deg, rgba(11,18,38,0.97) 0%, rgba(6,10,22,0.99) 100%)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.04) inset",
        }}
      >
        {/* Card header */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-white/30 text-[10px] tracking-[0.2em] uppercase font-semibold">
            Score de Santé
          </span>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-[7px] w-[7px]">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B88A5A] opacity-50" />
              <span className="relative inline-flex rounded-full h-[7px] w-[7px] bg-[#B88A5A]" />
            </span>
            <span className="text-[#B88A5A]/55 text-[10px] font-medium tracking-wide">Yolo AI</span>
          </div>
        </div>

        {/* Score ring */}
        <div className="flex items-center gap-5 mb-6">
          <div className="relative w-[84px] h-[84px] flex items-center justify-center shrink-0">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 84 84">
              <circle cx="42" cy="42" r="34" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6" />
              <circle
                className="hc-arc"
                cx="42" cy="42" r="34" fill="none"
                stroke="#B88A5A" strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={circumference}
                strokeLinecap="round"
              />
            </svg>
            <div className="text-center z-10">
              <div className="hc-score font-heading font-bold text-white text-[22px] leading-none">0</div>
              <div className="text-white/22 text-[9px] mt-0.5 tracking-wide">/100</div>
            </div>
          </div>
          <p className="text-white/30 text-[11px] leading-[1.7]">
            Évaluation issue de<br />6 disciplines cliniques<br />+ analyse Yolo AI
          </p>
        </div>

        {/* Metric bars */}
        <div className="space-y-3.5 mb-5">
          {[
            { label: "Physique", val: 82, color: "#B88A5A" },
            { label: "Mental", val: 68, color: "#159AA9" },
            { label: "Nutrition", val: 74, color: "#B88A5A" },
          ].map((m) => (
            <div key={m.label}>
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="text-white/40 text-[11px]">{m.label}</span>
                <span className="text-white/28 text-[10.5px] font-medium tabular-nums">{m.val}</span>
              </div>
              <div className="h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                <div
                  className="hc-bar h-full rounded-full"
                  style={{ width: "0%", backgroundColor: m.color, transition: "width 0.05s" }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Trend chart */}
        <div className="pt-4 border-t border-white/[0.05]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/22 text-[10px] tracking-wide">Tendance · 90 jours</span>
            <span className="text-[#B88A5A] text-[10px] font-semibold">↑ +12 pts</span>
          </div>
          <svg viewBox="0 0 240 38" className="w-full" fill="none">
            <defs>
              <linearGradient id="hc-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#B88A5A" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#B88A5A" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M4,32 Q55,28 95,19 T185,9 T235,4 L235,38 L4,38 Z" fill="url(#hc-grad)" />
            <path
              className="hc-trend"
              d="M4,32 Q55,28 95,19 T185,9 T235,4"
              stroke="#B88A5A" strokeWidth="1.5" strokeLinecap="round"
              strokeDasharray={290} strokeDashoffset={290}
            />
            <circle cx="235" cy="4" r="3" fill="#B88A5A" opacity="0.8" />
          </svg>
        </div>

        {/* Next appointment hint */}
        <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#159AA9]/70 shrink-0" />
          <span className="text-white/22 text-[10px]">Prochain RDV :</span>
          <span className="text-white/40 text-[10px] font-medium">Jeudi 19 juin · 14h00</span>
        </div>
      </div>
    </div>
  );
}

/* ── Hero Section ──────────────────────────────────────────── */
export default function HeroSection(): React.JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.set([".hero-eyebrow", ".hero-line", ".hero-sub", ".hero-cta", cardRef.current, trustRef.current], {
        opacity: 0,
      });

      gsap.timeline({ defaults: { ease: "power3.out" } })
        .to(".hero-eyebrow", { opacity: 1, y: 0, duration: 0.55 })
        .fromTo(".hero-line", { y: 32 }, { opacity: 1, y: 0, duration: 0.75, stagger: 0.1 }, "-=0.25")
        .to(".hero-sub", { opacity: 1, y: 0, duration: 0.5 }, "-=0.35")
        .to(".hero-cta", { opacity: 1, y: 0, duration: 0.45 }, "-=0.25")
        .fromTo(cardRef.current, { x: 28, scale: 0.97 }, { opacity: 1, x: 0, scale: 1, duration: 0.75, ease: "power2.out" }, "-=0.65")
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
      style={{ background: "#080E1C" }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Radial vignette to fade dots at edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 20%, #080E1C 75%)",
        }}
      />
      {/* Bronze ambient — right */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(184,138,90,0.07) 0%, transparent 65%)" }}
      />
      {/* Teal ambient — bottom-left */}
      <div
        className="absolute -left-32 bottom-0 w-[500px] h-[500px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(21,154,169,0.05) 0%, transparent 65%)" }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 pt-28 pb-20">
        <div className="grid lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px] gap-12 xl:gap-20 items-center">

          {/* ── Left column ── */}
          <div>
            {/* Eyebrow */}
            <div className="hero-eyebrow inline-flex items-center gap-2.5 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-[#B88A5A] shrink-0" />
              <span className="text-[#B88A5A]/70 text-[11px] font-semibold tracking-[0.24em] uppercase">
                Casablanca · Maroc
              </span>
              <div className="w-8 h-px bg-[#B88A5A]/25" />
              <span className="text-white/25 text-[11px] tracking-[0.14em] uppercase">Depuis 2019</span>
            </div>

            {/* Headline — Cormorant Garamond for editorial weight */}
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
              style={{ color: "rgba(255,255,255,0.45)", fontSize: "clamp(0.93rem, 1.4vw, 1.05rem)" }}
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
                  boxShadow: "0 1px 0 rgba(255,255,255,0.16) inset, 0 6px 24px rgba(184,138,90,0.32)",
                }}
              >
                Réserver une évaluation
              </Link>
              <Link
                href="/yolo"
                className="inline-flex items-center gap-2 h-11 px-6 rounded-xl text-white/50 text-[13.5px] font-medium border border-white/[0.08] transition-all duration-300 hover:text-white hover:border-white/[0.16] hover:bg-white/[0.03]"
              >
                Découvrir Yolo AI
                <svg className="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>

          {/* ── Right column: health card ── */}
          <div ref={cardRef} className="hidden lg:block">
            <HealthCard />
          </div>
        </div>

        {/* ── Trust bar ── */}
        <div
          ref={trustRef}
          className="mt-20 pt-8 grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div
                className="font-heading font-bold text-[22px] tracking-tight"
                style={{ color: "rgba(255,255,255,0.88)" }}
              >
                {s.value}
              </div>
              <div className="text-[11.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fade to next section (body bg: #F2EFE9) */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #F2EFE9)" }}
      />
    </section>
  );
}
