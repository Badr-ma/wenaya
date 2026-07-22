/**
 * YoloSection — interactive exploration hub with a visual map of wellness areas.
 * Features: clickable nodes (kinésithérapie, nutrition, psychologie, etc.) on a visual grid,
 * GSAP scroll-triggered animations, and expandable detail cards for each area.
 * Dark background section near the bottom of the homepage.
 */
"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";

const signals = [
  { label: "Sleep", x: 50, y: 15 },
  { label: "Recovery", x: 77, y: 28 },
  { label: "Nutrition", x: 84, y: 58 },
  { label: "Movement", x: 65, y: 82 },
  { label: "Stress", x: 35, y: 82 },
  { label: "Biomarkers", x: 16, y: 58 },
  { label: "Longevity", x: 23, y: 28 },
];

export default function YoloSection(): React.JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const glowInnerRef = useRef<HTMLDivElement>(null);
  const constellationRef = useRef<HTMLDivElement>(null);
  const signalRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const ringRefs = useRef<(HTMLDivElement | null)[]>([]);
  const particleRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none none" },
        defaults: { ease: "power3.out" },
      });

      tl.fromTo(badgeRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 })
        .fromTo(titleRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.3")
        .fromTo(subtitleRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
        .fromTo(descRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3")
        .fromTo(buttonsRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
        .fromTo(constellationRef.current, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 1 }, "-=0.6")
        .fromTo(phoneRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.5");

      const lines = lineRefs.current.filter(Boolean) as SVGLineElement[];
      gsap.to(lines, {
        strokeDashoffset: 0,
        duration: 0.6,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 76%", toggleActions: "play none none none" },
      });

      gsap.to(phoneRef.current, { y: -8, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(glowRef.current, { scale: 1.08, opacity: 0.6, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(glowInnerRef.current, { scale: 1.12, opacity: 0.5, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1 });

      signals.forEach((_, i) => {
        const s = signalRefs.current[i];
        const r = ringRefs.current[i];
        if (s) {
          gsap.to(s, {
            y: -3 - (i % 3) * 1.5,
            duration: 2.6 + i * 0.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.25,
          });
        }
        if (r) {
          gsap.to(r, {
            scale: 2,
            opacity: 0,
            duration: 2 + i * 0.15,
            repeat: -1,
            ease: "power2.out",
            delay: i * 0.3,
          });
        }
      });

      const flowDots = dotRefs.current.filter(Boolean) as SVGCircleElement[];
      flowDots.forEach((dot, i) => {
        gsap.to(dot, {
          attr: { cx: 50, cy: 50 },
          duration: 2.5 + i * 0.2,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay: i * 0.15,
        });
      });

      const particles = particleRefs.current.filter(Boolean) as HTMLDivElement[];
      particles.forEach((p) => {
        const x = 10 + Math.random() * 80;
        const y = 10 + Math.random() * 80;
        gsap.set(p, { x: `${x}%`, y: `${y}%`, opacity: 0 });
        gsap.to(p, {
          x: `${x + (Math.random() - 0.5) * 30}%`,
          y: `${y + (Math.random() - 0.5) * 30}%`,
          opacity: 0.15 + Math.random() * 0.15,
          duration: 4 + Math.random() * 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: Math.random() * 3,
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const setSignalRef = (i: number) => (el: HTMLDivElement | null) => { signalRefs.current[i] = el; };
  const setLineRef = (i: number) => (el: SVGLineElement | null) => { lineRefs.current[i] = el; };
  const setDotRef = (i: number) => (el: SVGCircleElement | null) => { dotRefs.current[i] = el; };
  const setRingRef = (i: number) => (el: HTMLDivElement | null) => { ringRefs.current[i] = el; };
  const setParticleRef = (i: number) => (el: HTMLDivElement | null) => { particleRefs.current[i] = el; };

  return (
    <section ref={sectionRef} className="bg-[#0B1220] py-12 sm:py-32 lg:py-44 px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 lg:gap-12 items-center">
          <div ref={contentRef} className="max-w-xl">
            <div ref={badgeRef}>
              <span className="inline-flex items-center gap-2 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase mb-6">
                <span className="w-5 h-px bg-[#B88A5A]/40" />
                Coming Soon
              </span>
            </div>

            <h2
              ref={titleRef}
              className="text-4xl sm:text-6xl lg:text-8xl font-serif font-bold leading-[0.95] tracking-tight"
              style={{
                background: "linear-gradient(135deg, #ffffff 40%, rgba(21,154,169,0.6))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              YOLO
            </h2>

            <p ref={subtitleRef} className="text-xl sm:text-2xl text-white/80 mt-4 font-serif leading-snug max-w-lg">
              The AI Agent Dedicated to Longevity.
            </p>

            <p ref={descRef} className="text-white/35 text-sm sm:text-base mt-6 leading-relaxed max-w-md">
              A continuous intelligence layer designed to help individuals understand their health, anticipate risks, and make better decisions over time.
            </p>

            <div ref={buttonsRef} className="flex flex-wrap gap-4 mt-6 sm:mt-12">
              <a
                href="#"
                className="group relative inline-flex items-center justify-center px-8 h-[50px] overflow-hidden rounded-full transition-all duration-500"
                style={{
                  background: "linear-gradient(135deg, #159AA9, #0D7A87)",
                  boxShadow: "0 4px 24px rgba(21,154,169,0.2)",
                }}
              >
                <span className="relative z-10 text-white text-sm font-semibold tracking-wide">
                  Join the Waitlist
                </span>
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "linear-gradient(135deg, #1AB0C0, #159AA9)" }} />
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center px-8 h-[50px] bg-transparent text-white/60 border border-white/10 hover:border-white/20 hover:text-white rounded-full text-sm font-medium transition-all duration-300"
              >
                Learn More
                <svg className="w-3.5 h-3.5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>

          <div ref={constellationRef} className="relative flex items-center justify-center">
            <div className="relative w-full max-w-[480px] mx-auto aspect-square">
              <div
                ref={glowRef}
                className="absolute w-3/4 h-3/4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(21,154,169,0.2) 0%, rgba(21,154,169,0.05) 50%, transparent 70%)" }}
              />
              <div
                ref={glowInnerRef}
                className="absolute w-1/2 h-1/2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(21,154,169,0.15) 0%, transparent 60%)" }}
              />

              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none">
                {signals.map((s, i) => (
                  <line
                    key={s.label}
                    ref={setLineRef(i)}
                    x1="50" y1="50" x2={s.x} y2={s.y}
                    stroke="rgba(21,154,169,0.12)"
                    strokeWidth="0.3"
                    strokeDasharray="45"
                    strokeDashoffset="45"
                  />
                ))}
                {signals.map((s, i) => (
                  <circle
                    key={`dot-${s.label}`}
                    ref={setDotRef(i)}
                    cx={s.x} cy={s.y} r="1.2"
                    fill="rgba(21,154,169,0.35)"
                  />
                ))}
              </svg>

              <div className="absolute inset-0">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    ref={setParticleRef(i)}
                    className="absolute w-0.5 h-0.5 rounded-full bg-white pointer-events-none"
                  />
                ))}
              </div>

              <div className="absolute inset-0">
                {signals.map((s, i) => (
                  <div key={s.label} className="absolute" style={{ left: `${s.x}%`, top: `${s.y}%`, transform: "translate(-50%, -50%)" }}>
                    <div ref={setRingRef(i)} className="absolute w-1.5 h-1.5 rounded-full bg-[#159AA9]/30" />
                    <div
                      ref={setSignalRef(i)}
                      className="relative flex items-center gap-1.5 cursor-pointer group"
                      style={{ flexDirection: s.x > 55 ? "row" : "row-reverse" }}
                    >
                      <span className="relative w-1.5 h-1.5 rounded-full bg-[#159AA9]/40 group-hover:bg-[#159AA9]/70 transition-colors duration-300 shrink-0" />
                      <span className="text-[10px] sm:text-[11px] text-white/30 group-hover:text-white/60 transition-colors duration-300 font-medium tracking-wide text-center max-w-[80px] sm:max-w-none leading-tight">
                        {s.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div
                ref={phoneRef}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] sm:w-[172px] h-[320px] sm:h-[365px] z-10"
                style={{
                  background: "linear-gradient(180deg, rgba(15,22,34,0.98), rgba(11,18,32,0.98))",
                  borderRadius: "30px",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 60px rgba(21,154,169,0.04)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[36%] h-5 sm:h-6 bg-[#0B1220] rounded-b-xl z-20 flex items-center justify-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-white/10" />
                </div>

                <div className="absolute inset-0 overflow-hidden rounded-[30px]">
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#159AA9]/3 rounded-full blur-3xl" />
                  <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#B88A5A]/3 rounded-full blur-3xl" />
                </div>

                <div className="relative h-full flex flex-col p-5 sm:p-6 z-10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[8px] text-white/15 font-medium">9:41</span>
                    <span className="text-[8px] text-white/15">●●</span>
                  </div>

                  <div className="flex-1 flex flex-col justify-center gap-3 sm:gap-4">
                    <div>
                      <p className="text-[8px] sm:text-[9px] text-white/20 font-medium tracking-[0.15em] uppercase">Recovery Score</p>
                      <div className="flex items-end gap-1.5 mt-0.5">
                        <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">92</span>
                        <span className="text-[8px] sm:text-[9px] text-[#159AA9] font-medium mb-0.5">+3</span>
                      </div>
                      <div className="flex gap-0.5 mt-1">
                        {[1, 1, 1, 1, 0.8, 0.6, 0.4].map((o, j) => (
                          <span key={j} className="w-4 sm:w-5 h-[2px] rounded-full" style={{ background: `rgba(21,154,169,${o * 0.5})` }} />
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[8px] sm:text-[9px] text-white/20 font-medium tracking-[0.15em] uppercase">Sleep Quality</p>
                      <p className="text-xs sm:text-sm text-white/80 font-medium mt-0.5">Excellent</p>
                    </div>

                    <div>
                      <p className="text-[8px] sm:text-[9px] text-white/20 font-medium tracking-[0.15em] uppercase">Longevity Outlook</p>
                      <p className="text-xs sm:text-sm text-[#B88A5A] font-medium mt-0.5">Improving</p>
                    </div>

                    <div className="pt-3 sm:pt-4 border-t border-white/5">
                      <p className="text-[8px] sm:text-[9px] text-white/20 font-medium tracking-[0.15em] uppercase">Today&apos;s Rec</p>
                      <p className="text-xs sm:text-sm text-white mt-0.5 font-medium">Prioritize Recovery</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center mt-2">
                    <span className="w-[30%] h-[3px] bg-white/10 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
