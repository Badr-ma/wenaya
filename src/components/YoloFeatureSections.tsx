"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import ScrollSection, { ParallaxLayer, staggerContainer, fadeUp, fadeIn } from "./ScrollSection";
import ParticleField from "./YoloParticles";
import { SvgArchitecture, SvgHeatmap } from "./YoloSvgArchitecture";
import { BADGE_D } from "./YoloHeroSection";

const BADGE_L = (label: string): React.JSX.Element => (
  <span className="inline-flex items-center gap-2 bg-[#AA412A]/5 border border-[#AA412A]/10 rounded-full px-3 py-1 mb-5">
    <span className="w-1.5 h-1.5 rounded-full bg-[#AA412A]/50" />
    <span className="text-[10px] font-mono text-[#AA412A]/60 tracking-wider uppercase">{label}</span>
  </span>
);

const CHECK: React.JSX.Element = (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const yoloSteps = [
  {
    number: "01", label: "Évaluation",
    desc: "Un questionnaire intelligent et personnalisé pour comprendre votre profil, vos objectifs et vos contraintes.",
    features: ["Questionnaire adaptatif", "Analyse des objectifs", "Profil de santé initial"],
  },
  {
    number: "02", label: "Analyse",
    desc: "Votre Health Score de référence est généré et les axes d'amélioration prioritaires sont identifiés par notre algorithme.",
    features: ["Health Score personnalisé", "Identification des priorités", "Benchmark anonymisé"],
  },
  {
    number: "03", label: "Accompagnement",
    desc: "Recommandations quotidiennes, routines adaptatives et conseils personnalisés qui évoluent en temps réel avec vous.",
    features: ["Recommandations quotidiennes", "Routines adaptatives", "Suivi en temps réel"],
  },
  {
    number: "04", label: "Suivi",
    desc: "Visualisez votre progression avec des rapports détaillés. Yolo ajuste ses recommandations pour une amélioration continue.",
    features: ["Rapports hebdomadaires", "Évolution du Health Score", "Ajustements continus"],
  },
  {
    number: "05", label: "Orientation",
    desc: "Orientation fluide vers le réseau d'experts Wenaya pour un accompagnement humain personnalisé si nécessaire.",
    features: ["Orientation vers les experts", "Bilan non invasif", "Suivi coordonné"],
  },
];

function StickySteps(): React.JSX.Element {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const obs = yoloSteps.map((_, i) => {
      const el = stepRefs.current[i];
      if (!el) return null;
      const o = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveStep(i); },
        { rootMargin: "-40% 0px -40% 0px" },
      );
      o.observe(el);
      return o;
    });
    return () => obs.forEach((o) => o?.disconnect());
  }, []);

  const scrollTo = (i: number) =>
    stepRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" });

  const stepDecorations = [
    "from-[#AA412A]/5 via-[#159AA9]/5 to-transparent",
    "from-[#159AA9]/5 via-[#AA412A]/5 to-transparent",
    "from-[#AA412A]/5 via-transparent to-[#159AA9]/5",
    "from-[#159AA9]/5 via-transparent to-[#AA412A]/5",
    "from-[#AA412A]/5 via-[#159AA9]/5 to-transparent",
  ];

  return (
    <div className="relative -ml-[33px] -mr-edge">
      <div className="flex">
        <div className="hidden lg:block w-[200px] shrink-0" />
        <div className="hidden lg:block sticky top-32 self-start z-10 -ml-[200px] w-[200px]">
          <div className="flex flex-col">
            <div className="relative ml-5 mb-4 h-[200px]">
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent" />
            </div>

            {yoloSteps.map((s, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className="flex items-center gap-4 group py-2.5"
              >
                <span
                  className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold font-mono transition-all duration-500 shrink-0 ${
                    activeStep === i
                      ? "bg-[#AA412A] text-white scale-110 shadow-[0_0_24px_rgba(170,65,42,0.4)] ring-4 ring-[#AA412A]/10"
                      : "bg-white text-gray-400 border-2 border-gray-200 group-hover:border-[#AA412A]/30 group-hover:text-[#AA412A]/60"
                  }`}
                >
                  {s.number}
                </span>

                <span
                  className={`text-sm font-heading font-bold tracking-widest uppercase transition-all duration-500 whitespace-nowrap ${
                    activeStep === i
                      ? "text-[#AA412A]"
                      : "text-gray-300 group-hover:text-gray-500"
                  }`}
                >
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-0 px-edge lg:px-0 space-y-24">
          {yoloSteps.map((s, i) => (
            <motion.div
              key={i}
              ref={(el) => { stepRefs.current[i] = el; }}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ type: "spring", damping: 25, stiffness: 90 }}
              className="relative group"
            >
              <div className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgba(170,65,42,0.08)] hover:-translate-y-1">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#AA412A] via-[#AA412A]/60 to-[#159AA9]/40" />
                <div className={`absolute inset-0 bg-gradient-to-br ${stepDecorations[i]} pointer-events-none`} />
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border border-[#AA412A]/5 pointer-events-none" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full border border-[#159AA9]/5 pointer-events-none" />

                <div className="relative p-8 sm:p-10">
                  <div className="flex items-center gap-4 mb-5">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#AA412A] to-[#AA412A]/80 text-white text-lg font-bold font-mono shadow-[0_4px_12px_rgba(170,65,42,0.25)]">
                      {s.number}
                    </span>
                    <div>
                      <span className="text-[10px] font-mono text-[#AA412A]/40 uppercase tracking-[0.15em]">Étape {s.number}</span>
                      <h3 className="text-xl sm:text-2xl font-heading font-bold text-[#083241]">{s.label}</h3>
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">{s.desc}</p>

                  <div className="flex flex-wrap gap-2 mt-6">
                    {s.features.map((f, j) => (
                      <motion.span
                        key={j}
                        initial={{ opacity: 0, scale: 0.85, y: 8 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + j * 0.07, type: "spring", damping: 16, stiffness: 200 }}
                        className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#AA412A]/5 to-[#AA412A]/2 rounded-full px-4 py-2 text-[12px] font-mono text-[#AA412A]/80 border border-[#AA412A]/10 shadow-sm"
                      >
                        <svg className="w-3 h-3 text-[#AA412A]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {f}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function YoloFeatureSections(): React.JSX.Element {
  return (
    <>
      {/* ══════ 1: CAPABILITIES ══════ */}
      <section className="relative z-20 rounded-t-[48px] overflow-hidden -mt-12 bg-white">
        <ParallaxLayer yOffset={[0, -30]}>
          <ScrollSection xRange={[0, 0, -80]} className="min-h-screen flex items-center justify-center py-28 sm:py-36 px-edge">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-150px" }}
              className="w-full max-w-7xl mx-auto"
            >
              <motion.div variants={fadeUp} className="text-center mb-12">
                {BADGE_L("Core Capabilities")}
                <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-heading font-bold text-[#083241] leading-[1.02] tracking-tight">Tout ce dont vos équipes ont besoin</h2>
              </motion.div>
              <motion.div variants={staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { title: "Agent IA 24/7", desc: "Un assistant empathique disponible à tout moment.", meta: "always-on", span: "lg:col-span-2 lg:row-span-2" },
                  { title: "Health Score", desc: "Un indicateur clair qui synthétise l'état de santé global.", meta: "real-time", span: "" },
                  { title: "Routines Adaptatives", desc: "Des plans qui évoluent avec les besoins de chacun.", meta: "adaptive", span: "" },
                  { title: "Prévention Active", desc: "Détection précoce des signaux faibles.", meta: "predictive", span: "sm:col-span-2" },
                  { title: "Réseau d'Experts", desc: "Connexion fluide avec les spécialistes Wenaya.", meta: "human-in-the-loop", span: "sm:col-span-2" },
                  { title: "Conseils Validés", desc: "Recommandations basées sur des sources validées.", meta: "evidence-based", span: "" },
                  { title: "Cellule de Crise", desc: "Protocole d'urgence avec escalade immédiate.", meta: "emergency", span: "" },
                ].map((cap, i) => (
                  <motion.div key={i} variants={fadeUp} className={`group bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 transition-all duration-500 hover:shadow-[0_12px_40px_rgba(170,65,42,0.08)] hover:-translate-y-1.5 overflow-hidden ${cap.span}`}>
                    <motion.div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#AA412A]/3 to-transparent rounded-bl-full pointer-events-none" whileHover={{ scale: 1.5 }} transition={{ duration: 0.4 }} />
                    <div className="h-full flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-[#AA412A]/40 uppercase tracking-wider">{cap.meta}</span>
                        <h3 className="text-lg font-heading font-bold text-[#083241] mt-1.5 group-hover:text-[#AA412A] transition-colors duration-300">{cap.title}</h3>
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed mt-3">{cap.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </ScrollSection>
        </ParallaxLayer>
      </section>

      {/* ══════ 2: FOR EMPLOYEES ══════ */}
      <section className="relative z-30 rounded-t-[48px] overflow-hidden -mt-12 bg-[#AA412A]">
        <ParticleField count={10} />
        <div className="absolute inset-0 pointer-events-none">
          <motion.div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-white/[0.04] to-transparent blur-[120px]" animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
        </div>
        <ScrollSection rotateRange={[0, 0, 4]} scaleRange={[1, 1, 0.9]} yRange={[0, 0, -120]} className="relative z-10 min-h-screen flex items-center justify-center py-28 sm:py-36 px-edge">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-150px" }}
            className="w-full max-w-7xl mx-auto"
          >
            <motion.div variants={fadeUp} className="text-center mb-12">
              {BADGE_D("Pour les Collaborateurs")}
              <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-heading font-bold text-white leading-[1.02] tracking-tight">Un Accompagnement Complet</h2>
            </motion.div>
            <motion.div variants={staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {[
                { icon: "⊕", title: "Agent IA empathique", desc: "Disponible 24/7 pour répondre à chaque collaborateur." },
                { icon: "✓", title: "Conseils validés", desc: "Recommandations issues de sources médicalement validées." },
                { icon: "↻", title: "Routines personnalisées", desc: "Plans sur mesure qui évoluent avec les besoins." },
                { icon: "◉", title: "Health Score", desc: "Un indicateur clair pour suivre sa progression." },
                { icon: "☰", title: "Bibliothèque d'exercices", desc: "Accès à une collection variée d'exercices." },
                { icon: "⇌", title: "Accès au réseau Wenaya", desc: "Orientation fluide vers les experts Wenaya." },
                { icon: "⚡", title: "Cellule de crise", desc: "Protocole d'urgence avec escalade immédiate." },
              ].map((f, i) => (
                <motion.div key={i} variants={fadeUp} className="group bg-white/[0.03] backdrop-blur-md rounded-2xl p-6 border border-white/[0.06] transition-all duration-500 hover:bg-white/[0.06] hover:border-white/10 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]">
                  <motion.span className="text-lg block mb-3 text-white/30 group-hover:text-white/50 transition-all duration-500 group-hover:scale-110" whileHover={{ scale: 1.2, rotate: 5 }}>{f.icon}</motion.span>
                  <h3 className="text-white font-heading font-bold text-sm mb-2">{f.title}</h3>
                  <p className="text-white/50 text-xs leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </ScrollSection>
      </section>

      {/* ══════ 3: FOR HR ══════ */}
      <section className="relative z-40 rounded-t-[48px] overflow-hidden -mt-12 bg-white">
        <SvgHeatmap className="z-0" />
        <ScrollSection scaleRange={[1, 1, 0.95]} xRange={[0, 0, 60]} yRange={[0, 0, -60]} className="relative z-10 min-h-screen flex items-center justify-center py-28 sm:py-36 px-edge">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-150px" }}
            className="w-full max-w-7xl mx-auto"
          >
            <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
              <motion.div variants={staggerContainer}>
                <motion.div variants={fadeUp}>{BADGE_L("Pour les RH")}</motion.div>
                <motion.h2 variants={fadeUp} className="text-[clamp(2rem,4vw,3.2rem)] font-heading font-bold text-[#083241] leading-[1.02] tracking-tight mt-5">
                  Des Données Utiles Sans Compromettre la <span className="text-[#AA412A]">Confidentialité</span>
                </motion.h2>
                <motion.p variants={fadeUp} className="text-gray-500 text-[13px] sm:text-sm leading-relaxed mt-6 max-w-lg">
                  Un tableau de bord agrégé pour piloter la qualité de vie au travail, sans jamais exposer les données individuelles.
                </motion.p>
                <motion.ul variants={staggerContainer} className="mt-8 space-y-3">
                  {["Tableau de bord agrégé et anonymisé", "Détection précoce des risques psychosociaux", "Suivi de participation et d'engagement", "Tendances émergentes par équipe", "Pilotage QVT basé sur des données fiables"].map((item, i) => (
                    <motion.li key={i} variants={fadeUp} className="flex items-start gap-3">
                      <motion.span className="w-5 h-5 rounded-lg bg-[#AA412A]/10 flex items-center justify-center shrink-0 mt-0.5" whileHover={{ scale: 1.2, backgroundColor: "rgba(170,65,42,0.2)" }}>{CHECK}</motion.span>
                      <span className="text-sm text-gray-600">{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
              <motion.div variants={fadeIn}>
                <ParallaxLayer yOffset={[0, -60]}>
                  <motion.div className="relative max-w-[520px] mx-auto w-full" whileHover={{ scale: 1.01 }} transition={{ type: "spring", damping: 20 }}>
                    <div className="bg-[#083241] rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                        <span className="text-xs font-mono text-white/40 uppercase tracking-wider">vue d&apos;ensemble · qvt</span>
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-green-400/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400/60 animate-pulse-soft" />live
                        </span>
                      </div>
                      <div className="p-4 space-y-4">
                        <div className="grid grid-cols-3 gap-2">
                          {[{ label: "Participation", val: "84%", color: "text-[#AA412A]" }, { label: "Health Score", val: "72", color: "text-[#AA412A]/80" }, { label: "Engagement", val: "91%", color: "text-white/70" }].map((s, i) => (
                            <motion.div key={s.label} className="bg-white/[0.03] backdrop-blur-sm rounded-xl p-3" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 + 0.5 }} viewport={{ once: true }}>
                              <span className="text-[10px] font-mono text-white/30 block">{s.label}</span>
                              <span className={`text-lg font-bold font-heading ${s.color}`}>{s.val}</span>
                            </motion.div>
                          ))}
                        </div>
                        <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl p-3.5">
                          <span className="text-[10px] font-mono text-white/30 block mb-2">Évolution du Health Score</span>
                          <div className="flex items-end gap-1 h-16">
                            {[45, 52, 48, 58, 63, 60, 68, 72].map((v, i) => (
                              <motion.div key={i} className="flex-1 bg-gradient-to-t from-[#AA412A]/30 to-[#AA412A]/10 rounded-t" style={{ height: `${v}%`, originY: 1 }} initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} transition={{ delay: i * 0.06 + 0.8, type: "spring" as const, damping: 15 }} viewport={{ once: true }} />
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-[#AA412A]/5 rounded-xl p-3 border border-[#AA412A]/10">
                            <span className="text-[10px] font-mono text-white/30">Risques détectés</span>
                            <span className="text-white text-sm font-bold font-heading block mt-1">2 alertes</span>
                          </div>
                          <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl p-3 border border-white/[0.04]">
                            <span className="text-[10px] font-mono text-white/30">Tendances</span>
                            <span className="text-white text-sm font-bold font-heading block mt-1">+12%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </ParallaxLayer>
              </motion.div>
            </div>
          </motion.div>
        </ScrollSection>
      </section>

      {/* ══════ 4: SECURITY ══════ */}
      <section className="relative z-50 rounded-t-[48px] overflow-hidden -mt-12 bg-[#083241]">
        <SvgArchitecture className="z-0 opacity-40" />
        <ParticleField count={8} />
        <ScrollSection rotateRange={[0, 0, -3]} scaleRange={[1, 1, 0.88]} yRange={[0, 0, -100]} className="relative z-10 min-h-screen flex items-center justify-center py-28 sm:py-36 px-edge">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-150px" }}
            className="w-full max-w-6xl mx-auto"
          >
            <motion.div variants={fadeUp} className="text-center mb-12">
              {BADGE_D("Sécurité & Confidentialité")}
              <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-heading font-bold text-white leading-[1.02] tracking-tight">La Confidentialité <span className="text-[#AA412A]">Avant Tout</span></h2>
            </motion.div>
            <motion.div variants={staggerContainer} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { title: "Chiffrement de bout en bout", desc: "Toutes les données sont chiffrées au repos et en transit.", icon: "⊟" },
                { title: "Données personnelles chiffrées", desc: "Les informations identifiantes sont réservées à l'utilisateur.", icon: "⊡" },
                { title: "IA basée sur données anonymisées", desc: "L'apprentissage repose exclusivement sur des données agrégées.", icon: "⊕" },
                { title: "Modèle d'autorisation strict", desc: "Contrôle d'accès granulaire avec permissions spécifiques.", icon: "⊠" },
                { title: "Prévention des contre-indications", desc: "Vérification automatique avant toute recommandation sensible.", icon: "⊜" },
                { title: "Système d'escalade conforme", desc: "Protocole certifié pour les situations nécessitant intervention humaine.", icon: "⧉" },
              ].map((f, i) => (
                <motion.div key={i} variants={fadeUp} className="group bg-white/[0.02] backdrop-blur-md rounded-2xl p-7 border border-white/[0.04] transition-all duration-500 hover:bg-white/[0.04] hover:border-[#AA412A]/15 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(170,65,42,0.08)]">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#AA412A]/5 to-transparent rounded-bl-full pointer-events-none" />
                  <motion.span className="text-xl block mb-4 text-white/20 group-hover:text-[#AA412A]/30 transition-all duration-500" whileHover={{ scale: 1.2, rotate: 10 }}>{f.icon}</motion.span>
                  <h3 className="text-white font-heading font-bold text-sm mb-2 group-hover:text-[#AA412A] transition-colors duration-300">{f.title}</h3>
                  <p className="text-white/30 text-xs leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </ScrollSection>
      </section>

      {/* ══════ 5: YOLO STEPS ══════ */}
      <section className="relative z-[60] rounded-t-[48px] -mt-12 bg-white py-28 sm:py-36">
        <div className="px-edge mb-16 text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeUp}>
              {BADGE_L("Comment ça marche")}
              <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-heading font-bold text-[#083241] leading-[1.02] tracking-tight">Comment Fonctionne <span className="text-[#AA412A]">Yolo</span></h2>
            </motion.div>
          </motion.div>
        </div>
        <StickySteps />
      </section>

      {/* ══════ 6: CTA ══════ */}
      <section className="relative z-[70] rounded-t-[48px] overflow-hidden -mt-12 bg-gradient-to-br from-[#AA412A]/90 via-[#083241] to-[#083241]">
        <ParticleField count={12} />
        <ScrollSection scaleRange={[0.9, 1, 1]} yRange={[80, 0, 0]} className="min-h-screen flex items-center justify-center py-32 sm:py-40 px-edge">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="w-full max-w-3xl mx-auto text-center"
          >
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-full px-3 py-1 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400/60 animate-pulse-soft" />
                <span className="text-[10px] font-mono text-[#AA412A]/60 tracking-wider uppercase">Prêt à transformer le bien-être</span>
              </span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-[clamp(2.4rem,4.5vw,4rem)] font-heading font-bold text-white leading-[1] tracking-tight mt-5">
              Le Futur du Bien-être<br /><span className="text-[#AA412A]">Commence Ici</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/35 text-sm sm:text-base mt-6 max-w-xl mx-auto leading-relaxed font-mono text-[13px]">
              Offrez à vos collaborateurs un accompagnement intelligent, personnalisé et sécurisé.
            </motion.p>
            <motion.div variants={staggerContainer} className="flex flex-wrap items-center justify-center gap-4 mt-12">
              <motion.a href="#" onClick={(e) => e.preventDefault()} variants={fadeUp} className="inline-flex items-center justify-center px-8 h-[52px] bg-[#AA412A] text-white text-sm font-semibold rounded-xl shimmer-btn" whileHover={{ scale: 1.04, boxShadow: "0 12px 40px rgba(170,65,42,0.4)" }} whileTap={{ scale: 0.94 }}>
                <span className="font-mono text-xs tracking-wider uppercase relative z-10">Demander une Démonstration</span>
              </motion.a>
              <motion.a href="#" onClick={(e) => e.preventDefault()} variants={fadeUp} className="inline-flex items-center justify-center px-8 h-[52px] bg-white/[0.03] text-white/50 hover:text-white border border-white/[0.06] hover:border-white/20 rounded-xl font-mono text-xs tracking-wider uppercase" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }}>
                Parler à un Expert
              </motion.a>
            </motion.div>
          </motion.div>
        </ScrollSection>
      </section>
    </>
  );
}

export default YoloFeatureSections;
