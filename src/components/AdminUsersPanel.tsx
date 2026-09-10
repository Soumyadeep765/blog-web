"use client";

import { useActionState } from "react";
import {
  createAdminAccount,
  toggleAdminUser,
  type AdminFormState,
} from "@/app/actions/admin";
import type { AdminUser } from "@/lib/admin";

const initialState: AdminFormState = {};

export function AdminCreateUserForm() {
  const [state, action, pending] = useActionState(
    createAdminAccount,
    initialState,
  );

  return (
    <form action={action} className="dash-form">
      <div className="admin-form__row">
        <label className="admin-form__field">
          <span>Display name</span>
          <input type="text" name="name" required placeholder="Soumya" />
        </label>
        <label className="admin-form__field">
          <span>Username</span>
          <input type="text" name="username" required placeholder="soumya" />
        </label>
      </div>

      <div className="admin-form__row">
        <label className="admin-form__field">
          <span>Password</span>
          <input
            type="password"
            name="password"
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="At least 8 characters"
          />
        </label>
        <label className="admin-form__field">
          <span>Role</span>
          <select name="role" defaultValue="editor">
            <option value="editor">Editor</option>
            <option value="owner">Owner</option>
          </select>
        </label>
      </div>

      <div className="dash-form__actions" style={{ marginTop: "1rem" }}>
        <button type="submit" className="button button--primary" disabled={pending}>
          {pending ? "Creating..." : "Create user"}
        </button>
      </div>

      {state.error ? <p className="admin-form__error">{state.error}</p> : null}
      {state.success ? (
        <p className="admin-form__success">{state.success}</p>
      ) : null}

    </form>
  );
}

export function AdminUsersList({
  users,
  currentUserId,
}: {
  users: AdminUser[];
  currentUserId: string;
}) {
  const [state, action, pending] = useActionState(toggleAdminUser, initialState);

  return (
    <div className="admin-users-list">
      {state.error ? <p className="admin-form__error">{state.error}</p> : null}
      {state.success ? (
        <p className="admin-form__success">{state.success}</p>
      ) : null}

      <div className="dash-table-wrap">
        <table className="dash-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              <th className="dash-table__actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <strong>{user.name}</strong>
                  <div className="dash-table__sub">@{user.username}</div>
                </td>
                <td>{user.role}</td>
                <td>
                  <span className={user.active ? "dash-badge dash-badge--ok" : "dash-badge"}>
                    {user.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="dash-table__actions">
                  {user.id === currentUserId ? (
                    <span className="dash-muted" style={{ padding: "0 1rem" }}>You</span>
                  ) : (
                    <form action={action}>
                      <input type="hidden" name="userId" value={user.id} />
                      <input
                        type="hidden"
                        name="active"
                        value={user.active ? "false" : "true"}
                      />
                      <button
                        type="submit"
                        className="button button--secondary button--sm"
                        disabled={pending}
                      >
                        {user.active ? "Deactivate" : "Reactivate"}
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
