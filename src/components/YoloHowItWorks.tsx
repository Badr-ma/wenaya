"use client";

import { motion } from "framer-motion";

const steps = [
  { number: "01", label: "Évaluation", desc: "Le collaborateur répond à un questionnaire initial et partage ses objectifs de santé." },
  { number: "02", label: "Analyse", desc: "Yolo analyse les données et élabore un profil de santé personnalisé avec un Health Score de référence." },
  { number: "03", label: "Accompagnement", desc: "Recommandations quotidiennes, routines adaptatives et suivi en temps réel." },
  { number: "04", label: "Suivi", desc: "Évolution mesurée, ajustements continus et rapports de progression." },
  { number: "05", label: "Orientation", desc: "Si nécessaire, orientation fluide vers les experts Wenaya pour un accompagnement humain." },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 40, scale: 0.95 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, damping: 25, stiffness: 100 } } };

export default function YoloHowItWorks() {
  return (
    <section id="how" className="bg-[#F7F5F2] min-h-screen py-28 sm:py-36 px-6 relative overflow-hidden flex items-center">
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full opacity-[0.02]" viewBox="0 0 1440 600">
          <defs>
            <linearGradient id="hg1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#AA412A" stopOpacity="0" />
              <stop offset="50%" stopColor="#AA412A" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#AA412A" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0,300 Q360,200 720,300 Q1080,400 1440,300" stroke="url(#hg1)" strokeWidth="1" fill="none" opacity="0.2" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-white border border-gray-200/50 rounded-full px-3 py-1 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#AA412A]/50" />
            <span className="text-[10px] font-mono text-[#AA412A]/60 tracking-wider uppercase">Comment ça marche</span>
          </span>
          <h2 className="text-[clamp(2.2rem,4vw,3.2rem)] font-heading font-bold text-[#083241] leading-[1.02] tracking-tight">
            Comment Fonctionne <span className="text-[#AA412A]">Yolo</span>
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3"
        >
          {steps.map((s, i) => (
            <motion.div
              key={i}
              variants={item}
              className="group relative bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-gray-100/80 transition-all duration-500 hover:shadow-[0_8px_30px_rgba(170,65,42,0.06)] hover:-translate-y-1.5 hover:border-[#AA412A]/10"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="text-3xl font-heading font-bold text-[#AA412A]/15">{s.number}</span>
                {i < 4 && <span className="hidden lg:block text-[#AA412A]/15 text-sm">→</span>}
              </div>
              <span className="text-white font-heading font-bold text-xs bg-[#AA412A] px-3 py-1.5 rounded-lg inline-block mb-3">{s.label}</span>
              <p className="text-[#6B6B6B]/70 text-xs leading-relaxed mt-3">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
