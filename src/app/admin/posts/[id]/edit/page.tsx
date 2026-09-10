import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPostForm } from "@/components/AdminPostForm";
import { getCategories } from "@/lib/categories";
import { getPostById } from "@/lib/posts";
import { getSiteSettings } from "@/lib/settings";
import { getAllAuthors } from "@/lib/authors";

export const metadata: Metadata = {
  title: "Edit post",
};

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditPostPage({ params }: PageProps) {
  const { id } = await params;
  const [post, categories, settings, authors] = await Promise.all([
    getPostById(id),
    getCategories(),
    getSiteSettings(),
    getAllAuthors(),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <div className="dash-page">
      <header className="dash-page__intro dash-page__intro--row">
        <div>
          <p className="dash-breadcrumb">
            <Link href="/admin/posts">Posts</Link> / Edit
          </p>
          <h1>{post.title}</h1>
          <p>
            {post.published ? "Published" : "Draft"} · {post.views} views
          </p>
        </div>
      </header>

      <AdminPostForm
        post={post}
        categories={categories}
        authors={authors}
        defaultAuthor={settings.default_author}
      />
    </div>
  );
}
