import { getPublishedPosts, authors, categories } from "@/lib/blog";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import BlogHero from "./BlogHero";
import BlogListClient from "./BlogListClient";

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
      <BlogHero latest={latest} />
      <BlogListClient posts={enriched} categories={categories} />
    </div>
    </ErrorBoundary>
  );
}
