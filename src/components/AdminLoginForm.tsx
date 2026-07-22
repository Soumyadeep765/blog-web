"use client";

import { useActionState } from "react";
import { loginAdmin, type AdminFormState } from "@/app/actions/admin";

const initialState: AdminFormState = {};

export function AdminLoginForm() {
  const [state, action, pending] = useActionState(loginAdmin, initialState);

  return (
    <form action={action} className="admin-login-form">
      <label className="admin-form__field">
        <span>Username</span>
        <input
          type="text"
          name="username"
          required
          autoComplete="username"
          autoFocus
          placeholder="Your username"
        />
      </label>

      <label className="admin-form__field">
        <span>Password</span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          placeholder="Your password"
        />
      </label>

      {state.error ? <p className="admin-form__error">{state.error}</p> : null}

      <button
        type="submit"
        className="button button--primary admin-login-form__submit"
        disabled={pending}
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
