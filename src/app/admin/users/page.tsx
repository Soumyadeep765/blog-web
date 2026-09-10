import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  AdminCreateUserForm,
  AdminUsersList,
} from "@/components/AdminUsersPanel";
import { getCurrentAdmin, listAdminUsers } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Users",
};

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const user = await getCurrentAdmin();
  if (user?.role !== "owner") {
    redirect("/admin");
  }

  const users = await listAdminUsers();

  return (
    <div className="dash-page">
      <header className="dash-page__intro">
        <h1>Users</h1>
        <p>Create accounts for people who should publish posts.</p>
      </header>

      <section className="dash-panel">
        <div className="dash-panel__head">
          <h2>Create user</h2>
        </div>
        <AdminCreateUserForm />
      </section>

      <section className="dash-panel">
        <div className="dash-panel__head">
          <h2>Team</h2>
          <span>{users.length} accounts</span>
        </div>
        <AdminUsersList users={users} currentUserId={user!.id} />
      </section>
    </div>
  );
}
