import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { getCurrentAdmin } from "@/lib/admin";
import { siteConfig } from "@/lib/site";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await getCurrentAdmin()) {
    redirect("/admin");
  }

  return (
    <div className="admin-login">
      <section className="admin-login__panel admin-login__panel--brand" aria-hidden="true">
        <div className="admin-login__brand-copy">
          <p className="admin-login__eyebrow">{siteConfig.name}</p>
          <h1>Control panel</h1>
          <p>
            Sign in to manage posts, categories, analytics, users, and site
            settings.
          </p>
        </div>
        <div className="admin-login__orb admin-login__orb--a" />
        <div className="admin-login__orb admin-login__orb--b" />
      </section>

      <section className="admin-login__panel admin-login__panel--form">
        <div className="admin-login__card">
          <header className="admin-login__header">
            <p className="admin-login__eyebrow">Admin access</p>
            <h2>Welcome back</h2>
            <p>Use your username and password to continue.</p>
          </header>

          <AdminLoginForm />

          <Link href="/" className="admin-login__back">
            ← Back to site
          </Link>
        </div>
      </section>
    </div>
  );
}
