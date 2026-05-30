import Link from "next/link";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { IssueCard } from "./IssueCard";
import { SubscribeForm } from "./SubscribeForm";
import { JsonLd } from "./JsonLd";
import { getAllIssues } from "@/lib/beehiiv/posts";
import { SITE_CONFIG } from "@/lib/seo/constants";
import {
  cleanIssueTitle,
  issueMatchesCity,
  issueMatchesTopic,
} from "@/lib/seo/issues";
import { generateItemListSchema } from "@/lib/seo/schemas";
import type { Issue } from "@/lib/beehiiv/types";

interface LocalCoveragePageProps {
  title: string;
  eyebrow: string;
  description: string;
  canonicalPath: string;
  topicSlug?: string;
  citySlug?: string;
  sections: {
    title: string;
    body: string;
  }[];
}

export async function LocalCoveragePage({
  title,
  eyebrow,
  description,
  canonicalPath,
  topicSlug,
  citySlug,
  sections,
}: LocalCoveragePageProps) {
  let issues: Issue[] = [];

  try {
    issues = await getAllIssues();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Failed to fetch issues for local coverage page:", error);
    }
  }

  const filteredIssues = issues
    .filter((issue) => issueMatchesTopic(issue, topicSlug))
    .filter((issue) => issueMatchesCity(issue, citySlug))
    .slice(0, 9);

  const itemListSchema = generateItemListSchema(
    filteredIssues.map((issue) => ({
      name: cleanIssueTitle(issue.title),
      url: `${SITE_CONFIG.url}/issues/${issue.slug}`,
      datePublished: issue.publishDate,
    })),
    title
  );

  return (
    <div className="min-h-screen flex flex-col">
      <JsonLd data={itemListSchema} />
      <Header />

      <main className="flex-1">
        <section className="bg-white border-b border-gray-200 py-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-gold mb-4">
              {eyebrow}
            </p>
            <h1 className="font-serif font-bold text-3xl sm:text-5xl text-navy mb-5">
              {title}
            </h1>
            <p className="text-lg sm:text-xl text-slate leading-relaxed">
              {description}
            </p>
          </div>
        </section>

        <section className="py-12 bg-paper">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {sections.map((section) => (
                <div key={section.title} className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="font-serif font-bold text-xl text-navy mb-3">
                    {section.title}
                  </h2>
                  <p className="text-sm text-slate leading-relaxed">
                    {section.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="font-serif font-bold text-2xl text-navy mb-2">
                  Recent coverage
                </h2>
                <p className="text-slate">
                  Latest Griffin Grapevine issues related to this topic.
                </p>
              </div>
              <Link href={canonicalPath === "/griffin-ga-news" ? "/issues?city=griffin" : `/issues?topic=${topicSlug}`} className="btn-secondary inline-block">
                Browse the archive
              </Link>
            </div>

            {filteredIssues.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIssues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-slate mb-6">
                  New coverage is added weekly. Subscribe to get the next issue.
                </p>
                <SubscribeForm variant="inline" className="max-w-md mx-auto" />
              </div>
            )}
          </div>
        </section>

        <section className="py-12 bg-white border-t border-gray-200">
          <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif font-bold text-2xl text-navy mb-4">
              Get Spalding County news in your inbox
            </h2>
            <p className="text-slate mb-6">
              Free weekly local news from Griffin Grapevine.
            </p>
            <SubscribeForm variant="card" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
