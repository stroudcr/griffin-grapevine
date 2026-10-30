import { NextResponse } from "next/server";
import { hasDatabase } from "@/lib/guide/env";
import { ACTIVITY_ACTIONS, recordActivity, type ActivityAction } from "@/lib/guide/listings";

export const dynamic = "force-dynamic";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Counts a profile view, call, website click or directions request, sent by
 * the browser with navigator.sendBeacon. Best effort: it never fails loudly.
 */
export async function POST(request: Request) {
  const data = (await request.json().catch(() => null)) as { business?: unknown; action?: unknown } | null;
  const business = typeof data?.business === "string" ? data.business : "";
  const action = typeof data?.action === "string" ? data.action : "";
  if (!SLUG.test(business) || business.length > 80 || !ACTIVITY_ACTIONS.includes(action as ActivityAction)) {
    return new NextResponse(null, { status: 204 });
  }
  if (hasDatabase()) {
    try {
      await recordActivity(business, action as ActivityAction);
    } catch (error) {
      console.error("[guide activity] Could not record:", error);
    }
  }
  return new NextResponse(null, { status: 204 });
}
