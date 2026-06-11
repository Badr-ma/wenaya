"use client";

import { motion } from "framer-motion";

const features = [
  { title: "Chiffrement de bout en bout", desc: "Toutes les données sont chiffrées au repos et en transit avec des protocoles de niveau bancaire.", icon: "⊟" },
  { title: "Données personnelles chiffrées", desc: "Les informations identifiantes sont chiffrées et accessibles uniquement par l'utilisateur.", icon: "⊡" },
  { title: "IA basée sur données anonymisées", desc: "L'apprentissage de l'IA repose exclusivement sur des données agrégées et anonymisées.", icon: "⊕" },
  { title: "Modèle d'autorisation strict", desc: "Contrôle d'accès granulaire avec permissions spécifiques pour chaque rôle.", icon: "⊠" },
  { title: "Prévention des contre-indications", desc: "Mécanisme de vérification automatique avant toute recommandation sensible.", icon: "⊜" },
  { title: "Système d'escalade conforme", desc: "Protocole d'escalade certifié pour les situations nécessitant une intervention humaine.", icon: "⧉" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: "spring" as const, damping: 25, stiffness: 100 } } };

export default function YoloSecurity() {
  return (
    <section className="bg-[#083241] min-h-screen py-28 sm:py-36 px-6 relative overflow-hidden flex items-center">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-l from-[#AA412A]/4 to-transparent blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-full px-3 py-1 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400/60 animate-pulse-soft" />
            <span className="text-[10px] font-mono text-[#AA412A]/60 tracking-wider uppercase">Sécurité & Confidentialité</span>
          </span>
          <h2 className="text-[clamp(2.2rem,4vw,3.2rem)] font-heading font-bold text-white leading-[1.02] tracking-tight">
            La Confidentialité <span className="text-[#AA412A]">Avant Tout</span>
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={item}
              className="group relative bg-white/[0.02] backdrop-blur-md rounded-2xl p-7 border border-white/[0.04] transition-all duration-500 hover:bg-white/[0.04] hover:border-[#AA412A]/15 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(170,65,42,0.04)]"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#AA412A]/5 to-transparent rounded-bl-full pointer-events-none" />
              <span className="text-xl block mb-4 text-white/20 group-hover:text-[#AA412A]/30 transition-all duration-500 group-hover:scale-110">{f.icon}</span>
              <h3 className="text-white font-heading font-bold text-sm mb-2 group-hover:text-[#AA412A] transition-colors duration-300">{f.title}</h3>
              <p className="text-white/30 text-xs leading-relaxed group-hover:text-white/40 transition-colors duration-300">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
