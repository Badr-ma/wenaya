"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useLocale } from "@/contexts/LanguageContext";

const planKeys = ["plan1", "plan2", "plan3"];

export default function Pricing(): React.JSX.Element {
  const { t, tRaw } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const plans = planKeys.map((key, i) => ({
    name: t(`pricing.${key}.name`),
    price: t(`pricing.${key}.price`),
    description: t(`pricing.${key}.desc`),
    features: tRaw<string[]>(`pricing.${key}.features`),
    cta: t(`pricing.${key}.cta`),
    popular: i === 0,
    badge: i === 0 ? t("pricing.plan1.badge") : undefined,
  }));

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];

      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" } }
      );

      gsap.fromTo(
        cards,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" } }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#F2EFE9] py-10 sm:py-20 px-6" id="tarifs">
      <div className="max-w-5xl mx-auto">
        <div ref={headingRef} className="text-center mb-8 sm:mb-16">
          <span className="text-[#B88A5A] font-semibold text-sm tracking-widest uppercase">
            {t("pricing.eyebrow")}
          </span>
          <h2 className="heading-serif text-[clamp(2rem,4vw,3.5rem)] text-[#0B1220] mt-4">
            {t("pricing.heading")}
          </h2>
          <p className="text-[#2B2F36] text-sm sm:text-base mt-4 max-w-lg mx-auto">
            {t("pricing.sub")}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch gap-5 lg:gap-6 xl:gap-8">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              ref={(el) => { cardsRef.current[i] = el; }}
              className={`relative rounded-2xl p-8 border-2 flex flex-col transition-all duration-300 flex-1 ${
                plan.popular
                  ? "bg-[#E8E2D9] border-[#B88A5A] shadow-xl shadow-[rgba(184,138,90,0.10)] hover:shadow-2xl hover:shadow-[rgba(184,138,90,0.16)]"
                  : "bg-[#E8E2D9] border-[#0B1220]/[0.06] shadow-sm hover:shadow-md hover:border-[#B88A5A]/30 hover:-translate-y-0.5"
              }`}
            >
              {plan.popular && plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#B88A5A] text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                  {plan.badge}
                </div>
              )}
              <h3 className="text-xl font-heading font-bold text-[#0B1220]">
                {plan.name}
              </h3>
              <div className="mt-3 mb-1">
                <span className="text-3xl font-heading font-bold text-[#0B1220]">
                  {plan.price}
                </span>
              </div>
              <p className="text-sm text-[#2B2F36] mb-6">{plan.description}</p>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feat) => (
                  <li
                    key={feat}
                    className="text-sm text-[#2B2F36] flex items-start gap-2.5"
                  >
                    <svg
                      className="w-4 h-4 text-[#B88A5A] mt-0.5 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    {feat}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className={`block text-center text-sm font-semibold py-3.5 rounded-full transition-all duration-300 ${
                  plan.popular
                    ? "bg-[#B88A5A] hover:bg-[#A07848] text-white hover:shadow-lg hover:shadow-[rgba(184,138,90,0.25)]"
                    : "bg-[#0B1220] hover:bg-[#2B2F36] text-white"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
