import Link from "next/link";

export default function NotFound() {
  return (
    <header className="page-intro">
      <h1>Page not found</h1>
      <p>
        That link doesn&apos;t match anything here. It might be old, or it might just
        be a typo.
      </p>
      <div className="hero__actions">
        <Link href="/" className="button button--primary">
          Back home
        </Link>
        <Link href="/blog" className="button button--ghost">
          Browse the blog
        </Link>
      </div>
    </header>
  );
}
