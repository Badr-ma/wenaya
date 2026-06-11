"use client";

import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function DonutChart() {
  return (
    <svg viewBox="0 0 200 130" className="w-full h-full">
      <defs>
        <radialGradient id="dr1" cx="45%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#159AA9" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#159AA9" stopOpacity="0" />
        </radialGradient>
        <filter id="dg1">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#159AA9" floodOpacity="0.15" />
        </filter>
      </defs>
      <style>{`
        @keyframes df { 0%{stroke-dashoffset:251} 100%{stroke-dashoffset:88} }
        @keyframes dd1 { 0%,100%{opacity:0.3;transform:scale(1)} 50%{opacity:0.7;transform:scale(1.15)} }
        @keyframes dd2 { 0%,100%{opacity:0.2;transform:translateY(0)} 50%{opacity:0.5;transform:translateY(-2px)} }
      `}</style>
      <circle cx="100" cy="62" r="48" fill="url(#dr1)" />
      <circle cx="100" cy="62" r="40" stroke="#EEEBE5" strokeWidth="5" />
      <circle cx="100" cy="62" r="40" stroke="#159AA9" strokeWidth="5" strokeLinecap="round" strokeDasharray="251" strokeDashoffset="251" fill="none" transform="rotate(-90 100 62)" style={{ animation: "df 2.8s ease-out infinite alternate", filter: "url(#dg1)" }} />
      <circle cx="100" cy="62" r="40" stroke="#159AA9" strokeWidth="5" strokeLinecap="round" strokeDasharray="251" strokeDashoffset="251" fill="none" transform="rotate(-90 100 62)" opacity="0.06" />
      <circle cx="100" cy="62" r="29" stroke="#159AA9" strokeWidth="0.3" opacity="0.06" />
      <circle cx="100" cy="62" r="18" stroke="#159AA9" strokeWidth="0.3" opacity="0.04" />
      <text x="100" y="57" textAnchor="middle" fill="#0B1220" fontSize="21" fontFamily="inherit" fontWeight="700" letterSpacing="-0.5">65</text>
      <text x="100" y="68" textAnchor="middle" fill="#0B1220" fontSize="9" fontFamily="inherit" opacity="0.25" fontWeight="600">/100</text>
      <circle cx="64" cy="100" r="2" fill="#159AA9" style={{ animation: "dd1 2s ease-in-out infinite" }} />
      <text x="72" y="103" fill="#2B2F36" fontSize="7.5" fontFamily="inherit" opacity="0.45">Bio 84</text>
      <circle cx="136" cy="100" r="2" fill="#A67C52" style={{ animation: "dd1 2.4s ease-in-out infinite" }} />
      <text x="144" y="103" fill="#2B2F36" fontSize="7.5" fontFamily="inherit" opacity="0.45">Clin 72</text>
    </svg>
  );
}

function HorizBars() {
  return (
    <svg viewBox="0 0 200 130" className="w-full h-full">
      <defs>
        <linearGradient id="h1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#159AA9" />
          <stop offset="100%" stopColor="#159AA9" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="h2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#A67C52" />
          <stop offset="100%" stopColor="#A67C52" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="h3" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0B1220" />
          <stop offset="100%" stopColor="#0B1220" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <style>{`
        @keyframes hw1 { 0%{width:42} 100%{width:118} }
        @keyframes hw2 { 0%{width:28} 100%{width:82} }
        @keyframes hw3 { 0%{width:58} 100%{width:142} }
        @keyframes hw4 { 0%{width:36} 100%{width:98} }
        @keyframes hw5 { 0%{width:52} 100%{width:130} }
      `}</style>
      <g opacity="0.35">
        <text x="0" y="21" fill="#2B2F36" fontSize="7.5" fontFamily="inherit" fontWeight="500">Alimentation</text>
        <rect x="82" y="14" height="7" rx="3.5" fill="#EEEBE5" width="118" />
        <rect x="82" y="14" height="7" rx="3.5" fill="url(#h1)" width="42" opacity="0.7" style={{ animation: "hw1 2.2s ease-in-out infinite alternate" }} />
      </g>
      <g opacity="0.35">
        <text x="0" y="39" fill="#2B2F36" fontSize="7.5" fontFamily="inherit" fontWeight="500">Activité</text>
        <rect x="82" y="32" height="7" rx="3.5" fill="#EEEBE5" width="118" />
        <rect x="82" y="32" height="7" rx="3.5" fill="url(#h2)" width="28" opacity="0.65" style={{ animation: "hw2 2.4s ease-in-out infinite alternate" }} />
      </g>
      <g>
        <text x="0" y="57" fill="#2B2F36" fontSize="7.5" fontFamily="inherit" fontWeight="500">Sommeil</text>
        <rect x="82" y="50" height="7" rx="3.5" fill="#EEEBE5" width="118" />
        <rect x="82" y="50" height="7" rx="3.5" fill="url(#h3)" width="58" opacity="0.5" style={{ animation: "hw3 2s ease-in-out infinite alternate" }} />
      </g>
      <g>
        <text x="0" y="75" fill="#2B2F36" fontSize="7.5" fontFamily="inherit" fontWeight="500">Stress</text>
        <rect x="82" y="68" height="7" rx="3.5" fill="#EEEBE5" width="118" />
        <rect x="82" y="68" height="7" rx="3.5" fill="url(#h1)" width="36" opacity="0.6" style={{ animation: "hw4 2.6s ease-in-out infinite alternate" }} />
      </g>
      <g>
        <text x="0" y="93" fill="#2B2F36" fontSize="7.5" fontFamily="inherit" fontWeight="500">Biochimie</text>
        <rect x="82" y="86" height="7" rx="3.5" fill="#EEEBE5" width="118" />
        <rect x="82" y="86" height="7" rx="3.5" fill="url(#h2)" width="52" opacity="0.6" style={{ animation: "hw5 2.8s ease-in-out infinite alternate" }} />
      </g>
      <line x1="82" y1="104" x2="200" y2="104" stroke="#159AA9" strokeWidth="0.3" opacity="0.06" />
    </svg>
  );
}

function MiniLineChart() {
  return (
    <svg viewBox="0 0 200 130" className="w-full h-full">
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#159AA9" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#159AA9" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lg2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A67C52" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#A67C52" stopOpacity="0" />
        </linearGradient>
        <filter id="lf1">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#159AA9" floodOpacity="0.2" />
        </filter>
      </defs>
      <style>{`
        @keyframes lc1 { 0%{d:path("M10,102 C26,90 42,92 58,82 C74,72 90,76 106,66 C122,56 138,60 154,50 C170,40 186,44 195,38")} 100%{d:path("M10,102 C26,72 42,75 58,62 C74,49 90,54 106,42 C122,30 138,35 154,24 C170,13 186,18 195,12")} }
        @keyframes lg { 0%,100%{opacity:0.3} 50%{opacity:0.6} }
      `}</style>
      <rect x="0" y="0" width="200" height="130" rx="4" fill="#F8F7F4" opacity="0.3" />
      <line x1="10" y1="105" x2="195" y2="105" stroke="#E5E2DC" strokeWidth="0.5" />
      <line x1="10" y1="79" x2="195" y2="79" stroke="#E5E2DC" strokeWidth="0.3" strokeDasharray="2 3" />
      <line x1="10" y1="53" x2="195" y2="53" stroke="#E5E2DC" strokeWidth="0.3" strokeDasharray="2 3" />
      <line x1="10" y1="27" x2="195" y2="27" stroke="#E5E2DC" strokeWidth="0.3" strokeDasharray="2 3" />
      <path fill="url(#lg1)" d="M10 105 C26 90 42 92 58 82 C74 72 90 76 106 66 C122 56 138 60 154 50 C170 40 186 44 195 38 L195 105 Z" opacity="0.5" style={{ animation: "lc1 3s ease-in-out infinite alternate" }} />
      <path fill="none" stroke="#159AA9" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" d="M10,102 C26,90 42,92 58,82 C74,72 90,76 106,66 C122,56 138,60 154,50 C170,40 186,44 195,38" style={{ animation: "lc1 3s ease-in-out infinite alternate" }} filter="url(#lf1)" />
      <g style={{ animation: "lg 2s ease-in-out infinite" }}>
        <circle cx="195" cy="38" r="3" fill="#159AA9" filter="url(#lf1)" />
        <circle cx="195" cy="38" r="6" fill="#159AA9" opacity="0.1" />
      </g>
      <text x="14" y="120" fill="#2B2F36" fontSize="6.5" fontFamily="inherit" opacity="0.3">J0</text>
      <text x="96" y="120" fill="#2B2F36" fontSize="6.5" fontFamily="inherit" opacity="0.3">J45</text>
      <text x="181" y="120" fill="#2B2F36" fontSize="6.5" fontFamily="inherit" opacity="0.3">J90</text>
    </svg>
  );
}

function AreaChart() {
  return (
    <svg viewBox="0 0 200 130" className="w-full h-full">
      <defs>
        <linearGradient id="ag1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#159AA9" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#159AA9" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ag2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A67C52" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#A67C52" stopOpacity="0" />
        </linearGradient>
        <filter id="af1">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#159AA9" floodOpacity="0.15" />
        </filter>
      </defs>
      <style>{`
        @keyframes am1 { 0%{d:path("M10,98 C30,82 50,86 70,76 C90,66 110,70 130,60 C150,50 170,54 190,46")} 100%{d:path("M10,98 C30,68 50,72 70,60 C90,48 110,52 130,42 C150,32 170,36 190,28")} }
        @keyframes am2 { 0%{d:path("M10,105 C30,94 50,97 70,90 C90,83 110,86 130,79 C150,72 170,75 190,70")} 100%{d:path("M10,105 C30,86 50,89 70,80 C90,71 110,74 130,66 C150,58 170,61 190,56")} }
        @keyframes ap1 { 0%,100%{opacity:0.3;r:2.5} 50%{opacity:0.8;r:3.5} }
        @keyframes ap2 { 0%,100%{opacity:0.15} 50%{opacity:0.35} }
      `}</style>
      <rect x="0" y="0" width="200" height="130" rx="4" fill="#F8F7F4" opacity="0.3" />
      <line x1="10" y1="108" x2="195" y2="108" stroke="#E5E2DC" strokeWidth="0.5" />
      <line x1="10" y1="83" x2="195" y2="83" stroke="#E5E2DC" strokeWidth="0.3" strokeDasharray="2 3" />
      <line x1="10" y1="58" x2="195" y2="58" stroke="#E5E2DC" strokeWidth="0.3" strokeDasharray="2 3" />
      <line x1="10" y1="33" x2="195" y2="33" stroke="#E5E2DC" strokeWidth="0.3" strokeDasharray="2 3" />
      <path fill="url(#ag1)" d="M10 108 C30 82 50 86 70 76 C90 66 110 70 130 60 C150 50 170 54 190 46 L190 108 Z" opacity="0.5" style={{ animation: "am1 3.2s ease-in-out infinite alternate" }} />
      <path fill="none" stroke="#159AA9" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" d="M10,98 C30,82 50,86 70,76 C90,66 110,70 130,60 C150,50 170,54 190,46" style={{ animation: "am1 3.2s ease-in-out infinite alternate" }} />
      <path fill="url(#ag2)" d="M10 108 C30 94 50 97 70 90 C90 83 110 86 130 79 C150 72 170 75 190 70 L190 108 Z" opacity="0.4" style={{ animation: "am2 3.8s ease-in-out infinite alternate" }} />
      <path fill="none" stroke="#A67C52" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" d="M10,105 C30,94 50,97 70,90 C90,83 110,86 130,79 C150,72 170,75 190,70" style={{ animation: "am2 3.8s ease-in-out infinite alternate" }} />
      <circle cx="190" cy="46" r="3" fill="#159AA9" filter="url(#af1)" />
      <circle cx="190" cy="46" r="7" fill="#159AA9" opacity="0.08" />
      <circle cx="190" cy="70" r="2.5" fill="#A67C52" />
      <circle cx="70" cy="76" r="2" fill="#159AA9" style={{ animation: "ap1 2.5s ease-in-out infinite" }} />
      <circle cx="130" cy="60" r="2" fill="#A67C52" style={{ animation: "ap1 3s ease-in-out 0.3s infinite" }} />
      <line x1="190" y1="46" x2="190" y2="108" stroke="#159AA9" strokeWidth="0.3" strokeDasharray="2 3" opacity="0.15" style={{ animation: "ap2 2s ease-in-out infinite" }} />
    </svg>
  );
}

const icons = [DonutChart, HorizBars, MiniLineChart, AreaChart];

const steps = [
  { number: "01", title: "Assess", subtitle: "Comprendre où vous en êtes." },
  { number: "02", title: "Align", subtitle: "Construire un parcours qui vous ressemble." },
  { number: "03", title: "Activate", subtitle: "Passer à l'action, ensemble." },
  { number: "04", title: "Sustain", subtitle: "Prévenir, performer, durer." },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const subheadingRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);

  const setStepRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      stepRefs.current[i] = el;
    },
    []
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const cards = stepRefs.current.filter(Boolean) as HTMLDivElement[];

      gsap.set(cards, { opacity: 0, y: 24, scale: 0.97 });
      gsap.set(headingRef.current, { opacity: 0, y: 16 });
      gsap.set(subheadingRef.current, { opacity: 0, y: 12 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        defaults: { ease: "power3.out", duration: 0.5 },
      });

      tl
        .to(headingRef.current, { opacity: 1, y: 0, duration: 0.4 })
        .to(subheadingRef.current, { opacity: 1, y: 0, duration: 0.35 }, "-=0.2")
        .to(cards, { opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.4 }, "-=0.1");
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#F2EFE9] relative overflow-hidden"
      id="method"
      style={{ padding: "120px 0" }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#159AA9]/[0.04] rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#A67C52]/[0.03] rounded-full blur-[100px]" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.015]">
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#0B1220" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-[1280px] mx-auto px-10 max-md:px-5 relative">
        <div ref={headingRef} className="max-w-[600px] mx-auto text-center mb-4 will-change-transform">
          <span className="text-[#159AA9] font-semibold text-xs tracking-[0.2em] uppercase">
            Prévenir. Performer. Durer.
          </span>
          <h2 className="font-heading text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.08] font-bold text-[#0B1220] tracking-[-0.03em] mt-2">
            La méthode Wenaya.
          </h2>
        </div>

        <div ref={subheadingRef} className="max-w-[480px] mx-auto text-center mb-14 will-change-transform">
          <p className="text-[14px] leading-relaxed text-[#2B2F36] font-light">
            Quatre étapes pour reprendre la main sur votre santé.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {steps.map((step, i) => (
            <div
              key={i}
              ref={setStepRef(i)}
              className="group bg-white/90 backdrop-blur-sm rounded-[14px] overflow-hidden border border-[#0B1220]/[0.04] will-change-transform transition-all duration-500 hover:border-[#159AA9]/20 hover:shadow-[0_8px_32px_rgba(21,154,169,0.07)] flex flex-col"
              style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.02), 0 2px 8px rgba(0,0,0,0.02)" }}
            >
              <div className="h-[2px] bg-gradient-to-r from-[#159AA9]/60 via-[#159AA9]/30 to-transparent shrink-0" />

              <div className="px-5 pt-4 pb-1.5 flex flex-col gap-1.5 items-center text-center">
                <span className="text-[9px] font-semibold text-[#159AA9]/40 tracking-[0.15em] uppercase">
                  Étape {step.number}
                </span>
                <h3 className="font-heading text-[15px] font-bold text-[#0B1220] tracking-[-0.02em] leading-tight">
                  {step.title}
                </h3>
                <p className="text-[11px] text-[#2B2F36] leading-relaxed font-light max-w-[140px]">
                  {step.subtitle}
                </p>
              </div>

              <div className="flex-1 flex items-end px-2 pb-2">
                <div className="w-full transition-all duration-500 group-hover:scale-[1.02]">
                  {(() => {
                    const Icon = icons[i];
                    return <Icon />;
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3 mt-12">
          <a
            href="#"
            className="inline-flex items-center justify-center px-6 h-10 bg-[#0B1220] text-white rounded-lg font-medium text-[12px] tracking-wide transition-all duration-300 hover:bg-[#2B2F36] hover:shadow-[0_4px_16px_rgba(11,18,32,0.15)]"
          >
            Découvrir votre parcours
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center px-5 h-10 bg-transparent text-[#159AA9] border border-[#159AA9]/20 rounded-lg font-medium text-[12px] tracking-wide transition-all duration-300 hover:border-[#159AA9]/40 hover:bg-[#159AA9]/[0.02]"
          >
            Commencer votre évaluation
          </a>
        </div>
      </div>
    </section>
  );
}
