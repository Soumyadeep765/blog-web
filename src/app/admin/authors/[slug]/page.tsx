import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AdminAuthorForm } from "@/components/AdminAuthorForm";
import { getAuthorBySlug } from "@/lib/authors";
import { getCurrentAdmin } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Edit Author",
};

export const dynamic = "force-dynamic";

export default async function AdminAuthorEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const user = await getCurrentAdmin();
  if (user?.role !== "owner") {
    redirect("/admin");
  }

  const { slug } = await params;
  const isNew = slug === "new";

  let author = null;
  if (!isNew) {
    author = await getAuthorBySlug(slug);
    if (!author) {
      notFound();
    }
  }

  return (
    <div className="dash-page">
      <header className="dash-page__intro">
        <Link href="/admin/authors" className="dash-page__back">
          <ChevronLeft size={16} />
          Back to authors
        </Link>
        <h1>{isNew ? "Create Author" : `Edit ${author?.name}`}</h1>
        <p>
          {isNew
            ? "Add a new author to your blog."
            : "Update public profile information and social links."}
        </p>
      </header>

      <section className="dash-panel">
        <div className="dash-panel__head">
          <h2>Profile Details</h2>
        </div>
        <AdminAuthorForm author={author || undefined} isNew={isNew} />
      </section>
    </div>
  );
}
