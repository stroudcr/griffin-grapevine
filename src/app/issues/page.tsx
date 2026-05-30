import { Metadata } from "next";
import Link from "next/link";
import { Header, Footer, IssueCard, SubscribeForm, JsonLd } from "@/components";
import { getAllIssues } from "@/lib/beehiiv/posts";
import type { Issue } from "@/lib/beehiiv/types";
import { SITE_CONFIG } from "@/lib/seo/constants";
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

export const metadata: Metadata = {
  title: "Spalding County News Archive",
  description:
    "Browse all Spalding County news issues. Read past coverage of Griffin, Orchard Hill, Sunny Side local news, events, and community stories.",
  alternates: {
    canonical: `${SITE_CONFIG.url}/issues`,
  },
};

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
      ? `${selectedTopic?.label || selectedCity?.label} news from Griffin Grapevine`
      : "Spalding County news archive from Griffin Grapevine"
  );

  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd data={itemListSchema} />
      <Header />

      <main className="flex-1 bg-paper">
        {/* Page Header */}
        <section className="bg-white border-b border-gray-200 py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-serif font-bold text-3xl sm:text-4xl text-navy mb-4">
              Spalding County News Archive
            </h1>
            <p className="text-slate text-lg max-w-2xl">
              Browse all past issues of the Griffin Grapevine. Catch up on local news,
              events, and stories from Spalding County.
            </p>
          </div>
        </section>

        {/* Issues Grid */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 space-y-5">
              <div>
                <h2 className="font-serif font-bold text-xl text-navy mb-3">
                  Browse by topic
                </h2>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={filterHref({ city: selectedCity?.slug })}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium ${!selectedTopic ? "bg-navy text-white" : "bg-white text-navy border border-gray-200"}`}
                  >
                    All topics
                  </Link>
                  {ISSUE_TOPICS.map((topic) => (
                    <Link
                      key={topic.slug}
                      href={filterHref({ topic: topic.slug, city: selectedCity?.slug })}
                      className={`rounded-full px-3 py-1.5 text-sm font-medium ${selectedTopic?.slug === topic.slug ? "bg-navy text-white" : "bg-white text-navy border border-gray-200"}`}
                    >
                      {topic.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-serif font-bold text-xl text-navy mb-3">
                  Browse by city
                </h2>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={filterHref({ topic: selectedTopic?.slug })}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium ${!selectedCity ? "bg-navy text-white" : "bg-white text-navy border border-gray-200"}`}
                  >
                    All Spalding County
                  </Link>
                  {ISSUE_CITIES.map((city) => (
                    <Link
                      key={city.slug}
                      href={filterHref({ topic: selectedTopic?.slug, city: city.slug })}
                      className={`rounded-full px-3 py-1.5 text-sm font-medium ${selectedCity?.slug === city.slug ? "bg-navy text-white" : "bg-white text-navy border border-gray-200"}`}
                    >
                      {city.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {filteredIssues.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIssues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-gold"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
                <h2 className="font-serif font-bold text-xl text-navy mb-2">
                  No matching issues
                </h2>
                <p className="text-slate mb-6">
                  Try another topic or city, or subscribe to get new local coverage.
                </p>
                <SubscribeForm variant="inline" className="max-w-md mx-auto" />
              </div>
            )}
          </div>
        </section>

        {/* Subscribe CTA */}
        {issues.length > 0 && (
          <section className="py-12 bg-white border-t border-gray-200">
            <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="font-serif font-bold text-2xl text-navy mb-4">
                Never miss an issue
              </h2>
              <p className="text-slate mb-6">
                Get the Griffin Grapevine delivered to your inbox every week.
              </p>
              <SubscribeForm variant="hero" />
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
