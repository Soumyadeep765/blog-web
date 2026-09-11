"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { siteConfig } from "@/lib/site";

const nav = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const productsRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false);
    setProductsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("nav-open", menuOpen);
    return () => document.body.classList.remove("nav-open");
  }, [menuOpen]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (
        productsRef.current &&
        !productsRef.current.contains(event.target as Node)
      ) {
        setProductsOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProductsOpen(false);
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand">
          <BrandLogo className="brand-logo brand-logo--header" />
          <span className="brand__name">{siteConfig.name}</span>
        </Link>

        <div className="site-header__actions">
          <nav className="site-nav site-nav--desktop" aria-label="Primary">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="site-nav__link">
                {item.label}
              </Link>
            ))}

            <div className="products-menu" ref={productsRef}>
              <button
                type="button"
                className="site-nav__link products-menu__trigger"
                aria-expanded={productsOpen}
                aria-haspopup="true"
                onClick={() => setProductsOpen((open) => !open)}
              >
                Products
                <ChevronDown
                  size={15}
                  strokeWidth={2.2}
                  className={
                    productsOpen
                      ? "products-menu__chevron products-menu__chevron--open"
                      : "products-menu__chevron"
                  }
                  aria-hidden="true"
                />
              </button>

              <div
                className={
                  productsOpen
                    ? "products-menu__panel products-menu__panel--open"
                    : "products-menu__panel"
                }
                role="menu"
                aria-hidden={!productsOpen}
              >
                <p className="products-menu__eyebrow">Our products</p>
                {siteConfig.products.map((product) => (
                  <a
                    key={product.href}
                    href={product.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="products-menu__item"
                    role="menuitem"
                    onClick={() => setProductsOpen(false)}
                  >
                    <span className="products-menu__name">
                      {product.name}
                      <span className="products-menu__badge">
                        {product.label}
                      </span>
                    </span>
                    <span className="products-menu__desc">
                      {product.description}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </nav>

          <ThemeToggle />

          <button
            type="button"
            className={menuOpen ? "menu-toggle menu-toggle--open" : "menu-toggle"}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <X size={20} strokeWidth={2.1} aria-hidden="true" />
            ) : (
              <Menu size={20} strokeWidth={2.1} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <div
        className={menuOpen ? "mobile-nav mobile-nav--open" : "mobile-nav"}
        id={menuId}
      >
        <nav className="mobile-nav__panel" aria-label="Mobile">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="mobile-nav__link"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <div className="mobile-nav__products">
            <p className="products-menu__eyebrow">Our products</p>
            {siteConfig.products.map((product) => (
              <a
                key={product.href}
                href={product.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-nav__product"
                onClick={() => setMenuOpen(false)}
              >
                <span className="products-menu__name">
                  {product.name}
                  <span className="products-menu__badge">{product.label}</span>
                </span>
                <span className="products-menu__desc">{product.description}</span>
              </a>
            ))}
          </div>
        </nav>
      </div>

      <button
        type="button"
        className={
          menuOpen
            ? "mobile-nav__backdrop mobile-nav__backdrop--open"
            : "mobile-nav__backdrop"
        }
        aria-label="Close menu"
        tabIndex={menuOpen ? 0 : -1}
        onClick={() => setMenuOpen(false)}
      />
    </header>
  );
}
