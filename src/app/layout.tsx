import type { Metadata } from "next";
import { headers } from "next/headers";
import { Plus_Jakarta_Sans } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Footer } from "@/components/Footer";
import { GoogleAdsLoader } from "@/components/GoogleAdsLoader";
import { Header } from "@/components/Header";
import { ThemeScript } from "@/components/ThemeScript";
import { buildPageMetadata, getSeoSite } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans-face",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSeoSite();
  return {
    metadataBase: new URL(site.url),
    ...buildPageMetadata({
      site,
      title: site.title,
      description: site.description,
      path: "/",
      keywords: [
        "blog",
        "TeleBotHost",
        "technology",
        "travel",
        "lifestyle",
        "food",
        "work",
        "telegram bots",
      ],
    }),
    title: {
      default: site.title,
      template: `%s · ${site.name}`,
    },
    authors: [{ name: site.authorName, url: site.url }],
    creator: site.authorName,
    publisher: site.name,
    icons: {
      icon: "/brand/tbh.svg",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = (await headers()).get("x-pathname") || "";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${jakarta.variable} h-full`}
      suppressHydrationWarning
    >
      <body className={`site-shell antialiased${isAdmin ? " site-shell--admin" : ""}`}>
        <ThemeScript />
        {!isAdmin ? <GoogleAdsLoader /> : null}
        {isAdmin ? null : <Header />}
        <main className={isAdmin ? "admin-main" : "site-main"}>{children}</main>
        {isAdmin ? null : <Footer />}
        <GoogleAnalytics gaId="G-SH5JLTBH63" />
      </body>
    </html>
  );
}
