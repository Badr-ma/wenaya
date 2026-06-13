"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrollSection, { ParallaxLayer, staggerContainer, fadeUp, fadeIn } from "./ScrollSection";
import MouseGlow from "./YoloMouseGlow";
import ParticleField from "./YoloParticles";
import { SvgArchitecture } from "./YoloSvgArchitecture";

const BADGE_D = (label: string): React.JSX.Element => (
  <span className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-full px-3 py-1 mb-5">
    <span className="w-1.5 h-1.5 rounded-full bg-green-400/70 animate-pulse-soft" />
    <span className="text-[10px] font-mono text-white/40 tracking-wider uppercase">{label}</span>
  </span>
);

const ARROW_R: React.JSX.Element = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
  </svg>
);

function YoloHeroSection(): React.JSX.Element {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start end", "end start"] });
  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#AA412A] via-[#AA412A]/60 to-[#AA412A] z-[100] origin-left"
        style={{ scaleX: heroProgress, opacity: useTransform(heroProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]) }}
      />

      <section ref={heroRef} className="relative z-10 overflow-hidden bg-[#083241]">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <video autoPlay muted loop playsInline aria-hidden="true" className="absolute inset-0 w-full h-full object-cover">
            <source src="/videos/forest.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-br from-[#AA412A]/15 via-[#083241]/60 to-[#083241]/90" />
        </div>
        <MouseGlow />
        <ParticleField count={16} />
        <SvgArchitecture className="z-[1] opacity-80" />

        <ScrollSection
          scaleRange={[1, 1, 0.92]}
          yRange={[0, 0, -40]}
          rotateRange={[0, 0, 1.5]}
          opacityRange={[1, 1, 0.85]}
          className="relative z-10 min-h-screen flex items-center justify-center pt-28 pb-16 px-edge"
        >
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center w-full max-w-7xl mx-auto"
          >
            <div className="max-w-xl">
              <motion.div variants={fadeUp}>{BADGE_D("AI · Disponible 24/7")}</motion.div>
              <motion.h1 variants={fadeUp} className="text-[clamp(2.8rem,5.5vw,5rem)] font-heading font-bold text-white leading-[0.92] tracking-tight mt-6">
                L&apos;Agent IA<br /><span className="text-[#AA412A]">de Longévité</span><br /><span className="text-[#AA412A]">& Bien-être</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="text-white/35 text-[13px] sm:text-sm font-mono leading-relaxed mt-6 max-w-md">
                Un accompagnement personnalisé 24/7 connecté à des bilans non invasifs et au réseau d&apos;experts Wenaya.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mt-10">
                <motion.a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center justify-center h-[52px] px-8 bg-[#AA412A] text-white text-sm font-semibold rounded-xl shimmer-btn" whileHover={{ scale: 1.04, boxShadow: "0 12px 40px rgba(170,65,42,0.4)" }} whileTap={{ scale: 0.94 }}>
                  <span className="font-mono text-xs tracking-wider uppercase relative z-10">Demander une Démo</span>
                </motion.a>
                <motion.a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center justify-center h-[52px] px-8 bg-white/[0.03] text-white/50 hover:text-white border border-white/[0.06] hover:border-white/20 rounded-xl font-mono text-xs tracking-wider uppercase" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }}>
                  Comment ça marche
                </motion.a>
              </motion.div>
            </div>

            <motion.div variants={fadeIn}>
              <ParallaxLayer yOffset={[0, -80]}>
                <motion.div
                  className="relative max-w-[520px] mx-auto w-full"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", damping: 20, stiffness: 200 }}
                >
                  <div className="absolute -inset-6 bg-gradient-to-br from-[#AA412A]/4 via-transparent to-white/[0.01] rounded-3xl blur-3xl" />
                  <div className="relative bg-[#0A1F2E]/90 backdrop-blur-sm rounded-2xl border border-white/[0.04] shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden">
                    <div className="flex items-center gap-2 px-4 pt-3.5 pb-2.5 border-b border-white/[0.03]">
                      <div className="flex items-center gap-1.5">
                        <motion.span className="w-2 h-2 rounded-full bg-red-400/30" animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
                        <motion.span className="w-2 h-2 rounded-full bg-yellow-400/30" animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, delay: 0.3, repeat: Infinity }} />
                        <motion.span className="w-2 h-2 rounded-full bg-green-400/30" animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, delay: 0.6, repeat: Infinity }} />
                      </div>
                      <span className="ml-3 text-[10px] font-mono text-white/15">yolo · assistant</span>
                      <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-mono text-green-400/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400/60 animate-pulse-soft" />live
                      </span>
                    </div>
                    <div className="p-4 sm:p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-white/20 uppercase tracking-wider">health score</span>
                          <div className="flex items-baseline gap-2 mt-1">
                            <motion.span className="text-2xl sm:text-3xl font-bold font-heading text-white" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, type: "spring", damping: 12, stiffness: 120 }}>86</motion.span>
                            <span className="text-xs font-mono text-white/20">/100</span>
                            <motion.span className="ml-1 text-[10px] font-mono text-green-400/60 bg-green-400/8 px-1.5 py-0.5 rounded-md border border-green-400/10" initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1.2 }}>+4%</motion.span>
                          </div>
                        </div>
                        <div className="flex -space-x-1.5">
                          {[1, 2, 3].map((i) => (
                            <motion.div key={i} className="w-6 h-6 rounded-full border-2 border-[#0A1F2E] bg-gradient-to-br from-[#AA412A]/20 to-[#AA412A]/10" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.1 }} />
                          ))}
                        </div>
                      </div>
                      <motion.div className="h-1 bg-white/[0.03] rounded-full overflow-hidden" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1, duration: 0.8, ease: "easeOut" }} style={{ transformOrigin: "left" }}>
                        <div className="h-full w-[86%] rounded-full bg-gradient-to-r from-[#AA412A] to-[#AA412A]/60" />
                      </motion.div>
                      <div className="grid grid-cols-3 gap-2">
                        {[{ label: "Sommeil", val: "7h42", color: "text-blue-300/70" }, { label: "Activité", val: "6 843", color: "text-green-300/70" }, { label: "Récup.", val: "92%", color: "text-[#AA412A]" }].map((s, i) => (
                          <motion.div key={s.label} className="bg-white/[0.02] backdrop-blur-sm rounded-xl p-3 border border-white/[0.03]" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 + i * 0.1, type: "spring", damping: 20 }}>
                            <span className="text-[10px] font-mono text-white/20">{s.label}</span>
                            <p className={`text-sm font-bold font-heading mt-0.5 ${s.color}`}>{s.val}</p>
                          </motion.div>
                        ))}
                      </div>
                      <motion.div className="bg-white/[0.02] backdrop-blur-sm rounded-xl p-3.5 border border-white/[0.03]" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}>
                        <div className="flex items-start gap-3">
                          <motion.div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#AA412A] to-[#AA412A]/70 flex items-center justify-center shrink-0 text-[10px] font-bold text-white font-mono" animate={{ rotate: [0, 5, 0, -5, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>Y</motion.div>
                          <div className="min-w-0">
                            <p className="text-white/70 text-sm leading-relaxed">Bonjour ! Vos indicateurs sont stables. Je vous recommande une routine de récupération active.</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-[10px] font-mono text-white/20">il y a 2 min</span>
                              <span className="text-[10px] font-mono text-[#AA412A]/50">personnalisé</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      <motion.div className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
                        <div className="flex-1 bg-white/[0.03] rounded-xl px-3.5 py-2.5 text-xs font-mono text-white/15 border border-white/[0.03]">Demandez-moi n&apos;importe quoi...</div>
                        <motion.div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#AA412A] to-[#AA412A]/70 flex items-center justify-center cursor-pointer" whileHover={{ scale: 1.1, rotate: 45 }} whileTap={{ scale: 0.9 }}>{ARROW_R}</motion.div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </ParallaxLayer>
            </motion.div>
          </motion.div>
        </ScrollSection>
      </section>
    </>
  );
}

export default YoloHeroSection;
export { BADGE_D, ARROW_R };
