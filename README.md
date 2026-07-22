# TeleBotHost Blog

This is a clean, fast blog system built with Next.js 16 (App Router) and PostgreSQL. It includes visitor tracking, a custom markdown link preview feature, and a simple dashboard to manage your posts.

**Live Preview**: [blog.telebothost.com](https://blog.telebothost.com)

## What it does

* **Fast builds**: Blog post pages load on demand in production. The build process stays fast even if you have hundreds of posts.
* **Custom markdown previews**: When you write `[preview](https://url.com)` in your markdown, it renders as a visual preview card in the browser. Other links remain as standard text.
* **Simple analytics**: The app logs page views directly to your database, and Google Analytics 4 is set up to track page engagement and visitor regions.
* **Admin dashboard**: Access `/admin` to write posts, set up categories, view database statistics, and manage your settings.
* **GraphQL endpoint**: You can query your blog data dynamically at `/api/graphql`.
* **SEO ready**: The site builds sitemaps, RSS feeds, and robots.txt files automatically.

## How to set it up

1. Clone this repository from [github.com/Soumyadeep765/blog-web](https://github.com/Soumyadeep765/blog-web).
2. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
3. Open `.env.local` and add your database URL, Supabase details, and admin dashboard password.
4. Install the dependencies:
   ```bash
   npm install
   ```
5. Seed the database with sample posts if you want to start with some data:
   ```bash
   node scripts/seed-posts.mjs
   ```
6. Run the local development server:
   ```bash
   npm run dev
   ```

Open `http://localhost:3000` to see your blog running locally.

## Project Details & Contact

The code for this project is public and hosted on GitHub. If you want to suggest a feature, report a bug, or ask a question, feel free to open an issue or reach out.

* **GitHub Repository**: [github.com/Soumyadeep765/blog-web](https://github.com/Soumyadeep765/blog-web)
* **GitHub Profile**: [github.com/Soumyadeep765](https://github.com/Soumyadeep765)
