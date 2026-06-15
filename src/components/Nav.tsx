"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Solutions", href: "#", hasDropdown: true },
  { label: "Yolo AI", href: "/yolo" },
  { label: "À Propos", href: "/about" },
  { label: "FAQ", href: "/faq" },
];

const solutions = [
  {
    title: "Particuliers",
    desc: "Accompagnement personnalisé en santé physique, bien-être mental, nutrition et prévention.",
    cta: "Découvrir",
    href: "#",
    icon: (
      <svg viewBox="0 0 48 48" className="w-5 h-5" fill="none">
        <circle cx="24" cy="16" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 40c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Entreprises",
    desc: "Programmes de bien-être, santé mentale et performance pour les équipes.",
    cta: "Découvrir",
    href: "#",
    icon: (
      <svg viewBox="0 0 48 48" className="w-5 h-5" fill="none">
        <rect x="10" y="18" width="28" height="24" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M18 18V12a2 2 0 012-2h8a2 2 0 012 2v6" stroke="currentColor" strokeWidth="1.5" />
        <path d="M22 28v4M26 28v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Hôtellerie",
    desc: "Expériences wellness et partenariats santé pour hôtels, resorts et résidences premium.",
    cta: "Découvrir",
    href: "#",
    icon: (
      <svg viewBox="0 0 48 48" className="w-5 h-5" fill="none">
        <path d="M12 38V14l12-8 12 8v24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="18" y="24" width="12" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 38h32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function Nav(): React.JSX.Element {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const show = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setDropdownOpen(true); };
  const hide = () => { timeoutRef.current = setTimeout(() => setDropdownOpen(false), 140); };
  const closeMobile = () => { setMobileOpen(false); setMobileSolutionsOpen(false); };

  const isActive = (href: string): boolean => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] flex justify-center px-4 sm:px-8 pt-4">
      {/* ── Main bar ── */}
      <div
        className={`w-full flex items-center justify-between h-[60px] sm:h-[64px] px-5 sm:px-8 rounded-2xl transition-all duration-500 ${
          scrolled || dropdownOpen || mobileOpen
            ? "bg-[#0B1220]/92 backdrop-blur-[32px] border border-white/[0.08] shadow-[0_2px_40px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.05)]"
            : "bg-[#0B1220]/40 backdrop-blur-[20px] border border-white/[0.07]"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="relative flex items-center justify-center w-6 h-6">
            <svg viewBox="0 0 32 32" className="w-6 h-6 absolute inset-0" fill="none">
              <circle cx="16" cy="16" r="13.5" stroke="#B88A5A" strokeWidth="0.75" opacity="0.22" />
              <circle cx="16" cy="16" r="9" stroke="#B88A5A" strokeWidth="1" opacity="0.4" />
              <circle cx="16" cy="16" r="3.5" fill="#B88A5A" />
              <circle
                cx="22" cy="10" r="1.5" fill="#B88A5A" opacity="0.25"
                className="transition-all duration-500 group-hover:opacity-55"
              />
            </svg>
          </div>
          <span
            className="text-[21px] sm:text-[22px] font-bold font-heading tracking-[-0.035em]"
            style={{
              background: "linear-gradient(130deg, #C99B68 0%, #159AA9 52%, #ffffff 88%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Wenaya
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:block" aria-label="Navigation principale">
          <ul className="flex items-center gap-0">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <li key={link.label} className="relative">
                  <button
                    ref={triggerRef}
                    onMouseEnter={show}
                    onMouseLeave={hide}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen}
                    className={`relative flex items-center gap-1 px-4 py-2 text-[13.5px] rounded-xl transition-all duration-200 outline-none ${
                      isActive(link.href)
                        ? "text-white font-semibold"
                        : "text-white/52 hover:text-white font-medium"
                    }`}
                  >
                    {link.label}
                    <svg
                      className={`w-3 h-3 mt-px opacity-60 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                    {isActive(link.href) && (
                      <span className="absolute bottom-0.5 left-4 right-4 h-px rounded-full bg-[#B88A5A]/60" />
                    )}
                  </button>
                </li>
              ) : (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`relative px-4 py-2 text-[13.5px] rounded-xl transition-all duration-200 flex items-center ${
                      isActive(link.href)
                        ? "text-white font-semibold"
                        : "text-white/52 hover:text-white font-medium"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute bottom-0.5 left-4 right-4 h-px rounded-full bg-[#B88A5A]/60 transition-all duration-300 ${
                        isActive(link.href) ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                      }`}
                      style={{ transformOrigin: "left" }}
                    />
                    <span
                      className={`absolute bottom-0.5 left-4 right-4 h-px rounded-full bg-white/20 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100`}
                    />
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>

        {/* Right: separator + actions */}
        <div className="flex items-center gap-3">
          {/* Thin separator */}
          <div className="hidden sm:block w-px h-5 bg-white/[0.1] mr-0.5" />

          <Link
            href="#"
            onClick={(e) => e.preventDefault()}
            className="hidden sm:inline-flex items-center justify-center h-[34px] px-5 rounded-xl bg-white/[0.07] border border-white/[0.09] text-white/65 text-[13px] font-medium transition-all duration-200 hover:bg-white/[0.11] hover:text-white hover:border-white/[0.14]"
          >
            Se connecter
          </Link>

          <Link
            href="#"
            onClick={(e) => e.preventDefault()}
            className="hidden sm:inline-flex items-center justify-center h-[34px] px-5 rounded-xl text-[13px] font-semibold text-white transition-all duration-300 hover:-translate-y-px active:translate-y-0"
            style={{
              background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)",
              boxShadow: "0 1px 0 rgba(255,255,255,0.15) inset, 0 4px 16px rgba(184,138,90,0.28)",
            }}
          >
            Réserver
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden relative flex flex-col items-center justify-center w-9 h-9 rounded-xl hover:bg-white/[0.06] transition-colors"
            aria-label="Menu"
          >
            <span className={`block w-[17px] h-[1.5px] bg-white/75 rounded-full transition-all duration-300 origin-center ${mobileOpen ? "rotate-45 translate-y-[3px]" : ""}`} />
            <span className={`block w-[17px] h-[1.5px] bg-white/75 rounded-full mt-[5px] transition-all duration-300 ${mobileOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block w-[17px] h-[1.5px] bg-white/75 rounded-full mt-[5px] transition-all duration-300 origin-center ${mobileOpen ? "-rotate-45 -translate-y-[3px]" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── Solutions dropdown ── */}
      {mounted && (
        <div
          ref={dropdownRef}
          onMouseEnter={show}
          onMouseLeave={hide}
          className={`hidden lg:block absolute top-full left-1/2 -translate-x-1/2 mt-2.5 w-[820px] transition-all duration-[180ms] ${
            dropdownOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"
          }`}
        >
          <div
            className="relative rounded-2xl overflow-hidden border border-white/[0.07]"
            style={{
              background: "rgba(11,18,32,0.96)",
              backdropFilter: "blur(40px)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.05) inset",
            }}
          >
            {/* Top accent line */}
            <div className="h-px bg-gradient-to-r from-transparent via-[#B88A5A]/30 to-transparent" />

            <div className="p-5">
              <p className="text-white/25 text-[11px] uppercase tracking-[0.12em] font-medium mb-4 px-1">
                Nos solutions
              </p>
              <div className="grid grid-cols-3 gap-2">
                {solutions.map((s, i) => (
                  <Link
                    key={i}
                    href={s.href}
                    className="group relative rounded-xl p-4 transition-all duration-250 hover:bg-white/[0.04] border border-transparent hover:border-white/[0.05]"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.05] flex items-center justify-center text-[#B88A5A]/55 group-hover:text-[#B88A5A] group-hover:bg-[#B88A5A]/8 group-hover:border-[#B88A5A]/15 transition-all duration-250">
                        {s.icon}
                      </div>
                      <h3 className="text-white font-heading font-semibold text-[13.5px]">{s.title}</h3>
                    </div>
                    <p className="text-white/32 text-[12px] leading-relaxed mb-3.5">{s.desc}</p>
                    <span className="inline-flex items-center gap-1.5 text-[#B88A5A] text-[12px] font-medium group-hover:gap-2.5 transition-all duration-200">
                      {s.cta}
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Footer bar */}
            <div className="h-px bg-white/[0.04]" />
            <div className="px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#159AA9]/70" />
                <span className="text-white/28 text-[11.5px]">Solutions adaptées à chaque besoin</span>
              </div>
              <Link
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-white/42 hover:text-white text-[12px] font-medium transition-colors flex items-center gap-1.5"
              >
                Voir toutes nos solutions
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile menu ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigation"
        className={`fixed inset-0 bg-[#080E1C] z-40 transition-all duration-400 lg:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative flex flex-col h-full px-6 sm:px-10 pt-[88px] pb-10 overflow-y-auto">
          <nav className="flex-1" aria-label="Navigation mobile">
            <ul className="space-y-0.5">
              {/* Home */}
              <li>
                <Link
                  href="/"
                  onClick={closeMobile}
                  className={`flex items-center gap-3 py-3.5 text-[clamp(1.6rem,4vw,2.2rem)] font-heading font-bold transition-all duration-200 ${
                    isActive("/") ? "text-white" : "text-white/38 hover:text-white/75"
                  }`}
                >
                  {isActive("/") && <span className="w-1.5 h-1.5 rounded-full bg-[#B88A5A] shrink-0" />}
                  Accueil
                </Link>
              </li>

              {/* Solutions */}
              <li>
                <button
                  onClick={() => setMobileSolutionsOpen(!mobileSolutionsOpen)}
                  className="flex items-center justify-between w-full py-3.5 text-[clamp(1.6rem,4vw,2.2rem)] font-heading font-bold text-white/38 hover:text-white/75 transition-colors"
                >
                  Solutions
                  <svg
                    className={`w-5 h-5 text-white/20 transition-transform duration-300 ${mobileSolutionsOpen ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-350 ${
                    mobileSolutionsOpen ? "max-h-[460px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="space-y-1.5 pb-4 pt-2 pl-1">
                    {solutions.map((s, i) => (
                      <Link
                        key={i}
                        href={s.href}
                        onClick={closeMobile}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.055] transition-colors border border-white/[0.03] hover:border-white/[0.06]"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.05] flex items-center justify-center shrink-0 text-[#B88A5A]/60">
                          {s.icon}
                        </div>
                        <div className="min-w-0">
                          <span className="text-white font-heading font-semibold text-sm">{s.title}</span>
                          <p className="text-white/30 text-xs mt-0.5 leading-relaxed">{s.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </li>

              {/* Remaining links */}
              {[
                { label: "Yolo AI", href: "/yolo" },
                { label: "À Propos", href: "/about" },
                { label: "FAQ", href: "/faq" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    onClick={closeMobile}
                    className={`flex items-center gap-3 py-3.5 text-[clamp(1.6rem,4vw,2.2rem)] font-heading font-bold transition-all duration-200 ${
                      isActive(href) ? "text-white" : "text-white/38 hover:text-white/75"
                    }`}
                  >
                    {isActive(href) && <span className="w-1.5 h-1.5 rounded-full bg-[#B88A5A] shrink-0" />}
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile bottom actions */}
          <div className="pt-8 border-t border-white/[0.06] space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={closeMobile}
                className="flex items-center justify-center h-12 rounded-xl border border-white/[0.09] bg-white/[0.04] text-white/65 text-sm font-medium transition-all hover:bg-white/[0.07]"
              >
                Se connecter
              </button>
              <Link
                href="#"
                onClick={(e) => { e.preventDefault(); closeMobile(); }}
                className="flex items-center justify-center h-12 rounded-xl text-white text-sm font-semibold transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)",
                  boxShadow: "0 4px 20px rgba(184,138,90,0.3)",
                }}
              >
                Réserver
              </Link>
            </div>
            <p className="text-center text-white/18 text-[11.5px] tracking-wide">
              Votre santé, notre engagement
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
