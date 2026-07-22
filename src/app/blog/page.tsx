import type { Metadata } from "next";
import { BlogIndex } from "@/components/BlogIndex";
import { JsonLd } from "@/components/JsonLd";
import { getCategories } from "@/lib/categories";
import { getAllPosts } from "@/lib/posts";
import { buildCollectionJsonLd, buildPageMetadata, getSeoSite } from "@/lib/seo";
import { getResolvedSiteConfig } from "@/lib/site-resolved";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSeoSite();
  return buildPageMetadata({
    site,
    title: "Blog",
    description:
      "Posts on tech, travel, food, habits, work, and the rest of ordinary life.",
    path: "/blog",
    keywords: [
      "blog posts",
      "articles",
      "technology",
      "travel",
      "food",
      "work",
      "TeleBotHost",
    ],
  });
}

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function BlogPage({ searchParams }: PageProps) {
  const [{ q }, posts, categories, site] = await Promise.all([
    searchParams,
    getAllPosts(),
    getCategories(),
    getResolvedSiteConfig(),
  ]);

  const seoSite = await getSeoSite();

  return (
    <>
      <JsonLd
        data={buildCollectionJsonLd({
          site: seoSite,
          name: `${site.name} Blog`,
          description:
            "Posts on tech, travel, food, habits, work, and the rest of ordinary life.",
          path: "/blog",
        })}
      />
      <BlogIndex
        title={`${site.name} Blog`}
        posts={posts}
        categories={categories}
        activeCategory="all"
        initialQuery={q || ""}
      />
    </>
  );
}
