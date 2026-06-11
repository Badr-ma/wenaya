"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const partners = [
  {
    name: "Institut Pasteur",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=400&fit=crop",
    logo: "PASTEUR",
  },
  {
    name: "Hôpital Européen",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop",
    logo: "HEGP",
  },
  {
    name: "Genomic Lab",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&h=400&fit=crop",
    logo: "GENOMIC",
  },
  {
    name: "Swiss BioTech",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=400&fit=crop",
    logo: "SWISS BIO",
  },
];

export default function Partners() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" } }
      );

      const items = gridRef.current?.children;
      if (items) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none none" } }
        );
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#F2EFE9] py-24 sm:py-28 px-6" id="partenaires">
      <div className="max-w-[1440px] mx-auto">
        <div ref={headingRef} className="flex justify-center text-center mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[#0B1220] leading-[1.1] tracking-tight">
            Nos partenaires de confiance
          </h2>
        </div>

        <div ref={gridRef} className="grid grid-cols-4 max-md:grid-cols-2 max-sm:grid-cols-1 gap-8">
          {partners.map((partner) => (
            <div key={partner.name} className="flex flex-col gap-6">
              <div className="relative w-full aspect-[3/2] overflow-hidden rounded-xl bg-[#FAF8F4]">
                <img
                  src={partner.image}
                  alt={partner.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#0B1220]/0 hover:bg-[#0B1220]/20 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center">
                <span className="text-[#B88A5A] font-heading font-bold text-sm tracking-[0.2em]">
                  {partner.logo}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
