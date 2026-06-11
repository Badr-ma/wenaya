"use client";

import { motion } from "framer-motion";

export default function YoloCta() {
  return (
    <section className="relative bg-[#083241] min-h-screen flex items-center justify-center py-32 sm:py-40 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full bg-gradient-to-br from-[#AA412A]/5 via-[#AA412A]/2 to-transparent blur-[150px]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#AA412A]/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#AA412A]/10 to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9 }}
        className="relative z-10 max-w-3xl mx-auto text-center"
      >
        <span className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-full px-3 py-1 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400/60 animate-pulse-soft" />
          <span className="text-[10px] font-mono text-[#AA412A]/60 tracking-wider uppercase">Prêt à transformer le bien-être</span>
        </span>

        <h2 className="text-[clamp(2.4rem,4.5vw,4rem)] font-heading font-bold text-white leading-[1] tracking-tight mt-5">
          Le Futur du Bien-être<br />
          <span className="text-[#AA412A]">Commence Ici</span>
        </h2>

        <p className="text-white/35 text-sm sm:text-base mt-6 max-w-xl mx-auto leading-relaxed font-mono text-[13px]">
          Offrez à vos collaborateurs un accompagnement intelligent, personnalisé et sécurisé, conçu pour améliorer durablement leur santé et leur bien-être.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-12">
          <motion.a
            href="#"
            className="inline-flex items-center justify-center px-8 h-[52px] bg-[#AA412A] text-white text-sm font-semibold rounded-xl transition-all duration-300"
            whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(170,65,42,0.3)" }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="font-mono text-xs tracking-wider uppercase">Demander une Démonstration</span>
          </motion.a>
          <motion.a
            href="#"
            className="inline-flex items-center justify-center px-8 h-[52px] bg-white/[0.03] text-white/50 hover:text-white border border-white/[0.06] hover:border-white/20 rounded-xl text-sm font-medium transition-all duration-300 font-mono text-xs tracking-wider uppercase"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            Parler à un Expert
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}
