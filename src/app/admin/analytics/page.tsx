import type { Metadata } from "next";
import Link from "next/link";
import {
  getDashboardStats,
  getTopPosts,
  getViewsByDay,
} from "@/lib/analytics";

export const metadata: Metadata = {
  title: "Analytics",
};

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const [stats, topPosts, viewsByDay] = await Promise.all([
    getDashboardStats(),
    getTopPosts(12),
    getViewsByDay(30),
  ]);

  const maxViews = Math.max(1, ...viewsByDay.map((d) => d.views));

  return (
    <div className="dash-page">
      <header className="dash-page__intro">
        <h1>Analytics</h1>
        <p>Traffic from post views stored in your database.</p>
      </header>

      <section className="dash-stats">
        <article className="dash-stat">
          <p className="dash-stat__label">All-time views</p>
          <p className="dash-stat__value">{stats.totalViews.toLocaleString()}</p>
        </article>
        <article className="dash-stat">
          <p className="dash-stat__label">Last 7 days</p>
          <p className="dash-stat__value">
            {stats.viewsLast7Days.toLocaleString()}
          </p>
        </article>
        <article className="dash-stat">
          <p className="dash-stat__label">Last 30 days</p>
          <p className="dash-stat__value">
            {stats.viewsLast30Days.toLocaleString()}
          </p>
        </article>
        <article className="dash-stat">
          <p className="dash-stat__label">Published posts</p>
          <p className="dash-stat__value">{stats.publishedPosts}</p>
        </article>
      </section>

      <section className="dash-panel">
        <div className="dash-panel__head">
          <h2>Daily views · 30 days</h2>
        </div>
        {viewsByDay.length === 0 ? (
          <p className="dash-empty">No views recorded yet.</p>
        ) : (
          <div className="dash-bars dash-bars--dense">
            {viewsByDay.map((day) => (
              <div
                key={day.day}
                className="dash-bars__item"
                title={`${day.day}: ${day.views}`}
              >
                <div
                  className="dash-bars__fill"
                  style={{
                    height: `${Math.max(6, (day.views / maxViews) * 100)}%`,
                  }}
                />
                <span>{Number(day.day.slice(8))}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="dash-panel">
        <div className="dash-panel__head">
          <h2>Top posts</h2>
        </div>
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Post</th>
                <th>Status</th>
                <th>Views</th>
              </tr>
            </thead>
            <tbody>
              {topPosts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <Link href={`/admin/posts/${post.id}/edit`}>
                      {post.title}
                    </Link>
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
                  <td>{post.views.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
