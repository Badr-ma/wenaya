/**
 * Sticky journey section nav — desktop-only (xl+). A subtle left rail listing
 * "Sur cette page / On this page" with anchor links to each H2 section. The
 * current section is highlighted (lightweight IntersectionObserver). Links and
 * anchors work with JS disabled; the highlight is a progressive enhancement.
 * Hidden below xl where the article falls back to a single column.
 */
"use client";

import { useEffect, useState } from "react";

export interface NavItem {
  label: string;
  id: string;
}

export default function CareJourneyNavRail({
  title,
  items,
}: {
  title: string;
  items: NavItem[];
}) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(e.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );
    const els = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => Boolean(el));
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label={title}
      className="hidden xl:block sticky top-28 self-start max-h-[calc(100vh-8rem)] overflow-y-auto pr-2"
    >
      <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B88A5A]">
        {title}
      </span>
      <ul className="mt-5 space-y-3 border-l border-[#0B1220]/10">
        {items.map((it) => {
          const isActive = active === it.id;
          return (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                className={`-ml-px block border-l-2 py-0.5 pl-4 text-[13px] leading-snug transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A] ${
                  isActive
                    ? "border-[#B88A5A] font-medium text-[#0B1220]"
                    : "border-transparent text-[#0B1220]/55 hover:text-[#0B1220] hover:border-[#0B1220]/25"
                }`}
              >
                {it.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
