"use client";

import { useRef, useEffect, useCallback, type ReactNode } from "react";
import { gsap } from "gsap";

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

const items: GridItem[] = [
  {
    type: "testimonial",
    quote: "Je suis venue pour des douleurs chroniques au dos et l'équipe de kinésithérapie et d'ostéopathie de Wenaya Clinic Casablanca m'a redonné une qualité de vie que je n'espérais plus. Le suivi coordonné entre praticiens fait toute la différence.",
    name: "Fatima Z.",
    rating: 5,
  },
  { type: "award", title: "99%", subtitle: "de nos patients recommandent Wenaya Clinic à leur entourage" },
  {
    type: "testimonial",
    quote: "Mon enfant a été suivi en psychomotricité et orthophonie chez Wenaya. Les progrès en quelques mois ont dépassé nos attentes. Une équipe pluridisciplinaire remarquable à Casablanca pour la prise en charge des troubles de l'apprentissage.",
    name: "Karim B.",
    rating: 5,
  },
  { type: "award", title: "+148", subtitle: "avis Google 5 étoiles — la confiance de nos patients" },
  {
    type: "testimonial",
    quote: "Je consulte en psychologie et nutrition chez Wenaya depuis six mois. L'approche globale qui lie santé mentale et alimentation est exactement ce dont j'avais besoin. Les locaux sont modernes et l'accueil est chaleureux au centre de Casablanca.",
    name: "Nadia R.",
    rating: 5,
  },
  { type: "award", title: "9 spécialités", subtitle: "kinésithérapie, ostéopathie, psychologie, nutrition, orthophonie et plus en un seul lieu" },
  {
    type: "testimonial",
    quote: "Les séances d'ostéopathie avec Khalid Ouazzani m'ont soulagé d'une lombalgie chronique qui durait depuis deux ans. La qualité des soins et l'écoute sont exceptionnelles. Wenaya est bien plus qu'un simple cabinet : c'est un véritable centre de santé intégré.",
    name: "Youssef L.",
    rating: 5,
  },
  { type: "award", title: "6j/7", subtitle: "ouvert du lundi au samedi de 8h à 20h à Casablanca" },
];

function TestimonialCard({ item }: { item: TestimonialItem }): React.JSX.Element {
  return (
    <div
      className="bg-white rounded-2xl border border-[rgba(184,138,90,0.1)] p-8 transition-all duration-500 hover:border-[rgba(184,138,90,0.25)] hover:shadow-md hover:-translate-y-0.5"
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
      className="rounded-2xl bg-[#ECE7DD] flex flex-col items-center justify-center p-8 transition-all duration-400 group cursor-pointer"
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
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

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
    <section ref={sectionRef} className="bg-[#F2EFE9] noise accent-top relative py-20 sm:py-24 px-6" id="avis-google">
      <div className="max-w-7xl mx-auto">
        <div ref={headingRef} className="flex justify-center text-center mb-12 sm:mb-16 lg:mb-24">
          <h2 className="heading-serif text-4xl sm:text-5xl text-[#0B1220]">
            Ils nous font confiance
          </h2>
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
