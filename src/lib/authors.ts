import { cache } from "react";
import { sql } from "@/lib/db";
import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";
import { authorToSlug, getAuthorInitials, slugify } from "@/lib/slug";
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

export const getAllAuthors = cache(async (): Promise<Author[]> => {
  try {
    const rows = await sql<any[]>`
      SELECT 
        a.name, a.slug, a.role, a.bio, a.avatar, a.location, a.twitter, a.github, a.website,
        COUNT(p.id)::int as "postCount"
      FROM authors a
      LEFT JOIN posts p ON (lower(p.author) = lower(a.name) OR lower(p.author) = lower(a.slug)) AND p.published = true
      GROUP BY a.id
      ORDER BY "postCount" DESC, a.name ASC
    `;

    return rows.map((row) => ({
      name: row.name,
      slug: row.slug,
      role: row.role || "Author & Contributor",
      bio: row.bio || `Writer and contributor at ${siteConfig.name}.`,
      avatar: row.avatar || undefined,
      initials: getAuthorInitials(row.name),
      postCount: row.postCount || 0,
      location: row.location || undefined,
      socials: {
        twitter: row.twitter || undefined,
        github: row.github || undefined,
        website: row.website || undefined,
      }
    }));
  } catch (error) {
    console.error("Failed to fetch authors:", error);
    return [];
  }
});

export const getAuthorBySlug = cache(async (slug: string): Promise<Author | null> => {
  const normalizedSlug = slug.toLowerCase().trim();
  try {
    const rows = await sql<any[]>`
      SELECT 
        a.name, a.slug, a.role, a.bio, a.avatar, a.location, a.twitter, a.github, a.website,
        COUNT(p.id)::int as "postCount"
      FROM authors a
      LEFT JOIN posts p ON (lower(p.author) = lower(a.name) OR lower(p.author) = lower(a.slug)) AND p.published = true
      WHERE lower(a.slug) = ${normalizedSlug}
      GROUP BY a.id
      LIMIT 1
    `;

    if (rows.length === 0) return null;
    const row = rows[0];

    return {
      name: row.name,
      slug: row.slug,
      role: row.role || "Author & Contributor",
      bio: row.bio || `Writer and contributor at ${siteConfig.name}.`,
      avatar: row.avatar || undefined,
      initials: getAuthorInitials(row.name),
      postCount: row.postCount || 0,
      location: row.location || undefined,
      socials: {
        twitter: row.twitter || undefined,
        github: row.github || undefined,
        website: row.website || undefined,
      }
    };
  } catch (error) {
    console.error("Failed to fetch author by slug:", error);
    return null;
  }
});

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
