"use client";

import { motion } from "framer-motion";

const capabilities = [
  { title: "Agent IA 24/7", desc: "Un assistant empathique disponible à tout moment pour répondre, guider et accompagner chaque collaborateur.", meta: "always-on" },
  { title: "Health Score", desc: "Un indicateur clair et motivant qui synthétise l'état de santé global en un coup d'œil.", meta: "real-time" },
  { title: "Routines Adaptatives", desc: "Des plans personnalisés qui évoluent avec les besoins, les progrès et le rythme de chaque utilisateur.", meta: "adaptive" },
  { title: "Prévention Active", desc: "Détection précoce des signaux faibles et recommandations proactives pour anticiper les risques.", meta: "predictive" },
  { title: "Réseau d'Experts", desc: "Connexion fluide avec les spécialistes Wenaya pour un accompagnement humain quand cela compte.", meta: "human-in-the-loop" },
  { title: "Conseils Validés", desc: "Recommandations basées sur des sources médicalement validées, adaptées à chaque profil.", meta: "evidence-based" },
  { title: "Cellule de Crise", desc: "Protocole d'urgence intégré avec escalade immédiate vers les ressources appropriées.", meta: "emergency" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, damping: 25, stiffness: 100 } } };

const sizes: Record<number, string> = {
  0: "lg:col-span-2 lg:row-span-2",
  1: "lg:col-span-1 lg:row-span-1",
  2: "lg:col-span-1 lg:row-span-1",
  3: "lg:col-span-2 lg:row-span-1",
  4: "lg:col-span-2 lg:row-span-1",
  5: "lg:col-span-1 lg:row-span-1",
  6: "lg:col-span-1 lg:row-span-1",
};

export default function YoloBento() {
  return (
    <section className="bg-[#F7F5F2] min-h-screen py-28 sm:py-36 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-white border border-gray-200/50 rounded-full px-3 py-1 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-soft" />
            <span className="text-[10px] font-mono text-[#AA412A]/60 tracking-wider uppercase">Core Capabilities</span>
          </span>
          <h2 className="text-[clamp(2.2rem,4vw,3.5rem)] font-heading font-bold text-[#083241] leading-[1.02] tracking-tight">
            Tout ce dont vos équipes ont besoin
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-[200px]"
        >
          {capabilities.map((cap, i) => (
            <motion.div
              key={i}
              variants={item}
              className={`group relative rounded-2xl border border-black/[0.03] bg-white/60 backdrop-blur-sm p-6 transition-all duration-500 hover:shadow-[0_8px_30px_rgba(170,65,42,0.06)] hover:-translate-y-0.5 overflow-hidden ${sizes[i]} ${i === 3 || i === 4 ? "sm:col-span-2" : ""} ${i === 0 ? "sm:row-span-2 sm:col-span-2" : ""}`}
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#AA412A]/3 to-transparent rounded-bl-full pointer-events-none" />
              <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#AA412A]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="h-full flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#AA412A]/40 uppercase tracking-wider">{cap.meta}</span>
                  <h3 className="text-lg font-heading font-bold text-[#083241] mt-1.5 group-hover:text-[#AA412A] transition-colors duration-300">{cap.title}</h3>
                </div>
                <p className="text-sm text-[#6B6B6B]/70 leading-relaxed mt-3">{cap.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
