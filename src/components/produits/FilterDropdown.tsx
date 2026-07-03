"use client";

import { useState, useRef, useEffect } from "react";

export function MinimalDropdown({
  label,
  options,
  selected,
  onChange,
  multi,
  dark,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
  multi: boolean;
  dark?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggle = (val: string) => {
    if (multi) {
      onChange(selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]);
    } else {
      onChange(selected.includes(val) ? [] : [val]);
    }
  };

  const hasSelection = selected.length > 0;

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`text-sm tracking-wider transition-all duration-200 flex items-center gap-1.5 rounded-full px-3 py-1.5 border ${
          dark
            ? hasSelection || open
              ? "border-white text-white font-semibold"
              : "border-white/60 text-white/70 hover:border-white hover:text-white"
            : hasSelection || open
              ? "border-[#0B1220] text-[#0B1220] font-semibold"
              : "border-[#0B1220]/60 text-[#2B2F36]/70 hover:border-[#0B1220] hover:text-[#0B1220]"
        }`}
      >
        {label}
        <svg className={`w-3 h-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
        {hasSelection && multi && (
          <span className={`text-xs ml-0.5 ${dark ? "text-white/60" : "text-[#2B2F36]/60"}`}>({selected.length})</span>
        )}
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 sm:right-auto z-50 mt-2 bg-white border border-[#0B1220]/[0.06] min-w-[160px] sm:min-w-[180px] py-1.5 rounded-lg shadow-sm">
          {options.map((opt) => {
            const active = selected.includes(opt);
            return (
              <button
                key={opt}
                onClick={() => toggle(opt)}
                className={`flex w-full items-center gap-2 px-4 py-2 text-sm text-left transition-colors ${
                  active
                    ? "text-[#0B1220] font-semibold"
                    : "text-[#2B2F36]/50 hover:text-[#0B1220]"
                }`}
              >
                <span className="flex-1">{opt}</span>
                {active && (
                  <svg className="w-3.5 h-3.5 text-[#B88A5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
