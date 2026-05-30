import { MetadataRoute } from "next";
import { getAllIssues } from "@/lib/beehiiv/posts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.griffingrapevine.com";
const STATIC_LAST_MODIFIED = new Date("2026-05-29T00:00:00.000Z");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/issues`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/griffin-ga-news`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/spalding-county-events`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/local-government`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/advertise`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamic issue pages
  let issuePages: MetadataRoute.Sitemap = [];

  try {
    const issues = await getAllIssues();
    issuePages = issues.map((issue) => ({
      url: `${SITE_URL}/issues/${issue.slug}`,
      lastModified: issue.publishDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Failed to fetch issues for sitemap:", error);
    }
  }

  return [...staticPages, ...issuePages];
}
