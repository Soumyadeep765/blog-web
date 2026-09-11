import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { getCategories } from "@/lib/categories";
import { buildPageMetadata, getSeoSite } from "@/lib/seo";
import { getResolvedSiteConfig } from "@/lib/site-resolved";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSeoSite();
  return buildPageMetadata({
    site,
    title: "About",
    description: `What ${site.name} is: a multi-topic blog with clear posts and links to our official products.`,
    path: "/about",
    keywords: ["about", site.name, "technology", "blog", "telebothost"],
  });
}

export default async function AboutPage() {
  const categories = await getCategories();
  const site = await getResolvedSiteConfig();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: `About ${site.name}`,
          url: `${site.url}/about`,
          description: site.description,
          isPartOf: {
            "@type": "WebSite",
            name: site.name,
            url: site.url,
          },
        }}
      />

      <header className="page-intro">
        <h1>About this site</h1>
        <p>
          {site.name} is a blog for mixed topics. Tech one week. Travel or food
          the next. The point is clear writing you can finish and take with you.
        </p>
      </header>

      <div className="about-grid">
        <div className="about-card">
          <h2>What you&apos;ll find</h2>
          <p>
            Longer posts with covers, categories, and tags. You can browse by
            topic, open a story, and keep reading without a pile of widgets
            getting in the way.
          </p>
        </div>

        <div className="about-card">
          <h2>Topics we cover</h2>
          <ul className="about-list">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link href={`/blog/category/${category.slug}`}>
                  {category.name}
                </Link>
                <span> · {category.description}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="about-card">
          <h2>Our products</h2>
          <p>
            The blog is one thing. These are separate tools we build and link out
            to from the site.
          </p>
          <ul className="about-products">
            {site.products.map((product) => (
              <li key={product.href}>
                <a
                  href={product.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {product.name}
                </a>
                <span className="products-menu__badge">{product.label}</span>
                <p>{product.description}</p>
              </li>
            ))}
          </ul>
        </div>

        <p>
          Want to read something? Head to the <Link href="/blog">blog</Link>, or
          go back <Link href="/">home</Link>. If you like feeds, there&apos;s{" "}
          <a href="/rss.xml">RSS</a> too.
        </p>
      </div>
    </>
  );
}
