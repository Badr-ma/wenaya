"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { formatDate, categoryColors, type PostWithAuthor } from "@/lib/blog-utils";
import type { Category } from "@/lib/blog";
import { useLocale } from "@/contexts/LanguageContext";

function BlogCard({ post, index }: { post: PostWithAuthor; index: number }) {
  const { t } = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group block relative bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] hover:-translate-y-1"
      >
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:from-[#B88A5A]/20 group-hover:via-[#159AA9]/10 group-hover:to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 z-0 pointer-events-none" />
        <div className="relative overflow-hidden aspect-[16/9]">
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${post.featuredImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          {post.category && (
            <span
              className={`absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full text-[11px] font-mono font-medium border backdrop-blur-sm transition-all duration-300 group-hover:scale-105 ${
                categoryColors[post.category.slug] || "bg-gray-100 text-gray-700 border-gray-200"
              }`}
            >
              {post.category.name}
            </span>
          )}
          <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-[11px] font-mono text-gray-600 shadow-sm">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
            </svg>
            {post.readingTime} min
          </span>
        </div>
        <div className="relative p-6">
          <div className="flex items-center gap-3 mb-3 text-xs text-gray-400 font-mono">
            <span>{formatDate(post.publishedAt)}</span>
          </div>
          <h3 className="text-lg font-heading font-bold text-[#0B1220] leading-tight transition-colors duration-300 group-hover:text-[#B88A5A]">
            {post.title}
          </h3>
          <p className="mt-2 text-gray-500 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
          {post.author && (
            <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-50">
              <Image src={post.author.avatar} alt={post.author.name} width={32} height={32} className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-50" unoptimized />
              <div>
                <span className="block text-sm font-medium text-gray-900">{post.author.name}</span>
                <span className="text-[11px] text-gray-400 font-mono">{post.author.role}</span>
              </div>
            </div>
          )}
          <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-[#B88A5A] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
            <span>{t("blog.lireArticle")}</span>
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function BlogListClient({
  posts,
  categories,
}: {
  posts: PostWithAuthor[];
  categories: Category[];
}) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { t } = useLocale();
  const filtered = activeCategory ? posts.filter((p) => p.category?.slug === activeCategory) : posts;

  return (
    <section className="pb-24 sm:pb-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActiveCategory(null)}
            className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-mono font-medium transition-all duration-300 ${
              activeCategory === null
                ? "bg-[#0B1220] text-white shadow-md"
                : "bg-white text-gray-500 border border-gray-200 hover:border-[#B88A5A]/30 hover:text-[#B88A5A]"
            }`}
          >
            {t("blog.tous")}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-mono font-medium transition-all duration-300 ${
                activeCategory === cat.slug
                  ? "bg-[#0B1220] text-white shadow-md"
                  : "bg-white text-gray-500 border border-gray-200 hover:border-[#B88A5A]/30 hover:text-[#B88A5A]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">{t("blog.aucunDansCategorie")}</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <BlogCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
