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

function archiveHref({
  canonicalPath,
  topicSlug,
  citySlug,
}: {
  canonicalPath: string;
  topicSlug?: string;
  citySlug?: string;
}) {
  if (citySlug || canonicalPath === "/griffin-ga-news") {
    return `/issues?city=${citySlug || "griffin"}`;
  }

  return topicSlug ? `/issues?topic=${topicSlug}` : "/issues";
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
  const browseHref = archiveHref({ canonicalPath, topicSlug, citySlug });

  return (
    <div className="page-shell min-h-screen">
      <JsonLd data={itemListSchema} />
      <Header />

      <main>
        <section className="section-rule py-14 sm:py-18">
          <div className="page-frame pt-14">
            <div className="max-w-4xl">
              <p className="eyebrow mb-5">{eyebrow}</p>
              <h1 className="headline-balance text-5xl font-semibold text-ink sm:text-6xl">
                {title}
              </h1>
              <p className="copy-balance mt-5 max-w-3xl text-lg text-slate sm:text-xl">
                {description}
              </p>
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-12">
          <div className="page-frame grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
            <div className="surface-panel rounded-[2.25rem] p-7 sm:p-10">
              <p className="eyebrow mb-4">What we cover</p>
              <div className="space-y-5">
                {sections.map((section) => (
                  <div key={section.title} className="border-b border-[rgb(29_36_64_/_0.1)] pb-5 last:border-b-0 last:pb-0">
                    <h2 className="mb-2 font-serif text-2xl font-semibold text-ink">
                      {section.title}
                    </h2>
                    <p className="text-slate">
                      {section.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-tint rounded-[2rem] p-7 sm:p-10">
              <h2 className="headline-balance text-4xl font-semibold text-ink">
                A weekly read for people who live nearby.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate">
                We collect the practical local items that are easy to miss: public meetings, school notes, new businesses, weekend events, and small stories with real neighborhood value.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={browseHref} className="btn-primary">
                  Browse the archive
                </Link>
                <Link href="/#subscribe" className="btn-secondary">
                  Subscribe free
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-6 sm:py-8">
          <div className="page-frame">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow mb-4">Recent coverage</p>
                <h2 className="headline-balance text-3xl font-semibold text-ink sm:text-4xl">
                  Latest issues related to this topic.
                </h2>
              </div>
              <Link href={browseHref} className="btn-secondary self-start sm:self-auto">
                Open filtered archive
              </Link>
            </div>

            {filteredIssues.length > 0 ? (
              <div className="news-grid news-grid-3">
                {filteredIssues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            ) : (
              <div className="surface-panel rounded-[2rem] p-8 text-center sm:p-10">
                <p className="mx-auto mb-6 max-w-2xl text-slate">
                  New coverage is added weekly. Subscribe to get the next issue.
                </p>
                <SubscribeForm variant="inline" className="mx-auto max-w-xl" />
              </div>
            )}
          </div>
        </section>

        <section className="pb-16 pt-8 sm:pb-20">
          <div className="page-frame">
            <div className="surface-panel rounded-[2.25rem] p-7 sm:p-10 lg:flex lg:items-end lg:justify-between lg:gap-10">
              <div className="max-w-2xl">
                <p className="eyebrow mb-4">Local tips</p>
                <h2 className="headline-balance text-3xl font-semibold text-ink sm:text-4xl">
                  Help us catch what Spalding County is talking about.
                </h2>
                <p className="mt-4 text-slate">
                  Send tips about public decisions, events, openings, school news, and community notes.
                </p>
              </div>
              <Link href="/contact" className="btn-primary mt-6 lg:mt-0">
                Contact the newsroom
              </Link>
            </div>
          </div>
        </section>

        <section className="pb-16 sm:pb-20">
          <div className="page-frame">
            <SubscribeForm variant="inline" className="mx-auto max-w-2xl" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
