import { NextResponse } from "next/server";
import { getPublishedPosts, authors, categories } from "@/lib/blog";

export async function GET() {
  const posts = getPublishedPosts();
  const enriched = posts.slice(0, 3).map((p) => ({
    ...p,
    author: authors.find((a) => a.id === p.authorId),
    category: categories.find((c) => c.id === p.categoryId),
  }));
  return NextResponse.json({ data: enriched });
}
