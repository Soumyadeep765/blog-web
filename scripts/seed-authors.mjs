import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, {
  ssl: "require",
  max: 1,
});

const siteConfig = {
  name: "TeleBotHost Blog",
  url: "https://telebothost.com",
  author: {
    name: "TeleBotHost Team",
    bio: "We write about bots, building products, and the everyday stuff around shipping software.",
  },
  links: {
    twitter: "https://twitter.com/telebothost",
    github: "https://github.com/telebothost",
  }
};

const authorsToSeed = [
  {
    name: siteConfig.author.name,
    slug: "telebothost-team",
    role: "Editorial Team",
    bio: siteConfig.author.bio,
    avatar: null,
    location: "Earth",
    twitter: siteConfig.links.twitter,
    github: siteConfig.links.github,
    website: siteConfig.url,
  },
  {
    name: siteConfig.author.name,
    slug: "telebothost",
    role: "Editorial Team",
    bio: siteConfig.author.bio,
    avatar: null,
    location: "Earth",
    twitter: siteConfig.links.twitter,
    github: siteConfig.links.github,
    website: siteConfig.url,
  }
];

async function main() {
  console.log("Seeding authors...");
  for (const author of authorsToSeed) {
    try {
      await sql`
        INSERT INTO authors (name, slug, role, bio, avatar, location, twitter, github, website)
        VALUES (
          ${author.name}, ${author.slug}, ${author.role}, ${author.bio}, ${author.avatar}, ${author.location}, ${author.twitter}, ${author.github}, ${author.website}
        )
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          role = EXCLUDED.role,
          bio = EXCLUDED.bio,
          avatar = EXCLUDED.avatar,
          location = EXCLUDED.location,
          twitter = EXCLUDED.twitter,
          github = EXCLUDED.github,
          website = EXCLUDED.website;
      `;
      console.log(`Seeded author: ${author.slug}`);
    } catch (e) {
      console.error(`Failed to seed ${author.slug}:`, e);
    }
  }
  console.log("Done.");
  await sql.end();
}

main();
