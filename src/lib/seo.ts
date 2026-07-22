import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/settings";
import { siteConfig } from "@/lib/site";

export type ResolvedSite = {
  name: string;
  title: string;
  description: string;
  url: string;
  authorName: string;
};

export async function getSeoSite(): Promise<ResolvedSite> {
  const settings = await getSiteSettings();
  return {
    name: settings.site_name || siteConfig.name,
    title: settings.site_title || siteConfig.title,
    description: settings.site_description || siteConfig.description,
    url: siteConfig.url,
    authorName: settings.default_author || siteConfig.author.name,
  };
}

export function absoluteUrl(path: string, siteUrl = siteConfig.url) {
  if (path.startsWith("http")) {
    return path;
  }
  return `${siteUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

export function absoluteImageUrl(image: string | undefined, siteUrl = siteConfig.url) {
  if (!image) {
    return undefined;
  }
  if (image.startsWith("http")) {
    return image;
  }
  return absoluteUrl(image, siteUrl);
}

type PageSeoInput = {
  site: ResolvedSite;
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  keywords?: string[];
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
};

export function buildPageMetadata(input: PageSeoInput): Metadata {
  const {
    site,
    title,
    description,
    path,
    type = "website",
    keywords,
    publishedTime,
    modifiedTime,
    authors,
    tags,
    image,
    imageAlt,
    noIndex,
  } = input;

  const canonical = path.startsWith("/") ? path : `/${path}`;
  const ogImage = absoluteImageUrl(image, site.url);
  const pageTitle = title === site.title ? title : title;

  return {
    title: pageTitle,
    description,
    keywords: keywords?.length ? keywords : undefined,
    authors: authors?.map((name) => ({ name })),
    alternates: {
      canonical,
      types: path === "/" ? { "application/rss+xml": "/rss.xml" } : undefined,
    },
    openGraph: {
      type,
      locale: "en_US",
      url: absoluteUrl(canonical, site.url),
      siteName: site.name,
      title: pageTitle,
      description,
      publishedTime: type === "article" ? publishedTime : undefined,
      modifiedTime: type === "article" ? modifiedTime : undefined,
      authors: type === "article" ? authors : undefined,
      tags: type === "article" ? tags : undefined,
      images: ogImage
        ? [{ url: ogImage, alt: imageAlt || title, width: 1200, height: 630 }]
        : [{ url: absoluteUrl("/opengraph-image", site.url) }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: ogImage
        ? [ogImage]
        : [absoluteUrl("/opengraph-image", site.url)],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

export function buildWebSiteJsonLd(site: ResolvedSite) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site.url}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildBlogPostingJsonLd(input: {
  site: ResolvedSite;
  title: string;
  description: string;
  slug: string;
  date: string;
  updatedAt?: string;
  author: string;
  tags: string[];
  coverImage?: string;
  coverAlt?: string;
}) {
  const url = absoluteUrl(`/blog/${input.slug}`, input.site.url);
  const image = absoluteImageUrl(input.coverImage, input.site.url);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description,
    datePublished: input.date,
    dateModified: input.updatedAt || input.date,
    image: image ? [image] : undefined,
    author: {
      "@type": "Person",
      name: input.author,
    },
    publisher: {
      "@type": "Organization",
      name: input.site.name,
      url: input.site.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    keywords: input.tags.join(", "),
    url,
  };
}

export function buildBreadcrumbJsonLd(
  site: ResolvedSite,
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path, site.url),
    })),
  };
}

export function buildCollectionJsonLd(input: {
  site: ResolvedSite;
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path, input.site.url),
    isPartOf: {
      "@type": "WebSite",
      name: input.site.name,
      url: input.site.url,
    },
  };
}
