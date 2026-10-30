import { MetadataRoute } from "next";
import { getAllIssues } from "@/lib/beehiiv/posts";
import {
  CATEGORIES,
  DIRECTORY_PATH,
  businessHref,
  categoryHref,
  isBusinessIndexable,
  isCategoryIndexable,
  lastUpdated,
} from "@/lib/directory";
import { getGuideBusinesses } from "@/lib/directory/data";

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
      url: `${SITE_URL}/spalding-county-events`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
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

  // Local Business Guide: the guide home, plus only the categories and
  // businesses that are indexable (empty categories and bare listings stay out).
  const guideBusinesses = await getGuideBusinesses();
  const guidePages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}${DIRECTORY_PATH}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...CATEGORIES.filter((c) => isCategoryIndexable(guideBusinesses, c.slug)).map((c) => {
      const updated = lastUpdated(guideBusinesses.filter((b) => b.category === c.slug));
      return {
        url: `${SITE_URL}${categoryHref(c.slug)}`,
        lastModified: updated ? new Date(`${updated}T12:00:00Z`) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      };
    }),
    ...guideBusinesses.filter(isBusinessIndexable).map((b) => ({
      url: `${SITE_URL}${businessHref(b)}`,
      lastModified: new Date(`${b.verifiedAt ?? b.addedAt}T12:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
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

  return [...staticPages, ...guidePages, ...issuePages];
}
