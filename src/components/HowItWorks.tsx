"use client";

import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function DonutChart() {
  return (
    <svg viewBox="0 0 200 130" className="w-full h-full">
      <style>{`
        @keyframes dfill { 0%{stroke-dashoffset:251} 100%{stroke-dashoffset:88} }
        @keyframes dpulse { 0%,100%{opacity:0.4} 50%{opacity:0.7} }
      `}</style>
      <circle cx="100" cy="65" r="40" stroke="#E5E2DC" strokeWidth="6" opacity="0.5" />
      <circle cx="100" cy="65" r="40" stroke="#159AA9" strokeWidth="6" strokeLinecap="round" strokeDasharray="251" strokeDashoffset="251" fill="none" transform="rotate(-90 100 65)" style={{ animation: "dfill 2.5s ease-out infinite alternate" }} />
      <circle cx="100" cy="65" r="40" stroke="#159AA9" strokeWidth="6" strokeLinecap="round" strokeDasharray="251" strokeDashoffset="251" fill="none" transform="rotate(-90 100 65)" opacity="0.08" />
      <text x="100" y="60" textAnchor="middle" fill="#0B1220" fontSize="22" fontFamily="inherit" fontWeight="700">65%</text>
      <text x="100" y="76" textAnchor="middle" fill="#2B2F36" fontSize="9" fontFamily="inherit" opacity="0.5">Score global</text>
      <circle cx="66" cy="98" r="2.5" fill="#159AA9" style={{ animation: "dpulse 2s ease-in-out infinite" }} />
      <circle cx="134" cy="98" r="2.5" fill="#A67C52" style={{ animation: "dpulse 2.5s ease-in-out infinite" }} />
      <text x="74" y="101" fill="#2B2F36" fontSize="7" fontFamily="inherit" opacity="0.4">Bio 84%</text>
      <text x="142" y="101" fill="#2B2F36" fontSize="7" fontFamily="inherit" opacity="0.4">Clin 72%</text>
    </svg>
  );
}

function HorizBars() {
  return (
    <svg viewBox="0 0 200 130" className="w-full h-full">
      <style>{`
        @keyframes hb1 { 0%{width:48} 100%{width:124} }
        @keyframes hb2 { 0%{width:32} 100%{width:88} }
        @keyframes hb3 { 0%{width:64} 100%{width:148} }
        @keyframes hb4 { 0%{width:40} 100%{width:104} }
        @keyframes hbs { 0%,100%{opacity:0.05} 50%{opacity:0.12} }
      `}</style>
      <text x="0" y="22" fill="#2B2F36" fontSize="8" fontFamily="inherit" opacity="0.5">Physique</text>
      <rect x="52" y="14" height="8" rx="4" fill="#E5E2DC" opacity="0.5" width="148" />
      <rect x="52" y="14" height="8" rx="4" fill="#159AA9" opacity="0.6" width="48" style={{ animation: "hb1 2s ease-in-out infinite alternate" }} />

      <text x="0" y="42" fill="#2B2F36" fontSize="8" fontFamily="inherit" opacity="0.5">Mental</text>
      <rect x="52" y="34" height="8" rx="4" fill="#E5E2DC" opacity="0.5" width="148" />
      <rect x="52" y="34" height="8" rx="4" fill="#A67C52" opacity="0.5" width="32" style={{ animation: "hb2 2.2s ease-in-out infinite alternate" }} />

      <text x="0" y="62" fill="#2B2F36" fontSize="8" fontFamily="inherit" opacity="0.5">Nutrition</text>
      <rect x="52" y="54" height="8" rx="4" fill="#E5E2DC" opacity="0.5" width="148" />
      <rect x="52" y="54" height="8" rx="4" fill="#159AA9" opacity="0.5" width="64" style={{ animation: "hb3 1.8s ease-in-out infinite alternate" }} />

      <text x="0" y="82" fill="#2B2F36" fontSize="8" fontFamily="inherit" opacity="0.5">Sommeil</text>
      <rect x="52" y="74" height="8" rx="4" fill="#E5E2DC" opacity="0.5" width="148" />
      <rect x="52" y="74" height="8" rx="4" fill="#0B1220" opacity="0.35" width="40" style={{ animation: "hb4 2.4s ease-in-out infinite alternate" }} />

      <text x="0" y="102" fill="#2B2F36" fontSize="8" fontFamily="inherit" opacity="0.5">Biochimie</text>
      <rect x="52" y="94" height="8" rx="4" fill="#E5E2DC" opacity="0.5" width="148" />
      <rect x="52" y="94" height="8" rx="4" fill="#159AA9" opacity="0.55" width="48" style={{ animation: "hb1 2.6s ease-in-out infinite alternate" }} />

      <line x1="52" y1="110" x2="200" y2="110" stroke="#159AA9" strokeWidth="0.3" opacity="0.08" style={{ animation: "hbs 2s ease-in-out infinite" }} />
    </svg>
  );
}

function MiniLineChart() {
  return (
    <svg viewBox="0 0 200 130" className="w-full h-full">
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#159AA9" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#159AA9" stopOpacity="0" />
        </linearGradient>
      </defs>
      <style>{`
        @keyframes lc1 { 0%{d:path("M10,100 L10,100 L30,90 L50,95 L70,80 L90,70 L110,75 L130,55 L150,60 L170,40 L190,42")} 100%{d:path("M10,100 L10,60 L30,55 L50,70 L70,45 L90,35 L110,40 L130,20 L150,25 L170,10 L190,12")} }
        @keyframes lc2 { 0%{d:path("M10,100 C40,95 60,85 90,82 C120,78 150,70 190,72")} 100%{d:path("M10,100 C40,78 60,65 90,60 C120,55 150,45 190,48")} }
        @keyframes ldot { 0%{transform:translateX(10px)} 100%{transform:translateX(180px)} }
      `}</style>
      <line x1="10" y1="105" x2="195" y2="105" stroke="#E5E2DC" strokeWidth="0.5" opacity="0.5" />
      <line x1="10" y1="78" x2="195" y2="78" stroke="#E5E2DC" strokeWidth="0.3" strokeDasharray="2 4" opacity="0.3" />
      <line x1="10" y1="51" x2="195" y2="51" stroke="#E5E2DC" strokeWidth="0.3" strokeDasharray="2 4" opacity="0.3" />
      <line x1="10" y1="24" x2="195" y2="24" stroke="#E5E2DC" strokeWidth="0.3" strokeDasharray="2 4" opacity="0.3" />
      <path fill="url(#lg1)" d="M10 105 L10 100 L30 90 L50 95 L70 80 L90 70 L110 75 L130 55 L150 60 L170 40 L190 42 L190 105 Z" opacity="0.4" style={{ animation: "lc1 3s ease-in-out infinite alternate" }} />
      <path fill="none" stroke="#159AA9" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" d="M10,100 L30,90 L50,95 L70,80 L90,70 L110,75 L130,55 L150,60 L170,40 L190,42" style={{ animation: "lc1 3s ease-in-out infinite alternate" }} />
      <g style={{ animation: "ldot 3s ease-in-out infinite alternate" }}>
        <circle cx="10" cy="42" r="3" fill="#159AA9" />
        <circle cx="10" cy="42" r="6" fill="#159AA9" opacity="0.12" />
      </g>
    </svg>
  );
}

function AreaChart() {
  return (
    <svg viewBox="0 0 200 130" className="w-full h-full">
      <defs>
        <linearGradient id="ag1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#159AA9" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#159AA9" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ag2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A67C52" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#A67C52" stopOpacity="0" />
        </linearGradient>
      </defs>
      <style>{`
        @keyframes aw1 { 0%{d:path("M10,85 C30,75 50,80 70,70 C90,60 110,65 130,55 C150,45 170,50 190,42")} 100%{d:path("M10,85 C30,68 50,72 70,60 C90,50 110,55 130,45 C150,35 170,40 190,32")} }
        @keyframes aw2 { 0%{d:path("M10,95 C30,88 50,92 70,85 C90,78 110,82 130,75 C150,68 170,72 190,68")} 100%{d:path("M10,95 C30,82 50,86 70,78 C90,70 110,74 130,66 C150,58 170,62 190,56")} }
        @keyframes adot { 0%,100%{opacity:0.3;r:2} 50%{opacity:0.7;r:3} }
      `}</style>
      <line x1="10" y1="105" x2="195" y2="105" stroke="#E5E2DC" strokeWidth="0.5" opacity="0.5" />
      <line x1="10" y1="80" x2="195" y2="80" stroke="#E5E2DC" strokeWidth="0.3" strokeDasharray="2 4" opacity="0.3" />
      <line x1="10" y1="55" x2="195" y2="55" stroke="#E5E2DC" strokeWidth="0.3" strokeDasharray="2 4" opacity="0.3" />
      <line x1="10" y1="30" x2="195" y2="30" stroke="#E5E2DC" strokeWidth="0.3" strokeDasharray="2 4" opacity="0.3" />
      <path fill="url(#ag1)" d="M10 105 C30 75,50 80,70 70 C90 60,110 65,130 55 C150 45,170 50,190 42 L190 105 Z" opacity="0.5" style={{ animation: "aw1 3s ease-in-out infinite alternate" }} />
      <path fill="none" stroke="#159AA9" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" d="M10,85 C30,75 50,80 70,70 C90,60 110,65 130,55 C150,45 170,50 190,42" style={{ animation: "aw1 3s ease-in-out infinite alternate" }} />
      <path fill="url(#ag2)" d="M10 105 C30,88 50,92 70,85 C90,78 110,82 130,75 C150,68 170,72 190,68 L190 105 Z" opacity="0.4" style={{ animation: "aw2 3.5s ease-in-out infinite alternate" }} />
      <path fill="none" stroke="#A67C52" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" d="M10,95 C30,88 50,92 70,85 C90,78 110,82 130,75 C150,68 170,72 190,68" style={{ animation: "aw2 3.5s ease-in-out infinite alternate" }} />
      <circle cx="190" cy="42" r="3" fill="#159AA9" />
      <circle cx="190" cy="42" r="7" fill="#159AA9" opacity="0.08" />
      <circle cx="190" cy="68" r="2.5" fill="#A67C52" />
      <circle cx="70" cy="70" r="2" fill="#159AA9" style={{ animation: "adot 2s ease-in-out infinite" }} />
      <circle cx="130" cy="55" r="2" fill="#A67C52" style={{ animation: "adot 2.5s ease-in-out 0.3s infinite" }} />
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
        <div className="absolute top-0 left-1/3 w-72 h-72 bg-[#159AA9]/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-[#159AA9]/3 rounded-full blur-3xl" />
      </div>

      <div className="max-w-[1440px] mx-auto px-16 max-md:px-6 relative">
        <div ref={headingRef} className="max-w-[640px] mx-auto text-center mb-5 will-change-transform">
          <span className="text-[#159AA9] font-semibold text-sm tracking-widest uppercase">
            Prévenir. Performer. Durer.
          </span>
          <h2 className="font-heading text-[clamp(2rem,4vw,3.5rem)] leading-[1.08] font-bold text-[#0B1220] tracking-[-0.03em]">
            La méthode Wenaya.
          </h2>
        </div>

        <div ref={subheadingRef} className="max-w-[520px] mx-auto text-center mb-16 will-change-transform">
          <p className="text-[15px] leading-relaxed text-[#2B2F36] font-light">
            Quatre étapes pour reprendre la main sur votre santé.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-5">
          {steps.map((step, i) => (
            <div
              key={i}
              ref={setStepRef(i)}
              className="bg-white rounded-xl overflow-hidden border border-[#0B1220]/[0.05] will-change-transform transition-all duration-500 hover:border-[#159AA9]/15 hover:shadow-[0_4px_24px_rgba(21,154,169,0.06)] flex flex-col"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}
            >
              <div className="h-[2px] bg-[#159AA9]/40 shrink-0" />

              <div className="px-5 pt-4 pb-2 flex flex-col gap-1.5 items-center text-center">
                <span className="text-[10px] font-semibold text-[#159AA9]/50 tracking-[0.12em] uppercase">
                  Étape {step.number}
                </span>
                <h3 className="font-heading text-base font-bold text-[#0B1220] tracking-[-0.02em] leading-tight">
                  {step.title}
                </h3>
                <p className="text-[11px] text-[#2B2F36] leading-relaxed font-light max-w-[150px]">
                  {step.subtitle}
                </p>
              </div>

              <div className="flex-1 flex items-end px-3 pb-3">
                <div className="w-full">
                  {(() => {
                    const Icon = icons[i];
                    return <Icon />;
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 mt-14">
          <a
            href="#"
            className="inline-flex items-center justify-center px-7 h-11 bg-[#0B1220] text-white rounded-lg font-medium text-[13px] tracking-wide transition-all duration-300 hover:bg-[#2B2F36]"
          >
            Découvrir votre parcours
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center px-6 h-11 bg-transparent text-[#159AA9] border border-[#159AA9]/25 rounded-lg font-medium text-[13px] tracking-wide transition-all duration-300 hover:border-[#159AA9]/50"
          >
            Commencer votre évaluation
          </a>
        </div>
      </div>
    </section>
  );
}
