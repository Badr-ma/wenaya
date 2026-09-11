"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useLocale } from "@/contexts/LanguageContext";
import type { HowItWorksContent } from "@/lib/homepage-types";

interface HowItWorksStep {
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
    <p className="mhm-lbl mb-7 text-[9.5px] font-bold uppercase tracking-[0.24em] text-[#0B1220]/40">
      {children}
    </p>
  );
}

/* ── 01 COMPRENDRE — health-assessment indicators ─────────────── */
const ASSESS_VALUES = [78, 52, 90, 64]; // final fill % per dimension

function AssessmentPanel({ label, dims }: { label: string; dims: string[] }): React.JSX.Element {
  return (
    <div aria-hidden className="flex w-full flex-1 flex-col items-center justify-center pt-2">
      <VisualCaption>{label}</VisualCaption>
      <div className="w-full max-w-[220px]">
        {dims.map((d, i) => {
          const last = i === dims.length - 1;
          return (
            <div key={i} className="mb-6 last:mb-0">
              <div className="mb-2 flex items-center justify-between">
                <span
                  className="mhm-lbl text-[11px] font-semibold tracking-wide text-[#0B1220]/85"
                  style={{ transitionDelay: `${150 + i * 150}ms` }}
                >
                  {d}
                </span>
                <span
                  className="mhm-node h-1.5 w-1.5 rounded-full"
                  style={{
                    background: last ? BRONZE : TEAL,
                    transitionDelay: `${200 + i * 150}ms`,
                  }}
                />
              </div>
              <div className="h-[3px] w-full overflow-hidden rounded-full bg-[#0B1220]/[0.08]">
                <span
                  className="mhm-bar block h-full rounded-full"
                  style={{
                    width: `${ASSESS_VALUES[i]}%`,
                    background: last
                      ? `linear-gradient(90deg, ${BRONZE}, #C99B68)`
                      : `linear-gradient(90deg, ${TEAL}, #3BC1D4)`,
                    transitionDelay: `${320 + i * 460}ms`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── 02 AGIR — flowing vertical pathway ────────────────────────── */
function ActionPlanPanel({ label, nodes }: { label: string; nodes: string[] }): React.JSX.Element {
  return (
    <div aria-hidden className="flex w-full flex-1 flex-col items-center justify-center pt-2">
      <VisualCaption>{label}</VisualCaption>
      <div className="relative w-full max-w-[230px] py-1">
        <span
          className="mhm-line-vert absolute bottom-3 left-[9px] top-3 w-[2px] rounded-full bg-[#159AA9]/20"
          style={{ transitionDelay: "150ms" }}
        />
        {nodes.map((n, i) => {
          const last = i === nodes.length - 1;
          return (
            <div key={i} className="relative flex items-center gap-3.5 py-2">
              <span
                className="mhm-node relative z-10 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2"
                style={{
                  borderColor: last ? BRONZE : TEAL,
                  background: last ? "rgba(184,138,90,0.14)" : "rgba(21,154,169,0.14)",
                  transitionDelay: `${480 + i * 500}ms`,
                }}
              >
                <span className="h-[6px] w-[6px] rounded-full" style={{ background: last ? BRONZE : TEAL }} />
              </span>
              <span
                className="mhm-lbl text-[12px] font-medium text-[#0B1220]/85"
                style={{ transitionDelay: `${540 + i * 500}ms` }}
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
const MILESTONE_POS = [
  { left: "4.6%", top: "88%" },
  { left: "50%", top: "56%" },
  { left: "95.4%", top: "18%" },
];

function FollowUpPanel({ label, milestones }: { label: string; milestones: string[] }): React.JSX.Element {
  return (
    <div aria-hidden className="flex w-full flex-1 flex-col items-center justify-center pt-2">
      <VisualCaption>{label}</VisualCaption>
      <div className="relative w-full max-w-[270px]">
        <div className="relative h-[110px] w-full">
          <svg
            viewBox="0 0 260 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
            aria-hidden
          >
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
          {milestones.map((m, i) => {
            const last = i === milestones.length - 1;
            return (
              <div
                key={i}
                className="absolute flex flex-col items-center"
                style={{ left: MILESTONE_POS[i].left, top: MILESTONE_POS[i].top, transform: "translate(-50%,-50%)" }}
              >
                <span
                  className="mhm-node flex h-[16px] w-[16px] items-center justify-center rounded-full border-2"
                  style={{
                    borderColor: last ? BRONZE : TEAL,
                    background: last ? "rgba(184,138,90,0.14)" : "rgba(21,154,169,0.14)",
                    transitionDelay: `${700 + i * 650}ms`,
                  }}
                >
                  <span className="h-[5px] w-[5px] rounded-full" style={{ background: last ? BRONZE : TEAL }} />
                </span>
                <span
                  className="mhm-lbl mt-2 whitespace-nowrap text-center text-[9.5px] font-semibold tracking-wide text-[#0B1220]/70"
                  style={{ transitionDelay: `${780 + i * 650}ms` }}
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
    <article
      className="relative flex h-full flex-col rounded-2xl bg-white px-6 py-8 sm:px-7 sm:py-9"
      style={{
        border: "1px solid rgba(11,18,32,0.08)",
        boxShadow: "0 2px 24px rgba(11,18,32,0.06)",
      }}
    >
      <div className="mhm-reveal mb-6 flex flex-col items-center text-center">
        <div className="mb-4 flex w-full items-center gap-2">
          <span className="font-heading text-[12px] font-bold tracking-wider text-[#B88A5A]">0{index + 1}</span>
          <span className="h-px flex-1 bg-[#0B1220]/[0.1]" />
        </div>
        <h3 className="heading-serif text-[#0B1220] text-[clamp(1.3rem,1.9vw,1.6rem)] leading-[1.2]">
          {step.title}
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed text-[#0B1220]/[0.55] max-w-[260px]">{step.short}</p>
      </div>
      <div className="mhm-reveal flex min-h-[280px] flex-1 flex-col">
        {index === 0 && <AssessmentPanel label={visuals.pane1} dims={visuals.dims} />}
        {index === 1 && <ActionPlanPanel label={visuals.pane2} nodes={visuals.nodes} />}
        {index === 2 && <FollowUpPanel label={visuals.pane3} milestones={visuals.milestones} />}
      </div>
    </article>
  );
}

/* ── Section ─────────────────────────────────────────────────── */
interface HowItWorksProps {
  content?: HowItWorksContent;
}

export default function HowItWorks({ content }: HowItWorksProps): React.JSX.Element {
  const { t, tRaw } = useLocale();
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
          <h2 className="heading-serif text-[#0B1220] text-[clamp(1.875rem,3.2vw,2.75rem)]">
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
          <p className="mt-4 text-[14px] leading-relaxed text-[#2B2F36]/55 sm:text-[15px]">
            {content?.sub ?? t("howItWorks.sub")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {steps?.map((step, i) => (
            <Card key={step.title} index={i} step={step} visuals={visuals} />
          ))}
        </div>
      </div>
    </section>
  );
}