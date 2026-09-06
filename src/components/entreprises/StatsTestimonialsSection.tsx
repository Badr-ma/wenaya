/**
 * Proof — compact 3-layer evidence band: 4 key metrics in one row, a measured
 * impact strip, then a tight editorial testimonial line. One band, no nested
 * section padding, no cards — subtle dividers only. Bronze gradient preserved.
 */
"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "@/contexts/LanguageContext";

const portraitImages = [
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=100",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=100",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=100",
];

const reducedMotion =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

function animateCounter(el: HTMLElement, target: string) {
  const firstDigit = target.search(/\d/);
  const chars = Array.from(target);
  let lastDigit = -1;
  chars.forEach((ch, i) => { if (/\d/.test(ch)) lastDigit = i; });
  if (firstDigit < 0 || lastDigit < 0) { el.textContent = target; return; }
  const prefix = target.slice(0, firstDigit);
  const rawNum = target.slice(firstDigit, lastDigit + 1);
  const suffix = target.slice(lastDigit + 1);
  const num = parseInt(rawNum.replace(/[^0-9]/g, ""), 10);
  if (!num) { el.textContent = target; return; }
  const sepMatch = rawNum.match(/\D/);
  const sep = sepMatch ? sepMatch[0] : "";
  const format = (n: number) => {
    let s = String(n);
    if (sep) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
    return s;
  };
  gsap.fromTo(el, { textContent: 0 }, {
    textContent: num, duration: 1.8, ease: "power2.out", snap: { textContent: 1 },
    onUpdate() { el.textContent = prefix + format(Math.round(Number(el.textContent))) + suffix; },
  });
}

export default function StatsTestimonialsSection() {
  const { t, tRaw } = useLocale();
  const stats = tRaw<Array<{ value: string; label: string; source: string }>>("entreprises.stats.items");
  const impact = tRaw<Array<{ value: string; label: string; source: string }>>("entreprises.stats.impact");
  const testimonials = tRaw<Array<{ quote: string; author: string }>>("entreprises.testimonials.items");
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".pf-reveal", { opacity: 0, y: 16 }, {
        opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      });
      gsap.utils.toArray<HTMLElement>(".stat-num").forEach((num) => {
        const target = num.getAttribute("data-target") || num.textContent || "";
        ScrollTrigger.create({
          trigger: num,
          start: "top 94%",
          onEnter: () => animateCounter(num, target),
          once: true,
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const slideTo = (i: number) => setActive((i + testimonials.length) % testimonials.length);
  const item = testimonials[active];

  const arrowBtn =
    "inline-flex items-center justify-center w-8 h-8 rounded-full border border-white/30 text-white/70 hover:border-white/70 hover:text-white transition-colors duration-200";

  return (
    <section ref={sectionRef} className="relative overflow-hidden" style={{ background: "linear-gradient(165deg, #D4A56A 0%, #C99B5E 25%, #B88A5A 50%, #A07848 80%, #8E6A3E 100%)" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0.06) 55%, transparent 70%)" }} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="max-w-7xl mx-auto relative z-10 py-6 sm:py-7 lg:py-8 px-6">

        {/* LAYER 1 — 4 key metrics in one compact row (2×2 on mobile) */}
        <div className="pf-reveal grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5 lg:gap-x-0 lg:divide-x lg:divide-white/15">
          {stats.map((stat, i) => (
            <div key={i} className="lg:px-5 lg:first:pl-0 lg:last:pr-0">
              <div className="flex flex-col">
                <p className="stat-num text-white font-heading font-bold tracking-tight leading-none" data-target={stat.value} style={{ fontSize: "clamp(1.7rem, 2.5vw, 2.8rem)" }}>
                  {stat.value}
                </p>
                <p className="text-white/85 text-xs sm:text-[13px] font-medium mt-1.5 leading-snug">{stat.label}</p>
                {stat.source ? (
                  <p className="text-white/55 text-[10px] leading-snug mt-1">{stat.source}</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        {/* LAYER 2 — measured impact: heading left, two compact stats right */}
        <div className="pf-reveal mt-4 lg:mt-5 pt-4 border-t border-white/15">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-8">
            <p className="text-white/70 text-[10px] font-semibold tracking-[0.18em] uppercase leading-snug lg:w-44 lg:shrink-0">
              {t("entreprises.stats.impactTitle")}
            </p>
            <div className="sm:grid sm:grid-cols-2 sm:divide-x sm:divide-white/15 sm:gap-0 gap-y-4 flex-1">
              {impact.map((stat, i) => (
                <div key={i} className="sm:px-6 sm:first:pl-0 sm:last:pr-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-white font-heading font-bold tracking-tight leading-none" style={{ fontSize: "clamp(1.5rem, 1.9vw, 2.1rem)" }}>
                      {stat.value}
                    </span>
                    <span className="text-white/90 text-xs sm:text-[13px] font-medium">{stat.label}</span>
                  </div>
                  <p className="text-white/55 text-[10px] leading-snug mt-1">{stat.source}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LAYER 3 — compact editorial testimonial; carousel kept, tiny controls */}
        <div
          className="pf-reveal mt-4 lg:mt-5 pt-4 border-t border-white/15"
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchX.current == null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > 48) slideTo(dx < 0 ? active + 1 : active - 1);
          }}
        >
          {/* desktop — image | quote+author | controls */}
          <div className="hidden lg:flex lg:items-center gap-8">
            <div className="relative w-[104px] h-[104px] rounded-2xl overflow-hidden shrink-0">
              <Image src={portraitImages[active % portraitImages.length]} alt="" fill className="object-cover" sizes="104px" />
            </div>
            <div className="flex-1 min-w-0">
              <blockquote className="text-white/90 text-base leading-relaxed lg:line-clamp-3">{item.quote}</blockquote>
              <p className="text-white font-medium text-sm mt-1.5">{item.author}</p>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <p className="text-white/60 text-xs tabular-nums">
                {active + 1} / {testimonials.length}
              </p>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => slideTo(active - 1)} aria-label={t("entreprises.testimonials.prev")} className={arrowBtn}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <button type="button" onClick={() => slideTo(active + 1)} aria-label={t("entreprises.testimonials.next")} className={arrowBtn}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`${t("entreprises.testimonials.title")} ${i + 1}`}
                    aria-current={i === active}
                    className={
                      i === active
                        ? "w-5 h-[3px] rounded-full bg-white transition-all duration-300"
                        : "w-3 h-[3px] rounded-full bg-white/30 hover:bg-white/50 transition-all duration-300"
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          {/* mobile — image+author row, quote, controls */}
          <div className="lg:hidden">
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                <Image src={portraitImages[active % portraitImages.length]} alt="" fill className="object-cover" sizes="64px" />
              </div>
              <div className="min-w-0">
                <p className="text-white font-medium text-sm leading-tight">{item.author}</p>
                <p className="text-white/60 text-xs tabular-nums mt-0.5">
                  {active + 1} / {testimonials.length}
                </p>
              </div>
            </div>
            <blockquote className="text-white/90 text-[13px] sm:text-sm leading-relaxed line-clamp-3 mt-3">{item.quote}</blockquote>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1.5">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`${t("entreprises.testimonials.title")} ${i + 1}`}
                    aria-current={i === active}
                    className={
                      i === active
                        ? "w-5 h-[3px] rounded-full bg-white transition-all duration-300"
                        : "w-3 h-[3px] rounded-full bg-white/30 hover:bg-white/50 transition-all duration-300"
                    }
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => slideTo(active - 1)} aria-label={t("entreprises.testimonials.prev")} className={arrowBtn}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <button type="button" onClick={() => slideTo(active + 1)} aria-label={t("entreprises.testimonials.next")} className={arrowBtn}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}