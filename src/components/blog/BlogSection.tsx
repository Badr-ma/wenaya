/**
 * Blog Section — homepage preview of the 3 latest blog posts.
 * Displays post cards with featured image, category badge, title, excerpt, and author.
 * Features: GSAP staggered fade-in, "View All Posts" CTA link to /blog.
 */
"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import Image from "next/image";
import { formatDate, type PostWithAuthor } from "@/lib/blog-utils";
import { useLocale } from "@/contexts/LanguageContext";


function BlogCard({ post }: { post: PostWithAuthor }): React.JSX.Element {
  const { t } = useLocale();
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-[#E8E2D9] rounded-2xl border border-[#0B1220]/[0.06] overflow-hidden transition-all duration-500 hover:shadow-[0_8px_32px_rgba(184,138,90,0.06)] hover:border-[#B88A5A]/25 hover:-translate-y-0.5"
    >
      <div className="relative overflow-hidden aspect-[16/10]">
        <div className="absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${post.featuredImage})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-0.5 text-[10px] font-medium text-[#2B2F36]/60 shadow-sm">
          {post.readingTime} {t("blog.minLecture")}
        </span>
        {post.category && (
          <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#B88A5A]/10 text-[#B88A5A] border border-[#B88A5A]/20">
            {post.category.name}
          </span>
        )}
      </div>
      <div className="p-5">
        <span className="text-[10px] font-medium text-[#2B2F36]/40">{formatDate(post.publishedAt)}</span>
        <h3 className="font-heading font-bold text-[#0B1220] text-sm mt-1.5 leading-snug transition-colors duration-300 group-hover:text-[#B88A5A]">
          {post.title}
        </h3>
        <p className="text-[11px] text-[#2B2F36]/50 mt-1.5 leading-relaxed line-clamp-2">{post.excerpt}</p>
        {post.author && (
          <div className="flex items-center gap-2.5 mt-3 pt-3 border-t border-[#0B1220]/[0.04]">
            <Image src={post.author.avatar} alt={post.author.name} width={24} height={24} className="w-6 h-6 rounded-full object-cover" unoptimized />
            <div>
              <span className="text-[11px] font-medium text-[#0B1220]">{post.author.name}</span>
              <span className="text-[9px] text-[#2B2F36]/40 ml-1.5">{post.author.role}</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function BlogSection({ posts }: { posts: PostWithAuthor[] }): React.JSX.Element {
  const { t } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 85%" } });
      gsap.fromTo(cardsRef.current.filter(Boolean) as HTMLDivElement[], { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 82%" } });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#F2EFE9] py-10 sm:py-20 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        <div ref={headingRef} className="text-center mb-10 sm:mb-14 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-5">
            <div className="w-4 h-px bg-[#B88A5A]/40" />
            <span className="text-[#B88A5A] text-[10.5px] font-bold tracking-[0.22em] uppercase">{t("blog.badge")}</span>
            <div className="w-4 h-px bg-[#B88A5A]/40" />
          </div>
          <h2 className="heading-serif text-[clamp(2rem,4vw,3.5rem)] text-[#0B1220]">{t("blog.heading1")}{" "}
<span style={{
  background: "linear-gradient(135deg, #B88A5A 0%, #C99B68 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}}>
  {t("blog.heading2")}
</span></h2>
          <p className="text-[#2B2F36]/55 text-[14px] sm:text-[15px] mt-4 leading-relaxed">
            {t("blog.sub")}
          </p>
          <Link href="/blog"
            className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-[#B88A5A] hover:text-[#B88A5A]/70 transition-colors">
            <span>{t("blog.voirTous")}</span>
            <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12 text-[#2B2F36]/40">
            <p className="text-sm">{t("blog.aucunArticle")}</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post, i) => (
              <div key={post.slug} ref={(el) => { cardsRef.current[i] = el; }}>
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
