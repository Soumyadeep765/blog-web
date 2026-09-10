import type { Metadata } from "next";
import Link from "next/link";
import { PenTool, Plus } from "lucide-react";
import { getAllAuthors } from "@/lib/authors";
import { getCurrentAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Authors",
};

export const dynamic = "force-dynamic";

export default async function AdminAuthorsPage() {
  const user = await getCurrentAdmin();
  if (user?.role !== "owner") {
    redirect("/admin");
  }

  const authors = await getAllAuthors();

  return (
    <div className="dash-page">
      <header className="dash-page__intro dash-page__intro--row">
        <div>
          <h1>Authors</h1>
          <p>Manage the public profiles of your blog contributors.</p>
        </div>
        <Link href="/admin/authors/new" className="button button--primary">
          <Plus size={16} />
          New author
        </Link>
      </header>

      <section className="dash-panel">
        <div className="dash-panel__head">
          <h2>Profiles</h2>
          <span>{authors.length} authors</span>
        </div>
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Articles</th>
                <th className="dash-table__actions">Manage</th>
              </tr>
            </thead>
            <tbody>
              {authors.map((author) => (
                <tr key={author.slug}>
                  <td>
                    <strong>{author.name}</strong>
                    <div className="dash-table__sub">/{author.slug}</div>
                  </td>
                  <td>{author.role}</td>
                  <td>{author.postCount}</td>
                  <td className="dash-table__actions">
                    <Link
                      href={`/admin/authors/${author.slug}`}
                      className="button button--secondary button--sm"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
              {authors.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "2rem" }}>
                    No authors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
