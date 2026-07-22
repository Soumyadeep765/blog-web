import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogIndex } from "@/components/BlogIndex";
import { JsonLd } from "@/components/JsonLd";
import { getCategories, getCategoryBySlug } from "@/lib/categories";
import { getPostsByCategory } from "@/lib/posts";
import { buildCollectionJsonLd, buildPageMetadata, getSeoSite } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string }>;
};

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [category, site] = await Promise.all([
    getCategoryBySlug(slug),
    getSeoSite(),
  ]);

  if (!category) {
    return {};
  }

  return buildPageMetadata({
    site,
    title: category.name,
    description: category.description,
    path: `/blog/category/${category.slug}`,
    keywords: [category.name, category.slug, "blog", site.name],
  });
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const [{ slug }, { q }, categories] = await Promise.all([
    params,
    searchParams,
    getCategories(),
  ]);
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  const [posts, seoSite] = await Promise.all([
    getPostsByCategory(category.slug),
    getSeoSite(),
  ]);

  return (
    <>
      <JsonLd
        data={buildCollectionJsonLd({
          site: seoSite,
          name: category.name,
          description: category.description,
          path: `/blog/category/${category.slug}`,
        })}
      />
      <BlogIndex
        title={category.name}
        posts={posts}
        categories={categories}
        activeCategory={category.slug}
        initialQuery={q || ""}
      />
    </>
  );
}
