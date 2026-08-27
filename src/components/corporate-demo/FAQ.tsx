"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";

function FaqItem({ q, a, isOpen, onClick, id }: { q: string; a: string; isOpen: boolean; onClick: () => void; id: string }) {
  const answerId = `${id}-answer`;
  return (
    <div className="border-b border-[#0B1220]/[0.06] last:border-b-0">
      <button
        onClick={onClick}
        aria-expanded={isOpen}
        aria-controls={answerId}
        id={id}
        className="w-full flex items-center justify-between py-6 sm:py-7 text-left gap-4 group"
      >
        <span className="text-[#0B1220] font-serif flex-1 transition-colors group-hover:text-[#B88A5A]" style={{ fontSize: "clamp(1rem, 2vw, 1.35rem)", lineHeight: 1.3 }}>
          {q}
        </span>
        <svg
          className={`w-5 h-5 shrink-0 text-[#B88A5A] transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            id={answerId}
            role="region"
            aria-labelledby={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-[#2B2F36]/45 text-sm sm:text-base leading-relaxed pb-7 max-w-2xl">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DemoFAQ() {
  const { tRaw } = useLocale();
  const items = tRaw<Array<{ q: string; a: string }>>("entreprises.faq.items");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { elRef, ready } = useIntersectionDeferred("100px 0px");

  useEffect(() => {
    if (!ready) return;
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(".fq-head", { opacity: 0, y: 16, duration: 0.5, ease: "power3.out", immediateRender: false,
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      });
    }, el);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={(el) => { sectionRef.current = el; elRef.current = el; }}
      className="relative bg-[#F2EFE9] py-24 sm:py-36 px-6 overflow-hidden"
    >
      <div className="max-w-3xl mx-auto">
        <div className="fq-head mb-16">
          <span className="inline-flex items-center gap-4 text-[#B88A5A] text-xs font-semibold tracking-[0.25em] uppercase">
            <span className="w-10 h-px bg-[#B88A5A]/50" />
            {tRaw<string>("entreprises.faq.title")}
          </span>
        </div>

        <div>
          {items.map((item, i) => (
            <FaqItem
              key={i}
              id={`faq-${i}`}
              q={item.q}
              a={item.a}
              isOpen={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
