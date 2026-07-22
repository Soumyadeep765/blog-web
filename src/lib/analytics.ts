import { sql } from "@/lib/db";

export type DashboardStats = {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  viewsLast7Days: number;
  viewsLast30Days: number;
  totalUsers: number;
  totalCategories: number;
};

export type TopPost = {
  id: string;
  slug: string;
  title: string;
  views: number;
  published: boolean;
};

export type DailyViews = {
  day: string;
  views: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const [posts, views, recent7, recent30, users, categories] = await Promise.all([
    sql<{ total: string; published: string; drafts: string }[]>`
      select
        count(*)::text as total,
        count(*) filter (where published)::text as published,
        count(*) filter (where not published)::text as drafts
      from posts
    `,
    sql<{ total: string }[]>`
      select coalesce(sum(views), 0)::text as total from posts
    `,
    sql<{ total: string }[]>`
      select count(*)::text as total
      from post_views
      where viewed_at >= now() - interval '7 days'
    `,
    sql<{ total: string }[]>`
      select count(*)::text as total
      from post_views
      where viewed_at >= now() - interval '30 days'
    `,
    sql<{ total: string }[]>`
      select count(*)::text as total from admin_users where active = true
    `,
    sql<{ total: string }[]>`
      select count(*)::text as total from blog_categories
    `,
  ]);

  return {
    totalPosts: Number(posts[0]?.total || 0),
    publishedPosts: Number(posts[0]?.published || 0),
    draftPosts: Number(posts[0]?.drafts || 0),
    totalViews: Number(views[0]?.total || 0),
    viewsLast7Days: Number(recent7[0]?.total || 0),
    viewsLast30Days: Number(recent30[0]?.total || 0),
    totalUsers: Number(users[0]?.total || 0),
    totalCategories: Number(categories[0]?.total || 0),
  };
}

export async function getTopPosts(limit = 8): Promise<TopPost[]> {
  return sql<TopPost[]>`
    select id, slug, title, views, published
    from posts
    order by views desc, date desc
    limit ${limit}
  `;
}

export async function getViewsByDay(days = 14): Promise<DailyViews[]> {
  const rows = await sql<{ day: string; views: string }[]>`
    select
      to_char(date_trunc('day', viewed_at), 'YYYY-MM-DD') as day,
      count(*)::text as views
    from post_views
    where viewed_at >= now() - make_interval(days => ${days})
    group by 1
    order by 1 asc
  `;

  return rows.map((row) => ({
    day: row.day,
    views: Number(row.views),
  }));
}
