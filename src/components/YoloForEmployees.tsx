"use client";

import { motion } from "framer-motion";

const features = [
  { icon: "⊕", title: "Agent IA empathique", desc: "Disponible 24/7 pour répondre à chaque collaborateur avec bienveillance et précision." },
  { icon: "✓", title: "Conseils validés", desc: "Recommandations issues de sources médicalement validées et adaptées à chaque profil." },
  { icon: "↻", title: "Routines personnalisées", desc: "Plans sur mesure qui évoluent avec les besoins et les progrès de chaque utilisateur." },
  { icon: "◉", title: "Health Score", desc: "Un indicateur clair et motivant pour suivre sa progression en un coup d'œil." },
  { icon: "☰", title: "Bibliothèque d'exercices", desc: "Accès à une collection variée d'exercices physiques, mentaux et de relaxation." },
  { icon: "⇌", title: "Accès au réseau Wenaya", desc: "Orientation fluide vers les experts Wenaya en cas de besoin spécifique." },
  { icon: "⚡", title: "Cellule de crise", desc: "Protocole d'urgence intégré avec escalade immédiate vers les ressources appropriées." },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, damping: 25, stiffness: 100 } } };

export default function YoloForEmployees() {
  return (
    <section className="bg-[#083241] py-28 sm:py-36 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#AA412A]/4 to-transparent blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-full px-3 py-1 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400/60 animate-pulse-soft" />
            <span className="text-[10px] font-mono text-[#AA412A]/60 tracking-wider uppercase">Pour les Collaborateurs</span>
          </span>
          <h2 className="text-[clamp(2.2rem,4vw,3.2rem)] font-heading font-bold text-white leading-[1.02] tracking-tight">
            Un Accompagnement Complet
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={item}
              className="group relative bg-white/[0.03] backdrop-blur-md rounded-2xl p-6 border border-white/[0.04] transition-all duration-500 hover:bg-white/[0.05] hover:border-[#AA412A]/15 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(170,65,42,0.06)]"
            >
              <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#AA412A]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="text-lg block mb-3 text-white/30 group-hover:text-[#AA412A]/50 transition-all duration-500 group-hover:scale-110">{f.icon}</span>
              <h3 className="text-white font-heading font-bold text-sm mb-2 group-hover:text-[#AA412A] transition-colors duration-300">{f.title}</h3>
              <p className="text-white/30 text-xs leading-relaxed group-hover:text-white/40 transition-colors duration-300">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
