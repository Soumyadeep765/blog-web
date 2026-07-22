import type { Metadata } from "next";
import { BlogIndex } from "@/components/BlogIndex";
import { JsonLd } from "@/components/JsonLd";
import { getCategories } from "@/lib/categories";
import { getAllPosts } from "@/lib/posts";
import {
  buildCollectionJsonLd,
  buildPageMetadata,
  buildWebSiteJsonLd,
  getSeoSite,
} from "@/lib/seo";
import { getResolvedSiteConfig } from "@/lib/site-resolved";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSeoSite();
  return buildPageMetadata({
    site,
    title: site.title,
    description: site.description,
    path: "/",
    image: "/images/blog-cover.png",
    imageAlt: "TeleBotHost Blog Cover Image",
    keywords: [
      "TeleBotHost blog",
      "technology",
      "telegram bots",
      "travel",
      "lifestyle",
      "food",
      "work",
    ],
  });
}

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function HomePage({ searchParams }: PageProps) {
  const [{ q }, posts, categories, site] = await Promise.all([
    searchParams,
    getAllPosts(),
    getCategories(),
    getResolvedSiteConfig(),
  ]);

  const seoSite = await getSeoSite();

  return (
    <>
      <JsonLd data={[buildWebSiteJsonLd(seoSite), buildCollectionJsonLd({
        site: seoSite,
        name: `${site.name} Blog`,
        description: site.description,
        path: "/",
      })]} />
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
