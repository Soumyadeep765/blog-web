import Script from "next/script";
import { getAdsConfig } from "@/lib/ads";

export async function GoogleAdsLoader() {
  const ads = await getAdsConfig();

  if (!ads.enabled || !ads.clientId) {
    return null;
  }

  return (
    <Script
      id="google-adsense"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ads.clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
