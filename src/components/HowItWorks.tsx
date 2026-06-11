"use client";

import { useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function RadarScan() {
  return (
    <svg viewBox="0 0 200 130" className="w-full h-full">
      <defs>
        <linearGradient id="rg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#159AA9" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#159AA9" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="rg2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#159AA9" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#159AA9" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="65" r="52" fill="url(#rg2)" />
      <circle cx="100" cy="65" r="52" stroke="#159AA9" strokeWidth="0.4" opacity="0.12" />
      <circle cx="100" cy="65" r="39" stroke="#159AA9" strokeWidth="0.4" opacity="0.1" />
      <circle cx="100" cy="65" r="26" stroke="#159AA9" strokeWidth="0.4" opacity="0.1" />
      <circle cx="100" cy="65" r="13" stroke="#159AA9" strokeWidth="0.4" opacity="0.08" />
      <line x1="100" y1="13" x2="100" y2="117" stroke="#159AA9" strokeWidth="0.3" strokeDasharray="2 4" opacity="0.1" />
      <line x1="48" y1="65" x2="152" y2="65" stroke="#159AA9" strokeWidth="0.3" strokeDasharray="2 4" opacity="0.1" />
      <circle cx="100" cy="65" r="3" fill="#A67C52" />
      <circle cx="100" cy="65" r="7" fill="#A67C52" opacity="0.12" />
      <g style={{ transformOrigin: "100px 65px", animation: "rs 3s linear infinite" }}>
        <path d="M100 65 L100 13 A52 52 0 0 1 152 65 Z" fill="url(#rg1)" />
        <circle cx="100" cy="13" r="3.5" fill="#159AA9" opacity="0.7" />
        <circle cx="100" cy="13" r="6" fill="#159AA9" opacity="0.15" />
      </g>
      <g style={{ transformOrigin: "100px 65px", animation: "rs 4.5s linear infinite" }}>
        <circle cx="139" cy="39" r="2" fill="#A67C52" opacity="0.5" />
      </g>
      <g style={{ transformOrigin: "100px 65px", animation: "rs 3.8s linear infinite" }}>
        <circle cx="87" cy="117" r="1.5" fill="#A67C52" opacity="0.4" />
      </g>
      <style>{`@keyframes rs { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}

function VennAnimated() {
  return (
    <svg viewBox="0 0 200 130" className="w-full h-full">
      <defs>
        <radialGradient id="vgL" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#159AA9" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#159AA9" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="vgR" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#A67C52" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#A67C52" stopOpacity="0" />
        </radialGradient>
      </defs>
      <style>{`
        @keyframes vfL { 0%,100%{transform:translateX(0)} 50%{transform:translateX(-5px)} }
        @keyframes vfR { 0%,100%{transform:translateX(0)} 50%{transform:translateX(5px)} }
        @keyframes vp { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:0.8;transform:scale(1.12)} }
        @keyframes vd1 { 0%,100%{opacity:0} 20%{opacity:0.5} 80%{opacity:0.5} 100%{opacity:0} }
        @keyframes vd2 { 0%,100%{opacity:0} 30%{opacity:0.4} 70%{opacity:0.4} 100%{opacity:0} }
      `}</style>
      <circle cx="100" cy="65" r="50" fill="url(#vgL)" opacity="0.3" />
      <circle cx="100" cy="65" r="50" fill="url(#vgR)" opacity="0.3" />
      <g style={{ transformOrigin: "83px 65px", animation: "vfL 3s ease-in-out infinite" }}>
        <circle cx="83" cy="65" r="36" fill="#159AA9" opacity="0.08" />
        <circle cx="83" cy="65" r="36" stroke="#159AA9" strokeWidth="0.5" opacity="0.25" />
      </g>
      <g style={{ transformOrigin: "117px 65px", animation: "vfR 3s ease-in-out infinite" }}>
        <circle cx="117" cy="65" r="36" fill="#A67C52" opacity="0.06" />
        <circle cx="117" cy="65" r="36" stroke="#A67C52" strokeWidth="0.5" opacity="0.2" />
      </g>
      <ellipse cx="100" cy="65" rx="10" ry="36" fill="#0B1220" opacity="0.05" />
      <ellipse cx="100" cy="65" rx="10" ry="36" stroke="#0B1220" strokeWidth="0.4" opacity="0.12" />
      <circle cx="100" cy="65" r="3.5" fill="#159AA9" style={{ animation: "vp 2s ease-in-out infinite" }} />
      <circle cx="100" cy="65" r="9" fill="#159AA9" opacity="0.1" style={{ animation: "vp 2s ease-in-out infinite" }} />
      <circle cx="78" cy="50" r="2" fill="#159AA9" opacity="0.5" style={{ animation: "vd1 3s ease-in-out infinite" }} />
      <circle cx="122" cy="78" r="2" fill="#A67C52" opacity="0.4" style={{ animation: "vd2 3.5s ease-in-out infinite" }} />
      <circle cx="75" cy="80" r="1.5" fill="#159AA9" opacity="0.3" style={{ animation: "vd2 4s ease-in-out infinite" }} />
      <circle cx="125" cy="50" r="1.5" fill="#A67C52" opacity="0.3" style={{ animation: "vd1 3.8s ease-in-out infinite" }} />
    </svg>
  );
}

function BarChart() {
  return (
    <svg viewBox="0 0 200 130" className="w-full h-full">
      <defs>
        <linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#159AA9" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#159AA9" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A67C52" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#A67C52" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="bg3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0B1220" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0B1220" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <style>{`
        @keyframes bc1 { 0%,100%{height:28px;y:92} 50%{height:52px;y:68} }
        @keyframes bc2 { 0%,100%{height:40px;y:80} 50%{height:66px;y:54} }
        @keyframes bc3 { 0%,100%{height:54px;y:66} 50%{height:82px;y:38} }
        @keyframes bc4 { 0%,100%{height:66px;y:54} 50%{height:98px;y:22} }
        @keyframes bc5 { 0%,100%{height:78px;y:42} 50%{height:112px;y:8} }
        @keyframes bl { 0%,100%{opacity:0.08} 50%{opacity:0.18} }
      `}</style>
      <line x1="20" y1="100" x2="188" y2="100" stroke="#159AA9" strokeWidth="0.3" opacity="0.12" />
      <line x1="20" y1="76" x2="188" y2="76" stroke="#159AA9" strokeWidth="0.3" strokeDasharray="2 4" opacity="0.08" style={{ animation: "bl 2s ease-in-out infinite" }} />
      <line x1="20" y1="52" x2="188" y2="52" stroke="#159AA9" strokeWidth="0.3" strokeDasharray="2 4" opacity="0.08" style={{ animation: "bl 2.4s ease-in-out infinite" }} />
      <line x1="20" y1="28" x2="188" y2="28" stroke="#159AA9" strokeWidth="0.3" strokeDasharray="2 4" opacity="0.08" style={{ animation: "bl 2.8s ease-in-out infinite" }} />
      <rect x="28" y="92" width="22" rx="3" fill="url(#bg1)" style={{ animation: "bc1 1.6s ease-in-out infinite" }} />
      <rect x="56" y="80" width="22" rx="3" fill="url(#bg2)" style={{ animation: "bc2 1.6s ease-in-out 0.15s infinite" }} />
      <rect x="84" y="66" width="22" rx="3" fill="url(#bg3)" style={{ animation: "bc3 1.6s ease-in-out 0.3s infinite" }} />
      <rect x="112" y="54" width="22" rx="3" fill="url(#bg1)" style={{ animation: "bc4 1.6s ease-in-out 0.45s infinite" }} />
      <rect x="140" y="42" width="22" rx="3" fill="url(#bg2)" style={{ animation: "bc5 1.6s ease-in-out 0.6s infinite" }} />
      <rect x="168" y="66" width="20" rx="3" fill="url(#bg3)" style={{ animation: "bc3 1.6s ease-in-out 0.75s infinite" }} />
    </svg>
  );
}

function WaveGraph() {
  return (
    <svg viewBox="0 0 200 130" className="w-full h-full">
      <defs>
        <linearGradient id="wg1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#159AA9" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#159AA9" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="wg2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A67C52" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#A67C52" stopOpacity="0" />
        </linearGradient>
      </defs>
      <style>{`
        @keyframes wm1 { 0%{transform:translateX(0)} 100%{transform:translateX(-120px)} }
        @keyframes wm2 { 0%{transform:translateX(-120px)} 100%{transform:translateX(0)} }
        @keyframes wd { 0%{transform:translateX(-40px);opacity:0} 15%{opacity:0.8} 85%{opacity:0.8} 100%{transform:translateX(240px);opacity:0} }
        @keyframes wp { 0%,100%{transform:scale(1);opacity:0.3} 50%{transform:scale(1.3);opacity:0.7} }
      `}</style>
      <line x1="0" y1="100" x2="200" y2="100" stroke="#159AA9" strokeWidth="0.3" opacity="0.1" />
      <line x1="0" y1="74" x2="200" y2="74" stroke="#159AA9" strokeWidth="0.3" strokeDasharray="2 4" opacity="0.07" />
      <line x1="0" y1="48" x2="200" y2="48" stroke="#159AA9" strokeWidth="0.3" strokeDasharray="2 4" opacity="0.07" />
      <g style={{ animation: "wm1 3.5s linear infinite" }}>
        <path d="M0 100 C16 40,32 40,48 100 C64 55,80 55,96 100 C112 40,128 40,144 100 C160 55,176 55,192 100 C208 40,224 40,240 100" fill="none" stroke="#159AA9" strokeWidth="0.9" opacity="0.2" />
        <path d="M0 100 C16 40,32 40,48 100 C64 55,80 55,96 100 C112 40,128 40,144 100 C160 55,176 55,192 100 C208 40,224 40,240 100 L240 100 L0 100 Z" fill="url(#wg1)" />
      </g>
      <g style={{ animation: "wm2 4s linear infinite" }}>
        <path d="M-40 100 C-24 60,-8 60,8 100 C24 70,40 70,56 100 C72 60,88 60,104 100 C120 70,136 70,152 100 C168 60,184 60,200 100 C216 70,232 70,248 100" fill="none" stroke="#A67C52" strokeWidth="0.6" opacity="0.15" />
        <path d="M-40 100 C-24 60,-8 60,8 100 C24 70,40 70,56 100 C72 60,88 60,104 100 C120 70,136 70,152 100 C168 60,184 60,200 100 C216 70,232 70,248 100 L248 100 L-40 100 Z" fill="url(#wg2)" />
      </g>
      <g style={{ animation: "wd 3s linear infinite" }}>
        <circle cx="0" cy="40" r="3.5" fill="#159AA9" />
        <circle cx="0" cy="40" r="7" fill="#159AA9" opacity="0.12" />
      </g>
      <circle cx="48" cy="100" r="2" fill="#159AA9" style={{ animation: "wp 2s ease-in-out infinite" }} />
      <circle cx="96" cy="100" r="2" fill="#A67C52" style={{ animation: "wp 2.5s ease-in-out 0.5s infinite" }} />
      <circle cx="144" cy="100" r="2" fill="#0B1220" style={{ animation: "wp 2.2s ease-in-out 1s infinite" }} />
    </svg>
  );
}

const icons = [RadarScan, VennAnimated, BarChart, WaveGraph];

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
              className="bg-white rounded-2xl overflow-hidden border border-[#0B1220]/[0.06] will-change-transform transition-all duration-500 hover:border-[#159AA9]/25 hover:shadow-[0_8px_40px_rgba(21,154,169,0.08)] flex flex-col"
              style={{ boxShadow: "0 2px 24px rgba(0,0,0,0.03)" }}
            >
              <div className="h-1 bg-gradient-to-r from-[#159AA9] via-[#159AA9]/60 to-[#159AA9]/20 shrink-0" />

              <div className="px-6 pt-5 pb-3 flex flex-col gap-2 items-center text-center">
                <span className="w-7 h-7 rounded-full bg-[#159AA9]/10 flex items-center justify-center text-[10px] font-bold text-[#159AA9] tracking-wider">
                  {step.number}
                </span>
                <h3 className="font-heading text-[17px] font-bold text-[#0B1220] tracking-[-0.02em] leading-tight">
                  {step.title}
                </h3>
                <p className="text-[12px] text-[#2B2F36] leading-relaxed font-light max-w-[160px]">
                  {step.subtitle}
                </p>
              </div>

              <div className="flex-1 flex items-end px-4 pb-4">
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
