"use client";

import { motion } from "framer-motion";

export default function YoloWhatIs() {
  return (
    <section className="bg-white min-h-screen py-28 sm:py-36 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="max-w-xl"
          >
            <span className="inline-flex items-center gap-2 bg-[#AA412A]/5 border border-[#AA412A]/10 rounded-full px-3 py-1 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#AA412A]/50" />
              <span className="text-[10px] font-mono text-[#AA412A]/60 tracking-wider uppercase">Qu&apos;est-ce que Yolo</span>
            </span>

            <h2 className="text-[clamp(2.2rem,4vw,3.2rem)] font-heading font-bold text-[#083241] leading-[1.02] tracking-tight mt-5">
              Un Compagnon de Santé et de Bien-être <span className="text-[#AA412A]">Disponible 24/7</span>
            </h2>

            <div className="mt-8 space-y-5 text-[#2B2F36] text-sm sm:text-base leading-relaxed">
              <p>
                Yolo est un agent IA spécialisé dans la longévité et le bien-être, conçu pour accompagner chaque collaborateur dans son parcours de santé au quotidien.
              </p>
              <p>
                Il combine intelligence artificielle, données de santé anonymisées et expertise humaine pour offrir un accompagnement personnalisé, préventif et évolutif.
              </p>
              <p className="text-[#083241] font-medium">
                Yolo ne remplace pas un professionnel de santé — il le rend plus accessible, plus réactif et plus pertinent.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {["prévention", "personnalisation", "24/7", "évolutif"].map((tag) => (
                <span key={tag} className="text-[10px] font-mono text-[#AA412A] bg-[#AA412A]/5 px-3 py-1.5 rounded-lg border border-[#AA412A]/10 uppercase tracking-wider">{tag}</span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative max-w-[500px] mx-auto">
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-lg backdrop-blur-sm">
                <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-50">
                  <span className="text-xs font-mono font-semibold text-[#083241] uppercase tracking-wider">recommandations</span>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-green-400/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400/60 animate-pulse-soft" />
                    today
                  </span>
                </div>
                <div className="p-4 space-y-1">
                  {[
                    { time: "08:00", title: "Méditation matinale", desc: "5 min de respiration guidée" },
                    { time: "09:30", title: "Bilan hydrique", desc: "Objectif : 2L d'eau aujourd'hui" },
                    { time: "12:00", title: "Pause active", desc: "Marche de 15 min recommandée" },
                    { time: "14:00", title: "Check-in bien-être", desc: "Comment évaluez-vous votre niveau d'énergie ?" },
                    { time: "18:00", title: "Préparation sommeil", desc: "Routine de relaxation personnalisée" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-300"
                    >
                      <span className="text-[10px] font-mono text-gray-400 w-10 shrink-0 pt-0.5">{item.time}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#083241]">{item.title}</p>
                        <p className="text-xs font-mono text-gray-400 mt-0.5">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-[#AA412A]/5 blur-3xl pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
