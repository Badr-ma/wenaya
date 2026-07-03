"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "@/contexts/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "./Logo";
import { MinimalDropdown } from "./produits/FilterDropdown";

const solutions = [
  {
    key: "entreprises" as const,
    href: "/solutions/entreprises",
    icon: (
      <svg viewBox="0 0 48 48" className="w-5 h-5" fill="none">
        <rect x="10" y="18" width="28" height="24" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M18 18V12a2 2 0 012-2h8a2 2 0 012 2v6" stroke="currentColor" strokeWidth="1.5" />
        <path d="M22 28v4M26 28v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "cliniques" as const,
    href: "/solutions/clinics",
    icon: (
      <svg viewBox="0 0 48 48" className="w-5 h-5" fill="none">
        <rect x="12" y="10" width="24" height="28" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M24 18v12M18 24h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M8 40h32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "hotelierie" as const,
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
  const { t } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollRef = useRef(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const lastThemeRef = useRef<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;
  const filtersPastRef = useRef(false);

  const [filtersPast, setFiltersPast] = useState(false);
  const [filterSearch, setFilterSearch] = useState("");
  const [filterCount, setFilterCount] = useState(0);
  const [filterGoals, setFilterGoals] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterTopics, setFilterTopics] = useState<string[]>([]);
  const [filterSort, setFilterSort] = useState("bestRated");

  const [pratiquesSearch, setPratiquesSearch] = useState("");
  const [pratiquesActiveFilter, setPratiquesActiveFilter] = useState("all");

  useEffect(() => {
    const handler = (e: Event) => {
      const d = (e as CustomEvent).detail;
      setFilterSearch(d.search);
      setFilterCount(d.count);
      setFilterGoals(d.selectedGoals);
      setFilterCategory(d.selectedCategory);
      setFilterTopics(d.selectedTopics);
      setFilterSort(d.sort);
    };
    window.addEventListener("products-update", handler);
    return () => window.removeEventListener("products-update", handler);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const d = (e as CustomEvent).detail;
      setPratiquesSearch(d.searchQuery);
      setPratiquesActiveFilter(d.activeFilter);
    };
    window.addEventListener("pratiques-update", handler);
    return () => window.removeEventListener("pratiques-update", handler);
  }, []);

  const handleFilterChange = (key: string, value: unknown) => {
    window.dispatchEvent(new CustomEvent("products-filter-request", { detail: { key, value } }));
  };

  const handlePratiquesFilterChange = (key: string, value: string) => {
    window.dispatchEvent(new CustomEvent("pratiques-filter-request", { detail: { key, value } }));
  };

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if ((pathnameRef.current === "/produits" || pathnameRef.current === "/pratiques") && filtersPastRef.current) {
        setHidden(false);
      } else if (y > 80 && y > lastScrollRef.current) {
        setHidden(true);
      } else if (y <= 80 || y < lastScrollRef.current) {
        setHidden(false);
      }
      lastScrollRef.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/produits" && pathname !== "/pratiques") {
      setFiltersPast(false);
      return;
    }
    const findBar = () => {
      const el = document.querySelector("[data-filter-bar]");
      if (!el) { setTimeout(findBar, 50); return; }
      const check = () => {
        const r = el.getBoundingClientRect();
        const past = r.top < 80;
        filtersPastRef.current = past;
        setFiltersPast(past);
      };
      check();
      window.addEventListener("scroll", check, { passive: true });
    };
    findBar();
    return () => { filtersPastRef.current = false; };
  }, [pathname]);

  useEffect(() => {
    const detectSection = () => {
      const sections = document.querySelectorAll("[data-section-bg]");
      const navBottom = 80;
      let newTheme: "dark" | "light" = "dark";
      for (const s of sections) {
        const r = s.getBoundingClientRect();
        if (r.top <= navBottom && r.bottom > navBottom) {
          newTheme = s.getAttribute("data-section-bg") === "dark" ? "dark" : "light";
          break;
        }
      }
      if (newTheme !== lastThemeRef.current) {
        lastThemeRef.current = newTheme;
        setTheme(newTheme);
      }
    };
    detectSection();
    window.addEventListener("scroll", detectSection, { passive: true });
    return () => window.removeEventListener("scroll", detectSection);
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

  const isDark = theme === "dark";
  const barBg = isDark
    ? scrolled || dropdownOpen || mobileOpen
      ? "bg-[#0B1220]/92 backdrop-blur-[32px]"
      : "bg-[#0B1220]/40 backdrop-blur-[20px]"
    : scrolled || dropdownOpen || mobileOpen
      ? "bg-[#F2EFE9]/90 backdrop-blur-[32px]"
      : "bg-[#F2EFE9]/30 backdrop-blur-[20px]";
  const linkBase = isDark
    ? "text-white/52 hover:text-white"
    : "text-[#0B1220]/52 hover:text-[#0B1220]";
  const linkActive_ = isDark ? "text-white" : "text-[#0B1220]";
  const linkUnderline = isDark ? "bg-white/20" : "bg-black/[0.08]";
  const sepStyle = isDark ? "bg-white/[0.1]" : "bg-black/[0.08]";
  const loginBtn = isDark
    ? "bg-white/[0.07] border border-white/[0.09] text-white/65 hover:bg-white/[0.11] hover:text-white hover:border-white/[0.14]"
    : "bg-[#0B1220]/[0.04] border border-[#0B1220]/[0.08] text-[#0B1220]/65 hover:bg-[#0B1220]/[0.08] hover:text-[#0B1220] hover:border-[#0B1220]/[0.12]";

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] flex justify-center px-4 sm:px-8 pt-4 transition-transform duration-300 ease-in-out ${hidden ? "-translate-y-full" : "translate-y-0"}`}>
      {/* ── Main bar ── */}
      <div
        className={`flex-1 max-w-7xl flex items-center justify-between h-[60px] sm:h-[64px] px-5 rounded-full shadow-sm transition-all duration-500 ${barBg}`}
      >
        {/* ── Filter bar mode (appears when main filters scroll out of view) ── */}
        {filtersPast && pathname === "/produits" ? (
          <div className="flex items-center flex-1 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <span className={`text-xs sm:text-sm whitespace-nowrap shrink-0 ${isDark ? "text-white/65" : "text-[#2B2F36]/65"}`}>
                {filterCount} brands
              </span>
              <div className={`hidden sm:block w-px h-4 ${isDark ? "bg-white/[0.1]" : "bg-[#0B1220]/[0.06]"}`} />
              <div className="hidden sm:flex items-center gap-2">
                <MinimalDropdown
                  label="Goals"
                  options={["longevity", "sleep", "stress", "recovery", "skin", "heart", "energy", "brain"]}
                  selected={filterGoals}
                  onChange={(v) => handleFilterChange("selectedGoals", v)}
                  multi
                  dark={isDark}
                />
                <MinimalDropdown
                  label={filterCategory ?? "Categories"}
                  options={["supplements", "devices", "wearables", "skincare", "programs"]}
                  selected={filterCategory ? [filterCategory] : []}
                  onChange={(v) => handleFilterChange("selectedCategory", v[0] ?? null)}
                  multi={false}
                  dark={isDark}
                />
                <MinimalDropdown
                  label="Topics"
                  options={["magnesium", "omega-3", "glucose", "collagen", "peptides", "sleep-tracking", "heart-rate", "meditation", "breathwork"]}
                  selected={filterTopics}
                  onChange={(v) => handleFilterChange("selectedTopics", v)}
                  multi
                  dark={isDark}
                />
                <MinimalDropdown
                  label={filterSort === "bestRated" ? "Sort by" : filterSort === "mostPopular" ? "Most popular" : "Newest"}
                  options={["bestRated", "mostPopular", "newest"]}
                  selected={[filterSort]}
                  onChange={(v) => handleFilterChange("sort", v[0] ?? "bestRated")}
                  multi={false}
                  dark={isDark}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-auto">
              <svg className={`w-4 h-4 ${isDark ? "text-white/55" : "text-[#2B2F36]/55"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={filterSearch}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                placeholder="Search brands"
                className={`w-[110px] sm:w-[170px] py-1.5 bg-transparent border-b text-sm outline-none transition-colors ${
                  isDark
                    ? "text-white/85 placeholder-white/30 border-white/[0.2] focus:border-white/40"
                    : "text-[#0B1220] placeholder-[#2B2F36]/35 border-[#0B1220]/[0.15] focus:border-[#0B1220]/40"
                }`}
              />
              {/* Mobile hamburger in filter mode */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`lg:hidden relative flex flex-col items-center justify-center w-9 h-9 rounded-xl transition-colors ml-1 sm:ml-0 ${isDark ? "hover:bg-white/[0.06]" : "hover:bg-black/[0.06]"}`}
                aria-label={t("nav.menu")}
              >
                <span className={`block w-[17px] h-[1.5px] rounded-full transition-all duration-300 origin-center ${isDark ? "bg-white/75" : "bg-[#0B1220]/60"} ${mobileOpen ? "rotate-45 translate-y-[3px]" : ""}`} />
                <span className={`block w-[17px] h-[1.5px] rounded-full mt-[5px] transition-all duration-300 ${isDark ? "bg-white/75" : "bg-[#0B1220]/60"} ${mobileOpen ? "opacity-0 scale-x-0" : ""}`} />
                <span className={`block w-[17px] h-[1.5px] rounded-full mt-[5px] transition-all duration-300 origin-center ${isDark ? "bg-white/75" : "bg-[#0B1220]/60"} ${mobileOpen ? "-rotate-45 -translate-y-[3px]" : ""}`} />
              </button>
            </div>
          </div>
        ) : filtersPast && pathname === "/pratiques" ? (
          <div className="flex items-center flex-1 min-w-0 gap-2 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none">
              {(["all", "manualTherapies", "mentalHealth", "nutrition", "holisticWellness"] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => handlePratiquesFilterChange("activeFilter", key)}
                  className={`shrink-0 text-xs sm:text-sm tracking-wider transition-all duration-200 rounded-full px-2.5 sm:px-3 py-1.5 border ${
                    isDark
                      ? pratiquesActiveFilter === key
                        ? "border-white text-white font-semibold"
                        : "border-white/60 text-white/70 hover:border-white hover:text-white"
                      : pratiquesActiveFilter === key
                        ? "border-[#0B1220] text-[#0B1220] font-semibold"
                        : "border-[#0B1220]/60 text-[#2B2F36]/70 hover:border-[#0B1220] hover:text-[#0B1220]"
                  }`}
                >
                  {t(`pratiques.filters.${key}`)}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5 shrink-0 ml-auto hidden sm:flex">
              <svg className={`w-4 h-4 ${isDark ? "text-white/55" : "text-[#2B2F36]/55"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={pratiquesSearch}
                onChange={(e) => handlePratiquesFilterChange("searchQuery", e.target.value)}
                placeholder="Search practices…"
                className={`w-[130px] sm:w-[170px] py-1.5 bg-transparent border-b text-sm outline-none transition-colors ${
                  isDark
                    ? "text-white/85 placeholder-white/30 border-white/[0.2] focus:border-white/40"
                    : "text-[#0B1220] placeholder-[#2B2F36]/35 border-[#0B1220]/[0.15] focus:border-[#0B1220]/40"
                }`}
              />
            </div>
          </div>
        ) : (
          <>
            <Link href="/" className="h-full overflow-hidden shrink-0 flex items-center">
              <Logo />
            </Link>

            <nav className="hidden lg:block" aria-label={t("nav.navPrincipale")}>
              <ul className="flex items-center gap-0">
                {[
                  { label: t("nav.accueil"), href: "/" },
                  { label: t("nav.solutions"), href: "#", hasDropdown: true },
                  { label: t("nav.aPropos"), href: "/about" },
                  { label: t("nav.produits"), href: "/produits" },
                  { label: t("nav.faq"), href: "/faq" },
                ].map((link) =>
                  link.hasDropdown ? (
                    <li key={link.label} className="relative">
                      <button
                        ref={triggerRef}
                        onMouseEnter={show}
                        onMouseLeave={hide}
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        aria-haspopup="true"
                        aria-expanded={dropdownOpen}
                        className={`relative flex items-center gap-1 px-4 py-2 text-sm rounded-full transition-all duration-200 outline-none ${
                          isActive(link.href)
                            ? `${linkActive_} font-semibold`
                            : `${linkBase} font-medium`
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
                        className={`relative px-4 py-2 text-sm rounded-full transition-all duration-200 flex items-center ${
                          isActive(link.href)
                            ? `${linkActive_} font-semibold`
                            : `${linkBase} font-medium`
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
                          className={`absolute bottom-0.5 left-4 right-4 h-px rounded-full ${linkUnderline} origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100`}
                        />
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </nav>

            <div className="flex items-center gap-3 shrink-0">
              <LanguageSwitcher />
              <div className={`hidden sm:block w-px h-5 ${sepStyle} mr-0.5`} />

              <Link
                href="/login"
                className={`hidden sm:inline-flex items-center justify-center px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${loginBtn}`}
              >
                {t("nav.seConnecter")}
              </Link>

              <Link
                href="#"
                onClick={(e) => e.preventDefault()}
                className="hidden sm:inline-flex items-center justify-center px-5 py-1.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-px active:translate-y-0"
                style={{
                  background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)",
                  boxShadow: "0 1px 0 rgba(255,255,255,0.15) inset, 0 4px 16px rgba(184,138,90,0.28)",
                }}
              >
                {t("nav.reserver")}
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`lg:hidden relative flex flex-col items-center justify-center w-9 h-9 rounded-xl transition-colors ${isDark ? "hover:bg-white/[0.06]" : "hover:bg-black/[0.06]"}`}
                aria-label={t("nav.menu")}
              >
                <span className={`block w-[17px] h-[1.5px] rounded-full transition-all duration-300 origin-center ${isDark ? "bg-white/75" : "bg-[#0B1220]/60"} ${mobileOpen ? "rotate-45 translate-y-[3px]" : ""}`} />
                <span className={`block w-[17px] h-[1.5px] rounded-full mt-[5px] transition-all duration-300 ${isDark ? "bg-white/75" : "bg-[#0B1220]/60"} ${mobileOpen ? "opacity-0 scale-x-0" : ""}`} />
                <span className={`block w-[17px] h-[1.5px] rounded-full mt-[5px] transition-all duration-300 origin-center ${isDark ? "bg-white/75" : "bg-[#0B1220]/60"} ${mobileOpen ? "-rotate-45 -translate-y-[3px]" : ""}`} />
              </button>
            </div>
          </>
        )}
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
                {t("nav.nosSolutions")}
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
                      <h3 className="text-white font-heading font-semibold text-sm">{t(`nav.${s.key}.title`)}</h3>
                    </div>
                    <p className="text-white/32 text-[12px] leading-relaxed mb-3.5">{t(`nav.${s.key}.desc`)}</p>
                    <span className="inline-flex items-center gap-1.5 text-[#B88A5A] text-[12px] font-medium group-hover:gap-2.5 transition-all duration-200">
                      {t(`nav.${s.key}.cta`)}
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
                <span className="text-white/28 text-[11.5px]">{t("nav.solutionsAdaptees")}</span>
              </div>
              <Link
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-white/42 hover:text-white text-[12px] font-medium transition-colors flex items-center gap-1.5"
              >
                {t("nav.voirToutes")}
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
        aria-label={t("nav.menuNav")}
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
          <nav className="flex-1" aria-label={t("nav.navMobile")}>
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
                  {t("nav.accueil")}
                </Link>
              </li>

              {/* Solutions */}
              <li>
                <button
                  onClick={() => setMobileSolutionsOpen(!mobileSolutionsOpen)}
                  className="flex items-center justify-between w-full py-3.5 text-[clamp(1.6rem,4vw,2.2rem)] font-heading font-bold text-white/38 hover:text-white/75 transition-colors"
                >
                  {t("nav.solutions")}
                  <svg
                    className={`w-5 h-5 text-white/20 transition-transform duration-300 ${mobileSolutionsOpen ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`overflow-y-auto transition-all duration-350 ${
                    mobileSolutionsOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
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
                          <span className="text-white font-heading font-semibold text-sm">{t(`nav.${s.key}.title`)}</span>
                          <p className="text-white/30 text-xs mt-0.5 leading-relaxed">{t(`nav.${s.key}.desc`)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </li>

              {/* Remaining links */}
              {[
                { label: t("nav.aPropos"), href: "/about" },
                { label: t("nav.produits"), href: "/produits" },
                { label: t("nav.faq"), href: "/faq" },
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
              <Link
                href="/login"
                onClick={closeMobile}
                className="flex items-center justify-center h-12 rounded-xl border border-white/[0.09] bg-white/[0.04] text-white/65 text-sm font-medium transition-all hover:bg-white/[0.07]"
              >
                {t("nav.seConnecter")}
              </Link>
              <Link
                href="#"
                onClick={(e) => { e.preventDefault(); closeMobile(); }}
                className="flex items-center justify-center h-12 rounded-xl text-white text-sm font-semibold transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #B88A5A 0%, #9A7242 100%)",
                  boxShadow: "0 4px 20px rgba(184,138,90,0.3)",
                }}
              >
                {t("nav.reserver")}
              </Link>
            </div>
            <p className="text-center text-white/18 text-[11.5px] tracking-wide">
              {t("nav.votreSanteNotreEngagement")}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
