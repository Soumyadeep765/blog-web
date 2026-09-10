import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AuthorHero } from "@/components/AuthorHero";
import { JsonLd } from "@/components/JsonLd";
import { PostCard } from "@/components/PostCard";
import { getAllAuthors, getAuthorBySlug, getPostsByAuthor } from "@/lib/authors";
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildPageMetadata,
  getSeoSite,
} from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const authors = await getAllAuthors();
  return authors.map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [author, site] = await Promise.all([
    getAuthorBySlug(slug),
    getSeoSite(),
  ]);

  if (!author) {
    return {};
  }

  return buildPageMetadata({
    site,
    title: `${author.name} — Author`,
    description: author.bio,
    path: `/blog/author/${author.slug}`,
    keywords: [author.name, "author", "articles", "blog", site.name],
  });
}

export default async function AuthorPage({ params }: PageProps) {
  const { slug } = await params;
  const [author, seoSite] = await Promise.all([
    getAuthorBySlug(slug),
    getSeoSite(),
  ]);

  if (!author) {
    notFound();
  }

  const posts = await getPostsByAuthor(author.name);
  const authorUrl = absoluteUrl(`/blog/author/${author.slug}`, seoSite.url);

  const authorJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: author.name,
      jobTitle: author.role,
      description: author.bio,
      url: authorUrl,
    },
    url: authorUrl,
  };

  return (
    <div className="author-page">
      <JsonLd
        data={[
          authorJsonLd,
          buildBreadcrumbJsonLd(seoSite, [
            { name: "Blog", path: "/blog" },
            { name: "Authors", path: "/blog" },
            { name: author.name, path: `/blog/author/${author.slug}` },
          ]),
        ]}
      />

      <AuthorHero author={{ ...author, postCount: posts.length }} />

      <section className="author-posts-section" aria-label={`Posts by ${author.name}`}>
        <div className="author-posts-section__header">
          <div className="author-posts-section__title-group">
            <h2 className="author-posts-section__title">Published Articles</h2>
            <span className="author-posts-section__count-pill">
              {posts.length} {posts.length === 1 ? "article" : "articles"}
            </span>
          </div>
        </div>

        {posts.length > 0 ? (
          <div className="post-grid post-grid--blog">
            {posts.map((post, index) => (
              <PostCard
                key={post.slug}
                post={post}
                variant="flat"
                priority={index < 3}
              />
            ))}
          </div>
        ) : (
          <div className="author-posts-empty">
            <p className="empty-state">
              No published articles yet by {author.name}. Check back soon!
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
