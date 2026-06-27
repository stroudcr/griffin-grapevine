import "server-only";
import { getPosts, getAllPosts, getPostBySlug } from "./client";
import type { BeehiivPost, Issue } from "./types";

const MAX_EXCERPT_LENGTH = 200;

export function transformPost(post: BeehiivPost): Issue {
  const publishDate = post.publish_date
    ? new Date(post.publish_date * 1000)
    : new Date();
  const displayedDate = post.displayed_date
    ? new Date(post.displayed_date * 1000)
    : undefined;
  const content = choosePublicIssueContent(
    post.content?.free?.web,
    post.content?.free?.email,
    post.content?.free?.rss
  );

  const fallbackExcerpt = content ? excerptFromHtml(content) : "";
  const excerpt =
    cleanPlainText(post.meta_default_description) ||
    cleanPlainText(post.subtitle) ||
    fallbackExcerpt;

  return {
    id: post.id,
    title: post.title,
    subtitle: post.subtitle,
    slug: post.slug,
    publishDate,
    displayedDate,
    thumbnailUrl: post.thumbnail_url,
    excerpt,
    content,
    webUrl: post.web_url,
    metaTitle: cleanPlainText(post.meta_default_title),
    metaDescription: cleanPlainText(post.meta_default_description),
    contentTags: post.content_tags,
    authors: post.authors?.map((a) => ({
      name: a.name,
      avatar: a.profile_picture,
    })),
  };
}

function choosePublicIssueContent(
  webContent: string | undefined,
  emailContent: string | undefined,
  rssContent: string | undefined
): string | undefined {
  if (emailContent && hasSponsorAdContent(emailContent) && !hasSponsorAdContent(webContent)) {
    return emailContent;
  }

  return webContent || emailContent || rssContent;
}

function hasSponsorAdContent(content: string | undefined): boolean {
  return Boolean(
    content &&
      (/\/ad_network\//i.test(content) ||
        /_bhiiv=opp_/i.test(content) ||
        /In partnership with/i.test(content))
  );
}

export function cleanPlainText(value: string | undefined): string {
  if (!value) {
    return "";
  }

  return value.replace(/\s+/g, " ").trim();
}

function excerptFromHtml(html: string): string {
  const textContent = cleanPlainText(
    html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, "\"")
      .replace(/&#x27;|&#39;/gi, "'")
  );

  if (textContent.length <= MAX_EXCERPT_LENGTH) {
    return textContent;
  }

  return `${textContent.slice(0, MAX_EXCERPT_LENGTH).trimEnd()}...`;
}

export async function getLatestIssues(count: number = 6): Promise<Issue[]> {
  const response = await getPosts({ limit: count, expand: [] });
  return response.data.map(transformPost);
}

export async function getAllIssues(): Promise<Issue[]> {
  const posts = await getAllPosts({ expand: [] });
  return posts.map(transformPost);
}

export async function getIssueBySlug(slug: string): Promise<Issue | null> {
  const post = await getPostBySlug(slug);
  return post ? transformPost(post) : null;
}

export async function getAdjacentIssues(
  currentSlug: string
): Promise<{ prev: Issue | null; next: Issue | null }> {
  const allIssues = await getAllIssues();
  const currentIndex = allIssues.findIndex((issue) => issue.slug === currentSlug);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: currentIndex > 0 ? allIssues[currentIndex - 1] : null,
    next: currentIndex < allIssues.length - 1 ? allIssues[currentIndex + 1] : null,
  };
}
