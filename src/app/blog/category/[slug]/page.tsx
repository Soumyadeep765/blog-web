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

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  const site = await getSeoSite();

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
  const { slug } = await params;
  const { q } = await searchParams;
  const categories = await getCategories();
  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  const posts = await getPostsByCategory(category.slug);
  const seoSite = await getSeoSite();

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
