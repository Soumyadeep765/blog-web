import { unstable_cache } from "next/cache";
import { cache } from "react";
import { sql } from "@/lib/db";

export type Category = {
  slug: string;
  name: string;
  description: string;
};

/** Fallback if DB is empty or unreachable during build. */
export const defaultCategories: Category[] = [
  {
    slug: "technology",
    name: "Technology",
    description: "Code, the web, and building things that don't fall apart.",
  },
  {
    slug: "lifestyle",
    name: "Lifestyle",
    description: "Habits, routines, and how ordinary days get better.",
  },
  {
    slug: "travel",
    name: "Travel",
    description: "Slower trips, real places, and leaving room to wander.",
  },
  {
    slug: "food",
    name: "Food",
    description: "Cooking when you're tired, hungry, or both.",
  },
  {
    slug: "work",
    name: "Work",
    description: "Focus, craft, and getting through the week without frying.",
  },
];

/** @deprecated Prefer getCategories() for live data. */
export const categories = defaultCategories;

export const getCategories = cache(unstable_cache(
  async (): Promise<Category[]> => {
    try {
      const rows = await sql<Category[]>`
        select slug, name, coalesce(description, '') as description
        from blog_categories
        order by name asc
      `;
      return rows.length > 0 ? rows : defaultCategories;
    } catch {
      return defaultCategories;
    }
  },
  ["categories"],
  { tags: ["categories"] }
));

export const getCategoryBySlug = cache(unstable_cache(
  async (slug: string): Promise<Category | null> => {
    const cats = await getCategories();
    return cats.find((c) => c.slug === slug) || null;
  },
  ["category-by-slug"],
  { tags: ["categories"] }
));

export async function createCategory(input: {
  slug: string;
  name: string;
  description?: string;
}): Promise<Category> {
  const rows = await sql<Category[]>`
    insert into blog_categories (slug, name, description)
    values (
      ${input.slug},
      ${input.name},
      ${input.description || ""}
    )
    returning slug, name, coalesce(description, '') as description
  `;
  return rows[0];
}

export async function updateCategory(
  slug: string,
  input: { name: string; description?: string },
): Promise<Category | null> {
  const rows = await sql<Category[]>`
    update blog_categories
    set
      name = ${input.name},
      description = ${input.description || ""},
      updated_at = now()
    where slug = ${slug}
    returning slug, name, coalesce(description, '') as description
  `;
  return rows[0] ?? null;
}

export async function deleteCategory(slug: string): Promise<boolean> {
  const inUse = await sql<{ count: string }[]>`
    select count(*)::text as count from posts where category = ${slug}
  `;
  if (Number(inUse[0]?.count || 0) > 0) {
    throw new Error("Category is used by posts. Reassign those posts first.");
  }

  const rows = await sql`
    delete from blog_categories where slug = ${slug} returning slug
  `;
  return rows.length > 0;
}
