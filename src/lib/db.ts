import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing. Check your .env.local file.");
}

const globalForDb = globalThis as unknown as {
  sql?: ReturnType<typeof postgres>;
};

// Vercel serverless: keep pool tiny; disable prepared statements for PgBouncer.
export const sql =
  globalForDb.sql ??
  postgres(connectionString, {
    ssl: "require",
    max: 1,
    idle_timeout: 1,
    connect_timeout: 30,
    prepare: false,
  });

// Next.js clears module cache during build, so we must always cache the connection globally
globalForDb.sql = sql;

export type DbPost = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  cover_image: string | null;
  cover_alt: string | null;
  author: string;
  published: boolean;
  views: number;
  date: string;
  created_at: string;
  updated_at: string;
  excerpt: string | null;
  meta_title: string | null;
  meta_description: string | null;
};
