import type { Issue } from "@/lib/beehiiv/types";

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
