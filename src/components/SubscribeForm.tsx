"use client";

import { FormEvent, useState } from "react";
import { SITE_CONFIG } from "@/lib/seo/constants";

interface SubscribeFormProps {
  variant?: "hero" | "inline" | "card";
  className?: string;
}

declare global {
  interface Window {
    fbq?: (
      method: "track",
      eventName: "Lead",
      parameters?: Record<string, string>
    ) => void;
  }
}

const UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

function getAttributionParams(variant: SubscribeFormProps["variant"]) {
  const attribution: Record<string, string> = {};

  if (typeof window !== "undefined") {
    const searchParams = new URLSearchParams(window.location.search);

    for (const param of UTM_PARAMS) {
      const value = searchParams.get(param);

      if (value) {
        attribution[param] = value;
      }
    }
  }

  return {
    utm_source: "website",
    utm_medium: variant || "subscribe_form",
    ...attribution,
  };
}

function trackMetaLead() {
  if (typeof window === "undefined" || typeof window.fbq !== "function") {
    return;
  }

  window.fbq("track", "Lead", {
    content_name: SITE_CONFIG.newsletter.signupContentName,
  });
}

export function SubscribeForm({
  variant = "inline",
  className = "",
}: SubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!email) {
      setStatus("error");
      setMessage("Please enter your email address");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          ...getAttributionParams(variant),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setMessage(data.message || SITE_CONFIG.newsletter.successMessage);
      trackMetaLead();
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className={`surface-panel rounded-[2rem] p-6 text-center sm:p-8 ${className}`}>
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[rgb(177_142_87_/_0.12)] text-accent">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.7}
              d="M8.25 12.75l2.25 2.25 5.25-6.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="mb-2 font-serif text-2xl font-semibold text-ink">You&apos;re on the list.</p>
        <p className="mx-auto max-w-md text-slate">{message}</p>
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <form onSubmit={handleSubmit} className={className}>
        <div className="surface-panel rounded-[2rem] p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="input-field flex-1"
              disabled={status === "loading"}
            />
            <button type="submit" disabled={status === "loading"} className="btn-primary min-w-[11rem] disabled:opacity-60">
              {status === "loading" ? "Subscribing..." : "Subscribe Free"}
            </button>
          </div>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-ink-deep">{SITE_CONFIG.newsletter.deliveryPromise}</p>
            {status === "error" ? (
              <p className="text-sm text-red-700">{message}</p>
            ) : (
              <p className="text-sm font-medium text-slate-deep">{SITE_CONFIG.newsletter.heroAudience}</p>
            )}
          </div>
        </div>
      </form>
    );
  }

  if (variant === "card") {
    return (
      <div className={`surface-panel rounded-[2rem] p-6 sm:p-8 ${className}`}>
        <p className="eyebrow mb-4">Newsletter</p>
        <h3 className="headline-balance mb-2 font-serif text-3xl font-semibold text-ink">
          Stay ahead of the next local headline.
        </h3>
        <p className="mb-5 max-w-lg text-slate">
          Get the {SITE_CONFIG.name} in your inbox each week with community reporting, local events, and the stories neighbors actually talk about.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="input-field"
            disabled={status === "loading"}
          />
          <button type="submit" disabled={status === "loading"} className="btn-primary w-full disabled:opacity-60">
            {status === "loading" ? "Subscribing..." : "Subscribe Free"}
          </button>
          {status === "error" ? (
            <p className="text-sm text-red-700">{message}</p>
          ) : (
            <p className="status-note">Free to join. No paywall. No clutter.</p>
          )}
        </form>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-3 sm:flex-row ${className}`}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="input-field flex-1"
        disabled={status === "loading"}
      />
      <button type="submit" disabled={status === "loading"} className="btn-primary min-w-[10rem] disabled:opacity-60">
        {status === "loading" ? "Working..." : "Subscribe"}
      </button>
      {status === "error" && <p className="text-sm text-red-700 sm:basis-full">{message}</p>}
    </form>
  );
}
