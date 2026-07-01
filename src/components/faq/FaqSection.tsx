"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";
import HiggsField from "../HiggsField";

interface FaqItem {
  q: string;
  a: string;
}

export default function FaqSection(): React.JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useLocale();
  const faqData: FaqItem[] = [];
  for (let i = 1; i <= 14; i++) {
    faqData.push({ q: t("faq.q" + i + ".q"), a: t("faq.q" + i + ".a") });
  }
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl
        .fromTo(headingRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8 })
        .fromTo(subRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4");

      if (listRef.current) {
        const items = listRef.current.querySelectorAll(".faq-item");
        gsap.fromTo(items, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, scrollTrigger: { trigger: listRef.current, start: "top 80%" } });
      }
    }, el);

    return () => ctx.revert();
  }, []);

  const toggle = (i: number): void => setOpenIndex(openIndex === i ? null : i);

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-[#F2EFE9]">
      <HiggsField />

      <div className="relative z-10 pt-40 pb-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 ref={headingRef} className="heading-serif text-[clamp(2.5rem,5vw,4.5rem)] text-[#0B1220]">
            {t("faq.heading1")}{" "}
<span style={{
  background: "linear-gradient(135deg, #B88A5A 0%, #C99B68 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}}>
  {t("faq.heading2")}
</span>
          </h1>
          <p ref={subRef} className="mt-4 sm:mt-5 text-[clamp(0.95rem,2vw,1.15rem)] text-[#0B1220]/60 leading-relaxed max-w-xl mx-auto">
            {t("faq.sub")}
          </p>
        </div>

        <div ref={listRef} className="max-w-2xl mx-auto mt-14 space-y-3">
          {faqData.map((item, i) => (
            <div key={i} className="faq-item">
              <button
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
                className="w-full flex items-center justify-between gap-4 text-left p-5 sm:p-6 rounded-xl bg-[#E8E2D9] border border-[#0B1220]/[0.06] hover:border-[#B88A5A]/30 transition-all duration-300 group"
              >
                <span className="text-[#0B1220] font-heading font-semibold text-[clamp(0.9rem,1.5vw,1rem)] leading-snug">
                  {item.q}
                </span>
                <svg
                  className={`w-4 h-4 shrink-0 text-[#B88A5A] transition-transform duration-300 ${openIndex === i ? "rotate-45" : ""}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === i ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
              >
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3 text-[#0B1220]/70 text-sm sm:text-base leading-relaxed">
                  {item.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
