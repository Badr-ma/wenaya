"use client";

import { motion } from "framer-motion";

const items = [
  "Tableau de bord agrégé et anonymisé",
  "Détection précoce des risques psychosociaux",
  "Suivi de participation et d'engagement",
  "Tendances émergentes par équipe",
  "Pilotage QVT basé sur des données fiables",
];

export default function YoloForHR() {
  return (
    <section className="bg-white py-28 sm:py-36 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 bg-[#AA412A]/5 border border-[#AA412A]/10 rounded-full px-3 py-1 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#AA412A]/50" />
              <span className="text-[10px] font-mono text-[#AA412A]/60 tracking-wider uppercase">Pour les RH</span>
            </span>

            <h2 className="text-[clamp(2.2rem,4vw,3.2rem)] font-heading font-bold text-[#083241] leading-[1.02] tracking-tight mt-5">
              Des Données Utiles Sans Compromettre la <span className="text-[#AA412A]">Confidentialité</span>
            </h2>

            <p className="text-[#2B2F36] text-sm sm:text-base mt-6 leading-relaxed max-w-lg">
              Un tableau de bord agrégé pour piloter la qualité de vie au travail, sans jamais exposer les données individuelles.
            </p>

            <motion.ul
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="mt-8 space-y-3"
            >
              {items.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="flex items-start gap-3"
                >
                  <span className="w-5 h-5 rounded-lg bg-[#AA412A]/10 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-[#AA412A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </span>
                  <span className="text-sm text-[#2B2F36]">{item}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.97 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-[#083241] rounded-2xl border border-white/[0.06] shadow-xl overflow-hidden max-w-[520px] mx-auto backdrop-blur-sm">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
                <span className="text-xs font-mono text-white/40 uppercase tracking-wider">vue d&apos;ensemble · qvt</span>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-green-400/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400/60 animate-pulse-soft" />
                  live
                </span>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Participation", val: "84%", color: "text-[#AA412A]" },
                    { label: "Health Score", val: "72", color: "text-[#AA412A]/80" },
                    { label: "Engagement", val: "91%", color: "text-white/70" },
                  ].map((s) => (
                    <div key={s.label} className="bg-white/[0.03] backdrop-blur-sm rounded-xl p-3">
                      <span className="text-[10px] font-mono text-white/30 block">{s.label}</span>
                      <span className={`text-lg font-bold font-heading ${s.color}`}>{s.val}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl p-3.5">
                  <span className="text-[10px] font-mono text-white/30 block mb-2">Évolution du Health Score</span>
                  <div className="flex items-end gap-1 h-16">
                    {[45, 52, 48, 58, 63, 60, 68, 72].map((v, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-[#AA412A]/30 to-[#AA412A]/10 rounded-t transition-all duration-300 hover:from-[#AA412A]/40" style={{ height: `${v}%` }} />
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
        </div>
      </div>
    </section>
  );
}
