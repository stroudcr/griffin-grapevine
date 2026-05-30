import type { Issue } from "@/lib/beehiiv/types";

export interface IssueTopic {
  slug: string;
  label: string;
  keywords: string[];
}

export interface IssueCity {
  slug: string;
  label: string;
  keywords: string[];
}

export const ISSUE_TOPICS: IssueTopic[] = [
  {
    slug: "local-government",
    label: "Local Government",
    keywords: [
      "commission",
      "council",
      "hearing",
      "zoning",
      "tax",
      "election",
      "poll",
      "ordinance",
      "board",
      "data center",
      "development authority",
    ],
  },
  {
    slug: "events",
    label: "Events",
    keywords: [
      "event",
      "events",
      "festival",
      "concert",
      "ceremony",
      "weekend",
      "market",
      "parade",
      "happenin",
      "calendar",
    ],
  },
  {
    slug: "public-safety",
    label: "Public Safety",
    keywords: [
      "fire",
      "firefighter",
      "police",
      "sheriff",
      "crime",
      "emergency",
      "safety",
      "traffic",
      "road",
    ],
  },
  {
    slug: "schools",
    label: "Schools",
    keywords: [
      "school",
      "schools",
      "student",
      "students",
      "graduation",
      "class of",
      "uga",
      "college",
      "teacher",
      "campus",
    ],
  },
  {
    slug: "business",
    label: "Business",
    keywords: [
      "business",
      "opening",
      "restaurant",
      "store",
      "job fair",
      "jobs",
      "retail",
      "entrepreneur",
    ],
  },
  {
    slug: "weather",
    label: "Weather",
    keywords: [
      "weather",
      "rain",
      "storm",
      "freeze",
      "chill",
      "summer",
      "spring",
      "forecast",
    ],
  },
  {
    slug: "community",
    label: "Community",
    keywords: [],
  },
];

export const ISSUE_CITIES: IssueCity[] = [
  {
    slug: "griffin",
    label: "Griffin",
    keywords: ["griffin"],
  },
  {
    slug: "orchard-hill",
    label: "Orchard Hill",
    keywords: ["orchard hill"],
  },
  {
    slug: "sunny-side",
    label: "Sunny Side",
    keywords: ["sunny side"],
  },
];

export function normalizeText(value: string | undefined | null): string {
  return (value || "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

export function stripHtml(value: string | undefined | null): string {
  return normalizeText((value || "").replace(/<[^>]+>/g, " "));
}

export function cleanIssueTitle(title: string): string {
  return normalizeText(
    title
      .replace(/^[\s\p{Extended_Pictographic}\p{Emoji_Presentation}\uFE0F]+/gu, "")
      .replace(/^grapevine:\s*/i, "")
  );
}

export function getIssueDisplayTitle(issue: Issue): string {
  return cleanIssueTitle(issue.metaTitle || issue.title);
}

export function getIssuePlainText(issue: Issue): string {
  return stripHtml([issue.title, issue.subtitle, issue.excerpt, issue.content].join(" "));
}

function stripNewsletterSuffix(value: string): string {
  return normalizeText(
    value
      .replace(/\bLocal Spalding County News\.?/gi, "")
      .replace(/\bSpalding County local news from Griffin, Orchard Hill, Sunny Side & more\.?/gi, "")
      .replace(/\s+\|\s*$/, "")
  );
}

export function getIssueStoryDeck(issue: Issue): string {
  return stripNewsletterSuffix(
    normalizeText(issue.metaDescription || issue.subtitle || issue.excerpt || "")
  );
}

function truncateAtWord(value: string, maxLength: number): string {
  const clean = normalizeText(value);

  if (clean.length <= maxLength) {
    return clean;
  }

  const truncated = clean.slice(0, maxLength - 1);
  const lastSpace = truncated.lastIndexOf(" ");

  return `${truncated.slice(0, lastSpace > 40 ? lastSpace : truncated.length).trim()}...`;
}

function getStoryParts(issue: Issue): string[] {
  const deck = getIssueStoryDeck(issue);

  return deck
    .replace(/\.$/, "")
    .split(/\s*,\s*|\s+and\s+/i)
    .map((part) => normalizeText(part))
    .filter((part) => part.length > 6)
    .slice(0, 3);
}

export function getIssueSeoTitle(issue: Issue): string {
  const storyParts = getStoryParts(issue);
  const base =
    storyParts.length >= 2
      ? `${storyParts[0]}, ${storyParts[1]}`
      : getIssueDisplayTitle(issue);

  return `${truncateAtWord(base, 42)} | Griffin Grapevine`;
}

export function getIssueSeoDescription(issue: Issue): string {
  const deck = getIssueStoryDeck(issue);
  const base = deck
    ? `${deck}. Spalding County news for Griffin, Orchard Hill, and Sunny Side.`
    : `${getIssueDisplayTitle(issue)} from Griffin Grapevine, covering Spalding County news for Griffin, Orchard Hill, and Sunny Side.`;

  return truncateAtWord(base.replace(/\.\./g, "."), 158);
}

export function getIssueSummary(issue: Issue, maxLength = 170): string {
  const deck = getIssueStoryDeck(issue) || stripHtml(issue.content).slice(0, maxLength);
  return truncateAtWord(deck, maxLength);
}

export function getIssueTopics(issue: Issue): IssueTopic[] {
  const text = getIssuePlainText(issue).toLowerCase();
  const matches = ISSUE_TOPICS.filter((topic) =>
    topic.keywords.some((keyword) => text.includes(keyword))
  );

  if (matches.length === 0) {
    return [ISSUE_TOPICS.find((topic) => topic.slug === "community")!];
  }

  return matches.slice(0, 3);
}

export function getIssueCities(issue: Issue): IssueCity[] {
  const text = getIssuePlainText(issue).toLowerCase();
  return ISSUE_CITIES.filter((city) =>
    city.keywords.some((keyword) => text.includes(keyword))
  );
}

export function getIssueTags(issue: Issue): { slug: string; label: string; type: "topic" | "city" }[] {
  const topics = getIssueTopics(issue).slice(0, 2).map((topic) => ({
    slug: topic.slug,
    label: topic.label,
    type: "topic" as const,
  }));
  const cities = getIssueCities(issue).slice(0, 1).map((city) => ({
    slug: city.slug,
    label: city.label,
    type: "city" as const,
  }));

  return [...topics, ...cities];
}

export function findTopicBySlug(slug: string | undefined): IssueTopic | undefined {
  return ISSUE_TOPICS.find((topic) => topic.slug === slug);
}

export function findCityBySlug(slug: string | undefined): IssueCity | undefined {
  return ISSUE_CITIES.find((city) => city.slug === slug);
}

export function issueMatchesTopic(issue: Issue, topicSlug: string | undefined): boolean {
  if (!topicSlug) {
    return true;
  }

  return getIssueTopics(issue).some((topic) => topic.slug === topicSlug);
}

export function issueMatchesCity(issue: Issue, citySlug: string | undefined): boolean {
  if (!citySlug) {
    return true;
  }

  return getIssueCities(issue).some((city) => city.slug === citySlug);
}

export function getRelatedIssues(currentIssue: Issue, issues: Issue[], max = 3): Issue[] {
  const currentTopics = new Set(getIssueTopics(currentIssue).map((topic) => topic.slug));
  const currentCities = new Set(getIssueCities(currentIssue).map((city) => city.slug));

  return issues
    .filter((issue) => issue.slug !== currentIssue.slug)
    .map((issue) => {
      const topicScore = getIssueTopics(issue).filter((topic) =>
        currentTopics.has(topic.slug)
      ).length;
      const cityScore = getIssueCities(issue).filter((city) =>
        currentCities.has(city.slug)
      ).length;

      return {
        issue,
        score: topicScore * 2 + cityScore,
      };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return b.issue.publishDate.getTime() - a.issue.publishDate.getTime();
    })
    .slice(0, max)
    .map(({ issue }) => issue);
}
