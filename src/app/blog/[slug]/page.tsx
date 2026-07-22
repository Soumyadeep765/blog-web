import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { ArticleSidebar } from "@/components/ArticleSidebar";
import { JsonLd } from "@/components/JsonLd";
import { Markdown } from "@/components/Markdown";
import { RelatedPosts } from "@/components/RelatedPosts";
import { ShareButtons } from "@/components/ShareButtons";
import { ViewTracker } from "@/components/ViewTracker";
import { getAdSlotId, getAdsConfig } from "@/lib/ads";
import {
  formatDate,
  formatViews,
  getAllPosts,
  getCategoryLabel,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/posts";
import {
  absoluteUrl,
  buildBlogPostingJsonLd,
  buildBreadcrumbJsonLd,
  buildPageMetadata,
  getSeoSite,
} from "@/lib/seo";
type PageProps = {
  params: Promise<{ slug: string }>;
};


export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [post, site] = await Promise.all([getPostBySlug(slug), getSeoSite()]);

  if (!post) {
    return {};
  }

  return buildPageMetadata({
    site,
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    type: "article",
    keywords: [...post.tags, post.category, site.name],
    publishedTime: post.date,
    modifiedTime: post.updatedAt || post.date,
    authors: [post.author],
    tags: post.tags,
    image: post.coverImage,
    imageAlt: post.coverAlt ?? post.title,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const [seoSite, categoryLabel, related, ads] = await Promise.all([
    getSeoSite(),
    getCategoryLabel(post.category),
    getRelatedPosts(post.slug, post.category, 3),
    getAdsConfig(),
  ]);

  const url = absoluteUrl(`/blog/${post.slug}`, seoSite.url);
  const sidebarAdSlot = getAdSlotId("sidebar");

  return (
    <div className="article-layout">
      <ViewTracker slug={post.slug} />
      <JsonLd
        data={[
          buildBlogPostingJsonLd({
            site: seoSite,
            title: post.title,
            description: post.description,
            slug: post.slug,
            date: post.date,
            updatedAt: post.updatedAt,
            author: post.author,
            tags: post.tags,
            coverImage: post.coverImage,
            coverAlt: post.coverAlt,
          }),
          buildBreadcrumbJsonLd(seoSite, [
            { name: "Blog", path: "/blog" },
            { name: categoryLabel, path: `/blog/category/${post.category}` },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />

      <article className="article">
        <nav className="article__crumbs" aria-label="Breadcrumb">
          <Link href="/blog">Blog</Link>
          <span aria-hidden="true">›</span>
          <Link href={`/blog/category/${post.category}`}>{categoryLabel}</Link>
          <span aria-hidden="true">›</span>
          <span>{post.title}</span>
        </nav>

        <header className="article__header">
          <h1 className="article__title">{post.title}</h1>
          <time className="article__date" dateTime={post.date}>
            {post.date}
          </time>
        </header>

        {ads.enabled ? (
          <AdSlot
            slot="article-top"
            clientId={ads.clientId}
            slotId={getAdSlotId("article-top")}
          />
        ) : null}

        {post.coverImage ? (
          <div className="article__cover">
            <Image
              src={post.coverImage}
              alt={post.coverAlt ?? post.title}
              width={1400}
              height={788}
              className="article__cover-image"
              sizes="(max-width: 900px) 100vw, 720px"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              priority
            />
          </div>
        ) : null}

        <Markdown content={post.content} />

        {ads.enabled ? (
          <AdSlot
            slot="article-bottom"
            clientId={ads.clientId}
            slotId={getAdSlotId("article-bottom")}
          />
        ) : null}

        <div className="article__details">
          <div>
            <span className="article__details-label">Views</span>
            <strong>{formatViews(post.views)}</strong>
          </div>
          <div>
            <span className="article__details-label">Published</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>
          <div>
            <span className="article__details-label">Last updated</span>
            <time dateTime={post.updatedAt || post.date}>
              {formatDate(post.updatedAt || post.date)}
            </time>
          </div>
        </div>

        <RelatedPosts
          posts={related.map((item) => ({
            slug: item.slug,
            title: item.title,
            date: item.date,
            coverImage: item.coverImage,
            coverAlt: item.coverAlt,
          }))}
          className="related-posts--mobile"
        />

        <footer className="article__footer article__footer--mobile">
          <ShareButtons
            url={url}
            title={post.title}
            description={post.description}
          />
        </footer>
      </article>

      <ArticleSidebar
        url={url}
        title={post.title}
        description={post.description}
        viewsLabel={formatViews(post.views)}
        publishedLabel={formatDate(post.date)}
        updatedLabel={formatDate(post.updatedAt || post.date)}
        readingTime={post.readingTime}
        ads={
          ads.enabled
            ? { clientId: ads.clientId, sidebarSlotId: sidebarAdSlot }
            : undefined
        }
        related={related.map((item) => ({
          slug: item.slug,
          title: item.title,
          date: item.date,
          coverImage: item.coverImage,
          coverAlt: item.coverAlt,
        }))}
      />
    </div>
  );
}
