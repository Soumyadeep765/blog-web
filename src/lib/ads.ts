import type { SiteSettings } from "@/lib/settings";
import { getSiteSettings } from "@/lib/settings";

export type AdSlotName =
  | "article-top"
  | "article-mid"
  | "article-bottom"
  | "sidebar"
  | "blog-list";

const SLOT_SETTING_KEYS: Record<AdSlotName, keyof SiteSettings> = {
  "article-top": "ad_slot_article_top",
  "article-mid": "ad_slot_article_mid",
  "article-bottom": "ad_slot_article_bottom",
  sidebar: "ad_slot_sidebar",
  "blog-list": "ad_slot_blog_list",
};

/** Whether Google Ads can render on the public site. */
export async function getAdsConfig() {
  const settings = await getSiteSettings();
  const clientId =
    settings.google_ads_client ||
    process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT ||
    "";

  return {
    enabled: settings.ads_enabled && Boolean(clientId),
    clientId,
    slots: {
      articleTop: settings.ad_slot_article_top || process.env.NEXT_PUBLIC_AD_SLOT_ARTICLE_TOP || "",
      articleMid: settings.ad_slot_article_mid || process.env.NEXT_PUBLIC_AD_SLOT_ARTICLE_MID || "",
      articleBottom: settings.ad_slot_article_bottom || process.env.NEXT_PUBLIC_AD_SLOT_ARTICLE_BOTTOM || "",
      sidebar: settings.ad_slot_sidebar || process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR || "",
      blogList: settings.ad_slot_blog_list || process.env.NEXT_PUBLIC_AD_SLOT_BLOG_LIST || "",
    },
  };
}

export function getAdSlotId(
  slot: AdSlotName,
  settings?: SiteSettings,
): string | undefined {
  const key = SLOT_SETTING_KEYS[slot];
  if (settings && key && typeof settings[key] === "string" && settings[key]) {
    return settings[key] as string;
  }
  return process.env[`NEXT_PUBLIC_AD_SLOT_${slot.toUpperCase().replace(/-/g, "_")}`];
}
