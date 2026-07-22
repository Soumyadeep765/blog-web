import type { Metadata } from "next";
import { AdminSettingsForm } from "@/components/AdminSettingsForm";
import { getCurrentAdmin } from "@/lib/admin";
import { getSiteSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Settings",
};

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const [user, settings] = await Promise.all([
    getCurrentAdmin(),
    getSiteSettings(),
  ]);

  return (
    <div className="dash-page">
      <header className="dash-page__intro">
        <h1>Settings</h1>
        <p>
          Site identity stored in the database. Works the same on local and
          Vercel.
        </p>
      </header>

      <section className="dash-panel">
        <div className="dash-panel__head">
          <h2>General</h2>
        </div>
        <AdminSettingsForm
          settings={settings}
          canEdit={user?.role === "owner"}
        />
      </section>

      <section className="dash-panel">
        <div className="dash-panel__head">
          <h2>Vercel env checklist</h2>
        </div>
        <ul className="dash-checklist">
          <li>
            <code>DATABASE_URL</code> — Supabase pooler URL (port 6543,
            transaction mode)
          </li>
          <li>
            <code>ADMIN_PASSWORD</code> — bootstrap owner password
          </li>
          <li>
            <code>ADMIN_SESSION_SECRET</code> — dedicated session HMAC secret
          </li>
          <li>
            <code>NEXT_PUBLIC_SITE_URL</code> — https://blog.telebothost.com
          </li>
        </ul>
      </section>
    </div>
  );
}
