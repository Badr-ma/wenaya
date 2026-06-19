"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const sessions = [
  { title: "Yoga Prénatal", desc: "Méthode de Gasquet — postures adaptées à la grossesse", img: "/images/cours-ateliers/yoga.jpg" },
  { title: "Sophrologie", desc: "Ateliers collectifs de relaxation et de gestion du stress", img: "/images/cours-ateliers/wellness.jpg" },
  { title: "Nutrition", desc: "Cuisine saine et équilibrée — ateliers pratiques avec dégustation", img: "/images/cours-ateliers/nutrition.jpg" },
  { title: "Breathwork", desc: "Séances de respiration guidée et bains sonores", img: "/images/cours-ateliers/nature.jpg" },
  { title: "Jiu Jitsu Brésilien", desc: "Art martial brésilien — cours hebdomadaires tous niveaux", img: "/images/cours-ateliers/yoga.jpg" },
  { title: "Pilates & Posture", desc: "Renforcement musculaire doux et alignement postural", img: "/images/cours-ateliers/wellness.jpg" },
];

export default function CoursAteliers(): React.JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  const scroll = useCallback((dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = dir === "left" ? -280 : 280;
    el.scrollBy({ left: amount, behavior: "smooth" });
    setTimeout(updateArrows, 350);
  }, [updateArrows]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows);
    updateArrows();
    return () => el.removeEventListener("scroll", updateArrows);
  }, [updateArrows]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll(".ca-card"),
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.06, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 84%", toggleActions: "play none none none" },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="appointments-group" className="mx-auto w-full justify-between bg-[#377B89] p-8 md:flex md:space-x-4 xl:px-16 xl:pt-16 2xl:px-32">
      {/* Heading */}
      <div className="relative flex md:w-1/5 items-center text-gray-600 mb-6 md:mb-0">
        <div className="text-start">
          <h2 className="text-lg font-bold text-white md:text-2xl xl:text-3xl 2xl:text-4xl">
            <span className="text-[#BBDDE2]">Des </span>cours &amp; ateliers
            <br className="hidden md:block" />
            <span className="text-[#BBDDE2]"> adaptés à vos besoins</span>
          </h2>
          <a
            href="/seance-de-groupe"
            className="mt-4 inline-block font-medium text-white underline max-xl:text-sm max-lg:text-xs hover:text-[#BBDDE2] transition-colors"
          >
            Voir Plus
          </a>
        </div>
      </div>

      {/* Carousel */}
      <div className="overflow-hidden relative max-md:flex max-md:flex-col-reverse flex-1">
        {/* Arrows */}
        <div className="flex justify-center items-center px-5 py-4 space-x-2 w-full md:justify-end">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`top-1/4 z-10 h-10 w-10 rounded-xl text-lg inline-flex items-center justify-center rounded-full border transition-all duration-200 focus:outline-none ${
              canScrollLeft
                ? "bg-white text-[#377B89] border-neutral-200 hover:border-neutral-300 cursor-pointer"
                : "bg-gray-300 text-primary-default border-neutral-200 cursor-not-allowed"
            }`}
          >
            <svg stroke="currentColor" fill="currentColor" viewBox="0 0 24 24" height="1em" width="1em">
              <path d="M15.28 5.22a.75.75 0 0 1 0 1.06L9.56 12l5.72 5.72a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215l-6.25-6.25a.75.75 0 0 1 0-1.06l6.25-6.25a.75.75 0 0 1 1.06 0Z" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`top-1/4 z-10 h-10 w-10 rounded-xl text-lg inline-flex items-center justify-center rounded-full border transition-all duration-200 focus:outline-none ${
              canScrollRight
                ? "bg-white text-[#377B89] border-neutral-200 hover:border-neutral-300 cursor-pointer"
                : "bg-gray-300 text-primary-default border-neutral-200 cursor-not-allowed"
            }`}
          >
            <svg stroke="currentColor" fill="currentColor" viewBox="0 0 24 24" height="1em" width="1em">
              <path d="M8.72 18.78a.75.75 0 0 1 0-1.06L14.44 12 8.72 6.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018l6.25 6.25a.75.75 0 0 1 0 1.06l-6.25 6.25a.75.75 0 0 1-1.06 0Z" />
            </svg>
          </button>
        </div>

        {/* Cards */}
        <div className="overflow-hidden rounded-xl">
          <div ref={scrollRef} className="flex overflow-x-auto scroll-smooth no-scrollbar">
            {sessions.map((s, i) => (
              <div
                key={i}
                className="ca-card flex flex-col gap-2 mr-4 min-w-[220px] max-w-[220px] lg:min-w-[270px] lg:max-w-[270px] cursor-pointer group"
              >
                <div
                  className="rounded-3xl h-52 w-full bg-cover bg-center transition-all duration-500 group-hover:scale-[1.02]"
                  style={{ backgroundImage: `url(${s.img})` }}
                >
                  <div className="w-full h-full rounded-3xl bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="rounded-3xl h-16 w-full bg-white/10 backdrop-blur-sm flex items-center px-5">
                  <div>
                    <p className="text-white text-sm font-semibold leading-tight">{s.title}</p>
                    <p className="text-white/60 text-[10px] leading-tight mt-0.5">{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
