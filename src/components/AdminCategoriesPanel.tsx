"use client";

import { useActionState } from "react";
import {
  createBlogCategory,
  deleteBlogCategory,
  updateBlogCategory,
  type AdminFormState,
} from "@/app/actions/admin";
import type { Category } from "@/lib/categories";

const initialState: AdminFormState = {};

export function AdminCategoriesPanel({
  categories,
}: {
  categories: Category[];
}) {
  const [createState, createAction, createPending] = useActionState(
    createBlogCategory,
    initialState,
  );
  const [updateState, updateAction, updatePending] = useActionState(
    updateBlogCategory,
    initialState,
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteBlogCategory,
    initialState,
  );

  return (
    <div className="dash-stack">
      <section className="dash-panel">
        <div className="dash-panel__head">
          <h2>Add category</h2>
        </div>
        <form action={createAction} className="admin-form dash-form">
          <div className="admin-form__row">
            <label className="admin-form__field">
              <span>Name</span>
              <input type="text" name="name" required placeholder="Technology" />
            </label>
            <label className="admin-form__field">
              <span>Slug (optional)</span>
              <input type="text" name="slug" placeholder="technology" />
            </label>
          </div>
          <label className="admin-form__field">
            <span>Description</span>
            <textarea name="description" rows={2} placeholder="What this topic covers" />
          </label>
          {createState.error ? (
            <p className="admin-form__error">{createState.error}</p>
          ) : null}
          {createState.success ? (
            <p className="admin-form__success">{createState.success}</p>
          ) : null}
          <button
            type="submit"
            className="button button--primary"
            disabled={createPending}
          >
            {createPending ? "Creating..." : "Create category"}
          </button>
        </form>
      </section>

      {(updateState.error || deleteState.error) && (
        <p className="admin-form__error">
          {updateState.error || deleteState.error}
        </p>
      )}
      {(updateState.success || deleteState.success) && (
        <p className="admin-form__success">
          {updateState.success || deleteState.success}
        </p>
      )}

      <section className="dash-panel">
        <div className="dash-panel__head">
          <h2>All categories</h2>
          <span>{categories.length} total</span>
        </div>
        <ul className="dash-cat-list">
          {categories.map((category) => (
            <li key={category.slug}>
              <form action={updateAction} className="dash-cat-form">
                <input type="hidden" name="slug" value={category.slug} />
                <label className="admin-form__field">
                  <span>Name</span>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={category.name}
                  />
                </label>
                <label className="admin-form__field">
                  <span>Slug</span>
                  <input type="text" value={category.slug} disabled />
                </label>
                <label className="admin-form__field dash-cat-form__desc">
                  <span>Description</span>
                  <input
                    type="text"
                    name="description"
                    defaultValue={category.description}
                  />
                </label>
                <div className="dash-row-actions">
                  <button
                    type="submit"
                    className="button button--ghost"
                    disabled={updatePending}
                  >
                    Save
                  </button>
                </div>
              </form>
              <form
                action={deleteAction}
                onSubmit={(event) => {
                  if (
                    !confirm(
                      `Delete category “${category.name}”? Posts using it must be moved first.`,
                    )
                  ) {
                    event.preventDefault();
                  }
                }}
              >
                <input type="hidden" name="slug" value={category.slug} />
                <button
                  type="submit"
                  className="button button--ghost dash-danger"
                  disabled={deletePending}
                >
                  Delete
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
