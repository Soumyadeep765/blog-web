import Link from "next/link";
import type { Category } from "@/lib/categories";

type CategoryNavProps = {
  active?: string;
  categories: Category[];
};

export function CategoryNav({ active, categories }: CategoryNavProps) {
  return (
    <nav className="category-nav" aria-label="Categories">
      <Link
        href="/blog"
        className={
          active === "all"
            ? "category-chip category-chip--active"
            : "category-chip"
        }
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/blog/category/${category.slug}`}
          className={
            active === category.slug
              ? "category-chip category-chip--active"
              : "category-chip"
          }
        >
          {category.name}
        </Link>
      ))}
    </nav>
  );
}
