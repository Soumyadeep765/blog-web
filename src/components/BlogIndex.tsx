"use client";

import { Search } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { CategoryNav } from "@/components/CategoryNav";
import { PostCard } from "@/components/PostCard";
import type { Category } from "@/lib/categories";
import type { Post } from "@/types/post";

type BlogIndexProps = {
  title: string;
  posts: Post[];
  categories: Category[];
  activeCategory?: string;
  showSearch?: boolean;
  initialQuery?: string;
};

export function BlogIndex({
  title,
  posts,
  categories,
  activeCategory = "all",
  showSearch = true,
  initialQuery = "",
}: BlogIndexProps) {
  const [query, setQuery] = useState(initialQuery);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const filtered = useMemo(() => {
    if (!deferredQuery) {
      return posts;
    }

    return posts.filter((post) => {
      const haystack = [
        post.title,
        post.description,
        post.category,
        ...post.tags,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(deferredQuery);
    });
  }, [deferredQuery, posts]);

  return (
    <div className="blog-index">
      <header className="blog-index__header">
        <h1 className="blog-index__title">{title}</h1>
      </header>

      {showSearch ? (
        <label className="blog-search">
          <Search size={18} strokeWidth={2} aria-hidden="true" />
          <span className="sr-only">Search posts</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search posts"
            autoComplete="off"
          />
        </label>
      ) : null}

      <CategoryNav active={activeCategory} categories={categories} />

      {filtered.length > 0 ? (
        <div className="post-grid post-grid--blog">
          {filtered.map((post, index) => (
            <PostCard
              key={post.slug}
              post={post}
              variant="card"
              priority={index < 3}
            />
          ))}
        </div>
      ) : (
        <p className="empty-state">No posts match that search.</p>
      )}
    </div>
  );
}
