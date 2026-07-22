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
    <form action={action} className="admin-form">
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

      {state.error ? <p className="admin-form__error">{state.error}</p> : null}
      {state.success ? (
        <p className="admin-form__success">{state.success}</p>
      ) : null}

      <button type="submit" className="button button--primary" disabled={pending}>
        {pending ? "Creating..." : "Create user"}
      </button>
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

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <div>
              <strong>{user.name}</strong>
              <span>
                @{user.username} · {user.role}
                {!user.active ? " · inactive" : ""}
              </span>
            </div>
            {user.id === currentUserId ? (
              <span className="admin-users-list__you">You</span>
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
                  className="button button--ghost"
                  disabled={pending}
                >
                  {user.active ? "Deactivate" : "Reactivate"}
                </button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
