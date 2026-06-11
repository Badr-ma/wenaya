"use client";

import { motion } from "framer-motion";

const nodes = [
  { label: "Experts Wenaya", x: "50%", y: "6%" },
  { label: "Prévention", x: "88%", y: "25%" },
  { label: "Données de Santé", x: "77%", y: "88%" },
  { label: "Programmes Bien-être", x: "23%", y: "88%" },
  { label: "Accompagnement Humain", x: "12%", y: "25%" },
];

export default function YoloEcosystem() {
  return (
    <section className="bg-white py-28 sm:py-36 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#AA412A]/3 to-transparent blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-[#AA412A]/5 border border-[#AA412A]/10 rounded-full px-3 py-1 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#AA412A]/50" />
            <span className="text-[10px] font-mono text-[#AA412A]/60 tracking-wider uppercase">Écosystème Wenaya</span>
          </span>
          <h2 className="text-[clamp(2.2rem,4vw,3.2rem)] font-heading font-bold text-[#083241] leading-[1.02] tracking-tight">
            Connecté à un Écosystème de Santé <span className="text-[#AA412A]">Réel</span>
          </h2>
          <p className="text-[#2B2F36] text-sm sm:text-base mt-5 leading-relaxed max-w-lg mx-auto">
            Yolo n&apos;est pas un chatbot isolé. Il est connecté à un réseau d&apos;experts Wenaya qui interviennent quand l&apos;IA détecte un besoin humain.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative max-w-2xl mx-auto aspect-square"
        >
          <svg viewBox="0 0 500 500" className="w-full h-full">
            <defs>
              <radialGradient id="eg1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#AA412A" stopOpacity="0.12" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            <circle cx="250" cy="250" r="220" fill="url(#eg1)" />
            <circle cx="250" cy="250" r="180" fill="none" stroke="#AA412A" strokeWidth="0.3" opacity="0.08" strokeDasharray="8 4" />
            <circle cx="250" cy="250" r="130" fill="none" stroke="#AA412A" strokeWidth="0.2" opacity="0.05" strokeDasharray="4 6" />

            {[
              { x1: 250, y1: 250, x2: 250, y2: 30 },
              { x1: 250, y1: 250, x2: 440, y2: 125 },
              { x1: 250, y1: 250, x2: 385, y2: 440 },
              { x1: 250, y1: 250, x2: 115, y2: 440 },
              { x1: 250, y1: 250, x2: 60, y2: 125 },
            ].map((line, i) => (
              <line key={i} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="#AA412A" strokeWidth="0.4" opacity="0.12" />
            ))}

            <g>
              <circle cx="250" cy="250" r="45" fill="white" stroke="#AA412A" strokeWidth="1.5" />
              <text x="250" y="246" textAnchor="middle" className="text-xs font-bold" fill="#083241" fontSize="14" fontWeight="700">Yolo</text>
              <text x="250" y="262" textAnchor="middle" className="text-[9px] font-mono" fill="#AA412A60" fontSize="9">AI</text>
            </g>

            {nodes.map((node, i) => {
              const cx = parseFloat(node.x) / 100 * 500;
              const cy = parseFloat(node.y) / 100 * 500;
              const [first, ...rest] = node.label.split(" ");
              return (
                <g key={i}>
                  <circle cx={cx} cy={cy} r="3" fill="#AA412A" opacity="0.2" />
                  <circle cx={cx} cy={cy - 18} r="38" fill="white" stroke="#AA412A" strokeWidth="0.3" opacity="0.2" />
                  <text x={cx} y={cy - 22} textAnchor="middle" className="text-[8px]" fill="#2B2F3680" fontSize="8">{first}</text>
                  <text x={cx} y={cy - 12} textAnchor="middle" className="text-[8px]" fill="#2B2F3680" fontSize="8">{rest.join(" ")}</text>
                </g>
              );
            })}
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
