import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPublishedPosts, authors, categories } from "@/lib/blog";
import { formatDate, categoryColors } from "@/lib/blog-utils";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import BlogListClient from "./BlogListClient";

export const metadata: Metadata = {
  title: "Blog | Wenaya — Prévention, Performance & Longévité",
  description:
    "Expert insights on longevity science, biomarker optimization, AI-powered preventive medicine, and personalized nutrition from the Wenaya team.",
};

export default function BlogPage() {
  const posts = getPublishedPosts();
  const enriched = posts.map((p) => ({
    ...p,
    author: authors.find((a) => a.id === p.authorId),
    category: categories.find((c) => c.id === p.categoryId),
  }));

  const latest = enriched[0];

  return (
    <ErrorBoundary>
    <div className="min-h-screen bg-[#F2EFE9]">
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-gradient-to-bl from-[#B88A5A]/5 to-transparent blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#159AA9]/5 to-transparent blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] rounded-full bg-gradient-to-br from-[#0B1220]/3 to-transparent blur-[80px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 bg-[#B88A5A]/5 border border-[#B88A5A]/10 rounded-full px-3 py-1 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B88A5A]/50" />
              <span className="text-[10px] font-mono text-[#B88A5A]/60 tracking-wider uppercase">Blog</span>
            </span>
            <h1 className="text-[clamp(2.4rem,5vw,4rem)] font-heading font-bold text-[#0B1220] leading-[1.02] tracking-tight">
              Insights & <span className="text-[#B88A5A]">Recherche</span>
            </h1>
            <p className="text-gray-500 text-sm sm:text-base mt-4 max-w-lg leading-relaxed">
              Expert analysis on the science of longevity, biomarker optimization, and the future of personalized preventive medicine.
            </p>
          </div>
        </div>
      </section>

      {latest && (
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 -mt-6 mb-12">
          <Link
            href={`/blog/${latest.slug}`}
            className="group block relative bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] hover:-translate-y-1"
          >
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:from-[#B88A5A]/20 group-hover:via-[#159AA9]/10 group-hover:to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 z-0 pointer-events-none" />
            <div className="sm:flex">
              <div className="sm:w-[45%] relative overflow-hidden aspect-[16/9] sm:aspect-auto sm:min-h-[320px]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${latest.featuredImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 sm:hidden">
                  {latest.category && (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-mono font-medium border backdrop-blur-sm ${categoryColors[latest.category.slug] || "bg-white/90 text-gray-700 border-gray-200"}`}>
                      {latest.category.name}
                    </span>
                  )}
                </div>
              </div>
              <div className="sm:w-[55%] p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                <div className="hidden sm:flex items-center gap-3 mb-4">
                  {latest.category && (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-mono font-medium border ${categoryColors[latest.category.slug] || "bg-gray-100 text-gray-700 border-gray-200"}`}>
                      {latest.category.name}
                    </span>
                  )}
                  <span className="text-xs text-gray-400 font-mono">{latest.readingTime} min de lecture</span>
                </div>
                <span className="text-[10px] font-mono text-[#B88A5A]/60 tracking-wider uppercase mb-2">Dernier article</span>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-[#0B1220] leading-tight transition-colors duration-300 group-hover:text-[#B88A5A]">
                  {latest.title}
                </h2>
                <p className="mt-3 text-gray-500 text-sm leading-relaxed line-clamp-2">{latest.excerpt}</p>
                {latest.author && (
                  <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-50">
                    <Image src={latest.author.avatar} alt={latest.author.name} width={32} height={32} className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-50" unoptimized />
                    <div>
                      <span className="block text-sm font-medium text-gray-900">{latest.author.name}</span>
                      <span className="text-[11px] text-gray-400 font-mono">{formatDate(latest.publishedAt)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Link>
        </section>
      )}

      <BlogListClient posts={enriched} categories={categories} />
    </div>
    </ErrorBoundary>
  );
}
