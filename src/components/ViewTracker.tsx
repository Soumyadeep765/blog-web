"use client";

import { useEffect } from "react";
import { recordPostView } from "@/app/actions/views";

type ViewTrackerProps = {
  slug: string;
};

export function ViewTracker({ slug }: ViewTrackerProps) {
  useEffect(() => {
    const key = `tbh-viewed:${slug}`;
    if (sessionStorage.getItem(key)) {
      return;
    }
    sessionStorage.setItem(key, "1");
    void recordPostView(slug);
  }, [slug]);

  return null;
}
