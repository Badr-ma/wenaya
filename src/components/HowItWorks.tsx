"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ── Card wrapper ───────────────────────────────────────── */
function Card({ step, title, desc, children }: { step: string; title: string; desc: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#0B1220]/[0.04] p-6 flex flex-col w-full sm:w-[270px] transition-all duration-500 hover:shadow-[0_8px_32px_rgba(184,138,90,0.06)] hover:border-[#B88A5A]/15" style={{ minHeight: "280px", boxShadow: "0 1px 3px rgba(0,0,0,0.02), 0 4px 16px rgba(0,0,0,0.03)" }}>
      <span className="text-[#B88A5A] font-semibold text-xs tracking-[0.15em]">{step}</span>
      <h3 className="heading-serif text-xl text-[#0B1220] mt-1 mb-1">{title}</h3>
      <p className="text-[11px] text-[#2B2F36]/50 mb-4 leading-relaxed">{desc}</p>
      <div className="flex-1">{children}</div>
    </div>
  );
}

/* ── 1. Assess — score circle 0→65 + 3 pills ────────────── */
function AssessAnim(): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let t: ReturnType<typeof setTimeout>[] = [];
    let alive = true;

    const scoreEl = el.querySelector<HTMLDivElement>(".as-score");
    const arcEl = el.querySelector<SVGCircleElement>(".as-arc");
    const pills = el.querySelectorAll<HTMLDivElement>(".as-pill");
    const circumference = 2 * Math.PI * 42;

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
          if (arcEl) arcEl.style.strokeDashoffset = String(circumference - (circumference * v) / 100);
          if (v >= 65) clearInterval(si);
        }, 20);
        t.push(setTimeout(() => clearInterval(si), 3000));
        pills.forEach((p, i) => t.push(setTimeout(() => { if (!alive) return; p.style.opacity = "1"; p.style.transform = "translateY(0)"; }, 1600 + i * 350)));
      },
      once: true,
    });

    return () => { alive = false; t.forEach(clearTimeout); };
  }, []);

  return (
    <Card step="Étape 01" title="Assess" desc="Comprendre où vous en êtes.">
      <div ref={ref} className="flex flex-col items-center gap-3 pt-2">
        <div className="relative w-[90px] h-[90px] flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#0B1220/[0.04]" strokeWidth="6" />
            <circle className="as-arc" cx="50" cy="50" r="42" fill="none" stroke="#B88A5A" strokeWidth="6" strokeDasharray={2 * Math.PI * 42} strokeDashoffset={2 * Math.PI * 42} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.1s linear" }} />
          </svg>
          <div className="text-center">
            <div className="as-score font-heading font-bold text-[#0B1220] text-xl leading-none">0</div>
            <div className="text-[9px] text-[#2B2F36]/40 font-medium">/100</div>
          </div>
        </div>
        <div className="flex gap-3">
          {[
            { label: "Bio", value: "84" },
            { label: "Clin", value: "72" },
            { label: "Âge", value: "34" },
          ].map(item => (
            <div key={item.label} className="as-pill text-center transition-all duration-400" style={{ opacity: 0, transform: "translateY(8px)" }}>
              <div className="font-heading font-semibold text-sm text-[#0B1220]">{item.value}</div>
              <div className="text-[8px] text-[#2B2F36]/40 font-medium tracking-wider">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ── 2. Align — 3 pills slide in left to right ──────────── */
function AlignAnim(): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let t: ReturnType<typeof setTimeout>[] = [];
    let alive = true;

    const items = el.querySelectorAll<HTMLDivElement>(".al-item");
    const checks = el.querySelectorAll<HTMLDivElement>(".al-check");

    let triggered = false;
    ScrollTrigger.create({
      trigger: el, start: "top 88%",
      onEnter: () => {
        if (triggered) return;
        triggered = true;
        items.forEach((it, i) => t.push(setTimeout(() => { if (!alive) return; it.style.opacity = "1"; it.style.transform = "translateX(0)"; }, 300 + i * 500)));
        checks.forEach((c, i) => t.push(setTimeout(() => { if (!alive) return; c.style.opacity = "1"; }, 600 + i * 500)));
      },
      once: true,
    });

    return () => { alive = false; t.forEach(clearTimeout); };
  }, []);

  return (
    <Card step="Étape 02" title="Align" desc="Construire un parcours qui vous ressemble.">
      <div ref={ref} className="space-y-3 pt-1">
        {["Alimentation", "Activité", "Sommeil"].map(label => (
          <div key={label} className="al-item flex items-center gap-3 p-2.5 rounded-xl bg-[#0B1220]/[0.02] border border-[#0B1220]/[0.03] transition-all duration-400" style={{ opacity: 0, transform: "translateX(-12px)" }}>
            <div className="al-check w-4 h-4 rounded-full bg-[#BBF6F3] flex items-center justify-center transition-opacity duration-300" style={{ opacity: 0 }}>
              <svg className="w-2.5 h-2.5 text-[#0B1220]" fill="none" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <span className="text-xs font-medium text-[#0B1220]">{label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ── 3. Activate — timeline dots + line ─────────────────── */
function ActivateAnim(): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let t: ReturnType<typeof setTimeout>[] = [];
    let alive = true;

    const dots = el.querySelectorAll<HTMLDivElement>(".ac-dot");
    const lines = el.querySelectorAll<HTMLDivElement>(".ac-line");

    let triggered = false;
    ScrollTrigger.create({
      trigger: el, start: "top 88%",
      onEnter: () => {
        if (triggered) return;
        triggered = true;
        dots.forEach((d, i) => t.push(setTimeout(() => { if (!alive) return; d.className = "ac-dot w-9 h-9 rounded-full border-2 flex items-center justify-center font-heading font-bold text-xs transition-all duration-500 border-[#BBF6F3] bg-[#BBF6F3] text-[#0B1220]"; }, 500 + i * 700)));
        lines.forEach((l, i) => t.push(setTimeout(() => { if (!alive) return; l.style.width = "100%"; }, 600 + i * 700)));
      },
      once: true,
    });

    return () => { alive = false; t.forEach(clearTimeout); };
  }, []);

  return (
    <Card step="Étape 03" title="Activate" desc="Passer à l'action, ensemble.">
      <div ref={ref} className="flex flex-col gap-4 pt-2">
        <div className="flex items-center justify-between px-1">
          {["J0", "J45", "J90"].map((label, i) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div className="ac-dot w-9 h-9 rounded-full border-2 flex items-center justify-center font-heading font-bold text-xs transition-all duration-500 border-[#0B1220]/10 text-[#0B1220]/30">{label}</div>
              {i < 2 && (
                <div className="w-12 h-[2px] bg-[#0B1220]/5 rounded-full overflow-hidden -mt-6">
                  <div className="ac-line h-full bg-[#BBF6F3] rounded-full transition-all duration-500" style={{ width: "0%" }} />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-2 p-2.5 rounded-xl bg-[#159AA9]/5 border border-[#159AA9]/10">
          <div className="text-[10px] text-[#159AA9] font-semibold">Prochaine étape</div>
          <div className="text-[11px] text-[#0B1220] font-medium mt-0.5">Bilan de contrôle J45</div>
        </div>
      </div>
    </Card>
  );
}

/* ── 4. Sustain — graph line draws + dot pulses ─────────── */
function SustainAnim(): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let t: ReturnType<typeof setTimeout>[] = [];
    let alive = true;

    const lineEl = el.querySelector<SVGPathElement>(".su-line");
    const dotEl = el.querySelector<SVGCircleElement>(".su-dot");

    let triggered = false;
    ScrollTrigger.create({
      trigger: el, start: "top 88%",
      onEnter: () => {
        if (triggered) return;
        triggered = true;
        t.push(setTimeout(() => { if (!alive) return; if (lineEl) lineEl.style.strokeDashoffset = "0"; }, 300));
        t.push(setTimeout(() => { if (!alive) return; if (dotEl) { dotEl.style.opacity = "1"; dotEl.style.r = "3"; } }, 2000));
      },
      once: true,
    });

    return () => { alive = false; t.forEach(clearTimeout); };
  }, []);

  return (
    <Card step="Étape 04" title="Sustain" desc="Prévenir, performer, durer.">
      <div ref={ref} className="flex items-center justify-center h-full pt-4">
        <svg className="w-full max-w-[140px]" viewBox="0 0 120 50" fill="none">
          <path d="M5,42 Q30,38 55,22 T105,8" stroke="#0B1220/[0.04]" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path className="su-line" d="M5,42 Q30,38 55,22 T105,8" stroke="#BBF6F3" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeDasharray={140} strokeDashoffset={140} style={{ transition: "stroke-dashoffset 1.6s ease-out" }} />
          <circle className="su-dot" cx="105" cy="8" r="0" fill="#BBF6F3" style={{ transition: "opacity 0.3s, r 0.3s" }} />
        </svg>
      </div>
    </Card>
  );
}

/* ── Section ─────────────────────────────────────────────── */
export default function HowItWorks(): React.JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 85%" } });
      gsap.fromTo(cardRefs.current.filter(Boolean) as HTMLDivElement[], { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 82%" } });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#F2EFE9] relative overflow-hidden" id="method" style={{ padding: "80px 0" }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-10 relative">
        <div ref={headingRef} className="text-center mb-14">
          <span className="text-[#B88A5A] font-semibold text-xs tracking-[0.2em] uppercase">Méthode Wenaya</span>
          <h2 className="heading-serif text-[clamp(1.8rem,3.5vw,3rem)] text-[#0B1220] mt-3">Votre parcours en quatre étapes</h2>
          <p className="text-[#2B2F36]/60 text-sm sm:text-base mt-3 max-w-lg mx-auto leading-relaxed">
            De l'évaluation à la performance durable, chaque étape est conçue pour vous.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-5">
          <div ref={(el) => { cardRefs.current[0] = el; }}><AssessAnim /></div>
          <div ref={(el) => { cardRefs.current[1] = el; }}><AlignAnim /></div>
          <div ref={(el) => { cardRefs.current[2] = el; }}><ActivateAnim /></div>
          <div ref={(el) => { cardRefs.current[3] = el; }}><SustainAnim /></div>
        </div>

        <div className="flex items-center justify-center gap-3 mt-12">
          <a href="#" onClick={(e) => e.preventDefault()}
            className="inline-flex items-center justify-center px-8 h-12 bg-[#0B1220] text-white rounded-full font-medium text-sm tracking-wide transition-all duration-300 hover:bg-[#2B2F36] hover:shadow-[0_4px_16px rgba(11,18,32,0.15)]">
            Commencer votre bilan
          </a>
        </div>
      </div>
    </section>
  );
}
