"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import { formatDate, type PostWithAuthor } from "@/lib/blog-utils";

gsap.registerPlugin(ScrollTrigger);

function BlogCard({ post, index }: { post: PostWithAuthor; index: number }): React.JSX.Element {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-[#E8E2D9] rounded-2xl border border-[#0B1220]/[0.06] overflow-hidden transition-all duration-500 hover:shadow-[0_8px_32px_rgba(184,138,90,0.06)] hover:border-[#B88A5A]/25 hover:-translate-y-0.5"
    >
      <div className="relative overflow-hidden aspect-[16/10]">
        <div className="absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${post.featuredImage})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-0.5 text-[10px] font-medium text-[#2B2F36]/60 shadow-sm">
          {post.readingTime} min
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
    <section ref={sectionRef} className="bg-[#F2EFE9] py-16 sm:py-20 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        <div ref={headingRef} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[#B88A5A] font-semibold text-xs tracking-[0.2em] uppercase">Insights</span>
            <h2 className="heading-serif text-[clamp(1.5rem,3vw,2.5rem)] text-[#0B1220] mt-2">Latest Insights</h2>
            <p className="text-[#2B2F36]/60 text-sm mt-2 max-w-md leading-relaxed">
              Expert analysis on longevity science, biomarker optimization, and preventive medicine.
            </p>
          </div>
          <Link href="/blog"
            className="group inline-flex items-center gap-1.5 text-xs font-medium text-[#B88A5A] hover:text-[#B88A5A]/70 transition-colors shrink-0">
            <span>Voir tous les articles</span>
            <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12 text-[#2B2F36]/40">
            <p className="text-sm">Aucun article pour le moment.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post, i) => (
              <div key={post.slug} ref={(el) => { cardsRef.current[i] = el; }}>
                <BlogCard post={post} index={i} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
