/**
 * Blog Post Client — Editorial (FR-only).
 *
 * Renders the FR article detail page in the old wenaya.com editorial style:
 * ivory background, strong serif title, large image-first hero, narrow
 * reading column, reduced share controls, an optional practitioner booking
 * CTA (allowlisted authors only), a compact author bio, a "Découvrez aussi"
 * related grid and the newsletter band. Light, gentle motion only.
 *
 * The `content` prop is the PRE-SANITIZED HTML emitted by the articles API
 * adapter (whitelist p/ul/ol/li/strong/em/br) — it is rendered through the
 * same `.bio-content` stylesheet used by specialist profiles. It is NOT
 * markdown (do not route through ReactMarkdown, which would escape it).
 */
"use client";

import { useEffect, useState } from "react";
import { MotionConfig, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/contexts/LanguageContext";
import { h } from "@/lib/href";
import { formatDate, type PostWithAuthor } from "@/lib/blog-utils";
import type { BlogPractitioner } from "@/lib/blog-practitioner";

/** Neutral local fallback for broken/injected-404 hero images. */
const FALLBACK_IMAGE = "/images/wellness-stretch.jpg";

export default function BlogPostClientEditorial({
  post,
  related,
  practitioner,
}: {
  post: PostWithAuthor;
  related: PostWithAuthor[];
  practitioner: BlogPractitioner | null;
}) {
  const { t, locale } = useLocale();
  const [heroSrc, setHeroSrc] = useState(post.featuredImage || FALLBACK_IMAGE);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // hydration-safe: window is unavailable during SSR, set once on mount
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShareUrl(window.location.href);
  }, []);

  const shareText = encodeURIComponent(post.title);
  const authorName = post.author?.name?.trim() || "";
  const hasAvatar = Boolean(post.author?.avatar?.trim());

  const practitionerHref = practitioner ? h(locale, `/professional/${practitioner.slug}`) : null;
  const backHref = h(locale, "/articles");

  return (
    <MotionConfig reducedMotion="user">
      <motion.article
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="min-h-screen bg-[#FAF8F4]"
      >
        {/* Back link */}
        <div className="max-w-4xl mx-auto px-6 sm:px-8 pt-10 sm:pt-14">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-xs font-mono text-[#2B2F36]/60 hover:text-[#B88A5A] transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {t("blog.retourArticles")}
          </Link>
        </div>

        {/* Editorial header */}
        <header className="max-w-4xl mx-auto px-6 sm:px-8 pt-10 sm:pt-14 pb-8 sm:pb-10">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B88A5A]" />
            <span className="text-[10px] font-mono text-[#B88A5A] uppercase tracking-[0.22em]">
              {t("blog.badge")}
            </span>
          </div>

          <h1 className="heading-serif text-[#0B1220] leading-[1.08] tracking-[-0.01em] text-[clamp(1.9rem,4.2vw,3.1rem)]">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-[#2B2F36]/70 leading-[1.7] text-base sm:text-lg mt-5 max-w-[640px]">
              {post.excerpt}
            </p>
          )}

          {/* Author + date row */}
          <div className="flex items-center gap-3 mt-7">
            {authorName && (
              <>
                <span className="flex items-center gap-3">
                  {hasAvatar ? (
                    <Image
                      src={post.author!.avatar as string}
                      alt={authorName}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="w-10 h-10 rounded-full bg-[#0B1220] text-white flex items-center justify-center text-sm font-semibold">
                      {authorName.charAt(0).toUpperCase()}
                    </span>
                  )}
                  {practitioner && practitionerHref ? (
                    <Link
                      href={practitionerHref}
                      className="text-sm font-semibold text-[#0B1220] underline underline-offset-4 decoration-transparent transition-colors duration-300 hover:text-[#B88A5A] hover:decoration-[#B88A5A]/50 focus-visible:outline-2 focus-visible:outline-[#B88A5A]/60 focus-visible:outline-offset-2 rounded-sm"
                    >
                      {authorName}
                    </Link>
                  ) : (
                    <span className="text-sm font-semibold text-[#0B1220]">{authorName}</span>
                  )}
                </span>
                <span className="text-xs text-[#0B1220]/40" aria-hidden="true">·</span>
              </>
            )}
            <span className="text-xs font-mono text-[#2B2F36]/50">
              {formatDate(post.publishedAt, locale)}
            </span>
          </div>
        </header>

        {/* Image-first hero */}
        <div className="max-w-4xl mx-auto px-6 sm:px-8 pb-10 sm:pb-12">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-[#F2EFE9]">
            <Image
              src={heroSrc}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 896px"
              className="object-cover"
              onError={() => {
                if (heroSrc !== FALLBACK_IMAGE) setHeroSrc(FALLBACK_IMAGE);
              }}
            />
          </div>
        </div>

        {/* Reading column + share */}
        <div className="max-w-4xl mx-auto px-6 sm:px-8 pb-20 sm:pb-24">
          <div className="grid lg:grid-cols-[1fr_64px] lg:gap-10">
            <div className="min-w-0">
              <div
                className="bio-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Practitioner CTA — allowlist only */}
              {practitioner && practitionerHref && (
                <div className="mt-10 rounded-2xl border border-[#B88A5A]/25 bg-white px-6 sm:px-8 py-6 sm:py-7">
                  <p className="text-sm text-[#2B2F36]/70 leading-relaxed">
                    {t("blog.bookSession")
                      .replace("{name}", practitioner.name)
                      .trim()}
                  </p>
                  <Link
                    href={practitionerHref}
                    className="mt-4 inline-flex items-center gap-2 h-12 px-6 rounded-full bg-[#0B1220] text-white text-sm font-semibold hover:bg-[#B88A5A] transition-colors duration-300"
                  >
                    {practitioner.name}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4-4 4M21 12H3" />
                    </svg>
                  </Link>
                </div>
              )}

              {/* Author bio card */}
              {authorName && (
                <div className="mt-10 flex items-center gap-4 rounded-2xl bg-[#F2EFE9] px-6 py-5">
                  {hasAvatar ? (
                    <Image
                      src={post.author!.avatar as string}
                      alt={authorName}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="w-12 h-12 rounded-full bg-[#0B1220] text-white flex items-center justify-center text-base font-semibold">
                      {authorName.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-[#0B1220]">{authorName}</p>
                    <p className="text-xs font-mono text-[#2B2F36]/50">
                      {formatDate(post.publishedAt, locale)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Share rail (desktop) + inline (mobile) */}
            <aside className="lg:mt-1">
              <p className="text-[10px] font-mono text-[#2B2F36]/40 uppercase tracking-widest mb-3">
                {t("blog.partager")}
              </p>
              <div className="flex lg:flex-col gap-2">
                <a
                  href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-[#0B1220]/10 text-[#2B2F36]/60 hover:text-[#B88A5A] hover:border-[#B88A5A]/30 transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                  <span className="lg:hidden text-xs">X</span>
                </a>
                <a
                  href={`https://www.linkedin.com/share?url=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-[#0B1220]/10 text-[#2B2F36]/60 hover:text-[#B88A5A] hover:border-[#B88A5A]/30 transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                  <span className="lg:hidden text-xs">LinkedIn</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(shareUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  aria-label={t("blog.copier")}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-[#0B1220]/10 text-[#2B2F36]/60 hover:text-[#B88A5A] hover:border-[#B88A5A]/30 transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                  </svg>
                  <span className="lg:hidden text-xs">{copied ? t("blog.copie") : t("blog.copier")}</span>
                </button>
              </div>
            </aside>
          </div>

          {/* End-of-article practitioner repeat */}
          {practitioner && practitionerHref && (
            <div className="mt-8 lg:hidden">
              <Link
                href={practitionerHref}
                className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-[#0B1220] text-white text-sm font-semibold hover:bg-[#B88A5A] transition-colors duration-300"
              >
                {practitioner.name}
              </Link>
            </div>
          )}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="bg-white border-t border-[#0B1220]/5 py-16 sm:py-20">
            <div className="max-w-4xl mx-auto px-6 sm:px-8">
              <h2 className="heading-serif text-[#0B1220] text-[clamp(1.5rem,2.6vw,1.9rem)] mb-8">
                {t("blog.relatedHeading")}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={h(locale, `/articles/${r.slug}`)}
                    className="group block bg-[#FAF8F4] rounded-2xl overflow-hidden border border-[#0B1220]/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(11,18,32,0.07)]"
                  >
                    <div className="aspect-[16/9] overflow-hidden bg-[#F2EFE9]">
                      <Image
                        src={r.featuredImage || FALLBACK_IMAGE}
                        alt={r.title}
                        width={720}
                        height={405}
                        sizes="(max-width: 1023px) 50vw, 288px"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] font-mono text-[#2B2F36]/50 mb-2">
                        {formatDate(r.publishedAt, locale)}
                      </p>
                      <h3 className="text-sm font-heading font-bold text-[#0B1220] leading-snug group-hover:text-[#B88A5A] transition-colors duration-300">
                        {r.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Newsletter */}
        <section className="bg-[#0B1220] py-16 sm:py-20">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <span className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-full px-3 py-1 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B88A5A]" />
              <span className="text-[10px] font-mono text-white/40 tracking-wider uppercase">
                {t("blog.newsletterBadge")}
              </span>
            </span>
            <h2 className="heading-serif text-[clamp(1.6rem,3vw,2.4rem)] text-white">
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
                className="h-12 px-6 bg-[#B88A5A] text-white text-sm font-semibold rounded-xl hover:bg-[#B88A5A]/90 transition-all duration-300 shrink-0"
              >
                {t("blog.newsletterBtn")}
              </button>
            </form>
          </div>
        </section>
      </motion.article>
    </MotionConfig>
  );
}