"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";

const BLOG_ACCENT = "#1A6B52";
const BLOG_ACCENT_LIGHT = "#1A6B5215";
const BLOG_ACCENT_BORDER = "#1A6B5225";

const sections = [
  { id: "introduction", label: "Introduction" },
  { id: "what-is-burnout", label: "What is Employee Burnout?" },
  { id: "organizational-impact", label: "The Organizational Impact" },
  { id: "root-causes", label: "Root Causes at Work" },
  { id: "strategies", label: "Evidence-Based Strategies" },
  { id: "measuring", label: "Measuring Progress" },
];

const faqItems = [
  {
    q: "How do I know if my team is experiencing burnout?",
    a: "Look for signs like increased absenteeism, lower engagement scores, higher turnover, reduced productivity, and more conflict between team members. Pulse surveys and manager check-ins can help identify patterns before they become critical.",
  },
  {
    q: "What is the cost of employee burnout to our organization?",
    a: "Burnout costs organizations through lost productivity, increased healthcare claims, higher turnover and recruitment costs, absenteeism, and reduced innovation. Studies estimate burnout costs U.S. employers $125-190 billion annually in healthcare spending alone.",
  },
  {
    q: "How long does it take to see results from burnout prevention programs?",
    a: "Most organizations begin to see improvements in engagement and reduced absenteeism within 3-6 months of implementing comprehensive burnout prevention strategies. Full cultural change typically takes 12-18 months of consistent effort.",
  },
];

const relatedArticles = [
  {
    title: "Building Resilient Teams: A Practical Guide for HR Leaders",
    category: "Workplace Wellness",
    readTime: "6 min read",
    image: "/images/wellness-stretch.jpg",
  },
  {
    title: "The ROI of Mental Health Programs in Moroccan Companies",
    category: "Corporate Health",
    readTime: "8 min read",
    image: "/images/business-meeting.jpg",
  },
  {
    title: "5 Signs Your Workplace Culture Needs Attention",
    category: "Leadership",
    readTime: "4 min read",
    image: "/images/diverse-team.jpg",
  },
];

export default function BlogDemoPage() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-120px 0px -60% 0px", threshold: 0 }
    );

    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero: Image Left + Metadata Right ── */}
      <div className="mt-24 py-16 px-6 mb-14" style={{ backgroundColor: "#F4F1EB" }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-start">
          {/* Left: Image */}
          <div className="w-full lg:w-[440px] shrink-0">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/images/wellness-stretch.jpg"
                alt="Corporate wellness session"
                fill
                sizes="(max-width: 1024px) 100vw, 440px"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Right: Metadata */}
          <div className="flex-1 pt-2">
            <span
              className="inline-block text-[11px] font-bold tracking-[0.16em] uppercase px-3 py-1 rounded-full mb-5"
              style={{ color: BLOG_ACCENT, backgroundColor: BLOG_ACCENT_LIGHT, border: `1px solid ${BLOG_ACCENT_BORDER}` }}
            >
              Workplace Wellness
            </span>

            <h1 className="font-[family-name:var(--font-heading)] text-[#0B1220] text-[28px] sm:text-[34px] lg:text-[40px] font-extrabold leading-[1.1] tracking-[-0.02em] mb-4">
              Why Employee Burnout Is Now an Organizational Risk — and Not Just an HR Issue
            </h1>

            <p className="text-[#0B1220]/50 text-[15px] leading-relaxed mb-6">
              Employee burnout is now recognized as a significant organizational risk affecting productivity, retention, and costs. Discover how proactive strategies can mitigate these impacts.
            </p>

            <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-[#0B1220]/[0.06]">
              {/* Author with image */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src="/images/executive-team.jpg"
                    alt="Dr. Sara Drissi"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-[#0B1220] text-[13px] font-semibold">Dr. Sara Drissi</p>
                  <p className="text-[#0B1220]/40 text-[11px]">Head of Corporate Wellness</p>
                </div>
              </div>

              <div className="w-px h-5 bg-[#0B1220]/[0.08]" />

              {/* Date & Read time */}
              <div className="flex items-center gap-3 text-[12px] text-[#0B1220]/40 font-medium">
                <span>July 10, 2026</span>
                <span className="w-1 h-1 rounded-full bg-[#0B1220]/15" />
                <span>8 min read</span>
              </div>

              <div className="w-px h-5 bg-[#0B1220]/[0.08]" />

              {/* Share */}
              <div className="flex items-center gap-2">
                {["LinkedIn", "X", "FB", "Link"].map((s) => (
                  <button
                    key={s}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 text-[10px] font-bold"
                    style={{
                      backgroundColor: "#0B122008",
                      color: "#0B122040",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = BLOG_ACCENT_LIGHT; e.currentTarget.style.color = BLOG_ACCENT; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#0B122008"; e.currentTarget.style.color = "#0B122040"; }}
                  >
                    {s === "Link" ? (
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    ) : s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* ── Article Layout: Content + Sticky TOC ── */}
      <div className="max-w-[1200px] mx-auto px-6 flex gap-12 relative">
        {/* ── Sticky TOC Sidebar ── */}
        <aside className="hidden lg:block w-[220px] shrink-0">
          <div className="sticky top-28">
            <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#0B1220]/25 mb-4">Jump to section</p>
            <nav className="space-y-1">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block text-[12px] py-1.5 pl-3 border-l-2 transition-all duration-200"
                  style={{
                    borderColor: activeSection === s.id ? BLOG_ACCENT : "transparent",
                    color: activeSection === s.id ? "#0B1220" : "#0B122055",
                    fontWeight: activeSection === s.id ? 600 : 400,
                  }}
                >
                  {s.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* ── Main Content Column ── */}
        <article className="flex-1 max-w-[720px]">
          {/* ── Blog Highlights Box ── */}
          <div className="rounded-2xl p-6 sm:p-8 mb-12" style={{ backgroundColor: "#F8F7F4", border: "1px solid #0B122008" }}>
            <h3 className="font-[family-name:var(--font-heading)] text-[#0B1220] text-[15px] font-bold mb-4 flex items-center gap-2">
              <span className="w-6 h-[2px] rounded-full" style={{ backgroundColor: BLOG_ACCENT }} />
              Blog Highlights
            </h3>
            <ul className="space-y-3">
              {[
                "Burnout has become an organizational risk because it affects productivity, retention, healthcare costs, leave, and workforce stability.",
                "Burnout is not only an individual coping issue — it often reflects systemic workplace conditions such as unrealistic workload and unclear expectations.",
                "HR leaders can reduce burnout risk by identifying strain earlier, training managers, improving access to care, and designing work in more sustainable ways.",
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-[14px] text-[#0B1220]/65 leading-relaxed">
                  <span
                    className="shrink-0 w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center mt-0.5"
                    style={{ backgroundColor: BLOG_ACCENT_LIGHT, color: BLOG_ACCENT }}
                  >
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Article Body ── */}
          <div>
            <section id="introduction" className="mb-14">
              <p className="text-[#0B1220]/70 text-[16px] leading-[1.85] mb-5">
                Employee burnout is no longer only an employee wellbeing concern. It is an <strong className="text-[#0B1220] font-semibold">organizational risk</strong> that affects productivity, retention, healthcare costs, workforce stability, and business performance.
              </p>
              <p className="text-[#0B1220]/70 text-[16px] leading-[1.85] mb-5">
                A recent workplace mental health report makes that clear: <strong className="text-[#0B1220] font-semibold">60% of burned-out employees</strong> said they feel emotionally drained and exhausted at work. This is at a time when 83% of business leaders say they&apos;re navigating more major workplace changes than ever before.
              </p>
              <p className="text-[#0B1220]/70 text-[16px] leading-[1.85]">
                For HR leaders, this means burnout can no longer be treated as a personal resilience issue. It has to be treated as a <strong className="text-[#0B1220] font-semibold">business continuity issue</strong> — one that requires earlier identification, stronger manager support, better care access, and healthier organizational design.
              </p>
            </section>

            <section id="what-is-burnout" className="mb-14">
              <h2 className="font-[family-name:var(--font-heading)] text-[#0B1220] text-[24px] sm:text-[28px] font-bold mb-5 tracking-[-0.01em]">
                What Is Employee Burnout?
              </h2>
              <p className="text-[#0B1220]/70 text-[16px] leading-[1.85] mb-5">
                The World Health Organization defines burnout as &quot;a syndrome conceptualized as resulting from chronic workplace stress that has not been successfully managed.&quot; That definition matters because it shifts burnout away from being seen as an individual weakness.
              </p>
              <p className="text-[#0B1220]/70 text-[16px] leading-[1.85] mb-5">
                People experience burnout individually, but the conditions that create it are often <strong className="text-[#0B1220] font-semibold">systemic</strong>. Those conditions can include:
              </p>
              <ul className="space-y-2.5 mb-5 pl-1">
                {[
                  "Unrealistic workload and deadlines",
                  "Unclear priorities and expectations",
                  "Constant urgency without recovery time",
                  "Poor manager support and feedback",
                  "Limited autonomy over how work gets done",
                  "A culture that leaves too little room for rest",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[15px] text-[#0B1220]/65 leading-relaxed">
                    <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: BLOG_ACCENT }} />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section id="organizational-impact" className="mb-14">
              <h2 className="font-[family-name:var(--font-heading)] text-[#0B1220] text-[24px] sm:text-[28px] font-bold mb-5 tracking-[-0.01em]">
                The Organizational Impact
              </h2>
              <p className="text-[#0B1220]/70 text-[16px] leading-[1.85] mb-6">
                Burnout does not stay confined to how employees feel. It changes how organizations operate. Employees experiencing burnout may have less focus, lower energy, weaker engagement, and more difficulty sustaining performance.
              </p>

              {/* Stats grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                  { stat: "61%", label: "of HR professionals say mental health leaves increased in the past year" },
                  { stat: "16%", label: "say mental health leaves increased by 25% or more" },
                  { stat: "51%", label: "say rising manager burnout is their top concern for next year" },
                ].map((item, i) => (
                  <div key={i} className="rounded-xl p-5 text-center" style={{ backgroundColor: "#F8F7F4", border: "1px solid #0B122008" }}>
                    <p className="font-[family-name:var(--font-heading)] text-[32px] font-extrabold mb-1" style={{ color: BLOG_ACCENT }}>{item.stat}</p>
                    <p className="text-[#0B1220]/45 text-[12px] leading-snug">{item.label}</p>
                  </div>
                ))}
              </div>

              <p className="text-[#0B1220]/70 text-[16px] leading-[1.85]">
                Burnout affects whether teams can sustain performance, whether managers can lead effectively, whether key roles remain stable, and whether organizations can retain strong talent over time.
              </p>
            </section>

            <section id="root-causes" className="mb-14">
              <h2 className="font-[family-name:var(--font-heading)] text-[#0B1220] text-[24px] sm:text-[28px] font-bold mb-5 tracking-[-0.01em]">
                Root Causes at Work
              </h2>
              <p className="text-[#0B1220]/70 text-[16px] leading-[1.85] mb-5">
                Burnout is usually not caused by one difficult week. It builds when stress becomes chronic and employees do not have enough support, recovery, or control to manage it.
              </p>
              <p className="text-[#0B1220]/70 text-[16px] leading-[1.85] mb-5">
                Common workplace drivers include unrealistic workloads, unclear expectations, lack of manager support, low autonomy, poor work-life balance, constant urgency, and limited recognition.
              </p>
              <p className="text-[#0B1220]/70 text-[16px] leading-[1.85]">
                External pressures — economic uncertainty, community trauma, financial stress, and caregiving demands — can make burnout worse. Employers cannot remove every external stressor, but they can influence the workplace conditions that either compound strain or help employees recover.
              </p>
            </section>

            {/* ── Blockquote ── */}
            <blockquote className="rounded-2xl px-8 py-10 mb-14 relative overflow-hidden" style={{ backgroundColor: BLOG_ACCENT }}>
              <div className="absolute top-4 left-8 text-[80px] leading-none font-serif select-none" style={{ color: "rgba(255,255,255,0.12)" }}>&ldquo;</div>
              <p className="font-[family-name:var(--font-serif)] text-[20px] sm:text-[22px] leading-[1.6] text-white/90 relative z-10 italic">
                Organizations that take burnout seriously can reduce avoidable disruption, improve workforce stability, strengthen retention, and support more consistent performance across teams.
              </p>
            </blockquote>

            <section id="strategies" className="mb-14">
              <h2 className="font-[family-name:var(--font-heading)] text-[#0B1220] text-[24px] sm:text-[28px] font-bold mb-5 tracking-[-0.01em]">
                Evidence-Based Strategies
              </h2>
              <p className="text-[#0B1220]/70 text-[16px] leading-[1.85] mb-6">
                Burnout prevention works best when it combines early identification, manager capability, care access, and healthier work design. Here are five strategies that deliver measurable results:
              </p>
              <div className="space-y-4">
                {[
                  { title: "Identify burnout risk earlier", desc: "Use pulse surveys, structured manager check-ins, and benefit utilization trends to spot patterns before burnout becomes severe." },
                  { title: "Train managers to recognize and respond", desc: "Managers are often the first to notice when someone is struggling. Equip them to respond appropriately with training and clear guidelines." },
                  { title: "Improve access to mental health care", desc: "Awareness is not enough if employees cannot get timely support. Ensure fast access to coaching, therapy, and crisis support." },
                  { title: "Design work in more sustainable ways", desc: "Reduce unnecessary strain, clarify priorities, protect recovery time, and create clearer systems for ongoing support." },
                  { title: "Connect mental health strategy to business outcomes", desc: "Measure burnout as part of workforce health — connect to engagement, absenteeism, leave, turnover, and claims trends." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 rounded-xl p-5" style={{ backgroundColor: "#F8F7F4", border: "1px solid #0B122008" }}>
                    <span
                      className="shrink-0 w-8 h-8 rounded-full text-[13px] font-bold flex items-center justify-center"
                      style={{ backgroundColor: BLOG_ACCENT_LIGHT, color: BLOG_ACCENT }}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <h4 className="text-[#0B1220] text-[15px] font-bold mb-1">{item.title}</h4>
                      <p className="text-[#0B1220]/50 text-[13px] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="measuring" className="mb-14">
              <h2 className="font-[family-name:var(--font-heading)] text-[#0B1220] text-[24px] sm:text-[28px] font-bold mb-5 tracking-[-0.01em]">
                Measuring Progress
              </h2>
              <p className="text-[#0B1220]/70 text-[16px] leading-[1.85]">
                The cost of inaction is clear — but so is the upside of acting earlier. Track your organization&apos;s burnout indicators alongside business performance metrics. When you connect employee wellbeing to retention, engagement, and productivity data, you build the case for sustained investment in prevention.
              </p>
            </section>

            {/* ── About Wenaya ── */}
            <div className="rounded-2xl p-7 mb-14" style={{ backgroundColor: "#F8F7F4", border: "1px solid #0B122008" }}>
              <h3 className="font-[family-name:var(--font-heading)] text-[#0B1220] text-[17px] font-bold mb-3">About Wenaya</h3>
              <p className="text-[#0B1220]/55 text-[14px] leading-[1.7]">
                Wenaya is a multidisciplinary wellness clinic in Casablanca, Morocco, offering physiotherapy, nutrition, psychology, and corporate wellness programs. Our team of certified specialists provides personalized care plans that integrate conventional and alternative approaches to health.
              </p>
            </div>

            {/* ── FAQ ── */}
            <div className="mb-14">
              <h2 className="font-[family-name:var(--font-heading)] text-[#0B1220] text-[22px] font-bold mb-6">FAQ</h2>
              <div className="space-y-3">
                {faqItems.map((item, i) => (
                  <div key={i} className="rounded-xl overflow-hidden" style={{ border: "1px solid #0B122010", backgroundColor: "#FDFCFA" }}>
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-6 py-4 text-left"
                    >
                      <span className="text-[#0B1220] text-[14px] font-semibold pr-4">{item.q}</span>
                      <svg
                        className="shrink-0 w-4 h-4 transition-transform duration-300"
                        style={{ color: "#0B122040", transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)" }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"}`}
                    >
                      <p className="px-6 pb-5 text-[#0B1220]/50 text-[13px] leading-[1.7]">{item.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Bottom Share ── */}
            <div className="flex items-center gap-3 pb-10 mb-10" style={{ borderBottom: "1px solid #0B12200A" }}>
              <span className="text-[12px] text-[#0B1220]/35 font-medium">Share this article</span>
              <div className="flex gap-2">
                {["LinkedIn", "X", "FB", "Link"].map((s) => (
                  <button
                    key={s}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 text-[10px] font-bold"
                    style={{ backgroundColor: "#0B122008", color: "#0B122040" }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = BLOG_ACCENT_LIGHT; e.currentTarget.style.color = BLOG_ACCENT; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#0B122008"; e.currentTarget.style.color = "#0B122040"; }}
                  >
                    {s === "Link" ? (
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    ) : s}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Author Bio ── */}
            <div className="flex gap-5 rounded-2xl p-6 mb-14" style={{ backgroundColor: "#F8F7F4", border: "1px solid #0B122008" }}>
              <div className="shrink-0 w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src="/images/executive-team.jpg"
                  alt="Dr. Sara Drissi"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-[#0B1220] text-[15px] font-bold mb-0.5">Dr. Sara Drissi</p>
                <p className="text-[12px] font-semibold mb-2" style={{ color: BLOG_ACCENT }}>Head of Corporate Wellness, Wenaya</p>
                <p className="text-[#0B1220]/45 text-[13px] leading-[1.6]">
                  Dr. Sara Drissi is a clinical psychologist and corporate wellness specialist with over 12 years of experience in workplace mental health. She leads Wenaya&apos;s corporate programs, helping organizations across Morocco build healthier, more resilient teams.
                </p>
              </div>
            </div>
          </div>

          {/* ── Related Articles ── */}
          <div className="mb-16">
            <h3 className="font-[family-name:var(--font-heading)] text-[#0B1220] text-[20px] font-bold mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedArticles.map((article, i) => (
                <Link key={i} href="/blog" className="group rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1" style={{ backgroundColor: "#FDFCFA", border: "1px solid #0B122008" }}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 240px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-bold tracking-[0.12em] uppercase" style={{ color: BLOG_ACCENT }}>{article.category}</span>
                    <h4 className="text-[#0B1220] text-[14px] font-bold leading-snug mt-1.5 mb-2 transition-colors" style={{ ["--tw-text-opacity" as string]: "1" }}>
                      <span className="group-hover:text-[#1A6B52]">{article.title}</span>
                    </h4>
                    <p className="text-[#0B1220]/30 text-[11px] font-medium">{article.readTime}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </article>
      </div>

      {/* ── CTA Section ── */}
      <section className="mt-20 py-20 px-6" style={{ backgroundColor: "#0B1220" }} data-section-bg="dark">
        <div className="max-w-[640px] mx-auto text-center">
          <h2 className="font-[family-name:var(--font-heading)] text-white text-[28px] sm:text-[34px] font-extrabold leading-tight mb-4">
            Better Support, Better Outcomes, Stronger Teams
          </h2>
          <p className="text-white/45 text-[15px] leading-relaxed mb-8">
            Explore how Wenaya helps organizations reduce burnout and improve employee wellbeing across Morocco.
          </p>
          <Link
            href="/solutions/entreprises#contact"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full text-white text-[14px] font-semibold transition-all duration-300 hover:-translate-y-px"
            style={{ backgroundColor: BLOG_ACCENT }}
          >
            Book a Consultation
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="py-20 px-6" style={{ backgroundColor: "#FAFAF8" }}>
        <div className="max-w-[560px] mx-auto text-center">
          <h3 className="font-[family-name:var(--font-heading)] text-[#0B1220] text-[22px] font-bold mb-3">
            Stay Informed on Workplace Wellness
          </h3>
          <p className="text-[#0B1220]/40 text-[14px] leading-relaxed mb-6">
            Get monthly insights on employee health, burnout prevention, and corporate wellness programs delivered to your inbox.
          </p>
          <div className="flex gap-2 max-w-[420px] mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-5 py-2.5 rounded-full text-[#0B1220] text-[13px] placeholder:text-[#0B1220]/25 transition-all"
              style={{ backgroundColor: "white", border: "1px solid #0B122010" }}
            />
            <button
              className="px-6 py-2.5 rounded-full text-white text-[13px] font-semibold transition-all duration-300 shrink-0"
              style={{ backgroundColor: BLOG_ACCENT }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <div data-section-bg="dark"><Footer /></div>
    </div>
  );
}
