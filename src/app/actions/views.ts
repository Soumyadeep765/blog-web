"use server";

import { createHash } from "crypto";
import { headers } from "next/headers";
import { trackPostView } from "@/lib/posts";

export async function recordPostView(slug: string) {
  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    "unknown";
  const ua = headerStore.get("user-agent") || "unknown";
  const viewerHash = createHash("sha256").update(`${ip}:${ua}:${slug}`).digest("hex");

  await trackPostView(slug, viewerHash);
}
