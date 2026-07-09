"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "@/contexts/LanguageContext";

const portraitImages = [
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=100",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=100",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=100",
];

function animateCounter(el: HTMLElement, target: string) {
  const num = parseInt(target.replace(/\D/g, ""));
  if (!num) return;
  const suffix = target.replace(/[\d,.]/g, "");
  const prefix = target.includes("+") ? "+" : "";
  gsap.fromTo(el, { textContent: 0 }, {
    textContent: num, duration: 2.2, ease: "power2.out", snap: { textContent: 1 },
    onUpdate() { el.textContent = prefix + Math.round(Number(el.textContent)) + suffix; },
  });
}

function StatsSection() {
  const { t, tRaw } = useLocale();
  const stats = tRaw<Array<{ value: string; label: string; source: string }>>("entreprises.stats.items");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".st-reveal", { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      });
      gsap.utils.toArray<HTMLElement>(".stat-num").forEach((num) => {
        const target = num.getAttribute("data-target") || num.textContent || "";
        ScrollTrigger.create({
          trigger: num,
          start: "top 90%",
          onEnter: () => animateCounter(num, target),
          once: true,
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#0B1220] py-6 sm:py-8 px-6 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=3840&q=100"
          alt=""
          fill
          className="object-cover opacity-[0.06]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1220] via-[#0B1220]/95 to-[#0B1220]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="st-reveal max-w-2xl mb-4">
          <span className="inline-flex items-center gap-2 text-[#B88A5A] text-[9px] font-semibold tracking-[0.2em] uppercase mb-1">
            <span className="w-5 h-px bg-[#B88A5A]/40" />
            {t("entreprises.stats.title")}
          </span>
          <h2 className="heading-serif text-white text-[clamp(0.8rem, 1.3vw, 1rem)] mt-1 leading-snug font-medium">
            {t("entreprises.stats.desc")}
          </h2>
        </div>

        <div className="st-reveal grid sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((stat, i) => (
            <div key={i}>
              <div className="flex items-baseline gap-2">
                <p className="stat-num text-white font-heading font-bold tracking-tight leading-none" data-target={stat.value} style={{ fontSize: "clamp(1.1rem, 2vw, 1.6rem)" }}>
                  {stat.value}
                </p>
                <p className="text-white/50 text-[10px] leading-none">{stat.label}</p>
              </div>
              <p className="text-white/15 text-[7px] mt-0.5 tracking-wide">{stat.source}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const { t, tRaw } = useLocale();
  const testimonials = tRaw<Array<{ quote: string; author: string }>>("entreprises.testimonials.items");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".tm-reveal", { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#F2EFE9] py-20 sm:py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="tm-reveal max-w-2xl mb-16 sm:mb-20">
          <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase mb-5">
            <span className="w-8 h-px bg-[#B88A5A]/40" />
            {t("entreprises.testimonials.title")}
          </span>
          <h2 className="heading-serif text-[#0B1220] text-[clamp(2rem, 4vw, 3.5rem)] leading-[1.06]">
            {t("entreprises.testimonials.subtitle")}
          </h2>
        </div>

        <div className="space-y-16 sm:space-y-20">
          {testimonials.map((item, i) => (
            <div key={i} className="tm-reveal grid lg:grid-cols-5 gap-6 lg:gap-10">
              <div className="lg:col-span-1">
                <span className="text-[#B88A5A]/20 font-serif text-[8rem] sm:text-[10rem] leading-none block -mt-6 lg:-mt-10 select-none">
                  &ldquo;
                </span>
              </div>
              <div className="lg:col-span-3">
                <blockquote className="text-[#2B2F36]/70 text-base sm:text-lg lg:text-xl leading-relaxed font-light tracking-wide">
                  {item.quote}
                </blockquote>
                <div className="flex items-center gap-4 mt-6">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-white/60">
                    <Image
                      src={portraitImages[i % portraitImages.length]}
                      alt={item.author}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <span className="text-[#2B2F36]/40 text-sm font-medium">{item.author}</span>
                </div>
              </div>
              <div className="hidden lg:block lg:col-span-1">
                <div className="w-px h-full bg-[#B88A5A]/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function StatsTestimonialsSection() {
  return (
    <>
      <StatsSection />
      <TestimonialsSection />
    </>
  );
}
