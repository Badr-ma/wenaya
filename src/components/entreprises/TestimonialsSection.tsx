/**
 * Testimonials — editorial client proof (testimonials.*) as a compact
 * single-quote carousel. Only the active testimonial is visible (navy card
 * with a large quote mark); the other two stay in the DOM as screen-reader-only
 * slides so their full text remains in SSR/SEO. Prev/next controls + a
 * 0X/0Y counter drive the swap; aria-live announces changes. The tt-head
 * eyebrow block is kept byte-identical. Restrained once-only GSAP entrance.
 */
"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";

const reducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

type Testimonial = { quote: string; author: string };

export default function TestimonialsSection() {
  const { t, tRaw } = useLocale();
  const items = tRaw<Testimonial[]>("entreprises.testimonials.items");
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const count = items.length;

  const prev = () => setActive((a) => (a - 1 + count) % count);
  const next = () => setActive((a) => (a + 1) % count);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".tt-head", { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      });
      gsap.fromTo(".tt-item", { opacity: 0, y: 18 }, {
        opacity: 1, y: 0, duration: 0.55, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
      });
    }, el);
    return () => ctx.revert();
  }, [count]);

  if (count === 0) return null;

  return (
    <section ref={sectionRef} className="relative bg-[#FAF8F4] py-9 sm:py-13 lg:py-16 px-6 overflow-hidden scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <div className="tt-head mx-auto max-w-2xl text-center mb-6 sm:mb-8">
          <span className="inline-flex items-center justify-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            <span className="w-8 h-px bg-[#B88A5A]/40" aria-hidden />
            {t("entreprises.testimonials.title")}
          </span>
          <h2 className="heading-serif text-[#0B1220] leading-[1.06]" style={{ fontSize: "clamp(1.75rem, 2.6vw, 2.2rem)" }}>
            {t("entreprises.testimonials.subtitle")}
          </h2>
        </div>

        <div className="tt-item mx-auto max-w-3xl">
          {items.map((tm, i) => {
            const isActive = active === i;
            return (
              <figure
                key={i}
                aria-hidden={!isActive}
                className={`${isActive ? "" : "sr-only"} ${isActive ? "py-10 sm:py-12 px-6 sm:px-10 bg-[#0B1220] rounded-[6px]" : ""}`}
              >
                <svg width="42" height="34" viewBox="0 0 42 34" fill="none" aria-hidden="true" className="text-[#D4A56A]">
                  <path d="M0 34V19.4C0 8.7 5.6 2.2 17.2 0v6.2c-4.6 1.3-7.4 3.9-8.4 7.9h8.4V34H0zm24.1 0V19.4C24.1 8.7 29.7 2.2 41.3 0v6.2c-4.6 1.3-7.4 3.9-8.4 7.9h8.4V34H24.1z" fill="currentColor" />
                </svg>
                <blockquote className="mt-6">
                  <p className="heading-serif text-white leading-[1.3] text-xl sm:text-2xl lg:text-[1.65rem] lg:leading-[1.35] max-w-3xl">
                    {tm.quote}
                  </p>
                </blockquote>
                <figcaption className="mt-6 text-sm font-medium text-white/70">{tm.author}</figcaption>
              </figure>
            );
          })}
        </div>

        {count > 1 && (
          <div className="mt-6 flex items-center justify-between mx-auto max-w-3xl" key={active} aria-live="polite">
            <span className="font-mono text-sm text-[#0B1220]/60 tracking-[0.1em]">
              {`0${active + 1}`} / {`0${count}`}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={prev}
                aria-label={t("entreprises.testimonials.prev")}
                className="flex size-10 items-center justify-center rounded-full border border-[#0B1220]/15 text-[#0B1220] transition-colors hover:border-[#B88A5A] hover:text-[#B88A5A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                onClick={next}
                aria-label={t("entreprises.testimonials.next")}
                className="flex size-10 items-center justify-center rounded-full border border-[#0B1220]/15 text-[#0B1220] transition-colors hover:border-[#B88A5A] hover:text-[#B88A5A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}