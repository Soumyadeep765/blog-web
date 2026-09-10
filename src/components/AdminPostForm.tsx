"use client";

import { useActionState } from "react";
import {
  createBlogPost,
  updateBlogPost,
  type AdminFormState,
} from "@/app/actions/admin";
import type { Category } from "@/lib/categories";
import type { Post } from "@/types/post";

import type { Author } from "@/lib/authors";

const initialState: AdminFormState = {};

type AdminPostFormProps = {
  categories: Category[];
  authors: Author[];
  post?: Post;
  defaultAuthor?: string;
};

export function AdminPostForm({
  categories,
  authors,
  post,
  defaultAuthor = "TeleBotHost Team",
}: AdminPostFormProps) {
  const actionFn = post ? updateBlogPost : createBlogPost;
  const [state, action, pending] = useActionState(actionFn, initialState);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={action} className="admin-form dash-form">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}

      <label className="admin-form__field">
        <span>Title</span>
        <input
          type="text"
          name="title"
          required
          defaultValue={post?.title}
          placeholder="Post title"
        />
      </label>

      <label className="admin-form__field">
        <span>Slug</span>
        <input
          type="text"
          name="slug"
          defaultValue={post?.slug}
          placeholder="my-post-slug"
        />
      </label>

      <label className="admin-form__field">
        <span>Description</span>
        <textarea
          name="description"
          required
          rows={3}
          defaultValue={post?.description}
          placeholder="Short summary for cards and SEO"
        />
      </label>

      <label className="admin-form__field">
        <span>Content (markdown)</span>
        <textarea
          name="content"
          required
          rows={18}
          defaultValue={post?.content}
          placeholder={
            "## Heading\n\nWrite here...\n\n```ts\nconst ok = true;\n```"
          }
        />
      </label>

      <div className="admin-form__row">
        <label className="admin-form__field">
          <span>Category</span>
          <select
            name="category"
            defaultValue={post?.category || categories[0]?.slug || "technology"}
          >
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

      <div className="admin-form__row">
        <label className="admin-form__field">
          <span>Cover image URL</span>
          <input
            type="text"
            name="coverImage"
            defaultValue={post?.coverImage}
            placeholder="https://… or /images/posts/example.png"
          />
        </label>
        <label className="admin-form__field">
          <span>Cover alt text</span>
          <input
            type="text"
            name="coverAlt"
            defaultValue={post?.coverAlt}
            placeholder="Describe the image"
          />
        </label>
      </div>

      <label className="admin-form__field">
        <span>Tags (comma separated)</span>
        <input
          type="text"
          name="tags"
          defaultValue={post?.tags?.join(", ")}
          placeholder="Next.js, Bots, Tips"
        />
      </label>

      <div className="admin-form__row">
        <label className="admin-form__field">
          <span>Author</span>
          <select name="author" defaultValue={post?.author || defaultAuthor}>
            {authors.map((author) => (
              <option key={author.slug} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>
        </label>
        <label className="admin-form__field">
          <span>Date</span>
          <input
            type="date"
            name="date"
            defaultValue={post?.date || today}
          />
        </label>
      </div>

      <fieldset className="dash-form__fieldset" style={{ marginTop: "1rem" }}>
        <legend>SEO & Meta</legend>
        <label className="admin-form__field">
          <span>Excerpt</span>
          <textarea
            name="excerpt"
            rows={2}
            defaultValue={post?.excerpt}
            placeholder="Custom excerpt (overrides description on blog index)"
          />
        </label>
        
        <div className="admin-form__row">
          <label className="admin-form__field">
            <span>Meta Title</span>
            <input
              type="text"
              name="metaTitle"
              defaultValue={post?.metaTitle}
              placeholder="Custom SEO Title"
            />
          </label>
          <label className="admin-form__field">
            <span>Meta Description</span>
            <input
              type="text"
              name="metaDescription"
              defaultValue={post?.metaDescription}
              placeholder="Custom SEO Description"
            />
          </label>
        </div>
      </fieldset>

      <label className="admin-form__check">
        <input
          type="checkbox"
          name="published"
          defaultChecked={post ? post.published : true}
        />
        <span>Published</span>
      </label>

      {state.error ? <p className="admin-form__error">{state.error}</p> : null}
      {state.success ? (
        <p className="admin-form__success">{state.success}</p>
      ) : null}

      <div className="dash-form__actions">
        <button
          type="submit"
          className="button button--primary"
          disabled={pending}
        >
          {pending
            ? "Saving..."
            : post
              ? "Save changes"
              : "Create post"}
        </button>
        {post?.published ? (
          <a
            href={`/blog/${post.slug}`}
            className="button button--ghost"
            target="_blank"
            rel="noreferrer"
          >
            View live
          </a>
        ) : null}
      </div>
    </form>
  );
}
