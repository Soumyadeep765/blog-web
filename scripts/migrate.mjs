import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, {
  ssl: "require",
  max: 1,
});

async function main() {
  console.log("Running migrations...");

  try {
    // 1. Alter posts table
    console.log("Altering posts table...");
    await sql`
      ALTER TABLE posts
      ADD COLUMN IF NOT EXISTS excerpt TEXT,
      ADD COLUMN IF NOT EXISTS meta_title TEXT,
      ADD COLUMN IF NOT EXISTS meta_description TEXT;
    `;
    console.log("Posts table altered.");

    // 2. Create authors table
    console.log("Creating authors table...");
    await sql`
      CREATE TABLE IF NOT EXISTS authors (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        role TEXT,
        bio TEXT,
        avatar TEXT,
        location TEXT,
        twitter TEXT,
        github TEXT,
        website TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    console.log("Authors table created.");

  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();
