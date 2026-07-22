import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { SocialLinksCol } from "@/components/SocialLinks";
import { getCategories } from "@/lib/categories";
import { getResolvedSiteConfig } from "@/lib/site-resolved";

export async function Footer() {
  const year = new Date().getFullYear();
  const [categories, site] = await Promise.all([
    getCategories(),
    getResolvedSiteConfig(),
  ]);

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <Link href="/" className="site-footer__logo">
              <BrandLogo className="brand-logo brand-logo--footer" />
              <span>{site.name}</span>
            </Link>
            <p className="site-footer__tagline">
              Clear writing on tech, travel, food, work, and the rest of ordinary
              life.
            </p>
          </div>

          <div className="site-footer__cols">
            <div className="site-footer__col">
              <p className="site-footer__label">Explore</p>
              <Link href="/">Home</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/about">About</Link>
              <a href="/rss.xml">RSS</a>
            </div>

            <div className="site-footer__col">
              <p className="site-footer__label">Topics</p>
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/blog/category/${category.slug}`}
                >
                  {category.name}
                </Link>
              ))}
            </div>

            <div className="site-footer__col">
              <p className="site-footer__label">Products</p>
              {site.products.map((product) => (
                <a
                  key={product.href}
                  href={product.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {product.name}
                </a>
              ))}
            </div>

            <SocialLinksCol links={site.social} />
          </div>
        </div>

        <div className="site-footer__bottom">
          <p className="site-footer__copy">
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="site-footer__note">Built for readers who like it clear.</p>
        </div>
      </div>
    </footer>
  );
}
