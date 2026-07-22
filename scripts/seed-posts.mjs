import fs from "fs";
import path from "path";
import matter from "gray-matter";
import postgres from "postgres";
import { config } from "dotenv";

config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL missing in .env.local");
  process.exit(1);
}

const sql = postgres(connectionString, { ssl: "require", max: 1 });
const postsDir = path.join(process.cwd(), "content/posts");

async function main() {
  if (!fs.existsSync(postsDir)) {
    console.log("No content/posts directory found.");
    await sql.end();
    return;
  }

  const files = fs.readdirSync(postsDir).filter((file) => file.endsWith(".md"));

  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
    const { data, content } = matter(raw);
    const tags = Array.isArray(data.tags)
      ? data.tags.map(String)
      : data.tags
        ? [String(data.tags)]
        : [];

    await sql`
      insert into posts (
        slug, title, description, content, category, tags,
        cover_image, cover_alt, author, published, date
      ) values (
        ${slug},
        ${data.title},
        ${data.description ?? ""},
        ${content.trim()},
        ${data.category ?? "technology"},
        ${tags}::text[],
        ${data.coverImage ?? null},
        ${data.coverAlt ?? null},
        ${data.author ?? "TeleBotHost Team"},
        ${data.published !== false},
        ${data.date}
      )
      on conflict (slug) do update set
        title = excluded.title,
        description = excluded.description,
        content = excluded.content,
        category = excluded.category,
        tags = excluded.tags,
        cover_image = excluded.cover_image,
        cover_alt = excluded.cover_alt,
        author = excluded.author,
        published = excluded.published,
        date = excluded.date,
        updated_at = now()
    `;

    console.log(`Seeded: ${slug}`);
  }

  await sql.end();
  console.log("Done.");
}

main().catch(async (error) => {
  console.error(error);
  await sql.end({ timeout: 1 });
  process.exit(1);
});
