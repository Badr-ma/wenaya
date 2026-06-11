"use client";

import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function RadarScan() {
  return (
    <svg viewBox="0 0 200 140" className="w-full h-auto">
      <defs>
        <linearGradient id="rg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#159AA9" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#159AA9" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="70" r="50" stroke="#159AA9" strokeWidth="0.5" opacity="0.15" />
      <circle cx="100" cy="70" r="36" stroke="#159AA9" strokeWidth="0.5" opacity="0.12" />
      <circle cx="100" cy="70" r="22" stroke="#159AA9" strokeWidth="0.5" opacity="0.12" />
      <circle cx="100" cy="70" r="8" stroke="#159AA9" strokeWidth="0.5" opacity="0.1" />
      <circle cx="100" cy="70" r="3" fill="#A67C52" />
      <circle cx="100" cy="70" r="6" fill="#A67C52" opacity="0.15" />
      <g style={{ transformOrigin: "100px 70px", animation: "spin 3s linear infinite" }}>
        <path d="M100 70 L100 20 A50 50 0 0 1 150 70 Z" fill="url(#rg1)" />
        <circle cx="100" cy="20" r="3" fill="#159AA9" opacity="0.6" />
      </g>
      <g style={{ transformOrigin: "100px 70px", animation: "spin 4s linear infinite" }}>
        <circle cx="100" cy="34" r="2" fill="#159AA9" opacity="0.4" />
      </g>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}

function VennAnimated() {
  return (
    <svg viewBox="0 0 200 140" className="w-full h-auto">
      <style>{`
        @keyframes floatL { 0%,100%{transform:translateX(0)} 50%{transform:translateX(-4px)} }
        @keyframes floatR { 0%,100%{transform:translateX(0)} 50%{transform:translateX(4px)} }
        @keyframes pulseOverlap { 0%,100%{opacity:0.4;r:0} 50%{opacity:0.6;r:18} }
        @keyframes glowPulse { 0%,100%{opacity:0.2} 50%{opacity:0.5} }
      `}</style>
      <g style={{ transformOrigin: "86px 70px", animation: "floatL 2.5s ease-in-out infinite" }}>
        <circle cx="86" cy="70" r="40" fill="#159AA9" opacity="0.1" />
        <circle cx="86" cy="70" r="40" stroke="#159AA9" strokeWidth="0.6" opacity="0.3" />
      </g>
      <g style={{ transformOrigin: "114px 70px", animation: "floatR 2.5s ease-in-out infinite" }}>
        <circle cx="114" cy="70" r="40" fill="#A67C52" opacity="0.08" />
        <circle cx="114" cy="70" r="40" stroke="#A67C52" strokeWidth="0.6" opacity="0.3" />
      </g>
      <g>
        <ellipse cx="100" cy="70" rx="12" ry="40" fill="#0B1220" opacity="0.06" />
        <ellipse cx="100" cy="70" rx="12" ry="40" stroke="#0B1220" strokeWidth="0.5" opacity="0.15" />
      </g>
      <circle cx="100" cy="70" r="3" fill="#159AA9" style={{ animation: "glowPulse 1.5s ease-in-out infinite" }} />
      <circle cx="100" cy="70" r="8" fill="#159AA9" opacity="0.1" style={{ animation: "glowPulse 1.5s ease-in-out infinite" }} />
      <circle cx="86" cy="48" r="2" fill="#159AA9" opacity="0.4" style={{ animation: "glowPulse 2s ease-in-out infinite" }} />
      <circle cx="114" cy="92" r="2" fill="#A67C52" opacity="0.4" style={{ animation: "glowPulse 2s ease-in-out 0.5s infinite" }} />
    </svg>
  );
}

function BarChart() {
  return (
    <svg viewBox="0 0 200 140" className="w-full h-auto">
      <style>{`
        @keyframes grow1 { 0%,100%{height:26px;y:74} 50%{height:50px;y:50} }
        @keyframes grow2 { 0%,100%{height:38px;y:62} 50%{height:64px;y:36} }
        @keyframes grow3 { 0%,100%{height:52px;y:48} 50%{height:80px;y:20} }
        @keyframes grow4 { 0%,100%{height:64px;y:36} 50%{height:96px;y:4} }
        @keyframes bop { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(1.08)} }
      `}</style>
      <line x1="24" y1="110" x2="180" y2="110" stroke="#159AA9" strokeWidth="0.3" opacity="0.15" />
      <line x1="24" y1="80" x2="180" y2="80" stroke="#159AA9" strokeWidth="0.3" strokeDasharray="2 4" opacity="0.1" />
      <line x1="24" y1="50" x2="180" y2="50" stroke="#159AA9" strokeWidth="0.3" strokeDasharray="2 4" opacity="0.1" />
      <line x1="24" y1="20" x2="180" y2="20" stroke="#159AA9" strokeWidth="0.3" strokeDasharray="2 4" opacity="0.1" />
      <rect x="32" y="74" width="20" rx="3" fill="#159AA9" opacity="0.5" style={{ animation: "grow1 1.8s ease-in-out infinite" }} />
      <rect x="60" y="62" width="20" rx="3" fill="#A67C52" opacity="0.5" style={{ animation: "grow2 1.8s ease-in-out 0.15s infinite" }} />
      <rect x="88" y="48" width="20" rx="3" fill="#0B1220" opacity="0.4" style={{ animation: "grow3 1.8s ease-in-out 0.3s infinite" }} />
      <rect x="116" y="36" width="20" rx="3" fill="#159AA9" opacity="0.6" style={{ animation: "grow4 1.8s ease-in-out 0.45s infinite" }} />
      <rect x="144" y="20" width="20" rx="3" fill="#A67C52" opacity="0.6" style={{ animation: "grow4 1.8s ease-in-out 0.6s infinite" }} />
      <circle cx="42" cy="74" r="2.5" fill="#159AA9" style={{ animation: "bop 1.8s ease-in-out infinite" }} />
      <circle cx="70" cy="62" r="2.5" fill="#A67C52" style={{ animation: "bop 1.8s ease-in-out 0.15s infinite" }} />
      <circle cx="98" cy="48" r="2.5" fill="#0B1220" style={{ animation: "bop 1.8s ease-in-out 0.3s infinite" }} />
      <circle cx="126" cy="36" r="2.5" fill="#159AA9" style={{ animation: "bop 1.8s ease-in-out 0.45s infinite" }} />
      <circle cx="154" cy="20" r="2.5" fill="#A67C52" style={{ animation: "bop 1.8s ease-in-out 0.6s infinite" }} />
    </svg>
  );
}

function WaveGraph() {
  return (
    <svg viewBox="0 0 200 140" className="w-full h-auto">
      <style>{`
        @keyframes waveMove {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100px); }
        }
        @keyframes dotPulse {
          0%,100% { opacity: 0.3; r: 2; }
          50% { opacity: 0.8; r: 3.5; }
        }
        @keyframes dotTravel {
          0% { transform: translateX(0); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateX(200px); opacity: 0; }
        }
      `}</style>
      <line x1="0" y1="110" x2="200" y2="110" stroke="#159AA9" strokeWidth="0.3" opacity="0.12" />
      <line x1="0" y1="80" x2="200" y2="80" stroke="#159AA9" strokeWidth="0.3" strokeDasharray="2 4" opacity="0.08" />
      <line x1="0" y1="50" x2="200" y2="50" stroke="#159AA9" strokeWidth="0.3" strokeDasharray="2 4" opacity="0.08" />
      <line x1="0" y1="20" x2="200" y2="20" stroke="#159AA9" strokeWidth="0.3" strokeDasharray="2 4" opacity="0.08" />
      <g style={{ animation: "waveMove 3s linear infinite" }}>
        <path d="M0 60 C16 20, 32 20, 48 60 C64 100, 80 100, 96 60 C112 20, 128 20, 144 60 C160 100, 176 100, 192 60" stroke="#159AA9" strokeWidth="1" fill="none" opacity="0.25" />
        <path d="M0 75 C16 45, 32 45, 48 75 C64 105, 80 105, 96 75 C112 45, 128 45, 144 75 C160 105, 176 105, 192 75" stroke="#A67C52" strokeWidth="0.7" fill="none" opacity="0.15" />
      </g>
      <g style={{ transformOrigin: "100px 70px", animation: "dotTravel 3s linear infinite" }}>
        <circle cx="0" cy="60" r="3" fill="#159AA9" />
      </g>
      <circle cx="100" cy="60" r="2" fill="#159AA9" style={{ animation: "dotPulse 2s ease-in-out infinite" }} />
      <circle cx="148" cy="60" r="2" fill="#A67C52" opacity="0.5" style={{ animation: "dotPulse 2s ease-in-out 0.5s infinite" }} />
      <circle cx="52" cy="60" r="2" fill="#0B1220" opacity="0.3" style={{ animation: "dotPulse 2s ease-in-out 1s infinite" }} />
    </svg>
  );
}

const icons = [RadarScan, VennAnimated, BarChart, WaveGraph];

const steps = [
  {
    number: "01",
    title: "Assess",
    subtitle: "Comprendre où vous en êtes.",
  },
  {
    number: "02",
    title: "Align",
    subtitle: "Construire un parcours qui vous ressemble.",
  },
  {
    number: "03",
    title: "Activate",
    subtitle: "Passer à l'action, ensemble.",
  },
  {
    number: "04",
    title: "Sustain",
    subtitle: "Prévenir, performer, durer.",
  },
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
        defaults: { ease: "back.out(1.7)", duration: 0.4 },
      });

      tl
        .to(headingRef.current, { opacity: 1, y: 0 })
        .to(subheadingRef.current, { opacity: 1, y: 0, duration: 0.3 }, "-=0.15")
        .to(cards, { opacity: 1, y: 0, scale: 1, stagger: 0.06, duration: 0.35 }, "-=0.05");
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

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              ref={setStepRef(i)}
              className="bg-white rounded-2xl overflow-hidden border border-[#0B1220]/[0.06] will-change-transform transition-all duration-300 hover:border-[#159AA9]/20"
              style={{ boxShadow: "0 2px 24px rgba(0,0,0,0.03)" }}
            >
              <div className="h-1 bg-gradient-to-r from-[#159AA9] to-[#159AA9]/20" />

              <div className="px-6 pt-5 pb-4 flex flex-col gap-3 items-center text-center">
                <div className="w-full max-w-[140px] mx-auto">
                  {(() => {
                    const Icon = icons[i];
                    return <Icon />;
                  })()}
                </div>

                <div className="flex items-center gap-3 justify-center">
                  <span className="w-7 h-7 rounded-full bg-[#159AA9]/10 flex items-center justify-center text-[10px] font-bold text-[#159AA9] tracking-wider">
                    {step.number}
                  </span>
                  <span className="text-[10px] font-semibold tracking-[0.15em] text-[#159AA9] uppercase">
                    Étape
                  </span>
                </div>

                <div className="space-y-0">
                  <h3 className="font-heading text-[17px] font-bold text-[#0B1220] tracking-[-0.02em]">
                    {step.title}
                  </h3>
                  <p className="text-[12px] text-[#2B2F36] leading-relaxed">
                    {step.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-5 mt-16">
          <a
            href="#"
            className="inline-flex items-center justify-center px-8 h-[50px] bg-[#0B1220] text-white rounded-full font-medium text-sm tracking-wide transition-all duration-300 hover:bg-[#2B2F36] hover:shadow-lg"
          >
            Découvrir votre parcours
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center px-7 h-[50px] bg-transparent text-[#159AA9] border border-[#159AA9]/30 rounded-full font-medium text-sm tracking-wide transition-all duration-300 hover:border-[#159AA9] hover:bg-[rgba(21,154,169,0.04)]"
          >
            Commencer votre évaluation
          </a>
        </div>
      </div>
    </section>
  );
}
