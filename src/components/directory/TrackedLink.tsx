"use client";

import { useEffect, type AnchorHTMLAttributes } from "react";

type Action = "view" | "call" | "website" | "directions";

/** Sends one activity count to the guide. Works while the page is unloading. */
export function track(business: string, action: Action) {
  try {
    const body = JSON.stringify({ business, action });
    if (navigator.sendBeacon?.(`/api/directory/track`, new Blob([body], { type: "application/json" }))) return;
    void fetch("/api/directory/track", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } });
  } catch {
    // Stats are best effort.
  }
}

interface TrackedLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Business slug the click belongs to. */
  business: string;
  action: "call" | "website" | "directions";
}

/**
 * An outbound link that counts calls, website visits and direction requests,
 * so featured members get a monthly report of what their listing sent them.
 */
export function TrackedLink({ business, action, onClick, ...props }: TrackedLinkProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        track(business, action);
        onClick?.(event);
      }}
    />
  );
}

/** Counts one profile view when a business page opens. Renders nothing. */
export function TrackView({ business }: { business: string }) {
  useEffect(() => {
    track(business, "view");
  }, [business]);
  return null;
}
