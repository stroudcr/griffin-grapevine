import "server-only";
import { getPosts, getAllPosts, getPostBySlug } from "./client";
import type { BeehiivPost, Issue } from "./types";

// Transform Beehiiv post to Issue format
export function transformPost(post: BeehiivPost): Issue {
  const publishDate = post.publish_date
    ? new Date(post.publish_date * 1000)
    : new Date();

  const preferredContent =
    post.content?.free?.web ||
    post.content?.free?.email ||
    post.content?.free?.rss ||
    "";

  // Extract excerpt from metadata, subtitle, or content.
  let excerpt = post.meta_default_description || post.subtitle || "";
  if (!excerpt && preferredContent) {
    // Strip HTML and take first 200 chars
    const textContent = preferredContent
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    excerpt = textContent.substring(0, 200) + (textContent.length > 200 ? "..." : "");
  }

  return {
    id: post.id,
    title: post.title,
    subtitle: post.subtitle,
    slug: post.slug,
    publishDate,
    thumbnailUrl: post.thumbnail_url,
    excerpt,
    content: preferredContent,
    webUrl: post.web_url,
    metaTitle: post.meta_default_title,
    metaDescription: post.meta_default_description,
    authors: post.authors?.map((a) => ({
      name: a.name,
      avatar: a.profile_picture,
    })),
  };
}

export async function getLatestIssues(count: number = 6): Promise<Issue[]> {
  const response = await getPosts({ limit: count });
  return response.data.map(transformPost);
}

export async function getAllIssues(): Promise<Issue[]> {
  const posts = await getAllPosts();
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
    // Previous = newer (lower index since sorted desc by date)
    prev: currentIndex > 0 ? allIssues[currentIndex - 1] : null,
    // Next = older (higher index)
    next: currentIndex < allIssues.length - 1 ? allIssues[currentIndex + 1] : null,
  };
}
