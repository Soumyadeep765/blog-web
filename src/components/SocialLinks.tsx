import { getActiveSocialLinks, type SocialLinks as SocialLinksType } from "@/lib/settings";

type SocialLinksProps = {
  links: SocialLinksType;
  className?: string;
};

export function SocialLinks({ links, className }: SocialLinksProps) {
  const items = getActiveSocialLinks(links);

  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      className={className ? `social-links ${className}` : "social-links"}
      aria-label="Social"
    >
      {items.map((item) => (
        <a
          key={item.id}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer me"
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}

/** Compact list for footer column */
export function SocialLinksCol({ links }: SocialLinksProps) {
  const items = getActiveSocialLinks(links);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="site-footer__col">
      <p className="site-footer__label">Social</p>
      {items.map((item) => (
        <a
          key={item.id}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}
