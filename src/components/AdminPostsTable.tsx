"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  deleteBlogPost,
  toggleBlogPostPublished,
  type AdminFormState,
} from "@/app/actions/admin";
import type { Post } from "@/types/post";

const initialState: AdminFormState = {};

export function AdminPostsTable({ posts }: { posts: Post[] }) {
  const [toggleState, toggleAction, togglePending] = useActionState(
    toggleBlogPostPublished,
    initialState,
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteBlogPost,
    initialState,
  );

  return (
    <div>
      {toggleState.error || deleteState.error ? (
        <p className="admin-form__error">
          {toggleState.error || deleteState.error}
        </p>
      ) : null}
      {toggleState.success ? (
        <p className="admin-form__success">{toggleState.success}</p>
      ) : null}

      <div className="dash-table-wrap">
        <table className="dash-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Category</th>
              <th>Views</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="dash-empty">
                  No posts match this filter.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <Link href={`/admin/posts/${post.id}/edit`}>
                      {post.title}
                    </Link>
                    <div className="dash-muted">/{post.slug}</div>
                  </td>
                  <td>
                    <span
                      className={
                        post.published
                          ? "dash-badge dash-badge--ok"
                          : "dash-badge"
                      }
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td>{post.category}</td>
                  <td>{post.views}</td>
                  <td>{post.date}</td>
                  <td>
                    <div className="dash-row-actions">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="button button--ghost"
                      >
                        Edit
                      </Link>
                      <form action={toggleAction}>
                        <input type="hidden" name="id" value={post.id} />
                        <input type="hidden" name="slug" value={post.slug} />
                        <input
                          type="hidden"
                          name="category"
                          value={post.category}
                        />
                        <input
                          type="hidden"
                          name="published"
                          value={post.published ? "false" : "true"}
                        />
                        <button
                          type="submit"
                          className="button button--ghost"
                          disabled={togglePending}
                        >
                          {post.published ? "Unpublish" : "Publish"}
                        </button>
                      </form>
                      <form
                        action={deleteAction}
                        onSubmit={(event) => {
                          if (
                            !confirm(
                              `Delete “${post.title}”? This cannot be undone.`,
                            )
                          ) {
                            event.preventDefault();
                          }
                        }}
                      >
                        <input type="hidden" name="id" value={post.id} />
                        <input type="hidden" name="slug" value={post.slug} />
                        <input
                          type="hidden"
                          name="category"
                          value={post.category}
                        />
                        <button
                          type="submit"
                          className="button button--ghost dash-danger"
                          disabled={deletePending}
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
