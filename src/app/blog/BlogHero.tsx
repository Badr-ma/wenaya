"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDate, categoryColors, type PostWithAuthor } from "@/lib/blog-utils";
import { useLocale } from "@/contexts/LanguageContext";

export default function BlogHero({ latest }: { latest: PostWithAuthor | null }) {
  const { t } = useLocale();

  return (
    <>
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-gradient-to-bl from-[#B88A5A]/5 to-transparent blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#159AA9]/5 to-transparent blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] rounded-full bg-gradient-to-br from-[#0B1220]/3 to-transparent blur-[80px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-2xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 bg-[#B88A5A]/5 border border-[#B88A5A]/10 rounded-full px-3 py-1 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B88A5A]/50" />
              <span className="text-[10px] font-mono text-[#B88A5A]/60 tracking-wider uppercase">{t("blog.badge")}</span>
            </span>
            <h1 className="heading-serif text-[clamp(2.5rem,5vw,4.5rem)] text-[#0B1220]">
              {t("blog.heading1")}{" "}
              <span style={{
                background: "linear-gradient(135deg, #B88A5A 0%, #C99B68 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                {t("blog.heading2")}
              </span>
            </h1>
            <p className="text-gray-500 text-sm sm:text-base mt-4 max-w-lg mx-auto leading-relaxed">
              {t("blog.sub")}
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
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  {latest.category && (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-mono font-medium border ${categoryColors[latest.category.slug] || "bg-gray-100 text-gray-700 border-gray-200"}`}>
                      {latest.category.name}
                    </span>
                  )}
                  <span className="text-xs text-gray-400 font-mono">{latest.readingTime} {t("blog.minLecture")}</span>
                </div>
                <span className="text-[10px] font-mono text-[#B88A5A]/60 tracking-wider uppercase mb-2">{t("blog.dernierArticle")}</span>
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
    </>
  );
}
