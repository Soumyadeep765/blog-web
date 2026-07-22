import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/types/post";

export type RelatedPostItem = Pick<
  Post,
  "slug" | "title" | "date" | "coverImage" | "coverAlt"
>;

type RelatedPostsProps = {
  posts: RelatedPostItem[];
  className?: string;
  heading?: string;
};

export function RelatedPosts({
  posts,
  className = "",
  heading = "Related posts",
}: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className={`related-posts ${className}`.trim()}>
      <h2 className="related-posts__heading">{heading}</h2>
      <ul className="related-posts__list">
        {posts.map((item) => (
          <li key={item.slug}>
            <Link href={`/blog/${item.slug}`} className="related-post">
              {item.coverImage ? (
                <span className="related-post__media">
                  <Image
                    src={item.coverImage}
                    alt={item.coverAlt ?? item.title}
                    width={120}
                    height={68}
                    sizes="56px"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </span>
              ) : null}
              <span className="related-post__body">
                <span className="related-post__title">{item.title}</span>
                <time dateTime={item.date}>{item.date}</time>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
