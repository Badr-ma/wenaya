"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  { q: "Qu'est-ce que Yolo ?", a: "Yolo est un agent IA de longévité et de bien-être développé par Wenaya. Il accompagne les collaborateurs 24/7 avec des recommandations personnalisées, un Health Score, et une orientation vers les experts Wenaya si nécessaire." },
  { q: "Comment Yolo protège-t-il les données ?", a: "Toutes les données sont chiffrées de bout en bout. Les informations personnelles sont accessibles uniquement par l'utilisateur. L'IA s'entraîne exclusivement sur des données anonymisées et agrégées." },
  { q: "Les RH peuvent-ils voir les données personnelles ?", a: "Non. Les RH disposent uniquement d'un tableau de bord agrégé et anonymisé qui montre les tendances globales, le taux de participation et les indicateurs QVT sans jamais exposer les données individuelles." },
  { q: "Comment fonctionne le Health Score ?", a: "Le Health Score est calculé à partir de multiples indicateurs : sommeil, activité physique, nutrition, bien-être mental, récupération et engagement." },
  { q: "Yolo remplace-t-il un professionnel de santé ?", a: "Non. Yolo est un outil d'accompagnement et de prévention. Il ne remplace pas un médecin ou un spécialiste." },
  { q: "Comment déployer Yolo dans mon entreprise ?", a: "Le déploiement commence par une démonstration personnalisée, suivie d'une phase pilote avec un groupe de collaborateurs." },
];

export default function YoloFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-[#F7F5F2] py-28 sm:py-36 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 bg-white border border-gray-200/50 rounded-full px-3 py-1 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#AA412A]/50" />
            <span className="text-[10px] font-mono text-[#AA412A]/60 tracking-wider uppercase">FAQ</span>
          </span>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-heading font-bold text-[#083241] leading-[1.02] tracking-tight">
            Questions Fréquentes
          </h2>
        </motion.div>

        <div className="space-y-2" itemScope itemType="https://schema.org/FAQPage">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100/80 overflow-hidden transition-all duration-300 hover:border-[#AA412A]/10 hover:shadow-[0_4px_20px_rgba(170,65,42,0.04)]">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="flex items-center justify-between w-full px-5 sm:px-6 py-4 text-left transition-colors duration-300 hover:bg-white/50"
                >
                  <span itemProp="name" className="text-sm font-semibold text-[#083241] pr-4">{faq.q}</span>
                  <motion.svg
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={`w-4 h-4 text-[#AA412A] shrink-0`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer" className="px-5 sm:px-6 pb-5">
                        <p itemProp="text" className="text-sm text-[#6B6B6B] leading-relaxed">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-sm text-[#6B6B6B]">
            Vous avez d&apos;autres questions ?{" "}
            <a href="/contact" className="text-[#AA412A] font-medium hover:underline transition-colors">Contactez-nous</a>
          </p>
        </div>
      </div>
    </section>
  );
}
