import { unstable_cache } from "next/cache";
import { cache } from "react";
import { sql } from "@/lib/db";
import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";
import { authorToSlug, getAuthorInitials } from "@/lib/slug";
import type { Post } from "@/types/post";

export { authorToSlug, getAuthorInitials };

export type Author = {
  name: string;
  slug: string;
  role: string;
  bio: string;
  avatar?: string;
  initials: string;
  postCount: number;
  location?: string;
  socials?: {
    twitter?: string;
    github?: string;
    website?: string;
  };
};

export const getAllAuthors = cache(unstable_cache(
  async (): Promise<Author[]> => {
    try {
      const rows = await sql<Record<string, unknown>[]>`
        SELECT 
          a.name, a.slug, a.role, a.bio, a.avatar, a.location, a.twitter, a.github, a.website
        FROM authors a
        ORDER BY a.name ASC
      `;

      const posts = await getAllPosts();

      return rows.map((row) => {
        const nameStr = String(row.name || "");
        const targetSlug = authorToSlug(nameStr);
        const postCount = posts.filter(p => (p.author || "").toLowerCase() === nameStr.toLowerCase() || authorToSlug(p.author || "") === targetSlug).length;

        return {
          name: nameStr,
          slug: String(row.slug || ""),
          role: String(row.role || "Author & Contributor"),
          bio: String(row.bio || `Writer and contributor at ${siteConfig.name}.`),
          avatar: row.avatar ? String(row.avatar) : undefined,
          initials: getAuthorInitials(nameStr),
          postCount: postCount,
      location: row.location ? String(row.location) : undefined,
        socials: {
          twitter: row.twitter ? String(row.twitter) : undefined,
          github: row.github ? String(row.github) : undefined,
          website: row.website ? String(row.website) : undefined,
        }
      };
    });
    } catch (error) {
      console.error("Failed to fetch authors:", error);
      return [];
    }
  },
  ["all-authors"],
  { tags: ["authors"] }
));

export const getAuthorBySlug = cache(unstable_cache(
  async (slug: string): Promise<Author | null> => {
    const authors = await getAllAuthors();
    return authors.find((a) => a.slug === slug) || null;
  },
  ["author-by-slug"],
  { tags: ["authors"] }
));

export async function getPostsByAuthor(authorNameOrSlug: string): Promise<Post[]> {
  const posts = await getAllPosts();
  const targetSlug = authorToSlug(authorNameOrSlug);

  return posts.filter((post) => {
    return (
      post.author.toLowerCase() === authorNameOrSlug.toLowerCase() ||
      authorToSlug(post.author) === targetSlug
    );
  });
}
