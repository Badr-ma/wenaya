/**
 * Proof — combined compact section: key corporate metrics + impact row, then a
 * single active client testimonial in the same band. No separate giant block:
 * the testimonial becomes a tight proof line beneath the stats.
 */
"use client";

import { useRef, useState, useEffect, useCallback } from "react";
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
    textContent: num, duration: 2.2, ease: "power2.out", snap: { textContent: 1 },
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
      gsap.fromTo(".pf-reveal", { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      });
      gsap.utils.toArray<HTMLElement>(".stat-num").forEach((num) => {
        const target = num.getAttribute("data-target") || num.textContent || "";
        ScrollTrigger.create({
          trigger: num,
          start: "top 92%",
          onEnter: () => animateCounter(num, target),
          once: true,
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const slideTo = useCallback((i: number) => setActive((i + testimonials.length) % testimonials.length), [testimonials.length]);
  const item = testimonials[active];

  const arrowBtn =
    "inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#0B1220]/25 text-[#0B1220] hover:border-[#B88A5A] hover:text-[#B88A5A] transition-colors duration-200";

  return (
    <section ref={sectionRef} className="relative overflow-hidden" style={{ background: "linear-gradient(165deg, #D4A56A 0%, #C99B5E 25%, #B88A5A 50%, #A07848 80%, #8E6A3E 100%)" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0.06) 55%, transparent 70%)" }} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="max-w-7xl mx-auto relative z-10 py-14 sm:py-20 px-6">

        <div className="pf-reveal grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
          {stats.map((stat, i) => (
            <div key={i} className="relative">
              <div className="flex flex-col">
                <p className="stat-num text-white font-heading font-bold tracking-tight leading-none" data-target={stat.value} style={{ fontSize: "clamp(1.85rem, 3.8vw, 3.05rem)" }}>
                  {stat.value}
                </p>
                <p className="text-white/85 text-xs sm:text-sm font-medium mt-2 leading-snug">{stat.label}</p>
                {stat.source ? (
                  <div className="mt-3 pt-3 border-t border-white/25">
                    <p className="text-white/55 text-[10px] leading-relaxed">{stat.source}</p>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <div className="pf-reveal mt-9 pt-6 border-t border-white/30">
          <p className="text-white/70 text-[11px] font-semibold tracking-[0.18em] uppercase mb-4">
            {t("entreprises.stats.impactTitle")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {impact.map((stat, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="flex items-baseline gap-3">
                  <span className="text-white font-heading font-bold tracking-tight leading-none" style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)" }}>
                    {stat.value}
                  </span>
                  <span className="text-white/90 text-sm font-medium">{stat.label}</span>
                </div>
                <p className="text-white/55 text-[10px] leading-relaxed">{stat.source}</p>
              </div>
            ))}
          </div>
        </div>

        {/* single active testimonial — compact proof line */}
        <div
          className="pf-reveal mt-10 sm:mt-12 pt-8 border-t border-white/25"
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchX.current == null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > 48) slideTo(dx < 0 ? active + 1 : active - 1);
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <blockquote className="relative text-white/95 text-lg sm:text-xl lg:text-[1.4rem] leading-[1.35] font-light tracking-tight lg:max-w-3xl" style={{ paddingLeft: "3.5rem" }}>
              <span className="pointer-events-none absolute -top-4 left-0 text-white/25 font-serif text-[5rem] leading-none select-none" aria-hidden="true">
                &ldquo;
              </span>
              {item.quote}
            </blockquote>

            <div className="lg:w-[15rem] shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white/40">
                  <Image src={portraitImages[active % portraitImages.length]} alt="" fill className="object-cover" sizes="48px" />
                </div>
                <div>
                  <p className="text-white text-sm sm:text-base font-semibold">{item.author}</p>
                  <p className="text-white/60 text-xs mt-0.5 tabular-nums">
                    {active + 1} / {testimonials.length}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <button type="button" onClick={() => slideTo(active - 1)} aria-label={t("entreprises.testimonials.prev")} className={arrowBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <button type="button" onClick={() => slideTo(active + 1)} aria-label={t("entreprises.testimonials.next")} className={arrowBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <div className="flex items-center gap-1.5 ml-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActive(i)}
                      aria-label={`${t("entreprises.testimonials.title")} ${i + 1}`}
                      aria-current={i === active}
                      className={
                        i === active
                          ? "w-6 h-[3px] rounded-full bg-white transition-all duration-300"
                          : "w-4 h-[3px] rounded-full bg-white/30 hover:bg-white/50 transition-all duration-300"
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
