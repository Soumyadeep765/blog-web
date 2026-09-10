"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  FileText,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  PenTool,
} from "lucide-react";
import { logoutAdmin } from "@/app/actions/admin";
import { BrandLogo } from "@/components/BrandLogo";
import type { AdminUser } from "@/lib/admin";

const NAV: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  ownerOnly?: boolean;
}[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/authors", label: "Authors", icon: PenTool, ownerOnly: true },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/users", label: "Users", icon: Users, ownerOnly: true },
  { href: "/admin/settings", label: "Settings", icon: Settings, ownerOnly: true },
];

export function AdminShell({
  user,
  children,
}: {
  user: AdminUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="dash">
      <aside className="dash-sidebar">
        <div className="dash-sidebar__brand">
          <BrandLogo className="brand-logo brand-logo--dash" />
          <div>
            <strong>TeleBotHost</strong>
            <span>Admin</span>
          </div>
        </div>

        <nav className="dash-sidebar__nav" aria-label="Admin">
          {NAV.map((item) => {
            if (item.ownerOnly && user.role !== "owner") {
              return null;
            }
            const Icon = item.icon;
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "is-active" : undefined}
              >
                <Icon size={18} aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="dash-sidebar__footer">
          <Link href="/blog" className="dash-sidebar__view">
            View blog
          </Link>
          <div className="dash-sidebar__user">
            <div>
              <strong>{user.name}</strong>
              <span>
                @{user.username} · {user.role}
              </span>
            </div>
            <form action={logoutAdmin}>
              <button
                type="submit"
                className="dash-icon-btn"
                aria-label="Log out"
                title="Log out"
              >
                <LogOut size={16} />
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="dash-main">
        <header className="dash-top">
          <p className="dash-top__crumb">Blog control panel</p>
          <Link href="/admin/posts/new" className="button button--primary">
            New post
          </Link>
        </header>
        <div className="dash-content">{children}</div>
      </div>
    </div>
  );
}
