"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AdSlot } from "@/components/AdSlot";
import {
  RelatedPosts,
  type RelatedPostItem,
} from "@/components/RelatedPosts";
import { ShareButtons } from "@/components/ShareButtons";

type ArticleSidebarProps = {
  url: string;
  title: string;
  description?: string;
  author?: {
    name: string;
    slug: string;
  };
  viewsLabel: string;
  publishedLabel: string;
  updatedLabel: string;
  readingTime: string;
  related: RelatedPostItem[];
  ads?: {
    clientId: string;
    sidebarSlotId?: string;
  };
};

export function ArticleSidebar({
  url,
  title,
  description,
  author,
  viewsLabel,
  publishedLabel,
  updatedLabel,
  readingTime,
  related,
  ads,
}: ArticleSidebarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    if (!value) {
      router.push("/blog");
      return;
    }
    router.push(`/blog?q=${encodeURIComponent(value)}`);
  }

  return (
    <aside className="article-sidebar" aria-label="Article tools">
      <section className="article-sidebar__info">
        <h2 className="article-sidebar__heading">Post info</h2>
        <dl className="article-sidebar__meta">
          {author ? (
            <div>
              <dt>Author</dt>
              <dd>
                <Link
                  href={`/blog/author/${author.slug}`}
                  className="article-sidebar__author-link"
                >
                  {author.name}
                </Link>
              </dd>
            </div>
          ) : null}
          <div>
            <dt>Views</dt>
            <dd>{viewsLabel}</dd>
          </div>
          <div>
            <dt>Published</dt>
            <dd>{publishedLabel}</dd>
          </div>
          <div>
            <dt>Updated</dt>
            <dd>{updatedLabel}</dd>
          </div>
          <div>
            <dt>Read time</dt>
            <dd>{readingTime}</dd>
          </div>
        </dl>
      </section>

      <ShareButtons
        url={url}
        title={title}
        description={description}
        variant="sidebar"
      />

      {ads ? (
        <AdSlot
          slot="sidebar"
          clientId={ads.clientId}
          slotId={ads.sidebarSlotId}
          className="ad-slot--sidebar"
        />
      ) : null}

      <form className="article-sidebar__search" onSubmit={onSearch}>
        <Search size={16} strokeWidth={2.1} aria-hidden="true" />
        <label className="sr-only" htmlFor="article-side-search">
          Search posts
        </label>
        <input
          id="article-side-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search posts"
        />
      </form>

      <RelatedPosts posts={related} className="related-posts--side" />
    </aside>
  );
}
