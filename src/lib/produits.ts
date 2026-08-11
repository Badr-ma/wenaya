/**
 * Shared product query logic used by both the /api/produits route and the
 * /produits page (for server-rendered initial data). Keeps SSR and client
 * fetch results consistent.
 */
import fr from "@/i18n/fr";
import en from "@/i18n/en";

export type ProductItem = {
  slug: string;
  title: string;
  desc: string;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  goals: string[];
  topics: string[];
};

export type ProduitsQuery = {
  locale?: string;
  page?: number;
  limit?: number;
  category?: string | null;
  search?: string;
  goals?: string[];
  topics?: string[];
  sort?: string;
};

export type ProduitsResult = {
  items: ProductItem[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
};

const locales: Record<string, { produits: { items: ProductItem[] } }> = { fr, en };

export function getProduits(query: ProduitsQuery = {}): ProduitsResult {
  const {
    locale = "fr",
    category,
    search = "",
    goals = [],
    topics = [],
    sort = "bestRated",
  } = query;
  const page = Math.max(1, query.page ?? 1);
  const limit = Math.min(50, Math.max(1, query.limit ?? 12));

  const data = locales[locale] || fr;
  let items = [...data.produits.items] as ProductItem[];

  if (category) {
    items = items.filter((item) => item.category === category);
  }
  if (goals.length > 0) {
    items = items.filter((item) => item.goals.some((g) => goals.includes(g)));
  }
  if (topics.length > 0) {
    items = items.filter((item) => item.topics.some((t) => topics.includes(t)));
  }
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q)
    );
  }

  switch (sort) {
    case "bestRated":
      items.sort((a, b) => b.rating - a.rating);
      break;
    case "mostPopular":
      items.sort((a, b) => b.reviews - a.reviews);
      break;
  }

  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paged = items.slice(start, start + limit);

  return {
    items: paged,
    total,
    page,
    totalPages,
    hasMore: page < totalPages,
  };
}
