import type { Metadata } from "next";
import Link from "next/link";
import {
  Eye,
  FileText,
  FolderOpen,
  PenLine,
  Users,
} from "lucide-react";
import {
  getDashboardStats,
  getTopPosts,
  getViewsByDay,
} from "@/lib/analytics";
import { getAdminPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Dashboard",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [stats, topPosts, viewsByDay, recent] = await Promise.all([
    getDashboardStats(),
    getTopPosts(6),
    getViewsByDay(14),
    getAdminPosts("all"),
  ]);

  const maxViews = Math.max(1, ...viewsByDay.map((d) => d.views));

  const cards = [
    {
      label: "Published",
      value: stats.publishedPosts,
      hint: `${stats.draftPosts} drafts`,
      icon: FileText,
    },
    {
      label: "Total views",
      value: stats.totalViews.toLocaleString(),
      hint: `${stats.viewsLast7Days} last 7 days`,
      icon: Eye,
    },
    {
      label: "Categories",
      value: stats.totalCategories,
      hint: "Topic sections",
      icon: FolderOpen,
    },
    {
      label: "Team",
      value: stats.totalUsers,
      hint: "Active admins",
      icon: Users,
    },
  ];

  return (
    <div className="dash-page">
      <header className="dash-page__intro">
        <h1>Dashboard</h1>
        <p>Overview of posts, traffic, and publishing activity.</p>
      </header>

      <section className="dash-stats">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.label} className="dash-stat">
              <div className="dash-stat__icon">
                <Icon size={18} aria-hidden />
              </div>
              <p className="dash-stat__label">{card.label}</p>
              <p className="dash-stat__value">{card.value}</p>
              <p className="dash-stat__hint">{card.hint}</p>
            </article>
          );
        })}
      </section>

      <div className="dash-grid">
        <section className="dash-panel">
          <div className="dash-panel__head">
            <h2>Views · 14 days</h2>
            <span>{stats.viewsLast30Days} in 30 days</span>
          </div>
          {viewsByDay.length === 0 ? (
            <p className="dash-empty">No view data yet. Publish a post and share it.</p>
          ) : (
            <div className="dash-bars" role="img" aria-label="Views over the last 14 days">
              {viewsByDay.map((day) => (
                <div key={day.day} className="dash-bars__item" title={`${day.day}: ${day.views}`}>
                  <div
                    className="dash-bars__fill"
                    style={{ height: `${Math.max(8, (day.views / maxViews) * 100)}%` }}
                  />
                  <span>{day.day.slice(5)}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="dash-panel">
          <div className="dash-panel__head">
            <h2>Top posts</h2>
            <Link href="/admin/analytics">Analytics</Link>
          </div>
          <ul className="dash-list">
            {topPosts.map((post) => (
              <li key={post.id}>
                <Link href={`/admin/posts/${post.id}/edit`}>{post.title}</Link>
                <span>
                  {post.views} views
                  {!post.published ? " · draft" : ""}
                </span>
              </li>
            ))}
            {topPosts.length === 0 ? (
              <li className="dash-empty">No posts yet.</li>
            ) : null}
          </ul>
        </section>
      </div>

      <section className="dash-panel">
        <div className="dash-panel__head">
          <h2>Recent posts</h2>
          <Link href="/admin/posts/new" className="button button--ghost">
            <PenLine size={16} aria-hidden />
            Write
          </Link>
        </div>
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Category</th>
                <th>Views</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recent.slice(0, 8).map((post) => (
                <tr key={post.id}>
                  <td>
                    <Link href={`/admin/posts/${post.id}/edit`}>{post.title}</Link>
                  </td>
                  <td>
                    <span
                      className={
                        post.published
                          ? "dash-badge dash-badge--ok"
                          : "dash-badge"
                      }
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td>{post.category}</td>
                  <td>{post.views}</td>
                  <td>{post.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
