import { getSiteSettings } from "@/lib/settings";
import { siteConfig } from "@/lib/site";

/** Live site config from DB settings, with static fallbacks. Server-only. */
export async function getResolvedSiteConfig() {
  const settings = await getSiteSettings();
  return {
    ...siteConfig,
    name: settings.site_name || siteConfig.name,
    title: settings.site_title || siteConfig.title,
    description: settings.site_description || siteConfig.description,
    author: {
      ...siteConfig.author,
      name: settings.default_author || siteConfig.author.name,
    },
    social: settings.social,
    ads: {
      enabled: settings.ads_enabled,
      clientId:
        settings.google_ads_client ||
        process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT ||
        "",
    },
  };
}
