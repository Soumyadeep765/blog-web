import type { Metadata } from "next";
import { AdminCategoriesPanel } from "@/components/AdminCategoriesPanel";
import { getCategories } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Categories",
};

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="dash-page">
      <header className="dash-page__intro">
        <h1>Categories</h1>
        <p>Manage topics shown in navigation and post filters.</p>
      </header>
      <AdminCategoriesPanel categories={categories} />
    </div>
  );
}
