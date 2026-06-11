"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import type { Post, Author, Category } from "@/lib/blog";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const categoryColors: Record<string, string> = {
  longevity: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  biomarkers: "bg-blue-500/10 text-blue-600 border-blue-200",
  nutrition: "bg-amber-500/10 text-amber-600 border-amber-200",
  "ai-health": "bg-purple-500/10 text-purple-600 border-purple-200",
  prevention: "bg-rose-500/10 text-rose-600 border-rose-200",
};

function BlogCard({
  post,
  author,
  category,
  featured = false,
  index = 0,
}: {
  post: Post;
  author?: Author;
  category?: Category;
  featured?: boolean;
  index?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className={`group block relative bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] hover:-translate-y-1 h-full ${
          featured ? "lg:col-span-2 lg:row-span-2" : ""
        }`}
      >
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:from-[#AA412A]/20 group-hover:via-[#159AA9]/10 group-hover:to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 z-0 pointer-events-none" />
        <div className="relative overflow-hidden aspect-[16/9]">
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${post.featuredImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          {category && (
            <span
              className={`absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full text-[11px] font-mono font-medium border backdrop-blur-sm transition-all duration-300 group-hover:scale-105 ${
                categoryColors[category.slug] || "bg-gray-100 text-gray-700 border-gray-200"
              }`}
            >
              {category.name}
            </span>
          )}
          <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-[11px] font-mono text-gray-600 shadow-sm">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
            </svg>
            {post.readingTime} min
          </span>
        </div>
        <div className="relative p-6 flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-3 text-xs text-gray-400 font-mono">
            <span>{formatDate(post.publishedAt)}</span>
          </div>
          <h3
            className={`font-heading font-bold text-[#083241] leading-tight transition-colors duration-300 group-hover:text-[#AA412A] ${
              featured ? "text-xl sm:text-2xl" : "text-lg"
            }`}
          >
            {post.title}
          </h3>
          <p className="mt-2 text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1">{post.excerpt}</p>
          {author && (
            <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-50">
              <img
                src={author.avatar}
                alt={author.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-50"
              />
              <div>
                <span className="block text-sm font-medium text-gray-900">{author.name}</span>
                <span className="text-[11px] text-gray-400 font-mono">{author.role}</span>
              </div>
            </div>
          )}
          <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-[#AA412A] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
            <span>Lire l'article</span>
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function BlogSection({
  posts,
}: {
  posts: (Post & { author?: Author; category?: Category })[];
}) {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-[#F2EFE9]">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#AA412A]/5 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#159AA9]/5 to-transparent blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14"
        >
          <div>
            <span className="inline-flex items-center gap-2 bg-[#AA412A]/5 border border-[#AA412A]/10 rounded-full px-3 py-1 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#AA412A]/50" />
              <span className="text-[10px] font-mono text-[#AA412A]/60 tracking-wider uppercase">Insights</span>
            </span>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-heading font-bold text-[#083241] leading-[1.02] tracking-tight">
              Latest Insights
            </h2>
            <p className="text-gray-500 text-sm sm:text-base mt-3 max-w-lg leading-relaxed">
              Expert analysis on longevity science, biomarker optimization, and the future of preventive medicine.
            </p>
          </div>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-sm font-medium text-[#AA412A] hover:text-[#AA412A]/80 transition-colors shrink-0"
          >
            <span>Voir tous les articles</span>
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </Link>
        </motion.div>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">Aucun article pour le moment.</p>
            <p className="text-sm mt-1">Revenez bientôt pour de nouveaux insights.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <BlogCard key={post.slug} post={post} author={post.author} category={post.category} featured={i === 0} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
