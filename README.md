# TeleBotHost Blog

This is a developer-focused, high-performance blog engine built with Next.js 16 (App Router) and PostgreSQL. It features custom visitor statistics, automated ad slot rendering, modular SEO structures, and an on-demand link preview engine.

---

## What it does (Features in Detail)

### 1. Markdown Link Previews
The blog includes a link parser that runs in the browser.
* **Explicit Syntax**: To create a visual link card, put a markdown link on its own line using `[preview]` as the link text. For example:
  ```markdown
  [preview](https://github.com)
  ```
* **Fallback Behavior**: Normal links like `[GitHub](https://github.com)` render as regular inline text links. If the preview metadata fails to resolve, it falls back gracefully to a standard text link showing the destination URL.

### 2. Visitor Analytics & Views Tracker
A custom tracking system tracks article popularity without cookies.
* **Database Logs**: Every article view triggers a raw visit log in the PostgreSQL `post_views` table.
* **Aggregated Stats**: The dashboard query pulls these visits to generate visual charts (daily trends, total views, views in the last 7 or 30 days).
* **Google Analytics 4**: Set up via `@next/third-parties/google` to record geographical (country, state, city) and per-page metrics without slowing down the initial page render.

### 3. Google AdSense Integration
Includes modular ad slot layouts that can be controlled globally.
* **Toggle Controls**: Enable or disable ads sitewide.
* **Ad Slots**: Preconfigured layouts include:
  * Top of article (`article-top`)
  * Middle of article (`article-mid`)
  * Bottom of article (`article-bottom`)
  * Sidebar container (`sidebar`)
  * Blog list feed (`blog-list`)

### 4. Admin Dashboard (`/admin`)
A dashboard panel allowing full site management.
* **Write & Edit**: A full markdown editor to publish new posts or keep them as drafts.
* **Categories**: Define, edit, and organize posts under categories.
* **System Stats**: View real-time database metrics, total active administrators, and visit analytics charts.
* **Settings**: Configure site branding, active categories, and override ad settings directly from the UI.

### 5. GraphQL API (`/api/graphql`)
Includes a GraphQL endpoint at `/api/graphql` to query posts, tags, categories, and analytics data programmatically for external integrations.

---

## Configuration & Setup

### Environment Variables
Configure your local environment by creating a `.env.local` file. Use the values in `.env.example` as a template:

```ini
# Site Domain
NEXT_PUBLIC_SITE_URL=https://your-blog-domain.com

# Database Connection (PostgreSQL connection string)
DATABASE_URL=postgresql://user:password@host:port/dbname?sslmode=require

# Supabase Keys (if hosting on Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Admin Login Security
ADMIN_PASSWORD=your-secure-admin-password

# Optional: Google AdSense variables (can also be configured in DB settings)
NEXT_PUBLIC_GOOGLE_ADS_CLIENT=ca-pub-xxxxxxxxxxxxxxxx
```

---

## How Admin Login Works

1. Start your server and navigate to `/admin/login`.
2. Enter `admin` as the username and the value of your `ADMIN_PASSWORD` environment variable as the password.
3. The first login automatically initializes your user account details in the database.
4. You can edit site titles, descriptions, and logos directly inside the **Settings** tab.

---

## Installation & Commands

### 1. Install Dependencies
```bash
npm install
```

### 2. Populate Database (Optional)
Run the seeding script to populate your database with initial sample posts:
```bash
node scripts/seed-posts.mjs
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## Project Structure

* `/src/app`: App Router pages, layouts, API endpoints (GraphQL, link preview parser).
* `/src/components`: UI components, markdown renderer, and loading skeletons.
* `/src/lib`: Database clients, SEO metadata builders, setting helpers, and schemas.
* `/content`: Local markdown post archives.
* `/scripts`: Seeding scripts.
* `/public`: Static branding files, logo, and cover graphics.
