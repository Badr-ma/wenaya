"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const audiences = [
  {
    title: "PME & ETI",
    subtitle: "10 – 500 collaborateurs",
    desc: "Programmes clé en main, flexibles et adaptés à votre budget. Offrez à vos équipes un avantage santé sans complexité.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-6 h-6" fill="none">
        <path d="M12 38V14l12-8 12 8v24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="18" y="24" width="12" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 38h32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Grands Groupes",
    subtitle: "500+ collaborateurs",
    desc: "Déploiement multi-sites, reporting consolidé, comité de pilotage dédié. Une approche sur mesure avec indicateurs d'impact.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-6 h-6" fill="none">
        <rect x="6" y="10" width="36" height="28" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M16 10V6h16v4M20 22l4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Cabinets de conseil RH",
    subtitle: "Partenaires stratégiques",
    desc: "Co-construisez des programmes bien-être pour vos clients. Expertise terrain, plateforme digitale et supports white-label.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-6 h-6" fill="none">
        <circle cx="24" cy="16" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 40c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

const offers = [
  {
    title: "Adapté à vos horaires",
    desc: "Sessions courtes en pause déj, formats matinaux, fin de journée ou journées complètes.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-5 h-5" fill="none">
        <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="1.5" />
        <path d="M24 14v10l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Anonyme et confidentiel",
    desc: "Cellules d'écoute individuelles, données agrégées et anonymisées.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-5 h-5" fill="none">
        <rect x="8" y="18" width="32" height="24" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M16 18V12a8 8 0 0116 0v6" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="24" cy="30" r="3" fill="currentColor" opacity="0.4" />
      </svg>
    ),
  },
  {
    title: "À la carte ou en programme",
    desc: "Du séminaire ponctuel au parcours annuel. Composez votre offre ou choisissez un pack prêt à l'emploi.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-5 h-5" fill="none">
        <rect x="10" y="8" width="28" height="32" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M18 18h12M18 26h8M18 34h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
  },
  {
    title: "Présentiel et digital",
    desc: "Interventions en entreprise, en centre Wenaya et plateforme digitale.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-5 h-5" fill="none">
        <rect x="6" y="6" width="36" height="24" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M18 34h12M24 30v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Reporting d'impact",
    desc: "Indicateurs anonymisés, bilan trimestriel et recommandations actionnables.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-5 h-5" fill="none">
        <path d="M10 38V16l8-4 12 8 8-4v22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 24v10M28 20v14M38 16v18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Support dédié",
    desc: "Un interlocuteur unique pour le déploiement, des outils clés en main et un suivi continu.",
    icon: (
      <svg viewBox="0 0 48 48" className="w-5 h-5" fill="none">
        <path d="M24 6c-8.837 0-16 5.373-16 12 0 3.708 2.087 7.047 5.333 9.333L12 38l6.667-4.667A18.27 18.27 0 0024 34c8.837 0 16-5.373 16-12S32.837 6 24 6z" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
];

const themes = [
  { title: "Prévention des TMS et ergonomie", desc: "Réduire l'absentéisme lié aux douleurs physiques (TMS, lombalgies, tendinites)." },
  { title: "Nutrition et bien-être alimentaire", desc: "Améliorer concentration, énergie et santé long terme au travail." },
  { title: "Gestion du stress et prévention du burnout", desc: "Diminuer l'épuisement professionnel et renforcer la résilience." },
  { title: "Développement personnel et équilibre vie pro/perso", desc: "Prévenir les risques psychosociaux et nourrir l'engagement." },
  { title: "Cohésion d'équipe et leadership", desc: "Renforcer la collaboration, la communication et le management bienveillant." },
];

const partners = [
  { name: "Groupe OCP", color: "from-emerald-600 to-emerald-800" },
  { name: "Attijariwafa", color: "from-red-600 to-red-800" },
  { name: "Maroc Telecom", color: "from-blue-600 to-indigo-700" },
  { name: "Lydec", color: "from-cyan-600 to-teal-700" },
  { name: "Royal Air Maroc", color: "from-yellow-600 to-orange-700" },
  { name: "Société Générale", color: "from-gray-700 to-gray-900" },
];

const tabs = [
  { id: "audience", label: "Nos publics" },
  { id: "offers", label: "Notre offre" },
  { id: "themes", label: "Thématiques" },
];

export default function EntreprisesPrograms(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPaused = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const startAutoRotate = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!isPaused.current) {
        setActiveTab((prev) => (prev + 1) % tabs.length);
      }
    }, 5000);
  }, []);

  useEffect(() => {
    startAutoRotate();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startAutoRotate]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const cards = el.querySelectorAll(".tab-card");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, ease: "power2.out" }
    );
  }, [activeTab]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".prog-fade",
        { opacity: 0, y: 16 },
        {
          opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  const switchTab = (i: number) => {
    setActiveTab(i);
    isPaused.current = true;
    setTimeout(() => { isPaused.current = false; }, 8000);
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#F2EFE9]">
      {/* ═══════════════════════════════════════════════
          INTERACTIVE TABS — auto-rotates every 5s
          Merges: Audience + Offers + QVT themes
         ═══════════════════════════════════════════════ */}
      <div className="section-padding px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12">
            <div className="prog-fade">
              <span className="inline-flex items-center gap-3 text-[#B88A5A] text-xs font-semibold tracking-[0.2em] uppercase">
                <span className="w-6 h-px bg-[#B88A5A]/40" />
                Notre programme
              </span>
            </div>
            <h2 className="prog-fade heading-lg text-[#0B1220] mt-5">
              Une approche <span className="italic" style={{ color: "#B88A5A" }}>sur mesure</span>
            </h2>
            <p className="prog-fade text-[#2B2F36]/55 text-sm sm:text-base leading-relaxed mt-4 max-w-lg">
              Découvrez nos publics, notre offre et nos thématiques phares en un coup d&apos;œil.
            </p>
          </div>

          {/* Tab buttons */}
          <div className="prog-fade flex items-center justify-center sm:justify-start gap-1 mb-10">
            {tabs.map((tab, i) => (
              <button
                key={tab.id}
                onClick={() => switchTab(i)}
                onMouseEnter={() => { isPaused.current = true; }}
                onMouseLeave={() => { setTimeout(() => { isPaused.current = false; }, 2000); }}
                className={`relative px-3 sm:px-5 py-2 rounded-xl text-[10px] sm:text-xs font-semibold tracking-[0.08em] uppercase transition-all duration-300 ${
                  activeTab === i
                    ? "text-[#0B1220] bg-white shadow-sm"
                    : "text-[#2B2F36]/40 hover:text-[#2B2F36]/60"
                }`}
              >
                {tab.label}
              </button>
            ))}
            <span className="hidden sm:inline text-[10px] text-[#2B2F36]/20 tracking-[0.1em] ml-3">Auto · 5s</span>
          </div>

          {/* Tab content */}
          <div ref={contentRef} className="relative min-h-[280px]">
            {/* Subtle bg image behind cards */}
            <div className="absolute -inset-20 pointer-events-none opacity-[0.15]">
              <Image
                src="/images/business-meeting.jpg"
                alt=""
                fill
                className="object-cover object-center brightness-[0.8] saturate-[0.5]"
                sizes="100vw"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, transparent 30%, rgba(184,138,90,0.06) 100%)" }} />
            </div>
            {/* Audience */}
            {activeTab === 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {audiences.map((a, i) => (
                  <div
                    key={i}
                    className="tab-card group relative rounded-2xl p-6 sm:p-7 transition-all duration-500 bg-[#E8E2D9]/70 border border-[#B88A5A]/8 hover:bg-[#E1D9CD] hover:border-[#B88A5A]/25 hover:shadow-lg hover:shadow-[rgba(184,138,90,0.10)]"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#0B1220]/5 border border-[#0B1220]/8 flex items-center justify-center text-[#0B1220]/50 transition-all duration-500 group-hover:bg-[#0B1220] group-hover:text-white group-hover:border-[#0B1220]">
                      {a.icon}
                    </div>
                    <h3 className="text-[#0B1220] font-heading font-semibold text-base sm:text-lg mt-4">{a.title}</h3>
                    <span className="text-[#B88A5A]/70 text-xs font-medium tracking-wide uppercase">{a.subtitle}</span>
                    <p className="text-[#2B2F36]/60 text-sm leading-relaxed mt-2">{a.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Offers */}
            {activeTab === 1 && (
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                {offers.map((o, i) => (
                  <div
                    key={i}
                    className="tab-card group relative rounded-2xl p-5 sm:p-6 transition-all duration-300 bg-white/60 border border-[#B88A5A]/5 hover:bg-white hover:border-[#B88A5A]/15 hover:shadow-md hover:shadow-[rgba(184,138,90,0.06)]"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-[#B88A5A]/10 font-heading font-bold text-2xl leading-none mt-0.5 tabular-nums w-8 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-[#B88A5A]/8 border border-[#B88A5A]/10 flex items-center justify-center text-[#B88A5A]/60 transition-all duration-300 group-hover:bg-[#B88A5A] group-hover:text-white group-hover:border-[#B88A5A]">
                            {o.icon}
                          </div>
                          <h3 className="text-[#0B1220] font-heading font-semibold text-sm sm:text-base">{o.title}</h3>
                        </div>
                        <p className="text-[#2B2F36]/50 text-xs sm:text-sm leading-relaxed ml-11">{o.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Themes */}
            {activeTab === 2 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {themes.map((t, i) => (
                  <div
                    key={i}
                    className="tab-card group relative rounded-2xl p-6 sm:p-7 transition-all duration-300 bg-white/70 border border-[#B88A5A]/5 hover:bg-white hover:border-[#B88A5A]/15 hover:shadow-md hover:shadow-[rgba(184,138,90,0.06)]"
                  >
                    <span className="text-[#B88A5A]/15 font-heading font-bold text-3xl leading-none">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="text-[#0B1220] font-heading font-semibold text-base sm:text-lg mt-2">{t.title}</h3>
                    <p className="text-[#2B2F36]/50 text-sm leading-relaxed mt-1.5">{t.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          AUTO-SCROLL MARQUEE — trusted partners
         ═══════════════════════════════════════════════ */}
      <div className="py-14 sm:py-16 px-6 relative overflow-hidden border-t border-[#B88A5A]/5">
        {/* Wellness image visible behind logos */}
        <div className="absolute left-0 top-0 w-1/2 h-full pointer-events-none overflow-hidden opacity-[0.1]">
          <Image
            src="/images/wellness-stretch.jpg"
            alt=""
            fill
            className="object-cover object-right brightness-[0.7] saturate-[0.6]"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F2EFE9]/60 to-[#F2EFE9]" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, transparent 30%, rgba(184,138,90,0.06) 100%)" }} />
        </div>
        <div className="max-w-7xl mx-auto mb-8">
          <div className="prog-fade text-center">
            <span className="inline-flex items-center gap-3 text-[#B88A5A]/50 text-[10px] font-semibold tracking-[0.2em] uppercase">
              <span className="w-6 h-px bg-[#B88A5A]/20" />
              Ils nous font confiance
              <span className="w-6 h-px bg-[#B88A5A]/20" />
            </span>
          </div>
        </div>

        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 z-10 pointer-events-none bg-gradient-to-r from-[#F2EFE9] to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 z-10 pointer-events-none bg-gradient-to-l from-[#F2EFE9] to-transparent" />

          {/* Row 1 — leftward */}
          <div className="flex whitespace-nowrap animate-marquee mb-3 gap-3">
            {[...partners, ...partners].map((p, i) => (
              <div
                key={i}
                className={`inline-flex h-12 md:h-14 items-center gap-2 md:gap-3 px-4 md:px-6 rounded-xl border border-[#B88A5A]/8 bg-white/60`}
              >
                <div className={`w-1 h-5 md:w-1.5 md:h-6 rounded-full bg-gradient-to-b ${p.color} opacity-60 shrink-0`} />
                <span className="text-[#0B1220]/40 font-heading font-semibold text-xs md:text-sm whitespace-nowrap">
                  {p.name}
                </span>
              </div>
            ))}
          </div>

          {/* Row 2 — rightward */}
          <div className="flex whitespace-nowrap animate-marquee-reverse gap-3">
            {[...partners, ...partners].reverse().map((p, i) => (
              <div
                key={i}
                className={`inline-flex h-12 md:h-14 items-center gap-2 md:gap-3 px-4 md:px-6 rounded-xl border border-[#B88A5A]/8 bg-white/60`}
              >
                <div className={`w-1 h-5 md:w-1.5 md:h-6 rounded-full bg-gradient-to-b ${p.color} opacity-60 shrink-0`} />
                <span className="text-[#0B1220]/40 font-heading font-semibold text-xs md:text-sm whitespace-nowrap">
                  {p.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
