import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Header, Footer, SubscribeForm, JsonLd } from "@/components";
import { getAdjacentIssues, getAllIssues, transformPost } from "@/lib/beehiiv/posts";
import { getAllPosts, getPostById } from "@/lib/beehiiv/client";
import { generateNewsArticleSchema, generateBreadcrumbSchema } from "@/lib/seo/schemas";
import { SITE_CONFIG } from "@/lib/seo/constants";
import { sanitizeBeehiivContent } from "@/lib/sanitization";

// Route Segment Config
// Enable dynamic params to allow new newsletter slugs not pre-generated at build time
export const dynamicParams = true;

// Revalidate every 5 minutes to match Beehiiv API cache timing
// This ensures pages stay fresh while maintaining good performance
export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // Get post from cached list - no need to fetch full content for metadata
  const allPosts = await getAllPosts();
  const post = allPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Issue Not Found",
    };
  }

  // Transform to Issue format for metadata
  const issue = transformPost(post);

  const description = issue.excerpt
    ? `${issue.excerpt.slice(0, 150)}... | Spalding County local news from Griffin, Orchard Hill, Sunny Side & more.`
    : `Read ${issue.title} - Spalding County GA local news and community updates.`;

  const articleUrl = `${SITE_CONFIG.url}/issues/${slug}`;

  return {
    title: issue.title,
    description,
    authors: issue.authors?.map((a) => ({ name: a.name })) || [{ name: "Griffin Grapevine" }],
    openGraph: {
      title: `${issue.title} | Griffin Grapevine`,
      description,
      type: "article",
      publishedTime: issue.publishDate.toISOString(),
      authors: issue.authors?.map((a) => a.name).filter((name): name is string => Boolean(name)) || ["Griffin Grapevine"],
      section: "Local News",
      tags: ["Spalding County", "Georgia", "local news", "Griffin", "Orchard Hill", "Sunny Side"],
      images: issue.thumbnailUrl
        ? [{ url: issue.thumbnailUrl, width: 1200, height: 630 }]
        : [{ url: `${SITE_CONFIG.url}/og-default.svg`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: issue.title,
      description,
      images: [issue.thumbnailUrl || `${SITE_CONFIG.url}/og-default.svg`],
    },
    alternates: {
      canonical: articleUrl,
    },
  };
}

export async function generateStaticParams() {
  try {
    const issues = await getAllIssues();
    return issues.map((issue) => ({
      slug: issue.slug,
    }));
  } catch {
    return [];
  }
}

export default async function IssuePage({ params }: Props) {
  const { slug } = await params;

  // First, get the post ID from all posts (cached with 5min revalidation)
  const allPosts = await getAllPosts();
  const post = allPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Fetch the full post content by ID (fast, direct API call)
  const [fullPost, adjacent] = await Promise.all([
    getPostById(post.id),
    getAdjacentIssues(slug),
  ]);

  const issue = transformPost(fullPost);

  // Sanitize HTML content from Beehiiv API to prevent XSS attacks
  // Defense-in-depth: Even though Beehiiv strips scripts, we apply our own sanitization
  const sanitizedContent = issue.content
    ? sanitizeBeehiivContent(issue.content)
    : "";

  // Generate structured data schemas
  const newsArticleSchema = generateNewsArticleSchema(issue, slug);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Issues", url: `${SITE_CONFIG.url}/issues` },
    { name: issue.title, url: `${SITE_CONFIG.url}/issues/${slug}` },
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd data={newsArticleSchema} />
      <JsonLd data={breadcrumbSchema} />

      <Header />

      <main className="flex-1">
        {/* Breadcrumb navigation */}
        <section className="bg-white border-b border-gray-200 py-6">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm">
                <li>
                  <Link href="/" className="text-slate hover:text-navy">
                    Home
                  </Link>
                </li>
                <li className="text-slate">/</li>
                <li>
                  <Link href="/issues" className="text-slate hover:text-navy">
                    Issues
                  </Link>
                </li>
                <li className="text-slate">/</li>
                <li className="text-navy font-medium truncate max-w-[200px]">
                  {issue.title}
                </li>
              </ol>
            </nav>
          </div>
        </section>

        {/* Issue Content */}
        <article className="newsletter-content">
          {sanitizedContent ? (
            <div
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          ) : (
            <div className="py-12 bg-paper text-center">
              <p className="text-slate">
                Content is not available. Please check back later.
              </p>
            </div>
          )}
        </article>

        {/* Subscribe CTA (after first section) */}
        <section className="py-8 bg-white border-y border-gray-200">
          <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
            <SubscribeForm variant="card" />
          </div>
        </section>

        {/* Navigation between issues */}
        <section className="py-12 bg-paper">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              {adjacent.next ? (
                <Link
                  href={`/issues/${adjacent.next.slug}`}
                  className="card group flex-1"
                >
                  <div className="text-sm text-slate mb-1">← Previous Issue</div>
                  <div className="font-serif font-bold text-navy group-hover:text-navy-dark transition-colors">
                    {adjacent.next.title}
                  </div>
                </Link>
              ) : (
                <div className="flex-1" />
              )}

              {adjacent.prev ? (
                <Link
                  href={`/issues/${adjacent.prev.slug}`}
                  className="card group flex-1 text-right"
                >
                  <div className="text-sm text-slate mb-1">Next Issue →</div>
                  <div className="font-serif font-bold text-navy group-hover:text-navy-dark transition-colors">
                    {adjacent.prev.title}
                  </div>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
