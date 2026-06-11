"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";

export default function YoloHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.fromTo("#yh-badge", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 })
        .fromTo("#yh-title", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 }, "-=0.5")
        .fromTo("#yh-desc", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
        .fromTo("#yh-ctas", { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
        .fromTo("#yh-mockup", { opacity: 0, y: 80, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: "power3.out" }, "-=0.5");
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#083241] min-h-screen flex items-center overflow-hidden pt-28 pb-16">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#AA412A]/8 to-transparent blur-[120px] transition-all duration-1000 ease-out"
          style={{ left: `${20 + mousePos.x * 60}%`, top: `${20 + mousePos.y * 60}%`, transform: "translate(-50%, -50%)" }}
        />
        <div
          className="absolute w-[350px] h-[350px] rounded-full bg-gradient-to-br from-white/[0.03] to-transparent blur-[100px] transition-all duration-1500 ease-out"
          style={{ left: `${80 - mousePos.x * 40}%`, top: `${80 - mousePos.y * 40}%`, transform: "translate(-50%, -50%)" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-white/[0.01] to-transparent blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full relative">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <div className="max-w-xl z-10">
            <div id="yh-badge" className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400/70 animate-pulse-soft" />
              <span className="text-[10px] font-mono text-white/40 tracking-wider uppercase">AI · Disponible 24/7</span>
            </div>

            <h1 id="yh-title" className="text-[clamp(2.8rem,5.5vw,5rem)] font-heading font-bold text-white leading-[0.92] tracking-tight mt-6">
              L&apos;Agent IA<br />
              <span className="text-[#AA412A]">de Longévité</span><br />
              <span className="text-[#AA412A]">& Bien-être</span>
            </h1>

            <p id="yh-desc" className="text-white/35 text-base sm:text-lg leading-relaxed mt-6 max-w-md font-mono text-[13px] sm:text-sm tracking-[-0.01em]">
              Un accompagnement personnalisé 24/7 connecté à des bilans non invasifs et au réseau d&apos;experts Wenaya.
            </p>

            <div id="yh-ctas" className="flex flex-wrap gap-4 mt-10">
              <motion.a
                href="#"
                className="inline-flex items-center justify-center h-[52px] px-8 bg-[#AA412A] text-white text-sm font-semibold rounded-xl transition-all duration-300"
                whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(170,65,42,0.3)" }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="relative z-10 font-mono text-xs tracking-wider uppercase">Demander une Démo</span>
              </motion.a>
              <motion.a
                href="#how"
                className="inline-flex items-center justify-center h-[52px] px-8 bg-white/[0.03] text-white/50 hover:text-white border border-white/[0.06] hover:border-white/20 rounded-xl text-sm font-medium transition-all duration-300 font-mono text-xs tracking-wider uppercase"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                Comment ça marche
              </motion.a>
            </div>
          </div>

          <div id="yh-mockup" className="relative">
            <div className="relative w-full max-w-[520px] mx-auto">
              <div className="absolute -inset-6 bg-gradient-to-br from-[#AA412A]/4 via-transparent to-white/[0.01] rounded-3xl blur-3xl" />
              <div className="relative bg-[#0A1F2E]/90 backdrop-blur-sm rounded-2xl border border-white/[0.04] shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden">
                <div className="flex items-center gap-2 px-4 pt-3.5 pb-2.5 border-b border-white/[0.03]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400/30" />
                    <span className="w-2 h-2 rounded-full bg-yellow-400/30" />
                    <span className="w-2 h-2 rounded-full bg-green-400/30" />
                  </div>
                  <span className="ml-3 text-[10px] font-mono text-white/15">yolo · assistant</span>
                  <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-mono text-green-400/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400/60 animate-pulse-soft" />
                    live
                  </span>
                </div>

                <div className="p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-white/20 uppercase tracking-wider">health score</span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl sm:text-3xl font-bold font-heading text-white">86</span>
                        <span className="text-xs font-mono text-white/20">/100</span>
                        <span className="ml-1 text-[10px] font-mono text-green-400/60 bg-green-400/8 px-1.5 py-0.5 rounded-md border border-green-400/10">+4%</span>
                      </div>
                    </div>
                    <div className="flex -space-x-1.5">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-[#0A1F2E] bg-gradient-to-br from-[#AA412A]/20 to-[#AA412A]/10" />
                      ))}
                    </div>
                  </div>

                  <div className="h-1 bg-white/[0.03] rounded-full overflow-hidden">
                    <div className="h-full w-[86%] rounded-full bg-gradient-to-r from-[#AA412A] to-[#AA412A]/60" />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Sommeil", val: "7h42", color: "text-blue-300/70" },
                      { label: "Activité", val: "6 843", color: "text-green-300/70" },
                      { label: "Récup.", val: "92%", color: "text-[#AA412A]" },
                    ].map((s) => (
                      <div key={s.label} className="bg-white/[0.02] backdrop-blur-sm rounded-xl p-3 border border-white/[0.03]">
                        <span className="text-[10px] font-mono text-white/20">{s.label}</span>
                        <p className={`text-sm font-bold font-heading mt-0.5 ${s.color}`}>{s.val}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white/[0.02] backdrop-blur-sm rounded-xl p-3.5 border border-white/[0.03]">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#AA412A] to-[#AA412A]/70 flex items-center justify-center shrink-0 text-[10px] font-bold text-white font-mono">Y</div>
                      <div className="min-w-0">
                        <p className="text-white/70 text-sm leading-relaxed">
                          Bonjour ! Vos indicateurs sont stables. Je vous recommande une routine de récupération active.
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[10px] font-mono text-white/20">il y a 2 min</span>
                          <span className="text-[10px] font-mono text-[#AA412A]/50">personnalisé</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white/[0.03] rounded-xl px-3.5 py-2.5 text-xs font-mono text-white/15 border border-white/[0.03]">Demandez-moi n&apos;importe quoi...</div>
                    <motion.div
                      className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#AA412A] to-[#AA412A]/70 flex items-center justify-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </motion.div>
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
