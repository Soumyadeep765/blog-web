import { unstable_cache } from "next/cache";
import { cache } from "react";
import { sql } from "@/lib/db";

export type SocialLinks = {
  github: string;
  telegram: string;
  x: string;
  discord: string;
};

export type SiteSettings = {
  site_name: string;
  site_title: string;
  site_description: string;
  default_author: string;
  social: SocialLinks;
  ads_enabled: boolean;
  google_ads_client: string;
  ad_slot_article_top: string;
  ad_slot_article_mid: string;
  ad_slot_article_bottom: string;
  ad_slot_sidebar: string;
  ad_slot_blog_list: string;
};

const DEFAULTS: SiteSettings = {
  site_name: "TeleBotHost",
  site_title: "TeleBotHost Blog",
  site_description:
    "The TeleBotHost blog: tech, bots, travel, work, food, and the small stuff that actually sticks with you.",
  default_author: "TeleBotHost Team",
  social: {
    github: "",
    telegram: "",
    x: "",
    discord: "",
  },
  ads_enabled: false,
  google_ads_client: "",
  ad_slot_article_top: "",
  ad_slot_article_mid: "",
  ad_slot_article_bottom: "",
  ad_slot_sidebar: "",
  ad_slot_blog_list: "",
};

function mapSettings(map: Record<string, string>): SiteSettings {
  return {
    site_name: map.site_name || DEFAULTS.site_name,
    site_title: map.site_title || DEFAULTS.site_title,
    site_description: map.site_description || DEFAULTS.site_description,
    default_author: map.default_author || DEFAULTS.default_author,
    social: {
      github: map.social_github || "",
      telegram: map.social_telegram || "",
      x: map.social_x || map.twitter_handle || "",
      discord: map.social_discord || "",
    },
    ads_enabled: map.ads_enabled === "true",
    google_ads_client: map.google_ads_client || "",
    ad_slot_article_top: map.ad_slot_article_top || "",
    ad_slot_article_mid: map.ad_slot_article_mid || "",
    ad_slot_article_bottom: map.ad_slot_article_bottom || "",
    ad_slot_sidebar: map.ad_slot_sidebar || "",
    ad_slot_blog_list: map.ad_slot_blog_list || "",
  };
}

export const getSiteSettings = cache(unstable_cache(
  async (): Promise<SiteSettings> => {
    try {
      const rows = await sql<{ key: string; value: string }[]>`
        select key, value from site_settings
      `;
      const map = Object.fromEntries(rows.map((row) => [row.key, row.value]));
      return mapSettings(map);
    } catch {
      return DEFAULTS;
    }
  },
  ["site-settings"],
  { tags: ["settings"] }
));

export async function updateSiteSettings(
  input: Partial<{
    site_name: string;
    site_title: string;
    site_description: string;
    default_author: string;
    social_github: string;
    social_telegram: string;
    social_x: string;
    social_discord: string;
    ads_enabled: string;
    google_ads_client: string;
    ad_slot_article_top: string;
    ad_slot_article_mid: string;
    ad_slot_article_bottom: string;
    ad_slot_sidebar: string;
    ad_slot_blog_list: string;
  }>,
): Promise<SiteSettings> {
  const entries = Object.entries(input).filter(
    ([, value]) => typeof value === "string",
  ) as [string, string][];

  for (const [key, value] of entries) {
    await sql`
      insert into site_settings (key, value, updated_at)
      values (${key}, ${value}, now())
      on conflict (key) do update
      set value = excluded.value, updated_at = now()
    `;
  }

  const rows = await sql<{ key: string; value: string }[]>`
    select key, value from site_settings
  `;
  const map = Object.fromEntries(rows.map((row) => [row.key, row.value]));
  return mapSettings(map);
}

export function getActiveSocialLinks(social: SocialLinks) {
  const items: { id: keyof SocialLinks; label: string; href: string }[] = [];

  if (social.github?.trim()) {
    items.push({ id: "github", label: "GitHub", href: social.github.trim() });
  }
  if (social.telegram?.trim()) {
    items.push({
      id: "telegram",
      label: "Telegram",
      href: social.telegram.trim(),
    });
  }
  if (social.x?.trim()) {
    items.push({ id: "x", label: "X", href: social.x.trim() });
  }
  if (social.discord?.trim()) {
    items.push({
      id: "discord",
      label: "Discord",
      href: social.discord.trim(),
    });
  }

  return items;
}
