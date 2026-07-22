import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/types/post";

type PostCardProps = {
  post: Post;
  variant?: "featured" | "card" | "row";
  priority?: boolean;
};

export function PostCard({
  post,
  variant = "card",
  priority = false,
}: PostCardProps) {
  const href = `/blog/${post.slug}`;
  const eager = priority || variant === "featured";

  return (
    <article className={`post-card post-card--${variant}`}>
      {post.coverImage ? (
        <Link href={href} className="post-card__media" tabIndex={-1}>
          <Image
            src={post.coverImage}
            alt={post.coverAlt ?? post.title}
            width={1200}
            height={675}
            className="post-card__image"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            priority={eager}
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : "auto"}
          />
        </Link>
      ) : null}

      <div className="post-card__body">
        <h2 className="post-card__title">
          <Link href={href}>{post.title}</Link>
        </h2>
        <p className="post-card__description">{post.description}</p>
        <div className="post-card__date-meta">
          <time className="post-card__date" dateTime={post.date}>
            {post.date}
          </time>
          <span className="post-card__separator" aria-hidden="true">·</span>
          <span className="post-card__read-time">{post.readingTime}</span>
        </div>
      </div>
    </article>
  );
}
