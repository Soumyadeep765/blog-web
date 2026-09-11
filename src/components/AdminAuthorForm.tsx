"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { saveAuthor, deleteAuthor } from "@/app/actions/admin";
import type { Author } from "@/lib/authors";

function SubmitButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="button button--primary" disabled={pending}>
      {pending ? "Saving..." : isNew ? "Create Author" : "Save Changes"}
    </button>
  );
}

function DeleteButton({ slug }: { slug: string }) {
  const [state, action] = useActionState(deleteAuthor, {});
  const { pending } = useFormStatus();
  
  if (slug === "new") return null;

  return (
    <form action={action} onSubmit={(e) => {
      if (!confirm("Are you sure you want to delete this author?")) e.preventDefault();
    }}>
      <input type="hidden" name="slug" value={slug} />
      <button type="submit" className="button button--danger" disabled={pending}>
        Delete Author
      </button>
      {state.error && <p className="form-error">{state.error}</p>}
    </form>
  );
}

export function AdminAuthorForm({ author, isNew }: { author?: Author, isNew: boolean }) {
  const [state, action] = useActionState(saveAuthor, {});
  const [name, setName] = useState(author?.name || "");
  const [slug, setSlug] = useState(author?.slug || "");

  // Auto-generate slug for new authors
  useEffect(() => {
    if (isNew && name) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
    }
  }, [name, isNew]);

  return (
    <div className="dash-form-wrapper">
      <form action={action} className="admin-form dash-form">
        <input type="hidden" name="isNew" value={isNew ? "true" : "false"} />
        <input type="hidden" name="originalSlug" value={author?.slug || ""} />

        {state.error && <div className="dash-alert dash-alert--error">{state.error}</div>}
        {state.success && <div className="dash-alert dash-alert--success">{state.success}</div>}

        <div className="admin-form__row">
          <label className="admin-form__field">
            <span>Display Name</span>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </label>

          <label className="admin-form__field">
            <span>URL Slug</span>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="john-doe"
            />
          </label>
        </div>

        <label className="admin-form__field">
          <span>Role / Title</span>
          <input
            id="role"
            name="role"
            type="text"
            defaultValue={author?.role || ""}
            placeholder="e.g. Guest Writer"
          />
        </label>

        <label className="admin-form__field">
          <span>Bio</span>
          <textarea
            id="bio"
            name="bio"
            rows={3}
            defaultValue={author?.bio || ""}
            placeholder="A short biography..."
          />
        </label>

        <div className="admin-form__row">
          <label className="admin-form__field">
            <span>Avatar URL (Optional)</span>
            <input
              id="avatar"
              name="avatar"
              type="url"
              defaultValue={author?.avatar || ""}
              placeholder="https://example.com/avatar.jpg"
            />
          </label>
          
          <label className="admin-form__field">
            <span>Location (Optional)</span>
            <input
              id="location"
              name="location"
              type="text"
              defaultValue={author?.location || ""}
              placeholder="San Francisco, CA"
            />
          </label>
        </div>

        <fieldset className="dash-form__fieldset">
          <legend>Social Links</legend>
          <label className="admin-form__field">
            <span>Twitter / X URL</span>
            <input
              id="twitter"
              name="twitter"
              type="url"
              defaultValue={author?.socials?.twitter || ""}
              placeholder="https://twitter.com/username"
            />
          </label>
          <div className="admin-form__row">
            <label className="admin-form__field">
              <span>GitHub URL</span>
              <input
                id="github"
                name="github"
                type="url"
                defaultValue={author?.socials?.github || ""}
                placeholder="https://github.com/username"
              />
            </label>
            <label className="admin-form__field">
              <span>Website URL</span>
              <input
                id="website"
                name="website"
                type="url"
                defaultValue={author?.socials?.website || ""}
                placeholder="https://example.com"
              />
            </label>
          </div>
        </fieldset>

        <div className="dash-form__actions">
          <SubmitButton isNew={isNew} />
          <Link href="/admin/authors" className="button button--secondary">
            Cancel
          </Link>
        </div>
      </form>

      {!isNew && (
        <div className="dash-panel dash-panel--danger" style={{ marginTop: "2rem" }}>
          <div className="dash-panel__head">
            <h2>Danger Zone</h2>
          </div>
          <div className="dash-panel__body">
            <p>Deleting this author will not delete their posts, but their posts will no longer link to a valid profile.</p>
            <div style={{ marginTop: "1rem" }}>
              <DeleteButton slug={author!.slug} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
