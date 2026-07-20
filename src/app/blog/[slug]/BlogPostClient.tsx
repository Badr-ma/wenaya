"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatDate, categoryColors, type PostWithAuthor } from "@/lib/blog-utils";
import { useLocale } from "@/contexts/LanguageContext";

function extractHeadings(content: string): { id: string; text: string; level: number }[] {
  const headings: { id: string; text: string; level: number }[] = [];
  const regex = /^(#{2,3})\s+(.+)$/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    headings.push({ id, text, level });
  }
  return headings;
}

function headingId(text: string): string {
  return String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function BlogPostClient({
  post,
  related,
}: {
  post: PostWithAuthor;
  related: PostWithAuthor[];
}) {
  const { t } = useLocale();
  const contentRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });
  const headings = useMemo(() => extractHeadings(post.content), [post.content]);
  const [activeHeading, setActiveHeading] = useState("");
  const [tocOpen, setTocOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0);

      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            setActiveHeading(h.id);
          }
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings]);

  const [shareUrl, setShareUrl] = useState("");
  // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe: only runs once on mount
  useEffect(() => { setShareUrl(window.location.href); }, []);
  const shareText = encodeURIComponent(post.title);

  return (
    <article className="min-h-screen bg-[#F2EFE9]">
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#B88A5A] via-[#B88A5A]/60 to-[#159AA9] z-[200] origin-left"
        style={{ scaleX: progress }}
      />

      <section ref={heroRef} className="relative pt-28 sm:pt-36 pb-8 sm:pb-12 overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${post.featuredImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1220]/80 via-[#0B1220]/60 to-[#F2EFE9]" />
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-[#B88A5A]/10 to-transparent blur-[120px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="flex items-center gap-2 text-sm text-white/50 mb-6">
              <Link href="/" className="hover:text-white transition-colors">{t("blog.accueil")}</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              <span>/</span>
              <span className="text-white/70">{post.title.slice(0, 40)}...</span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              {post.category && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-mono font-medium border ${categoryColors[post.category.slug] || "bg-white/10 text-white/70 border-white/20"}`}>
                  {post.category.name}
                </span>
              )}
              <span className="text-white/40 text-xs font-mono">{post.readingTime} min de lecture</span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-[clamp(2rem,4.5vw,3.5rem)] font-heading font-bold text-white leading-[1.05] tracking-tight max-w-3xl"
            >
              {post.title}
            </motion.h1>

            {post.author && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center gap-4 mt-8"
              >
                <Image src={post.author.avatar} alt={post.author.name} width={48} height={48} className="w-12 h-12 rounded-full object-cover ring-2 ring-white/20" unoptimized />
                <div>
                  <span className="block text-white font-medium text-sm">{post.author.name}</span>
                  <span className="text-white/50 text-xs font-mono">{post.author.role}</span>
                </div>
                <span className="text-white/30 text-xs font-mono ml-auto">{formatDate(post.publishedAt)}</span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Mobile TOC */}
      <div className="lg:hidden max-w-4xl mx-auto px-6 sm:px-8 -mt-2 mb-6">
        <button
          onClick={() => setTocOpen(!tocOpen)}
          className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-[#B88A5A] transition-colors text-xs font-mono"
        >
          <span>{t("blog.contenu")}</span>
          <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${tocOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {tocOpen && (
          <nav className="mt-1 px-4 py-3 rounded-xl bg-white border border-gray-200 space-y-2.5">
            {headings.map((h) => (
              <a
                key={h.id}
                href={`#${h.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
                  setTocOpen(false);
                }}
                className={`block text-xs leading-relaxed transition-colors duration-300 ${
                  activeHeading === h.id
                    ? "text-[#B88A5A] font-medium"
                    : "text-gray-400 hover:text-gray-600"
                } ${h.level === 3 ? "pl-4" : ""}`}
              >
                {h.text}
              </a>
            ))}
          </nav>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-24 sm:pb-32">
        <div className="lg:grid lg:grid-cols-[220px_1fr_180px] lg:gap-8 xl:gap-12">
          <aside className="hidden lg:block">
            <div className="sticky top-32">
              <h4 className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-4">{t("blog.contenu")}</h4>
              <nav className="space-y-2.5">
                {headings.map((h) => (
                  <a
                    key={h.id}
                    href={`#${h.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`block text-xs leading-relaxed transition-colors duration-300 ${
                      activeHeading === h.id
                        ? "text-[#B88A5A] font-medium"
                        : "text-gray-400 hover:text-gray-600"
                    } ${h.level === 3 ? "pl-4" : ""}`}
                  >
                    {h.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="min-w-0">
            <motion.div
              ref={contentRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="prose-custom"
            >
              <div className="[&_h2]:text-2xl [&_h2]:font-heading [&_h2]:font-bold [&_h2]:text-[#0B1220] [&_h2]:mt-12 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-heading [&_h3]:font-bold [&_h3]:text-[#0B1220] [&_h3]:mt-10 [&_h3]:mb-4 [&_p]:text-gray-600 [&_p]:leading-[1.8] [&_p]:mb-4 [&_blockquote]:border-l-4 [&_blockquote]:border-[#B88A5A]/30 [&_blockquote]:bg-[#B88A5A]/5 [&_blockquote]:rounded-r-xl [&_blockquote]:px-6 [&_blockquote]:py-4 [&_blockquote]:my-6 [&_blockquote]:text-gray-600 [&_blockquote]:italic [&_ul]:space-y-2 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:space-y-2 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:text-gray-600 [&_li]:leading-[1.8] [&_li]:pl-2 [&_strong]:font-semibold [&_strong]:text-[#0B1220]">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h2: ({ children, ...props }) => {
                      const text = String(children);
                      const id = headingId(text);
                      return <h2 id={id} {...props}>{children}</h2>;
                    },
                    h3: ({ children, ...props }) => {
                      const text = String(children);
                      const id = headingId(text);
                      return <h3 id={id} {...props}>{children}</h3>;
                    },
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </motion.div>

            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-gray-200">
              {post.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-mono text-gray-500 bg-gray-100 border border-gray-200">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Mobile share buttons */}
            <div className="lg:hidden flex items-center gap-3 mt-8 pt-6 border-t border-gray-200">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{t("blog.partager")}</span>
              <div className="flex gap-2">
                <a
                  href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-[#B88A5A] hover:border-[#B88A5A]/20 transition-all duration-300 text-xs"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                  <span className="hidden sm:inline">X</span>
                </a>
                <a
                  href={`https://www.linkedin.com/share?url=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-[#B88A5A] hover:border-[#B88A5A]/20 transition-all duration-300 text-xs"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                  <span className="hidden sm:inline">LinkedIn</span>
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-[#B88A5A] hover:border-[#B88A5A]/20 transition-all duration-300 text-xs"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                  </svg>
                  {copied ? "Copié!" : <span className="hidden sm:inline">{t("blog.copier")}</span>}
                </button>
              </div>
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-32">
              <h4 className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-4">{t("blog.partager")}</h4>
              <div className="flex flex-col gap-3">
                <a
                  href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-[#B88A5A] hover:border-[#B88A5A]/20 hover:shadow-sm transition-all duration-300 text-xs font-mono"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                  X
                </a>
                <a
                  href={`https://www.linkedin.com/share?url=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-[#B88A5A] hover:border-[#B88A5A]/20 hover:shadow-sm transition-all duration-300 text-xs font-mono"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                  LinkedIn
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(shareUrl)}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-[#B88A5A] hover:border-[#B88A5A]/20 hover:shadow-sm transition-all duration-300 text-xs font-mono"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                  </svg>
                  {t("blog.copier")}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {related.length > 0 && (
        <section className="bg-white border-t border-gray-100 py-20 sm:py-24">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <h2 className="text-2xl font-heading font-bold text-[#0B1220] mb-10">{t("blog.articlesConnexes")}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group block bg-[#F2EFE9] rounded-2xl overflow-hidden border border-gray-100 transition-all duration-500 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1"
                >
                  <div className="aspect-[16/9] overflow-hidden">
                    <div
                      className="w-full h-full bg-cover bg-center transition-all duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${r.featuredImage})` }}
                    />
                  </div>
                  <div className="p-5">
                    <div className="text-xs text-gray-400 font-mono mb-2">{formatDate(r.publishedAt)} · {r.readingTime} min</div>
                    <h3 className="text-base font-heading font-bold text-[#0B1220] group-hover:text-[#B88A5A] transition-colors duration-300">{r.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-gradient-to-br from-[#0B1220] to-[#0B1220]/95 py-20 sm:py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-full px-3 py-1 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B88A5A] animate-pulse-soft" />
              <span className="text-[10px] font-mono text-white/40 tracking-wider uppercase">{t("blog.newsletterBadge")}</span>
            </span>
            <h2 className="heading-serif text-[clamp(2rem,4vw,3.5rem)] text-white">
              {t("blog.newsletterHeading")}
            </h2>
            <p className="text-white/40 text-sm sm:text-base mt-4 max-w-lg mx-auto leading-relaxed">
              {t("blog.newsletterSub")}
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mt-8"
            >
              <input
                type="email"
                placeholder={t("blog.newsletterPlaceholder")}
                className="flex-1 h-12 px-4 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-[#B88A5A]/40 focus:ring-1 focus:ring-[#B88A5A]/20 transition-all duration-300"
              />
              <button
                type="submit"
                className="h-12 px-6 bg-[#B88A5A] text-white text-sm font-semibold rounded-xl hover:bg-[#B88A5A]/90 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(170,65,42,0.3)] shrink-0"
              >
                {t("blog.newsletterBtn")}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </article>
  );
}
