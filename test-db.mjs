import postgres from "postgres";

async function test() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }
  
  console.log("Connecting to db...");
  const sql = postgres(connectionString, {
    ssl: "require",
    max: 1,
    idle_timeout: 1,
    connect_timeout: 10,
    prepare: false,
  });

  try {
    const res = await sql`select 1 as x`;
    console.log("Success:", res);
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await sql.end();
  }
}

test();
