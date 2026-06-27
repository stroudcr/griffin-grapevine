import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header, Footer, SubscribeForm, JsonLd, IssueCard } from "@/components";
import { transformPost } from "@/lib/beehiiv/posts";
import { getAllPosts, getPostById } from "@/lib/beehiiv/client";
import { generateNewsArticleSchema, generateBreadcrumbSchema } from "@/lib/seo/schemas";
import { SITE_CONFIG } from "@/lib/seo/constants";
import {
  getIssueDisplayTitle,
  getIssueSeoDescription,
  getIssueSeoTitle,
  getIssueStoryDeck,
  getIssueTags,
  getRelatedIssues,
} from "@/lib/seo/issues";
import { sanitizeBeehiivContent } from "@/lib/sanitization";

export const dynamicParams = true;
export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  let allPosts: Awaited<ReturnType<typeof getAllPosts>> = [];
  try {
    allPosts = await getAllPosts({ expand: [] });
  } catch {
    return {
      title: "Issue",
      alternates: {
        canonical: `${SITE_CONFIG.url}/issues/${slug}`,
      },
    };
  }

  const post = allPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Issue Not Found",
    };
  }

  const issue = transformPost(post);
  const description = getIssueSeoDescription(issue);
  const articleUrl = `${SITE_CONFIG.url}/issues/${slug}`;
  const seoTitle = getIssueSeoTitle(issue);
  const displayTitle = getIssueDisplayTitle(issue);

  return {
    title: {
      absolute: seoTitle,
    },
    description,
    authors: issue.authors?.map((a) => ({ name: a.name })) || [{ name: SITE_CONFIG.name }],
    openGraph: {
      title: seoTitle,
      description,
      type: "article",
      publishedTime: issue.publishDate.toISOString(),
      authors: issue.authors?.map((a) => a.name).filter((name): name is string => Boolean(name)) || [SITE_CONFIG.name],
      section: "Local News",
      tags: [
        SITE_CONFIG.location.county,
        SITE_CONFIG.location.state,
        "local news",
        ...SITE_CONFIG.cities,
      ],
      images: issue.thumbnailUrl
        ? [{ url: issue.thumbnailUrl, width: 1200, height: 630, alt: displayTitle }]
        : [{ url: SITE_CONFIG.defaultOgImage, width: 1200, height: 630, alt: displayTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: displayTitle,
      description,
      images: [issue.thumbnailUrl || SITE_CONFIG.defaultOgImage],
    },
    alternates: {
      canonical: articleUrl,
    },
  };
}

export async function generateStaticParams() {
  try {
    const posts = await getAllPosts({ expand: [] });
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch {
    return [];
  }
}

export default async function IssuePage({ params }: Props) {
  const { slug } = await params;

  const allPosts = await getAllPosts({ expand: [] });
  const post = allPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  let fullPost = post;
  try {
    fullPost = await getPostById(post.id);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(`Failed to fetch Beehiiv post content for ${slug}:`, error);
    }
  }

  const issue = transformPost(fullPost);
  const allIssues = allPosts.map(transformPost);
  const currentIndex = allIssues.findIndex((item) => item.slug === slug);
  const adjacent = {
    prev: currentIndex > 0 ? allIssues[currentIndex - 1] : null,
    next: currentIndex >= 0 && currentIndex < allIssues.length - 1
      ? allIssues[currentIndex + 1]
      : null,
  };
  const relatedIssues = getRelatedIssues(issue, allIssues);
  const displayTitle = getIssueDisplayTitle(issue);
  const storyDeck = getIssueStoryDeck(issue);
  const issueTags = getIssueTags(issue);
  const articleUrl = `${SITE_CONFIG.url}/issues/${slug}`;

  const sanitizedContent = issue.content
    ? sanitizeBeehiivContent(issue.content, {
        defaultImageAlt: displayTitle,
        stripFirstHeading: true,
      })
    : "";

  const newsArticleSchema = generateNewsArticleSchema(issue, slug);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Issues", url: `${SITE_CONFIG.url}/issues` },
    { name: displayTitle, url: articleUrl },
  ]);

  const formattedDate = issue.publishDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="page-shell min-h-screen">
      <JsonLd data={newsArticleSchema} />
      <JsonLd data={breadcrumbSchema} />

      <Header />

      <main>
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0">
            {issue.thumbnailUrl ? (
              <>
                <Image
                  src={issue.thumbnailUrl}
                  alt={displayTitle}
                  fill
                  priority
                  loading="eager"
                  quality={75}
                  sizes="100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,24,38,0.3)_0%,rgba(20,24,38,0.8)_100%)]" />
              </>
            ) : (
              <div className="h-full w-full bg-[radial-gradient(circle_at_top_left,_rgba(177,142,87,0.24),_transparent_30%),linear-gradient(180deg,_#222a47_0%,_#171d31_100%)]" />
            )}
          </div>

          <div className="page-frame relative py-14 sm:py-18 lg:py-24">
            <nav aria-label="Breadcrumb" className="mb-10 text-sm text-white/72">
              <ol className="flex flex-wrap items-center gap-3">
                <li>
                  <Link href="/" className="hover:text-white">Home</Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/issues" className="hover:text-white">Issues</Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="max-w-[18rem] truncate text-white">{displayTitle}</li>
              </ol>
            </nav>

            <div className="max-w-4xl">
              <p className="mb-4 inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white/78">
                <span className="h-2 w-2 rounded-full bg-accent" />
                Spalding County Local News
              </p>
              <h1 className="headline-balance text-4xl font-semibold leading-[0.94] text-white sm:text-6xl">
                {displayTitle}
              </h1>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/72">
                <time dateTime={issue.publishDate.toISOString()}>{formattedDate}</time>
                {issue.authors?.[0]?.name && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-white/30" />
                    <span>By {issue.authors[0].name}</span>
                  </>
                )}
              </div>
              {storyDeck && (
                <p className="copy-balance mt-6 max-w-3xl text-lg leading-8 text-white/78 sm:text-xl">
                  {storyDeck}
                </p>
              )}
              {issueTags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {issueTags.map((tag) => (
                    <Link
                      key={`${tag.type}-${tag.slug}`}
                      href={tag.type === "topic" ? `/issues?topic=${tag.slug}` : `/issues?city=${tag.slug}`}
                      className="issue-hero-tag"
                    >
                      {tag.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="section-rule py-10 sm:py-12">
          <div className="page-frame pt-10">
            <article className="surface-panel rounded-[2.25rem] px-5 py-6 sm:px-8 sm:py-8 lg:px-12">
              {sanitizedContent ? (
                <div className="newsletter-content p-0">
                  <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
                </div>
              ) : (
                <div className="py-16 text-center">
                  <p className="eyebrow mb-4 justify-center">Content unavailable</p>
                  <p className="mx-auto max-w-2xl text-slate">
                    This issue&apos;s article body is not available right now. Please check back shortly.
                  </p>
                </div>
              )}
            </article>
          </div>
        </section>

        {relatedIssues.length > 0 && (
          <section className="py-6 sm:py-8">
            <div className="page-frame">
              <div className="mb-6 max-w-2xl">
                <p className="eyebrow mb-4">Related local coverage</p>
                <h2 className="headline-balance text-3xl font-semibold text-ink sm:text-4xl">
                  Keep reading around this beat.
                </h2>
              </div>
              <div className="news-grid news-grid-3">
                {relatedIssues.map((relatedIssue) => (
                  <IssueCard key={relatedIssue.id} issue={relatedIssue} />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-6 sm:py-8">
          <div className="page-frame">
            <div className="surface-tint rounded-[2rem] p-7 sm:p-9 lg:flex lg:items-end lg:justify-between lg:gap-10">
              <div className="max-w-2xl">
                <p className="eyebrow mb-4">Inbox edition</p>
                <h2 className="headline-balance text-3xl font-semibold text-ink sm:text-4xl">
                  Read the next issue before it reaches the archive.
                </h2>
                <p className="mt-4 text-slate">
                  Subscribe for the weekly edition and follow along as new reporting lands.
                </p>
              </div>
              <div className="mt-6 w-full max-w-xl lg:mt-0">
                <SubscribeForm variant="hero" />
              </div>
            </div>
          </div>
        </section>

        <section className="pb-16 pt-8 sm:pb-20">
          <div className="page-frame">
            <div className="grid gap-4 md:grid-cols-2">
              {adjacent.next ? (
                <Link
                  href={`/issues/${adjacent.next.slug}`}
                  className="hover-lift rounded-[1.75rem] border border-[rgb(29_36_64_/_0.12)] bg-white/78 p-6"
                >
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-ink-soft">
                    Previous issue
                  </p>
                  <h3 className="headline-balance text-2xl font-semibold text-ink">
                    {getIssueDisplayTitle(adjacent.next)}
                  </h3>
                </Link>
              ) : (
                <div />
              )}

              {adjacent.prev ? (
                <Link
                  href={`/issues/${adjacent.prev.slug}`}
                  className="hover-lift rounded-[1.75rem] border border-[rgb(29_36_64_/_0.12)] bg-white/78 p-6 md:text-right"
                >
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-ink-soft">
                    Next issue
                  </p>
                  <h3 className="headline-balance text-2xl font-semibold text-ink">
                    {getIssueDisplayTitle(adjacent.prev)}
                  </h3>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
