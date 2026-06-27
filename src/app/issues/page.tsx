import { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Footer, Header, IssueCard, JsonLd, SubscribeForm } from "@/components";
import { getAllIssues } from "@/lib/beehiiv/posts";
import type { Issue } from "@/lib/beehiiv/types";
import { SITE_CONFIG } from "@/lib/seo/constants";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import {
  ISSUE_CITIES,
  ISSUE_TOPICS,
  cleanIssueTitle,
  findCityBySlug,
  findTopicBySlug,
  issueMatchesCity,
  issueMatchesTopic,
} from "@/lib/seo/issues";
import { generateItemListSchema } from "@/lib/seo/schemas";

export const metadata: Metadata = buildPageMetadata({
  title: "Spalding County News Archive",
  description:
    "Browse all Spalding County news issues. Read past coverage of Griffin, Orchard Hill, Sunny Side local news, events, and community stories.",
  path: "/issues",
});

interface IssuesPageProps {
  searchParams: Promise<{
    topic?: string;
    city?: string;
  }>;
}

function filterHref(params: { topic?: string; city?: string }) {
  const query = new URLSearchParams();

  if (params.topic) {
    query.set("topic", params.topic);
  }

  if (params.city) {
    query.set("city", params.city);
  }

  const queryString = query.toString();
  return queryString ? `/issues?${queryString}` : "/issues";
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
        active
          ? "bg-ink text-white"
          : "border border-[rgb(29_36_64_/_0.12)] bg-white/78 text-ink hover:bg-white"
      }`}
    >
      {children}
    </Link>
  );
}

export default async function IssuesPage({ searchParams }: IssuesPageProps) {
  const { topic: topicSlug, city: citySlug } = await searchParams;
  const selectedTopic = findTopicBySlug(topicSlug);
  const selectedCity = findCityBySlug(citySlug);
  let issues: Issue[] = [];

  try {
    issues = await getAllIssues();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Failed to fetch issues:", error);
    }
  }

  const filteredIssues = issues.filter((issue) =>
    issueMatchesTopic(issue, selectedTopic?.slug) &&
    issueMatchesCity(issue, selectedCity?.slug)
  );
  const itemListSchema = generateItemListSchema(
    filteredIssues.map((issue) => ({
      name: cleanIssueTitle(issue.title),
      url: `${SITE_CONFIG.url}/issues/${issue.slug}`,
      datePublished: issue.publishDate,
    })),
    selectedTopic || selectedCity
      ? `${selectedTopic?.label || selectedCity?.label} news from ${SITE_CONFIG.name}`
      : `${SITE_CONFIG.location.county} news archive from ${SITE_CONFIG.name}`
  );

  return (
    <div className="page-shell min-h-screen">
      <JsonLd data={itemListSchema} />
      <Header />

      <main>
        <section className="section-rule py-14 sm:py-18">
          <div className="page-frame pt-14">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.42fr)] lg:items-end">
              <div className="max-w-3xl">
                <p className="eyebrow mb-5">Archive</p>
                <h1 className="headline-balance text-5xl font-semibold text-ink sm:text-6xl">
                  Every issue, collected like a proper local edition.
                </h1>
                <p className="copy-balance mt-5 text-lg text-slate sm:text-xl">
                  Browse past coverage of Spalding County&apos;s civic updates, neighborhood openings, events, schools, and community stories.
                </p>
              </div>

              <div className="surface-panel rounded-[2rem] p-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-ink-soft">
                  What you&apos;ll find
                </p>
                <div className="space-y-3 text-sm leading-7 text-slate">
                  <p>County and city decisions that affect daily life</p>
                  <p>Openings, events, and business activity around the county</p>
                  <p>School, public safety, and neighborhood stories worth keeping up with</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="page-frame">
            <div className="surface-panel rounded-[2rem] p-6 sm:p-8">
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <h2 className="mb-3 font-serif text-2xl font-semibold text-ink">
                    Browse by topic
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <FilterLink href={filterHref({ city: selectedCity?.slug })} active={!selectedTopic}>
                      All topics
                    </FilterLink>
                    {ISSUE_TOPICS.map((topic) => (
                      <FilterLink
                        key={topic.slug}
                        href={filterHref({ topic: topic.slug, city: selectedCity?.slug })}
                        active={selectedTopic?.slug === topic.slug}
                      >
                        {topic.label}
                      </FilterLink>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="mb-3 font-serif text-2xl font-semibold text-ink">
                    Browse by city
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <FilterLink href={filterHref({ topic: selectedTopic?.slug })} active={!selectedCity}>
                      All Spalding County
                    </FilterLink>
                    {ISSUE_CITIES.map((city) => (
                      <FilterLink
                        key={city.slug}
                        href={filterHref({ topic: selectedTopic?.slug, city: city.slug })}
                        active={selectedCity?.slug === city.slug}
                      >
                        {city.label}
                      </FilterLink>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 pb-16 sm:pb-20">
          <div className="page-frame">
            {filteredIssues.length > 0 ? (
              <div className="space-y-6">
                {filteredIssues[0] && <IssueCard issue={filteredIssues[0]} featured />}
                {filteredIssues.length > 1 && (
                  <div className="news-grid news-grid-3">
                    {filteredIssues.slice(1).map((issue) => (
                      <IssueCard key={issue.id} issue={issue} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="surface-panel rounded-[2.25rem] p-8 text-center sm:p-12">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[rgb(177_142_87_/_0.12)] text-accent">
                  <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.7}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
                <p className="eyebrow mb-4 justify-center">No matching issues</p>
                <h2 className="headline-balance text-3xl font-semibold text-ink sm:text-4xl">
                  Try another topic or city, or subscribe for the next local read.
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-slate">
                  New coverage is added weekly as issues publish.
                </p>
                <SubscribeForm variant="inline" className="mx-auto mt-8 max-w-xl" />
              </div>
            )}
          </div>
        </section>

        <section className="pb-16 sm:pb-20">
          <div className="page-frame">
            <div className="surface-tint rounded-[2rem] p-8 sm:p-10 lg:flex lg:items-end lg:justify-between lg:gap-10">
              <div className="max-w-2xl">
                <p className="eyebrow mb-4">Inbox edition</p>
                <h2 className="headline-balance text-4xl font-semibold text-ink">
                  Never miss the next local read.
                </h2>
                <p className="mt-4 text-slate">
                  Get the {SITE_CONFIG.name} delivered weekly, with the newest issue arriving before you have to go looking for it.
                </p>
              </div>
              <div className="mt-6 w-full max-w-xl lg:mt-0">
                <SubscribeForm variant="hero" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
