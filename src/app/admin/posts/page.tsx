import type { Metadata } from "next";
import Link from "next/link";
import { AdminPostsTable } from "@/components/AdminPostsTable";
import {
  getAdminPosts,
  type AdminPostFilter,
} from "@/lib/posts";

export const metadata: Metadata = {
  title: "Posts",
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ status?: string; q?: string }>;
};

export default async function AdminPostsPage({ searchParams }: PageProps) {
  const { status, q } = await searchParams;
  const filter: AdminPostFilter =
    status === "published" || status === "draft" ? status : "all";
  const posts = await getAdminPosts(filter, q || "");

  const tabs: { key: AdminPostFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "published", label: "Published" },
    { key: "draft", label: "Drafts" },
  ];

  return (
    <div className="dash-page">
      <header className="dash-page__intro dash-page__intro--row">
        <div>
          <h1>Posts</h1>
          <p>Create, edit, publish, and delete blog posts.</p>
        </div>
        <Link href="/admin/posts/new" className="button button--primary">
          New post
        </Link>
      </header>

      <form className="dash-filters" method="get">
        <div className="dash-tabs">
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              href={
                tab.key === "all"
                  ? `/admin/posts${q ? `?q=${encodeURIComponent(q)}` : ""}`
                  : `/admin/posts?status=${tab.key}${q ? `&q=${encodeURIComponent(q)}` : ""}`
              }
              className={filter === tab.key ? "is-active" : undefined}
            >
              {tab.label}
            </Link>
          ))}
        </div>
        <input
          type="search"
          name="q"
          defaultValue={q || ""}
          placeholder="Search posts…"
          className="dash-search"
        />
        {filter !== "all" ? (
          <input type="hidden" name="status" value={filter} />
        ) : null}
        <button type="submit" className="button button--ghost">
          Search
        </button>
      </form>

      <AdminPostsTable posts={posts} />
    </div>
  );
}
