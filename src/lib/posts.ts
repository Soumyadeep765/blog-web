import { cache } from "react";
import readingTime from "reading-time";
import { getCategoryBySlug } from "@/lib/categories";
import { sql, type DbPost } from "@/lib/db";
import type { Post } from "@/types/post";

export type AdminPostFilter = "all" | "published" | "draft";

function toDateString(value: string | Date | null | undefined): string | undefined {
  if (!value) {
    return undefined;
  }
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return String(value).slice(0, 10);
}

function mapPost(row: DbPost): Post {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    content: row.content,
    category: row.category,
    tags: row.tags ?? [],
    coverImage: row.cover_image ?? undefined,
    coverAlt: row.cover_alt ?? row.title,
    author: row.author,
    published: row.published,
    views: row.views ?? 0,
    date: toDateString(row.date) || new Date().toISOString().slice(0, 10),
    readingTime: readingTime(row.content || "").text,
    excerpt: row.excerpt ?? undefined,
    metaTitle: row.meta_title ?? undefined,
    metaDescription: row.meta_description ?? undefined,
    createdAt: toDateString(row.created_at),
    updatedAt: toDateString(row.updated_at),
  };
}

export const getAllPosts = cache(async (): Promise<Post[]> => {
  const rows = await sql<DbPost[]>`
    select *
    from posts
    where published = true
    order by date desc, created_at desc
  `;
  return rows.map(mapPost);
});

export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  const rows = await sql<DbPost[]>`
    select *
    from posts
    where slug = ${slug} and published = true
    limit 1
  `;
  return rows[0] ? mapPost(rows[0]) : null;
});

export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  const rows = await sql<DbPost[]>`
    select *
    from posts
    where published = true and category = ${categorySlug}
    order by date desc, created_at desc
  `;
  return rows.map(mapPost);
}

export async function getRelatedPosts(
  slug: string,
  category: string,
  limit = 3,
): Promise<Post[]> {
  const rows = await sql<DbPost[]>`
    select *
    from posts
    where published = true
      and category = ${category}
      and slug <> ${slug}
    order by date desc, created_at desc
    limit ${limit}
  `;
  return rows.map(mapPost);
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tags = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags) {
      tags.add(tag);
    }
  }
  return Array.from(tags).sort((a, b) => a.localeCompare(b));
}

export async function getCategoryLabel(categorySlug: string): Promise<string> {
  const category = await getCategoryBySlug(categorySlug);
  return category?.name ?? categorySlug;
}

export async function getAdminPosts(
  filter: AdminPostFilter = "all",
  search = "",
): Promise<Post[]> {
  const q = search.trim();

  if (filter === "published") {
    const rows = q
      ? await sql<DbPost[]>`
          select * from posts
          where published = true
            and (
              title ilike ${"%" + q + "%"}
              or slug ilike ${"%" + q + "%"}
              or description ilike ${"%" + q + "%"}
            )
          order by date desc, created_at desc
        `
      : await sql<DbPost[]>`
          select * from posts
          where published = true
          order by date desc, created_at desc
        `;
    return rows.map(mapPost);
  }

  if (filter === "draft") {
    const rows = q
      ? await sql<DbPost[]>`
          select * from posts
          where published = false
            and (
              title ilike ${"%" + q + "%"}
              or slug ilike ${"%" + q + "%"}
              or description ilike ${"%" + q + "%"}
            )
          order by updated_at desc, created_at desc
        `
      : await sql<DbPost[]>`
          select * from posts
          where published = false
          order by updated_at desc, created_at desc
        `;
    return rows.map(mapPost);
  }

  const rows = q
    ? await sql<DbPost[]>`
        select * from posts
        where
          title ilike ${"%" + q + "%"}
          or slug ilike ${"%" + q + "%"}
          or description ilike ${"%" + q + "%"}
        order by date desc, created_at desc
      `
    : await sql<DbPost[]>`
        select * from posts
        order by date desc, created_at desc
      `;
  return rows.map(mapPost);
}

export async function getPostById(id: string): Promise<Post | null> {
  const rows = await sql<DbPost[]>`
    select * from posts where id = ${id} limit 1
  `;
  return rows[0] ? mapPost(rows[0]) : null;
}

export async function getAdminPostBySlug(slug: string): Promise<Post | null> {
  const rows = await sql<DbPost[]>`
    select * from posts where slug = ${slug} limit 1
  `;
  return rows[0] ? mapPost(rows[0]) : null;
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatViews(views: number): string {
  if (views < 1000) {
    return `${views} view${views === 1 ? "" : "s"}`;
  }
  return `${(views / 1000).toFixed(1).replace(/\.0$/, "")}k views`;
}

export async function createPost(input: {
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  coverImage?: string;
  coverAlt?: string;
  author?: string;
  published?: boolean;
  date?: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
}): Promise<Post> {
  const rows = await sql<DbPost[]>`
    insert into posts (
      slug, title, description, content, category, tags,
      cover_image, cover_alt, author, published, date,
      excerpt, meta_title, meta_description
    ) values (
      ${input.slug},
      ${input.title},
      ${input.description},
      ${input.content},
      ${input.category},
      ${input.tags}::text[],
      ${input.coverImage || null},
      ${input.coverAlt || null},
      ${input.author || "TeleBotHost Team"},
      ${input.published ?? true},
      ${input.date || new Date().toISOString().slice(0, 10)},
      ${input.excerpt || null},
      ${input.metaTitle || null},
      ${input.metaDescription || null}
    )
    returning *
  `;

  return mapPost(rows[0]);
}

export async function updatePost(
  id: string,
  input: {
    slug: string;
    title: string;
    description: string;
    content: string;
    category: string;
    tags: string[];
    coverImage?: string;
    coverAlt?: string;
    author?: string;
    published?: boolean;
    date?: string;
    excerpt?: string;
    metaTitle?: string;
    metaDescription?: string;
  },
): Promise<Post> {
  const rows = await sql<DbPost[]>`
    update posts set
      slug = ${input.slug},
      title = ${input.title},
      description = ${input.description},
      content = ${input.content},
      category = ${input.category},
      tags = ${input.tags}::text[],
      cover_image = ${input.coverImage || null},
      cover_alt = ${input.coverAlt || null},
      author = ${input.author || "TeleBotHost Team"},
      published = ${input.published ?? true},
      date = ${input.date || new Date().toISOString().slice(0, 10)},
      excerpt = ${input.excerpt || null},
      meta_title = ${input.metaTitle || null},
      meta_description = ${input.metaDescription || null},
      updated_at = now()
    where id = ${id}
    returning *
  `;

  if (!rows[0]) {
    throw new Error("Post not found.");
  }

  return mapPost(rows[0]);
}

export async function deletePost(id: string): Promise<boolean> {
  await sql`delete from post_views where post_id = ${id}`;
  const rows = await sql`delete from posts where id = ${id} returning id`;
  return rows.length > 0;
}

export async function setPostPublished(id: string, published: boolean) {
  await sql`
    update posts
    set published = ${published}, updated_at = now()
    where id = ${id}
  `;
}

export async function trackPostView(slug: string, viewerHash?: string) {
  const posts = await sql<{ id: string }[]>`
    select id from posts where slug = ${slug} and published = true limit 1
  `;

  if (!posts[0]) {
    return;
  }

  const postId = posts[0].id;

  await sql.begin(async (tx) => {
    await tx`
      update posts
      set views = views + 1, updated_at = now()
      where id = ${postId}
    `;

    await tx`
      insert into post_views (post_id, viewer_hash)
      values (${postId}, ${viewerHash || null})
    `;
  });
}

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
