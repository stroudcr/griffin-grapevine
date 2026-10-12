import { Metadata } from "next";
import { Footer, Header, IssueCard, JsonLd, SubscribeForm } from "@/components";
import { getAllIssues } from "@/lib/beehiiv/posts";
import type { Issue } from "@/lib/beehiiv/types";
import { SITE_CONFIG } from "@/lib/seo/constants";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import { cleanIssueTitle } from "@/lib/seo/issues";
import { generateItemListSchema } from "@/lib/seo/schemas";

export const metadata: Metadata = buildPageMetadata({
  title: "Spalding County News Archive",
  description:
    "Browse every Griffin Grapevine issue: Spalding County news, events, and public meetings from Griffin, Orchard Hill, and Sunny Side.",
  path: "/issues",
});

export default async function IssuesPage() {
  let issues: Issue[] = [];

  try {
    issues = await getAllIssues();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Failed to fetch issues:", error);
    }
  }

  const itemListSchema = generateItemListSchema(
    issues.map((issue) => ({
      name: cleanIssueTitle(issue.title),
      url: `${SITE_CONFIG.url}/issues/${issue.slug}`,
      datePublished: issue.publishDate,
    })),
    `${SITE_CONFIG.location.county} news archive from ${SITE_CONFIG.name}`
  );

  return (
    <div className="page-shell min-h-screen">
      <JsonLd data={itemListSchema} />
      <Header />

      <main>
        <section className="py-12 sm:py-16">
          <div className="page-frame">
            <p className="eyebrow mb-5">Archive</p>
            <h1 className="headline-balance text-4xl font-semibold text-ink sm:text-6xl">
              Every issue
            </h1>
            <p className="mt-4 text-lg text-slate">
              {issues.length > 0 ? `${issues.length} issues of ` : ""}Spalding County news, newest first.
            </p>
          </div>
        </section>

        <section className="pb-16 sm:pb-20">
          <div className="page-frame">
            {issues.length > 0 ? (
              <div className="space-y-6">
                <IssueCard issue={issues[0]} featured />
                {issues.length > 1 && (
                  <div className="news-grid news-grid-3">
                    {issues.slice(1).map((issue) => (
                      <IssueCard key={issue.id} issue={issue} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="surface-panel rounded-[1.75rem] p-8 sm:p-10">
                <h2 className="text-2xl font-semibold text-ink">The archive is loading.</h2>
                <p className="mb-6 mt-3 text-slate">Check back shortly, or get the next issue by email.</p>
                <SubscribeForm variant="inline" className="max-w-xl" />
              </div>
            )}
          </div>
        </section>

        <section className="pb-16 sm:pb-20">
          <div className="page-frame">
            <div className="surface-tint rounded-[1.75rem] p-6 sm:p-9 lg:flex lg:items-center lg:justify-between lg:gap-10">
              <h2 className="text-3xl font-semibold text-ink">Get the next issue by email</h2>
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
