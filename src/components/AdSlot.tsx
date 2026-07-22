"use client";

import { useEffect } from "react";
import type { AdSlotName } from "@/lib/ads";

type AdSlotProps = {
  slot: AdSlotName;
  clientId?: string;
  slotId?: string;
  className?: string;
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdSlot({
  slot,
  clientId: clientIdProp,
  slotId,
  className,
}: AdSlotProps) {
  const clientId =
    clientIdProp || process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT || "";

  useEffect(() => {
    if (!clientId) return;
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // Ad blockers may throw; ignore.
    }
  }, [slot, clientId, slotId]);

  return (
    <aside
      className={`ad-slot ad-slot--${slot}${className ? ` ${className}` : ""}`}
      aria-label="Advertisement"
      data-ad-slot={slot}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId || undefined}
        data-ad-slot={slotId || undefined}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
