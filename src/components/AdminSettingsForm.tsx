"use client";

import { useActionState } from "react";
import { saveSiteSettings, type AdminFormState } from "@/app/actions/admin";
import type { SiteSettings } from "@/lib/settings";

const initialState: AdminFormState = {};

export function AdminSettingsForm({
  settings,
  canEdit,
}: {
  settings: SiteSettings;
  canEdit: boolean;
}) {
  const [state, action, pending] = useActionState(saveSiteSettings, initialState);

  return (
    <form action={action} className="admin-form dash-form">
      {!canEdit ? (
        <p className="admin-form__error">
          Only owners can change site settings.
        </p>
      ) : null}

      <h3 className="admin-form__section-title">Site Details</h3>

      <label className="admin-form__field">
        <span>Site name</span>
        <input
          type="text"
          name="site_name"
          required
          defaultValue={settings.site_name}
          disabled={!canEdit}
        />
      </label>

      <label className="admin-form__field">
        <span>Site title</span>
        <input
          type="text"
          name="site_title"
          required
          defaultValue={settings.site_title}
          disabled={!canEdit}
        />
      </label>

      <label className="admin-form__field">
        <span>Site description</span>
        <textarea
          name="site_description"
          required
          rows={3}
          defaultValue={settings.site_description}
          disabled={!canEdit}
        />
      </label>

      <label className="admin-form__field">
        <span>Default author</span>
        <input
          type="text"
          name="default_author"
          defaultValue={settings.default_author}
          disabled={!canEdit}
        />
      </label>

      <h3 className="admin-form__section-title">Social Links</h3>

      <div className="admin-form__row">
        <label className="admin-form__field">
          <span>GitHub URL</span>
          <input
            type="url"
            name="social_github"
            placeholder="https://github.com/yourhandle"
            defaultValue={settings.social.github}
            disabled={!canEdit}
          />
        </label>

        <label className="admin-form__field">
          <span>Telegram URL</span>
          <input
            type="url"
            name="social_telegram"
            placeholder="https://t.me/yourhandle"
            defaultValue={settings.social.telegram}
            disabled={!canEdit}
          />
        </label>
      </div>

      <div className="admin-form__row">
        <label className="admin-form__field">
          <span>X / Twitter URL</span>
          <input
            type="url"
            name="social_x"
            placeholder="https://x.com/yourhandle"
            defaultValue={settings.social.x}
            disabled={!canEdit}
          />
        </label>

        <label className="admin-form__field">
          <span>Discord URL</span>
          <input
            type="url"
            name="social_discord"
            placeholder="https://discord.gg/yourinvite"
            defaultValue={settings.social.discord}
            disabled={!canEdit}
          />
        </label>
      </div>

      <h3 className="admin-form__section-title">Google Ads Configuration</h3>

      <label className="admin-form__field admin-form__field--checkbox">
        <input
          type="checkbox"
          name="ads_enabled"
          defaultChecked={settings.ads_enabled}
          disabled={!canEdit}
        />
        <span>Enable Google Ads</span>
      </label>

      <label className="admin-form__field">
        <span>Google Ads Client ID</span>
        <input
          type="text"
          name="google_ads_client"
          placeholder="ca-pub-1234567890123456"
          defaultValue={settings.google_ads_client}
          disabled={!canEdit}
        />
      </label>

      <h3 className="admin-form__section-title">Ad Slot IDs</h3>

      <div className="admin-form__row">
        <label className="admin-form__field">
          <span>Article Top Slot ID</span>
          <input
            type="text"
            name="ad_slot_article_top"
            placeholder="1234567890"
            defaultValue={settings.ad_slot_article_top}
            disabled={!canEdit}
          />
        </label>

        <label className="admin-form__field">
          <span>Article Mid Slot ID</span>
          <input
            type="text"
            name="ad_slot_article_mid"
            placeholder="1234567890"
            defaultValue={settings.ad_slot_article_mid}
            disabled={!canEdit}
          />
        </label>
      </div>

      <div className="admin-form__row">
        <label className="admin-form__field">
          <span>Article Bottom Slot ID</span>
          <input
            type="text"
            name="ad_slot_article_bottom"
            placeholder="1234567890"
            defaultValue={settings.ad_slot_article_bottom}
            disabled={!canEdit}
          />
        </label>

        <label className="admin-form__field">
          <span>Sidebar Slot ID</span>
          <input
            type="text"
            name="ad_slot_sidebar"
            placeholder="1234567890"
            defaultValue={settings.ad_slot_sidebar}
            disabled={!canEdit}
          />
        </label>
      </div>

      <label className="admin-form__field">
        <span>Blog List Slot ID</span>
        <input
          type="text"
          name="ad_slot_blog_list"
          placeholder="1234567890"
          defaultValue={settings.ad_slot_blog_list}
          disabled={!canEdit}
        />
      </label>

      {state.error ? <p className="admin-form__error">{state.error}</p> : null}
      {state.success ? (
        <p className="admin-form__success">{state.success}</p>
      ) : null}

      {canEdit ? (
        <button
          type="submit"
          className="button button--primary"
          disabled={pending}
        >
          {pending ? "Saving..." : "Save settings"}
        </button>
      ) : null}
    </form>
  );
}
