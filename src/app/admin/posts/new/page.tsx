import type { Metadata } from "next";
import Link from "next/link";
import { AdminPostForm } from "@/components/AdminPostForm";
import { getCategories } from "@/lib/categories";
import { getSiteSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "New post",
};

export const dynamic = "force-dynamic";

export default async function AdminNewPostPage() {
  const [categories, settings] = await Promise.all([
    getCategories(),
    getSiteSettings(),
  ]);

  return (
    <div className="dash-page">
      <header className="dash-page__intro dash-page__intro--row">
        <div>
          <p className="dash-breadcrumb">
            <Link href="/admin/posts">Posts</Link> / New
          </p>
          <h1>New post</h1>
          <p>Write in markdown. Cover images use a public URL (Vercel-safe).</p>
        </div>
      </header>

      <AdminPostForm
        categories={categories}
        defaultAuthor={settings.default_author}
      />
    </div>
  );
}
