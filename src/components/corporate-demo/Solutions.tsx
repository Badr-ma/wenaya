"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useLocale } from "@/contexts/LanguageContext";
import { useIntersectionDeferred } from "@/hooks/useDeferredSetup";

const accents = ["#1A6B52", "#B88A5A", "#2563EB", "#7C3AED"];
const images = [
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1600&q=80",
  "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=1600&q=80",
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1600&q=80",
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&q=80",
];

export default function DemoSolutions() {
  const { tRaw } = useLocale();
  const tabs = tRaw<Array<{ title: string; intro: string; services: string[] }>>("entreprises.expertises.tabs");
  const sectionRef = useRef<HTMLElement>(null);
  const { elRef, ready } = useIntersectionDeferred("100px 0px");
  const prefersReduced = useRef(false);

  useEffect(() => {
    prefersReduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (!ready) return;
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(".sol-eyebrow", { opacity: 0, y: 16, duration: 0.5, ease: "power3.out", immediateRender: false,
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
      });

      gsap.utils.toArray<HTMLElement>(".sol-chapter").forEach((ch) => {
        gsap.fromTo(ch.querySelector(".sol-img"), { clipPath: "inset(0 100% 0 0)" }, {
          clipPath: "inset(0 0% 0 0)", duration: 1, ease: "power3.inOut",
          scrollTrigger: { trigger: ch, start: "top 70%", toggleActions: "play none none none" },
        });
        gsap.from(ch.querySelector(".sol-text"), { opacity: 0, x: 40, duration: 0.7, ease: "power3.out", immediateRender: false,
          scrollTrigger: { trigger: ch, start: "top 65%", toggleActions: "play none none none" },
        });
        gsap.from(ch.querySelectorAll(".sol-service"), { opacity: 0, y: 12, duration: 0.4, stagger: 0.06, ease: "power3.out", immediateRender: false,
          scrollTrigger: { trigger: ch, start: "top 60%", toggleActions: "play none none none" },
        });
      });
    }, el);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={(el) => { sectionRef.current = el; elRef.current = el; }}
      className="relative bg-[#F2EFE9] overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 pt-24 sm:pt-32 pb-16">
        <div className="max-w-7xl mx-auto">
          <span className="sol-eyebrow inline-flex items-center gap-4 text-[#B88A5A] text-xs font-semibold tracking-[0.25em] uppercase">
            <span className="w-10 h-px bg-[#B88A5A]/50" />
            {tRaw<string>("entreprises.expertises.title")}
          </span>
          <h2
            className="heading-serif text-[#0B1220] mt-6"
            style={{ fontSize: "clamp(2rem, 4.5vw, 4rem)", lineHeight: 1.08 }}
            dangerouslySetInnerHTML={{
              __html: tRaw<string>("entreprises.expertises.heading").replace(
                /<gradient>(.*?)<\/gradient>/,
                '<span class="text-transparent bg-clip-text" style="background-image: linear-gradient(135deg, #B88A5A 0%, #D4A574 100%)">$1</span>'
              ),
            }}
          />
        </div>
      </div>

      {/* Editorial chapters */}
      <div className="space-y-0">
        {tabs.map((tab, i) => (
          <div
            key={i}
            className="sol-chapter relative min-h-[70vh] flex items-center"
          >
            <div className="max-w-7xl mx-auto px-6 w-full">
              <div className={`grid lg:grid-cols-2 gap-10 lg:gap-20 items-center ${i % 2 === 1 ? "lg:[direction:rtl]" : ""}`}>
                {/* Image */}
                <div className="sol-img overflow-hidden relative aspect-[4/3] lg:aspect-[3/2]" style={{ clipPath: "inset(0 100% 0 0)" }}>
                  <Image
                    src={images[i]}
                    alt={tab.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-0" style={{ backgroundColor: `${accents[i]}10` }} />
                </div>

                {/* Text content */}
                <div className="sol-text lg:[direction:ltr]">
                  <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: accents[i] }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3
                    className="text-[#0B1220] font-serif font-medium mt-4"
                    style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)", lineHeight: 1.1 }}
                  >
                    {tab.title}
                  </h3>
                  <p className="text-[#2B2F36]/50 text-base leading-relaxed mt-5 max-w-lg">
                    {tab.intro}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {tab.services.map((service, si) => (
                      <li key={si} className="sol-service flex items-start gap-3 text-[#2B2F36]/55 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: accents[i] }} />
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Subtle divider */}
            {i < tabs.length - 1 && (
              <div className="absolute bottom-0 left-6 right-6 h-px bg-[#0B1220]/[0.04]" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
