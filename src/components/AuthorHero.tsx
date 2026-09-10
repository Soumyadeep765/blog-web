import Image from "next/image";
import Link from "next/link";
import { BookOpen, Globe, ChevronRight, User } from "lucide-react";
import type { Author } from "@/lib/authors";
import { XLogo } from "@/components/BrandIcons";

type AuthorHeroProps = {
  author: Author;
};

export function AuthorHero({ author }: AuthorHeroProps) {
  return (
    <header className="author-hero">
      <nav className="author-hero__crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <ChevronRight size={13} strokeWidth={2.2} aria-hidden="true" />
        <Link href="/blog">Blog</Link>
        <ChevronRight size={13} strokeWidth={2.2} aria-hidden="true" />
        <span aria-current="page">Authors</span>
      </nav>

      <div className="author-hero__panel">
        <div className="author-hero__avatar-wrap">
          {author.avatar ? (
            <Image
              src={author.avatar}
              alt={author.name}
              width={88}
              height={88}
              className="author-hero__avatar"
              priority
            />
          ) : (
            <div className="author-hero__avatar author-hero__avatar--default">
              <User size={36} strokeWidth={1.5} aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="author-hero__info">
          <div className="author-hero__meta-top">
            <h1 className="author-hero__name">{author.name}</h1>
            {author.role ? (
              <span className="author-hero__role-badge">{author.role}</span>
            ) : null}
          </div>

          <p className="author-hero__bio">{author.bio}</p>

          <div className="author-hero__meta-bottom">
            <div className="author-hero__stat">
              <BookOpen size={15} strokeWidth={2.2} aria-hidden="true" />
              <span>
                <strong>{author.postCount}</strong> {author.postCount === 1 ? "article" : "articles"}
              </span>
            </div>


            {author.socials ? (
              <div className="author-hero__socials">
                {author.socials.website ? (
                  <a
                    href={author.socials.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="author-hero__social-link"
                    title="Website"
                  >
                    <Globe size={15} strokeWidth={2} aria-hidden="true" />
                    <span>Website</span>
                  </a>
                ) : null}
                {author.socials.twitter ? (
                  <a
                    href={author.socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="author-hero__social-link"
                    title="X (Twitter)"
                  >
                    <XLogo size={14} />
                    <span>Twitter</span>
                  </a>
                ) : null}
                {author.socials.github ? (
                  <a
                    href={author.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="author-hero__social-link"
                    title="GitHub"
                  >
                    <svg
                      width={14}
                      height={14}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    <span>GitHub</span>
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
