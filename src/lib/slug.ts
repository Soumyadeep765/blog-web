import { Children, isValidElement, type ReactNode } from "react";

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function authorToSlug(name: string): string {
  const clean = (name || "TeleBotHost Team").trim();
  const slug = slugify(clean);
  return slug || "telebothost-team";
}

export function getAuthorInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getNodeText(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child);
      }
      if (isValidElement<{ children?: ReactNode }>(child)) {
        return getNodeText(child.props.children);
      }
      return "";
    })
    .join("");
}

export function createHeadingIdFactory() {
  const used = new Map<string, number>();

  return (text: string) => {
    const base = slugify(text) || "section";
    const count = used.get(base) ?? 0;
    used.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  };
}
