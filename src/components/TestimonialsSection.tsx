/**
 * Testimonials Section — stats bar (patients, satisfaction, disciplines, experience)
 * combined with a testimonials carousel. Stats animate on scroll, testimonials auto-rotate.
 * Features: GSAP animations, auto-play carousel with progress indicator dots.
 */
"use client";

import { useRef, useEffect, useCallback, type ReactNode } from "react";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";

type TestimonialItem = {
  type: "testimonial";
  quote: string;
  name: string;
  rating: number;
};

type AwardItem = {
  type: "award";
  title: string;
  subtitle: string;
};

type GridItem = TestimonialItem | AwardItem;

function TestimonialCard({ item }: { item: TestimonialItem }): React.JSX.Element {
  return (
    <div
      className="bg-white rounded-2xl border border-[rgba(184,138,90,0.1)] p-6 sm:p-8 transition-all duration-500 hover:border-[rgba(184,138,90,0.25)] hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: item.rating }).map((_, j) => (
          <svg key={j} className="w-5 h-5 text-[#B88A5A]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
      <p className="text-[#2B2F36] text-[15px] leading-relaxed">
        &ldquo;{item.quote}&rdquo;
      </p>
      <p className="text-[#0B1220] text-[14px] font-semibold mt-4">{item.name}</p>
    </div>
  );
}

function AwardCard({ item }: { item: AwardItem }): React.JSX.Element {
  return (
    <div
      className="rounded-2xl bg-[#ECE7DD] flex flex-col items-center justify-center p-6 sm:p-8 transition-all duration-400 group cursor-pointer"
      style={{ minHeight: "170px" }}
    >
      <span className="text-[#0B1220] font-heading font-bold text-2xl text-center leading-tight transition-all duration-300 group-hover:text-[#B88A5A]">
        {item.title}
      </span>
      <span className="text-[#2B2F36] text-sm text-center mt-2 max-w-[22ch] leading-relaxed transition-all duration-300 group-hover:text-[#2B2F36]/80">
        {item.subtitle}
      </span>
    </div>
  );
}

function GridCell({ children, className }: { children: ReactNode; className?: string }): React.JSX.Element {
  return <div className={`flex-1 flex flex-col gap-6 ${className ?? ""}`}>{children}</div>;
}

export default function TestimonialsSection(): React.JSX.Element {
  const { t } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const items: GridItem[] = [
    { type: "testimonial", quote: t("testimonialsSection.testimonial1.quote"), name: t("testimonialsSection.testimonial1.name"), rating: 5 },
    { type: "award", title: t("testimonialsSection.award1.stat"), subtitle: t("testimonialsSection.award1.label") },
    { type: "testimonial", quote: t("testimonialsSection.testimonial2.quote"), name: t("testimonialsSection.testimonial2.name"), rating: 5 },
    { type: "award", title: t("testimonialsSection.award2.stat"), subtitle: t("testimonialsSection.award2.label") },
    { type: "testimonial", quote: t("testimonialsSection.testimonial3.quote"), name: t("testimonialsSection.testimonial3.name"), rating: 5 },
    { type: "award", title: t("testimonialsSection.award3.stat"), subtitle: t("testimonialsSection.award3.label") },
    { type: "testimonial", quote: t("testimonialsSection.testimonial4.quote"), name: t("testimonialsSection.testimonial4.name"), rating: 5 },
    { type: "award", title: t("testimonialsSection.award4.stat"), subtitle: t("testimonialsSection.award4.label") },
  ];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];

      gsap.fromTo(
        [headingRef.current, ...cards],
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" } }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  const setRef = useCallback((i: number) => (el: HTMLDivElement | null) => { cardsRef.current[i] = el; }, []);

  return (
    <section ref={sectionRef} className="bg-[#F2EFE9] noise accent-top relative py-12 sm:py-24 px-6" id="avis-google">
      <div className="max-w-7xl mx-auto">
        <div ref={headingRef} className="flex flex-col items-center text-center mb-8 sm:mb-16 lg:mb-24">
          <h2 className="heading-serif text-4xl sm:text-5xl text-[#0B1220]">
            {t("testimonialsSection.heading1")}{" "}
<span style={{
  background: "linear-gradient(135deg, #B88A5A 0%, #C99B68 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}}>
  {t("testimonialsSection.heading2")}
</span>
          </h2>
          <p className="text-[#2B2F36]/55 text-sm sm:text-base mt-4 max-w-lg leading-relaxed">
            {t("testimonialsSection.sub")}
          </p>
        </div>

        <div className="hidden lg:flex gap-6 items-start">
          <GridCell>
            <div ref={setRef(0)}><TestimonialCard item={items[0] as TestimonialItem} /></div>
            <div ref={setRef(1)}><AwardCard item={items[1] as AwardItem} /></div>
          </GridCell>
          <GridCell className="mt-16">
            <div ref={setRef(3)}><AwardCard item={items[3] as AwardItem} /></div>
            <div ref={setRef(2)}><TestimonialCard item={items[2] as TestimonialItem} /></div>
          </GridCell>
          <GridCell>
            <div ref={setRef(4)}><TestimonialCard item={items[4] as TestimonialItem} /></div>
            <div ref={setRef(5)}><AwardCard item={items[5] as AwardItem} /></div>
          </GridCell>
          <GridCell className="mt-24">
            <div ref={setRef(7)}><AwardCard item={items[7] as AwardItem} /></div>
            <div ref={setRef(6)}><TestimonialCard item={items[6] as TestimonialItem} /></div>
          </GridCell>
        </div>

        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.map((item, i) => (
            <div key={i} ref={setRef(i)}>
              {item.type === "testimonial" ? <TestimonialCard item={item} /> : <AwardCard item={item} />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
