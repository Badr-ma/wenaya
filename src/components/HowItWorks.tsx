"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

/* ── Card shell ─────────────────────────────────────────────── */
function Card({
  num, step, title, desc, children,
}: {
  num: string; step: string; title: string; desc: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div
      className="relative flex flex-col rounded-2xl px-8 py-10 min-h-[440px]"
      style={{
        background: "#E8E2D9",
        border: "1px solid rgba(11,18,32,0.08)",
        boxShadow: "0 2px 24px rgba(11,18,32,0.06)",
      }}
    >
      <span
        className="absolute top-5 right-5 font-heading font-black leading-none select-none pointer-events-none"
        style={{ fontSize: "72px", color: "rgba(11,18,32,0.04)" }}
      >
        {num}
      </span>

      <div className="w-6 h-[1.5px] rounded-full bg-[#B88A5A] mb-5 shrink-0" />
      <span className="text-[#B88A5A]/75 text-[10px] font-bold tracking-[0.2em] uppercase mb-1.5 shrink-0">{step}</span>
      <h3 className="text-[#0B1220] font-heading font-bold text-[19px] sm:text-[21px] leading-snug mb-2 shrink-0">{title}</h3>
      <p className="text-[#2B2F36]/50 text-[12.5px] leading-relaxed mb-6 shrink-0">{desc}</p>

      <div className="flex-1 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

/* ── 1. Assess — score arc 0→65 + metric pills ──────────────── */
function AssessViz(): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let alive = true;
    const scoreEl = el.querySelector<HTMLElement>(".as-score");
    const arcEl = el.querySelector<SVGCircleElement>(".as-arc");
    const pills = el.querySelectorAll<HTMLElement>(".as-pill");
    const circ = 2 * Math.PI * 40;

    let triggered = false;
    ScrollTrigger.create({
      trigger: el, start: "top 88%",
      onEnter: () => {
        if (triggered) return;
        triggered = true;
        let v = 0;
        const si = setInterval(() => {
          if (!alive) { clearInterval(si); return; }
          v++;
          if (scoreEl) scoreEl.textContent = String(v);
          if (arcEl) arcEl.style.strokeDashoffset = String(circ - (circ * v) / 100);
          if (v >= 65) clearInterval(si);
        }, 22);
        timers.push(setTimeout(() => clearInterval(si), 3000));
        pills.forEach((p, i) =>
          timers.push(setTimeout(() => {
            if (!alive) return;
            p.style.opacity = "1";
            p.style.transform = "translateY(0)";
          }, 1600 + i * 340))
        );
      },
      once: true,
    });
    return () => { alive = false; timers.forEach(clearTimeout); };
  }, []);

  return (
    <div ref={ref} className="flex flex-col items-center gap-4">
      <div className="relative w-[88px] h-[88px] flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(11,18,32,0.06)" strokeWidth="5" />
          <circle
            className="as-arc" cx="50" cy="50" r="40" fill="none"
            stroke="#B88A5A" strokeWidth="5"
            strokeDasharray={2 * Math.PI * 40}
            strokeDashoffset={2 * Math.PI * 40}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.08s linear" }}
          />
        </svg>
        <div className="text-center">
          <div className="as-score font-heading font-bold text-[#0B1220] text-xl leading-none">0</div>
          <div className="text-[9px] text-[#2B2F36]/35 font-medium">/100</div>
        </div>
      </div>
      <div className="flex gap-5">
        {[{ label: "Bio", value: "84" }, { label: "Clin", value: "72" }, { label: "Âge", value: "34" }].map((m) => (
          <div key={m.label} className="as-pill text-center transition-all duration-400" style={{ opacity: 0, transform: "translateY(8px)" }}>
            <div className="font-heading font-bold text-sm text-[#0B1220]">{m.value}</div>
            <div className="text-[9px] text-[#2B2F36]/35 tracking-wider">{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 2. Align — rows slide in + checkmarks ───────────────────── */
function AlignViz(): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let alive = true;
    const items = el.querySelectorAll<HTMLElement>(".al-item");
    const checks = el.querySelectorAll<HTMLElement>(".al-check");

    let triggered = false;
    ScrollTrigger.create({
      trigger: el, start: "top 88%",
      onEnter: () => {
        if (triggered) return;
        triggered = true;
        items.forEach((it, i) =>
          timers.push(setTimeout(() => {
            if (!alive) return;
            it.style.opacity = "1";
            it.style.transform = "translateX(0)";
          }, 300 + i * 480))
        );
        checks.forEach((c, i) =>
          timers.push(setTimeout(() => {
            if (!alive) return;
            c.style.opacity = "1";
          }, 620 + i * 480))
        );
      },
      once: true,
    });
    return () => { alive = false; timers.forEach(clearTimeout); };
  }, []);

  return (
    <div ref={ref} className="w-full space-y-2.5">
      {["Alimentation", "Activité", "Sommeil"].map((label) => (
        <div
          key={label}
          className="al-item flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#0B1220]/[0.06] border border-[#0B1220]/[0.08] transition-all duration-400"
          style={{ opacity: 0, transform: "translateX(-10px)" }}
        >
          <div
            className="al-check w-5 h-5 rounded-full bg-[#BBF6F3] flex items-center justify-center shrink-0 transition-opacity duration-300"
            style={{ opacity: 0 }}
          >
            <svg className="w-2.5 h-2.5 text-[#0B1220]" fill="none" viewBox="0 0 10 10">
              <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-[#0B1220]/75 text-[12.5px] font-medium">{label}</span>
        </div>
      ))}
    </div>
  );
}

/* ── 3. Activate — timeline dots animate ────────────────────── */
function ActivateViz(): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let alive = true;
    const dots = el.querySelectorAll<HTMLElement>(".ac-dot");
    const lines = el.querySelectorAll<HTMLElement>(".ac-line");

    let triggered = false;
    ScrollTrigger.create({
      trigger: el, start: "top 88%",
      onEnter: () => {
        if (triggered) return;
        triggered = true;
        dots.forEach((d, i) =>
          timers.push(setTimeout(() => {
            if (!alive) return;
            d.style.borderColor = "#BBF6F3";
            d.style.backgroundColor = "#BBF6F3";
            d.style.color = "#0B1220";
          }, 500 + i * 650))
        );
        lines.forEach((l, i) =>
          timers.push(setTimeout(() => {
            if (!alive) return;
            l.style.width = "100%";
          }, 680 + i * 650))
        );
      },
      once: true,
    });
    return () => { alive = false; timers.forEach(clearTimeout); };
  }, []);

  return (
    <div ref={ref} className="w-full flex flex-col gap-5">
      <div className="flex items-center justify-between px-2 relative">
        {["J0", "J45", "J90"].map((label, i) => (
          <div key={label} className="flex flex-col items-center gap-2 relative z-10">
            <div
              className="ac-dot w-10 h-10 rounded-full border-2 flex items-center justify-center font-heading font-bold text-xs transition-all duration-500"
              style={{ borderColor: "rgba(11,18,32,0.1)", color: "rgba(11,18,32,0.3)" }}
            >
              {label}
            </div>
            {i < 2 && (
              <div className="absolute left-full top-5 -translate-y-1/2 w-[64px] h-px bg-[#0B1220]/[0.06] overflow-hidden" style={{ marginLeft: "4px" }}>
                <div className="ac-line h-full bg-[#BBF6F3] transition-all duration-500" style={{ width: "0%" }} />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-[#159AA9]/[0.06] border border-[#159AA9]/[0.12] px-4 py-3">
        <div className="text-[10px] text-[#159AA9] font-semibold tracking-wide mb-0.5">Prochaine étape</div>
        <div className="text-[12.5px] text-[#0B1220]/75 font-medium">Bilan de contrôle J45</div>
      </div>
    </div>
  );
}

/* ── 4. Sustain — Function Health-style upward line chart ───── */
function SustainViz(): React.JSX.Element {
  const svgRef = useRef<SVGSVGElement>(null);
  const W = 200, H = 90;
  const pts = [0.15, 0.26, 0.40, 0.54, 0.65, 0.75, 0.84];
  const xs = pts.map((_, i) => 4 + (i / (pts.length - 1)) * (W - 8));
  const ys = pts.map((p) => H - 8 - p * (H - 18));

  /* smooth bezier path */
  let linePath = `M ${xs[0]},${ys[0]}`;
  for (let i = 1; i < pts.length; i++) {
    const cx = (xs[i - 1] + xs[i]) / 2;
    linePath += ` C ${cx},${ys[i - 1]} ${cx},${ys[i]} ${xs[i]},${ys[i]}`;
  }
  const areaPath = `${linePath} L ${xs[xs.length - 1]},${H} L ${xs[0]},${H} Z`;
  const lastX = xs[xs.length - 1];
  const lastY = ys[ys.length - 1];

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const lineEl = svg.querySelector<SVGPathElement>(".su-line");
    const areaEl = svg.querySelector<SVGPathElement>(".su-area");
    const dotEls = svg.querySelectorAll<SVGCircleElement>(".su-dot");
    const endDot = svg.querySelector<SVGCircleElement>(".su-end");
    const pulse = svg.querySelector<SVGCircleElement>(".su-pulse");

    let triggered = false;
    ScrollTrigger.create({
      trigger: svg, start: "top 88%",
      onEnter: () => {
        if (triggered) return;
        triggered = true;
        if (lineEl) {
          lineEl.style.transition = "stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)";
          lineEl.style.strokeDashoffset = "0";
        }
        setTimeout(() => { if (areaEl) areaEl.style.opacity = "1"; }, 500);
        dotEls.forEach((d, i) =>
          setTimeout(() => { d.style.opacity = "1"; d.setAttribute("r", "2.5"); }, 650 + i * 160)
        );
        setTimeout(() => {
          if (endDot) { endDot.style.opacity = "1"; endDot.setAttribute("r", "4"); }
          if (pulse) pulse.style.opacity = "0.35";
        }, 650 + pts.length * 160 + 80);
      },
      once: true,
    });
  }, []);

  return (
    <div className="w-full flex flex-col gap-2.5">
      {/* Label + badge */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-[#2B2F36]/45 font-medium">Santé durable</span>
        <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full text-[#B88A5A] bg-[#B88A5A]/10">+41%</span>
      </div>

      {/* Chart */}
      <div
        className="w-full rounded-xl overflow-hidden"
        style={{ background: "rgba(11,18,32,0.06)", border: "1px solid rgba(11,18,32,0.09)" }}
      >
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full" fill="none">
          <defs>
            <linearGradient id="su-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B88A5A" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#B88A5A" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Subtle grid */}
          {[0.3, 0.6].map((t) => (
            <line key={t}
              x1="4" y1={H - 8 - t * (H - 18)}
              x2={W - 4} y2={H - 8 - t * (H - 18)}
              stroke="rgba(11,18,32,0.04)" strokeWidth="1"
            />
          ))}

          {/* Area */}
          <path className="su-area" d={areaPath} fill="url(#su-grad)" style={{ opacity: 0, transition: "opacity 0.9s ease" }} />

          {/* Track */}
          <path d={linePath} stroke="rgba(11,18,32,0.05)" strokeWidth="1.5" strokeLinecap="round" />

          {/* Animated line */}
          <path
            className="su-line"
            d={linePath}
            stroke="#B88A5A" strokeWidth="2" strokeLinecap="round"
            strokeDasharray={350} strokeDashoffset={350}
          />

          {/* Intermediate dots */}
          {xs.slice(0, -1).map((x, i) => (
            <circle key={i} className="su-dot" cx={x} cy={ys[i]} r="0"
              fill="#B88A5A" style={{ opacity: 0, transition: "opacity 0.3s, r 0.3s" }} />
          ))}

          {/* Pulse ring */}
          <circle className="su-pulse" cx={lastX} cy={lastY} r="9"
            fill="none" stroke="#B88A5A" strokeWidth="1"
            style={{ opacity: 0, transition: "opacity 0.5s" }} />

          {/* End dot */}
          <circle className="su-end" cx={lastX} cy={lastY} r="0"
            fill="#B88A5A" style={{ opacity: 0, transition: "opacity 0.3s, r 0.3s" }} />
        </svg>
      </div>

      {/* X-axis labels */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-[#2B2F36]/35">Mois 1</span>
        <span className="text-[10px] text-[#2B2F36]/35">Mois 12</span>
      </div>
    </div>
  );
}

/* ── Section ─────────────────────────────────────────────────── */
export default function HowItWorks(): React.JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(headRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.55, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 82%" } }
      );
      gsap.fromTo(gridRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.08, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 80%" } }
      );
      gsap.fromTo(ctaRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.2, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 75%" } }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="method"
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
      style={{ background: "#FAF8F4" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-16 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, #F2EFE9, transparent)" }}
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10">

        {/* Header */}
        <div ref={headRef} className="text-center mb-14 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-5">
            <div className="w-4 h-px bg-[#B88A5A]/40" />
            <span className="text-[#B88A5A] text-[10.5px] font-bold tracking-[0.22em] uppercase">Méthode Wenaya</span>
            <div className="w-4 h-px bg-[#B88A5A]/40" />
          </div>
          <h2
            className="font-heading font-bold text-[#0B1220] leading-tight"
            style={{ fontSize: "clamp(1.85rem, 3.5vw, 2.75rem)" }}
          >
            Votre parcours en{" "}
            <span style={{
              background: "linear-gradient(135deg, #B88A5A 0%, #C99B68 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              quatre étapes
            </span>
          </h2>
          <p className="text-[#2B2F36]/55 text-[14px] sm:text-[15px] mt-4 leading-relaxed">
            De l'évaluation à la performance durable,{" "}
            <br className="hidden sm:block" />
            chaque étape est conçue pour vous.
          </p>
        </div>

        {/* Cards */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
        >
          <Card num="01" step="Étape 01" title="Assess" desc="Comprendre où vous en êtes avec 160+ biomarqueurs analysés.">
            <AssessViz />
          </Card>
          <Card num="02" step="Étape 02" title="Align" desc="Construire un parcours nutrition, activité et sommeil sur mesure.">
            <AlignViz />
          </Card>
          <Card num="03" step="Étape 03" title="Activate" desc="Passer à l'action avec votre coach et vos médecins référents.">
            <ActivateViz />
          </Card>
          <Card num="04" step="Étape 04" title="Sustain" desc="Maintenir vos acquis et prévenir les maladies sur le long terme.">
            <SustainViz />
          </Card>
        </div>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
          <Link
            href="#"
            onClick={(e) => e.preventDefault()}
            className="inline-flex items-center justify-center h-11 px-7 rounded-xl text-white text-[13.5px] font-semibold transition-all duration-300 hover:-translate-y-px"
            style={{ background: "#0B1220", boxShadow: "0 4px 20px rgba(11,18,32,0.18)" }}
          >
            Commencer votre bilan
          </Link>
          <Link
            href="#"
            onClick={(e) => e.preventDefault()}
            className="inline-flex items-center gap-2 h-11 px-7 rounded-xl border border-[#0B1220]/[0.12] text-[#0B1220]/60 text-[13.5px] font-medium transition-all duration-300 hover:text-[#0B1220] hover:border-[#0B1220]/[0.22] hover:bg-[#0B1220]/[0.03]"
          >
            Voir comment ça marche
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
