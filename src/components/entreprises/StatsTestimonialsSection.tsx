/**
 * Proof & Testimonials — full-bleed navy photo band with 3 typographic metrics
 * and a floating ivory panel holding the featured anonymized client voice
 * (the remaining voices stay in i18n data, not rendered). DR monogram tiles, no
 * photos of people. Subtle GSAP fade reveals; reduced-motion safe.
 */
"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "@/contexts/LanguageContext";

const BACKDROP =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=2400&q=100&auto=format&fit=crop";

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

/** First two letters of the leading all-caps role acronym ("DRH" → "DR"). */
function monogramOf(author: string): string {
  const token = author.match(/^[A-Z]{2,}/);
  return token ? token[0].slice(0, 2) : "W";
}

export default function StatsTestimonialsSection() {
  const { t, tRaw } = useLocale();
  const stats = tRaw<Array<{ value: string; label: string; source: string }>>("entreprises.stats.items");
  const band = tRaw<string>("entreprises.stats.band");
  const testimonials = tRaw<Array<{ quote: string; author: string }>>("entreprises.testimonials.items");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".st-head", { opacity: 0, y: 18 }, {
        opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      });
      gsap.fromTo(".st-metric", { opacity: 0, y: 16 }, {
        opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none none" },
      });
      gsap.fromTo(".st-panel", { opacity: 0, y: 26 }, {
        opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 66%", toggleActions: "play none none none" },
      });
      gsap.utils.toArray<HTMLElement>(".st-num").forEach((num) => {
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

  const [featured] = testimonials;

  return (
    <section ref={sectionRef} className="relative bg-[#0B1220] overflow-hidden" style={{ background: "#0B1220" }}>
      {/* Backdrop */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <Image
          src={BACKDROP}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(11,18,32,0.94) 0%, rgba(11,18,32,0.86) 40%, rgba(11,18,32,0.72) 72%, rgba(11,18,32,0.55) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(11,18,32,0.35) 0%, rgba(11,18,32,0.05) 55%, rgba(250,248,244,0.28) 100%)" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 sm:pt-24 lg:pt-28 pb-8 sm:pb-10">
        {/* Header */}
        <div className="st-head max-w-3xl">
          <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            <span className="w-8 h-px bg-[#B88A5A]/40" aria-hidden />
            {t("entreprises.testimonials.title")}
          </span>
          <h2
            className="heading-serif text-white"
            style={{ fontSize: "clamp(1.85rem, 3.4vw, 3.1rem)", fontWeight: 500, lineHeight: 1.05, letterSpacing: "-0.015em" }}
          >
            {t("entreprises.stats.title")}
          </h2>
        </div>

        {/* Metrics — typographic numerals */}
        <div className="st-head mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-8 sm:gap-y-0 sm:divide-x sm:divide-white/15">
          {stats.map((stat, i) => (
            <div key={i} className="st-metric sm:px-6 sm:first:pl-0 sm:last:pr-0">
              <p
                className="st-num text-white font-heading font-bold tracking-tight leading-none"
                data-target={stat.value}
                style={{ fontSize: "clamp(2.4rem, 4.4vw, 4rem)" }}
              >
                {stat.value}
              </p>
              <p className="text-white/85 text-[13px] sm:text-sm font-medium mt-3 leading-snug max-w-xs">{stat.label}</p>
              {stat.source ? (
                <p className="text-white/50 text-[10px] leading-snug mt-1.5">{stat.source}</p>
              ) : null}
            </div>
          ))}
        </div>

        {/* "Chez Wenaya" accent strip */}
        <div className="st-head mt-8 sm:mt-10 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B88A5A] shrink-0" aria-hidden />
          <p className="text-white/95 text-sm font-medium leading-snug">{band}</p>
        </div>

        {/* Floating ivory panel — static testimonials */}
        <div className="st-panel mt-12 sm:mt-16 md:-mb-24 rounded-t-[24px] md:rounded-[24px] bg-[#FAF8F4] shadow-[0_40px_120px_rgba(0,0,0,0.35)]">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-10 sm:py-14">
            {/* Featured quote */}
            {featured && (
              <figure className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
                <div className="w-14 h-14 rounded-2xl border border-[#B88A5A]/30 bg-[#B88A5A]/10 flex items-center justify-center shrink-0 mb-5 lg:mb-0">
                  <span className="text-[#B88A5A] font-heading font-bold text-xl tracking-wide">{monogramOf(featured.author)}</span>
                </div>
                <div className="min-w-0">
                  <blockquote
                    className="heading-serif text-[#0B1220]"
                    style={{ fontSize: "clamp(1.4rem, 2.5vw, 2.1rem)", fontWeight: 500, lineHeight: 1.28, letterSpacing: "-0.01em" }}
                  >
                    « {featured.quote} »
                  </blockquote>
                  <figcaption className="text-[#0B1220]/55 text-sm font-medium mt-4">{featured.author}</figcaption>
                </div>
              </figure>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}