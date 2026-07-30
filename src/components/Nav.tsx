/**
 * Navigation Bar — fixed top bar with logo, nav links, language switcher, login/CTA buttons.
 * Features: scroll-hide/show, theme detection (dark/light based on section background),
 * filter bar mode for /produits and /pratiques (sticky filter bar replaces main nav),
 * and responsive mobile menu with hamburger toggle.
 */
"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "@/contexts/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "./Logo";
import MobileMenu from "./nav/MobileMenu";
import ProduitsFilterBar from "./nav/ProduitsFilterBar";
import PratiquesFilterBar from "./nav/PratiquesFilterBar";
import { useLenis } from "lenis/react";

export default function Nav(): React.JSX.Element {
  const pathname = usePathname();
  const { t } = useLocale();
  const [scrolled, setScrolled] = useState(false); // Whether user has scrolled past 40px
  const [hidden, setHidden] = useState(false); // Whether nav is hidden (scrolling down)
  const lastScrollRef = useRef(0); // Previous scroll position for direction detection
  const [mobileOpen, setMobileOpen] = useState(false); // Mobile menu toggle
  const [theme, setTheme] = useState<"dark" | "light">("dark"); // Nav color theme based on current section
  const lastThemeRef = useRef<"dark" | "light">("dark"); // Avoids unnecessary re-renders on same theme
  const pathnameRef = useRef(pathname); // Ref to pathname for use inside scroll handlers
  const filtersPastRef = useRef(false); // Whether filter bar has scrolled past nav

  useEffect(() => { pathnameRef.current = pathname; });

  // Filter state for /produits page — synced via custom DOM events
  const [filtersPast, setFiltersPast] = useState(false);
  const [filterSearch, setFilterSearch] = useState("");
  const [filterCount, setFilterCount] = useState(0);
  const [filterGoals, setFilterGoals] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterTopics, setFilterTopics] = useState<string[]>([]);
  const [filterSort, setFilterSort] = useState("bestRated");

  // Filter state for /pratiques page — synced via custom DOM events
  const [pratiquesSearch, setPratiquesSearch] = useState("");
  const [pratiquesActiveFilter, setPratiquesActiveFilter] = useState("all");

  /** Listen for "products-update" custom events — keeps nav filter bar in sync with ProductsGrid */
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail.search !== undefined) setFilterSearch(detail.search);
      if (detail.count !== undefined) setFilterCount(detail.count);
      if (detail.selectedGoals !== undefined) setFilterGoals(detail.selectedGoals);
      if (detail.selectedCategory !== undefined) setFilterCategory(detail.selectedCategory);
      if (detail.selectedTopics !== undefined) setFilterTopics(detail.selectedTopics);
      if (detail.sort !== undefined) setFilterSort(detail.sort);
    };
    window.addEventListener("products-update", handler);
    return () => window.removeEventListener("products-update", handler);
  }, []);

  /** Listen for "pratiques-update" custom events — keeps nav filter bar in sync with PratiquesGrid */
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail.searchQuery !== undefined) setPratiquesSearch(detail.searchQuery);
      if (detail.activeFilter !== undefined) setPratiquesActiveFilter(detail.activeFilter);
    };
    window.addEventListener("pratiques-update", handler);
    return () => window.removeEventListener("pratiques-update", handler);
  }, []);

  /** Forwards filter changes to the page via custom DOM events (cross-component communication) */
  const handleFilterChange = (key: string, value: unknown) => {
    window.dispatchEvent(new CustomEvent("products-filter-request", { detail: { key, value } }));
  };

  const handlePratiquesFilterChange = (key: string, value: string) => {
    window.dispatchEvent(new CustomEvent("pratiques-filter-request", { detail: { key, value } }));
  };

  /** Scroll handler — uses Lenis scroll value to detect direction and show/hide nav */
  useLenis((lenis) => {
    const y = lenis.animatedScroll ?? lenis.scroll;
    setScrolled(y > 40);
    if (y <= 40) {
      setHidden(false);
    } else if (y > 80 && y > lastScrollRef.current) {
      setHidden(true);
    } else if (y <= 80 || y < lastScrollRef.current) {
      setHidden(false);
    }
    lastScrollRef.current = y;
  });

  /** Detects when the filter bar scrolls past the nav — switches to compact filter bar mode */
  useEffect(() => {
    if (pathname !== "/produits" && pathname !== "/pratiques") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFiltersPast(false);
      return;
    }
    const findBar = () => {
      const el = document.querySelector("[data-filter-bar]");
      if (!el) { setTimeout(findBar, 50); return; }
      let ticking = false;
      const check = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          const r = el.getBoundingClientRect();
          const past = r.top < 80;
          filtersPastRef.current = past;
          setFiltersPast(past);
        });
      };
      check();
      window.addEventListener("scroll", check, { passive: true });
    };
    findBar();
    return () => { filtersPastRef.current = false; };
  }, [pathname]);

  /** Section theme detector — reads data-section-bg attributes to switch nav between dark/light */
  useEffect(() => {
    let ticking = false;
    const detectSection = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const sections = document.querySelectorAll("[data-section-bg]");
        const navEl = document.querySelector("header > div");
        const navBottom = navEl ? navEl.getBoundingClientRect().bottom : 80;
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
      });
    };
    detectSection();
    window.addEventListener("scroll", detectSection, { passive: true });
    return () => window.removeEventListener("scroll", detectSection);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeMobile = () => { setMobileOpen(false); };

  const isActive = (href: string): boolean => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const isDark = theme === "dark";
  const barBg = isDark
    ? scrolled || mobileOpen
      ? "bg-[#0B1220]/92 backdrop-blur-[32px]"
      : "bg-[#0B1220]/40 backdrop-blur-[20px]"
    : scrolled || mobileOpen
      ? "bg-[#F2EFE9]/90 backdrop-blur-[32px]"
      : "bg-[#F2EFE9]/70 backdrop-blur-[20px]";
  const linkBase = isDark
    ? "text-white/52 hover:text-white"
    : "text-[#0B1220]/52 hover:text-[#0B1220]";
  const linkActive_ = isDark ? "text-white" : "text-[#0B1220]";
  const sepStyle = isDark ? "bg-white/[0.1]" : "bg-black/[0.08]";
  const loginBtn = isDark
    ? "bg-white/[0.07] border border-white/[0.09] text-white/65 hover:bg-white/[0.11] hover:text-white hover:border-white/[0.14]"
    : "bg-[#0B1220]/[0.04] border border-[#0B1220]/[0.08] text-[#0B1220]/65 hover:bg-[#0B1220]/[0.08] hover:text-[#0B1220] hover:border-[#0B1220]/[0.12]";

  return (
    <>
    <header className={`fixed left-0 right-0 z-[100] flex justify-center px-4 sm:px-8 transition-transform duration-300 ease-in-out will-change-transform ${hidden ? "-translate-y-[calc(100%+40px)]" : "translate-y-0"} ${pathname === "/" ? "top-[40px] pt-2 sm:pt-4" : "top-0 pt-2 sm:pt-4"}`}>
      {/* ── Main bar ── */}
      <div
        className={`flex-1 max-w-7xl flex items-center justify-between h-[52px] sm:h-[64px] px-4 sm:px-5 rounded-full shadow-sm transition-all duration-500 ${barBg}`}
      >
        {/* ── Filter bar mode (appears when main filters scroll out of view) ── */}
        {filtersPast && pathname === "/produits" ? (
          <ProduitsFilterBar
            filterCount={filterCount}
            filterSearch={filterSearch}
            filterGoals={filterGoals}
            filterCategory={filterCategory}
            filterTopics={filterTopics}
            filterSort={filterSort}
            onFilterChange={handleFilterChange}
            isDark={isDark}
            mobileOpen={mobileOpen}
            onToggleMobile={() => setMobileOpen(!mobileOpen)}
            t={t}
          />
        ) : filtersPast && pathname === "/pratiques" ? (
          <PratiquesFilterBar
            pratiquesSearch={pratiquesSearch}
            pratiquesActiveFilter={pratiquesActiveFilter}
            onFilterChange={handlePratiquesFilterChange}
            isDark={isDark}
            t={t}
          />
        ) : (
          <>
            <Link href="/" className="h-full overflow-hidden shrink-0 flex items-center">
              <Logo />
            </Link>

            <nav className="hidden lg:block" aria-label={t("nav.navPrincipale")}>
              <ul className="flex items-center gap-0">
                {[
                  { label: t("nav.accueil"), href: "/" },
                  { label: t("nav.aPropos"), href: "/about" },
                  { label: t("nav.solutions"), href: "/solutions/entreprises" },
                  { label: t("nav.produits"), href: "/produits" },
                  { label: t("nav.specialistes"), href: "/specialistes" },
                ].map((link) => (
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
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </nav>

            <div className={`flex items-center gap-3 shrink-0 ${isDark ? "text-white/70" : "text-[#0B1220]/50"}`}>
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
                className="hidden sm:inline-flex items-center justify-center px-5 py-1.5 rounded-full text-sm font-semibold text-[#0B1220] transition-all duration-300 hover:-translate-y-px active:translate-y-0"
                style={{
                  background: "#B88A5A",
                }}
              >
                {t("nav.reserver")}
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`lg:hidden relative flex flex-col items-center justify-center w-11 h-11 rounded-xl transition-colors ${isDark ? "hover:bg-white/[0.06]" : "hover:bg-black/[0.06]"}`}
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

    </header>

    <MobileMenu
      open={mobileOpen}
      onClose={closeMobile}
      isActive={isActive}
      t={t}
    />
    </>
  );
}
