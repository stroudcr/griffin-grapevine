import { NextRequest, NextResponse } from "next/server";
import { createSubscription } from "@/lib/beehiiv/client";

// Simple email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
    } = body;

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Create subscription in Beehiiv
    const result = await createSubscription({
      email: email.toLowerCase().trim(),
      reactivate_existing: true,
      send_welcome_email: true,
      utm_source: optionalString(utm_source) || "website",
      utm_medium: optionalString(utm_medium) || "subscribe_form",
      utm_campaign: optionalString(utm_campaign),
      utm_content: optionalString(utm_content),
      utm_term: optionalString(utm_term),
      referring_site: process.env.NEXT_PUBLIC_SITE_URL || "https://www.griffingrapevine.com",
    });

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed!",
      data: {
        id: result.data.id,
        status: result.data.status,
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Subscription error:", error);
    }

    // Handle specific Beehiiv errors
    if (error instanceof Error) {
      if (error.message.includes("already exists")) {
        return NextResponse.json({
          success: true,
          message: "You're already subscribed!",
        });
      }
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
