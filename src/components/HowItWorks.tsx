"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { useLocale } from "@/contexts/LanguageContext";
import type { HowItWorksContent } from "@/lib/homepage-types";
import SubtitleSplit from "@/components/SubtitleSplit";

interface HowItWorksStep {
  label: string;
  title: string;
  short: string;
}

/* i18n data shape — dims/nodes/milestones rendered; statuses/recs reserved. */
interface HowItWorksVisuals {
  pane1: string;
  pane2: string;
  pane3: string;
  dims: string[];
  statuses: string[];
  nodes: string[];
  milestones: string[];
  recs: string[];
}

const TEAL = "#159AA9";
const BRONZE = "#B88A5A";

/* ── Small editorial caption above every visual ───────────────── */
function VisualCaption({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <p className="mhm-lbl mb-4 text-[9.5px] font-bold uppercase tracking-[0.24em] text-[#0B1220]/40">
      {children}
    </p>
  );
}

/* Scroll-linked count-up for the assessment score. The old GSAP version counted
 * 0 → score in sync with the arc (both 1.5s power2.out starting together); CSS
 * cannot count, so a tiny IO-driven hook mirrors that. Reduced-motion / SSR
 * render the final value statically. */
function useCountUp(target: number, durationMs: number): { ref: RefObject<HTMLDivElement | null>; value: number } {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(target);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    let raf = 0;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (!en.isIntersecting) {
            setValue(target);
            continue;
          }
          setValue(0);
          const t0 = performance.now();
          cancelAnimationFrame(raf);
          const step = (now: number) => {
            const p = Math.min(1, (now - t0) / durationMs);
            const e = 1 - (1 - p) * (1 - p); // power2.out
            setValue(Math.round(target * e));
            if (p < 1) raf = requestAnimationFrame(step);
          };
          raf = requestAnimationFrame(step);
        }
      },
      { threshold: 0, rootMargin: "-8% 0px" }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, durationMs]);

  return { ref, value };
}

/* ── 01 COMPRENDRE — health-assessment score dial ─────────────── */
const ASSESS_VALUES = [78, 52, 90, 64]; // final fill % per dimension
/* Overall score = rounded mean of ASSESS_VALUES (71). The CSS reveal targets
 * the arc at 1 − SCORE/100 = 0.29 dashoffset — keep globals.css in sync. */
const ASSESS_SCORE = Math.round(ASSESS_VALUES.reduce((a, b) => a + b, 0) / ASSESS_VALUES.length);

function AssessmentPanel({ label, dims }: { label: string; dims: string[] }): React.JSX.Element {
  const { ref: scoreRef, value: score } = useCountUp(ASSESS_SCORE, 1500);
  return (
    <div aria-hidden className="flex w-full flex-1 flex-col items-center justify-center pt-2">
      <VisualCaption>{label}</VisualCaption>
      <div className="flex w-full max-w-[185px] flex-col items-center">
        <div className="relative mb-6 flex h-[88px] w-[88px] items-center justify-center">
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100" fill="none" aria-hidden>
            <circle cx="50" cy="50" r="40" stroke="rgba(11,18,32,0.06)" strokeWidth="5" />
            <circle
              className="mhm-arc"
              cx="50" cy="50" r="40"
              stroke={TEAL}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={1}
              pathLength={1}
            />
          </svg>
          <div className="relative text-center">
            <div
              ref={scoreRef}
              className="mhm-node font-heading text-[20px] font-bold leading-none text-[#0B1220]"
              style={{ transitionDelay: "0ms" }}
            >
              {score}
            </div>
            <div
              className="mhm-lbl mt-1 text-[10px] font-medium tracking-wide text-[#2B2F36]/40"
              style={{ transitionDelay: "0ms" }}
            >
              /100
            </div>
          </div>
        </div>
        <div className="flex w-full items-start justify-between gap-1.5">
          {dims.map((d, i) => {
            const last = i === dims.length - 1;
            const v = ASSESS_VALUES[i] ?? 0;
            return (
              <div
                key={i}
                className="mhm-lbl flex flex-1 flex-col items-center gap-1.5 rounded-lg border px-0.5 py-1.5 text-center"
                style={{
                  borderColor: last ? "rgba(184,138,90,0.28)" : "rgba(21,154,169,0.18)",
                  background: last ? "rgba(184,138,90,0.06)" : "rgba(21,154,169,0.05)",
                  transitionDelay: `${1500 + i * 340}ms`,
                }}
              >
                <span
                  className="font-heading text-[13px] font-bold leading-none"
                  style={{ color: last ? BRONZE : "#0B1220" }}
                >
                  {v}
                </span>
                <span className="max-w-full truncate text-[9px] font-semibold uppercase tracking-wide text-[#0B1220]/45">
                  {d}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── 02 AGIR — flowing vertical pathway ────────────────────────── */
function ActionPlanPanel({ label, nodes }: { label: string; nodes: string[] }): React.JSX.Element {
  return (
    <div aria-hidden className="flex w-full flex-1 flex-col items-center justify-center pt-2">
      <VisualCaption>{label}</VisualCaption>
      <div className="relative w-full max-w-[195px] py-0.5">
        <span
          className="mhm-line-vert absolute bottom-3 left-[9px] top-3 w-[2px] rounded-full bg-[#159AA9]/20"
          style={{ transitionDelay: "150ms" }}
        />
        {nodes.map((n, i) => {
          const last = i === nodes.length - 1;
          return (
            <div key={i} className="relative flex items-center gap-2.5 py-2">
              <span
                className="mhm-node relative z-10 flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full border-2"
                style={{
                  borderColor: last ? BRONZE : TEAL,
                  background: last ? "rgba(184,138,90,0.14)" : "rgba(21,154,169,0.14)",
                  transitionDelay: `${150 + i * 650}ms`,
                }}
              >
                <span className="h-[5px] w-[5px] rounded-full" style={{ background: last ? BRONZE : TEAL }} />
              </span>
              <span
                className="mhm-lbl text-[11px] font-medium text-[#0B1220]/85"
                style={{ transitionDelay: `${210 + i * 650}ms` }}
              >
                {n}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── 03 PROGRESSER — rising progress line ──────────────────────── */
const PROGRESS_PATH = "M12 92 C 82 76, 178 48, 248 22";
/* Closed path under the curve for the gradient area fill (Sustain restore). */
const PROGRESS_AREA_PATH = `${PROGRESS_PATH} L 248 100 L 12 100 Z`;
const MILESTONE_POS = [
  { left: "4.6%", top: "88%" },
  { left: "50%", top: "56%" },
  { left: "95.4%", top: "18%" },
];

function FollowUpPanel({ label, milestones }: { label: string; milestones: string[] }): React.JSX.Element {
  return (
    <div aria-hidden className="flex w-full flex-1 flex-col items-center justify-center pt-2">
      <VisualCaption>{label}</VisualCaption>
      <div className="relative w-full max-w-[225px]">
        <div className="relative h-[92px] w-full">
          <svg
            viewBox="0 0 260 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
            aria-hidden
          >
            <defs>
              <linearGradient id="mhm-progress-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={TEAL} stopOpacity="0.14" />
                <stop offset="100%" stopColor={TEAL} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={PROGRESS_AREA_PATH} fill="url(#mhm-progress-fill)" className="mhm-area" />
            <path
              d={PROGRESS_PATH}
              fill="none"
              stroke={TEAL}
              strokeWidth="2.5"
              strokeLinecap="round"
              pathLength={1}
              className="mhm-draw"
            />
          </svg>
          <div
            className="absolute"
            style={{
              left: MILESTONE_POS[MILESTONE_POS.length - 1].left,
              top: MILESTONE_POS[MILESTONE_POS.length - 1].top,
              transform: "translate(-50%,-50%)",
            }}
          >
            <span
              className="mhm-pulse block h-[18px] w-[18px] rounded-full"
              style={{ border: `1px solid ${BRONZE}`, transitionDelay: "1700ms" }}
            />
          </div>
          {milestones.map((m, i) => {
            const last = i === milestones.length - 1;
            return (
              <div
                key={i}
                className="absolute flex flex-col items-center"
                style={{ left: MILESTONE_POS[i].left, top: MILESTONE_POS[i].top, transform: "translate(-50%,-50%)" }}
              >
                <span
                  className="mhm-node flex h-[14px] w-[14px] items-center justify-center rounded-full border-2"
                  style={{
                    borderColor: last ? BRONZE : TEAL,
                    background: last ? "rgba(184,138,90,0.14)" : "rgba(21,154,169,0.14)",
                    transitionDelay: `${650 + i * 160}ms`,
                  }}
                >
                  <span className="h-[5px] w-[5px] rounded-full" style={{ background: last ? BRONZE : TEAL }} />
                </span>
                <span
                  className="mhm-lbl mt-2 whitespace-nowrap text-center text-[9.5px] font-semibold tracking-wide text-[#0B1220]/70"
                  style={{ transitionDelay: `${710 + i * 160}ms` }}
                >
                  {m}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Card ─────────────────────────────────────────────────────── */
function Card({
  index, step, visuals,
}: {
  index: number; step: HowItWorksStep; visuals: HowItWorksVisuals;
}): React.JSX.Element {
  return (
    <div
      className="relative flex flex-col rounded-2xl px-6 py-7 sm:px-7 sm:py-8 min-h-[280px] sm:min-h-[330px]"
      style={{
        background: "#E8E2D9",
        border: "1px solid rgba(11,18,32,0.08)",
        boxShadow: "0 2px 24px rgba(11,18,32,0.06)",
      }}
    >
      <span
        aria-hidden
        className="absolute top-4 right-4 font-heading font-black leading-none select-none pointer-events-none"
        style={{ fontSize: "54px", color: "rgba(11,18,32,0.04)" }}
      >
        0{index + 1}
      </span>

      <div aria-hidden className="mb-3 h-[1.5px] w-6 shrink-0 rounded-full bg-[#B88A5A]" />
      <span className="mb-1 shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-[#B88A5A]/75">
        {step.label}
      </span>
      <h3 className="mb-1.5 shrink-0 font-heading text-[22px] font-bold leading-[1.15] text-[#0B1220] sm:text-[24px] lg:text-[26px]">
        {step.title}
      </h3>
      <p className="mb-3.5 shrink-0 text-[12px] leading-relaxed text-[#2B2F36]/50">{step.short}</p>

      <div className="mhm-reveal flex min-h-[200px] flex-1 flex-col">
        {index === 0 && <AssessmentPanel label={visuals.pane1} dims={visuals.dims} />}
        {index === 1 && <ActionPlanPanel label={visuals.pane2} nodes={visuals.nodes} />}
        {index === 2 && <FollowUpPanel label={visuals.pane3} milestones={visuals.milestones} />}
      </div>
    </div>
  );
}

/* ── Section ─────────────────────────────────────────────────── */
interface HowItWorksProps {
  content?: HowItWorksContent;
}

export default function HowItWorks({ content }: HowItWorksProps): React.JSX.Element {
  const { t, tRaw, locale } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    el.classList.add("mhm-armed");

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("mhm-visible");
          } else {
            el.classList.remove("mhm-visible");
          }
        }
      },
      { threshold: 0, rootMargin: "-8% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const steps = tRaw<HowItWorksStep[]>("howItWorks.steps");
  const visuals = tRaw<HowItWorksVisuals>("howItWorks.visuals");

  return (
    <section
      ref={sectionRef}
      id="method"
      className="relative overflow-hidden py-12 sm:py-20 lg:py-24"
      style={{ background: "#FAF8F4" }}
    >
      <div
        className="absolute left-0 right-0 top-0 h-16 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, #F2EFE9, transparent)" }}
      />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-10">
        <div className="mhm-reveal mx-auto mb-10 max-w-xl text-center sm:mb-14">
          <div className="mb-5 inline-flex items-center gap-2">
            <div className="h-px w-4 bg-[#B88A5A]/40" />
            <span className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-[#B88A5A]">
              {content?.badge ?? t("howItWorks.badge")}
            </span>
            <div className="h-px w-4 bg-[#B88A5A]/40" />
          </div>
          <h2 className="heading-serif text-[#0B1220] text-[40px] sm:text-[50px] lg:text-[60px] leading-[1.02]">
            {content?.heading1 ?? t("howItWorks.heading1")}{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #B88A5A 0%, #C99B68 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {content?.heading2 ?? t("howItWorks.heading2")}
            </span>
          </h2>
          <p className="mt-4 text-[13px] leading-relaxed text-[#2B2F36]/55 sm:text-[14px] lg:text-[15px]">
            <SubtitleSplit text={content?.sub ?? t("howItWorks.sub")} bronze={locale === "fr" ? "en actions concrètes." : "into concrete actions."} />
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {steps?.map((step, i) => (
            <Card key={step.title} index={i} step={step} visuals={visuals} />
          ))}
        </div>
      </div>
    </section>
  );
}