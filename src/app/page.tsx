import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer, Header, IssueCard, JsonLd, SubscribeForm } from "@/components";
import { getLatestIssues } from "@/lib/beehiiv/posts";
import type { Issue } from "@/lib/beehiiv/types";
import { generateWebsiteSchema } from "@/lib/seo/schemas";
import { SITE_CONFIG } from "@/lib/seo/constants";

export const metadata: Metadata = {
  title: "Spalding County News | Local Updates from Griffin and Across Spalding County",
  description:
    "Get free weekly Spalding County GA news delivered to your inbox. Covering Griffin, Orchard Hill, Sunny Side local news, events, and community updates.",
  alternates: {
    canonical: SITE_CONFIG.url,
  },
};

export default async function HomePage() {
  let latestIssues: Issue[] = [];
  let featuredIssue: Issue | null = null;

  try {
    latestIssues = await getLatestIssues(6);
    featuredIssue = latestIssues[0] || null;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Failed to fetch issues:", error);
    }
  }

  const websiteSchema = generateWebsiteSchema();

  return (
    <div className="page-shell min-h-screen">
      <JsonLd data={websiteSchema} />
      <Header />

      <main>
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={SITE_CONFIG.heroImage}
              alt={SITE_CONFIG.heroImageAlt}
              fill
              priority
              loading="eager"
              quality={75}
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,24,38,0.78)_0%,rgba(20,24,38,0.56)_42%,rgba(20,24,38,0.28)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,24,38,0.26)_0%,rgba(20,24,38,0.54)_100%)]" />
          </div>

          <div className="page-frame relative grid min-h-[calc(100svh-5rem)] items-end gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.72fr)] lg:py-20">
            <div className="hero-entrance max-w-3xl text-white">
              <p className="mb-5 inline-flex items-center gap-3 rounded-full border border-white/16 bg-white/8 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-white/82">
                <span className="h-2 w-2 rounded-full bg-accent" />
                {SITE_CONFIG.name}
              </p>
              <h1 className="headline-balance max-w-4xl text-5xl font-semibold leading-[0.92] text-white sm:text-6xl lg:text-7xl">
                Spalding County news that feels close to home.
              </h1>
              <p className="copy-balance mt-6 max-w-2xl text-lg leading-8 text-white/82 sm:text-xl">
                Clear, weekly reporting on the local decisions, openings, events, and community stories shaping life in Griffin and communities across Spalding County.
              </p>

              <div id="subscribe" className="hero-entrance-delay mt-8 max-w-2xl">
                <SubscribeForm variant="hero" />
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-white/84">
                <span className="kicker-stat text-white/84 before:bg-[rgb(177_142_87)]">Always free</span>
                <span className="kicker-stat text-white/84 before:bg-[rgb(177_142_87)]">Weekly delivery</span>
                <span className="kicker-stat text-white/84 before:bg-[rgb(177_142_87)]">Locally reported</span>
              </div>
            </div>

            <div className="hero-entrance-delay">
              <div className="surface-panel rounded-[2rem] bg-[rgb(255_255_255_/_0.78)] p-6 shadow-[0_28px_80px_rgb(20_24_38_/_0.24)] backdrop-blur-xl sm:p-7">
                <p className="eyebrow mb-4 text-ink before:bg-[rgb(177_142_87_/_0.55)]">Inside the Edition</p>
                {featuredIssue ? (
                  <>
                    <p className="mb-2 text-sm uppercase tracking-[0.18em] text-ink-soft">
                      Latest issue
                    </p>
                    <h2 className="headline-balance text-3xl font-semibold text-ink">
                      {featuredIssue.title}
                    </h2>
                    {featuredIssue.excerpt && (
                      <p className="copy-balance mt-4 text-base leading-7 text-slate-deep">
                        {featuredIssue.excerpt}
                      </p>
                    )}
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link href={`/issues/${featuredIssue.slug}`} className="btn-primary">
                        Read the issue
                      </Link>
                      <Link href="/issues" className="btn-ghost text-ink hover:bg-[rgb(29_36_64_/_0.05)] hover:text-ink-deep">
                        Browse the archive
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="mb-2 text-sm uppercase tracking-[0.18em] text-ink-soft">
                      Weekly briefing
                    </p>
                    <h2 className="headline-balance text-3xl font-semibold text-ink">
                      Start with the next issue in your inbox.
                    </h2>
                    <p className="mt-4 text-base leading-7 text-slate-deep">
                      Our latest edition is published weekly. Subscribe now and you&apos;ll be first to know when the next briefing goes live.
                    </p>
                    <div className="mt-6">
                      <Link href="/issues" className="btn-primary">
                        Visit the archive
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="section-rule py-16 sm:py-20">
          <div className="page-frame pt-16">
            <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="eyebrow mb-4">Fresh reporting</p>
                <h2 className="headline-balance text-4xl font-semibold text-ink sm:text-5xl">
                  The week&apos;s local read.
                </h2>
                <p className="copy-balance mt-4 text-lg text-slate">
                  One strong lead edition, then the archive within reach.
                </p>
              </div>
              <Link href="/issues" className="btn-secondary self-start md:self-auto">
                Open the archive
              </Link>
            </div>

            {featuredIssue ? (
              <IssueCard issue={featuredIssue} featured />
            ) : (
              <div className="surface-panel rounded-[2rem] p-8 sm:p-10">
                <p className="eyebrow mb-4">Archive offline</p>
                <h3 className="headline-balance text-3xl font-semibold text-ink">
                  The latest issue will appear here as soon as the feed is available.
                </h3>
                <p className="mt-4 max-w-2xl text-slate">
                  The publication archive is temporarily unavailable in this local environment, but subscriptions and the rest of the site remain ready.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="py-4 sm:py-8">
          <div className="page-frame">
            <div className="rounded-[2rem] border border-[rgb(29_36_64_/_0.12)] bg-white/72 p-6 shadow-[0_20px_60px_rgb(20_24_38_/_0.08)] sm:p-8">
              <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="eyebrow mb-4">Recent issues</p>
                  <h2 className="headline-balance text-3xl font-semibold text-ink sm:text-4xl">
                    Catch up quickly.
                  </h2>
                </div>
                {latestIssues.length > 3 && (
                  <Link href="/issues" className="btn-ghost self-start md:self-auto">
                    View all issues
                  </Link>
                )}
              </div>

              {latestIssues.length > 1 ? (
                <div className="news-grid news-grid-3">
                  {latestIssues.slice(1, 4).map((issue) => (
                    <IssueCard key={issue.id} issue={issue} />
                  ))}
                </div>
              ) : (
                <p className="text-slate">More recent issues will appear here as they are published.</p>
              )}
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-14">
          <div className="page-frame">
            <div className="mb-8 max-w-2xl">
              <p className="eyebrow mb-4">Local coverage guides</p>
              <h2 className="headline-balance text-4xl font-semibold text-ink sm:text-5xl">
                Start with the local beat you need.
              </h2>
            </div>
            <div className="news-grid news-grid-3">
              <Link href="/griffin-ga-news" className="hover-lift h-full rounded-[1.75rem] border border-[rgb(29_36_64_/_0.12)] bg-white/78 p-6">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-ink-soft">
                  Griffin GA news
                </p>
                <h3 className="headline-balance text-2xl font-semibold text-ink">
                  City decisions, schools, events, and neighborhood updates.
                </h3>
              </Link>
              <Link href="/spalding-county-events" className="hover-lift h-full rounded-[1.75rem] border border-[rgb(29_36_64_/_0.12)] bg-white/78 p-6">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-ink-soft">
                  Spalding County events
                </p>
                <h3 className="headline-balance text-2xl font-semibold text-ink">
                  Weekend plans, markets, ceremonies, and community gatherings.
                </h3>
              </Link>
              <Link href="/local-government" className="hover-lift h-full rounded-[1.75rem] border border-[rgb(29_36_64_/_0.12)] bg-white/78 p-6">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-ink-soft">
                  Local government
                </p>
                <h3 className="headline-balance text-2xl font-semibold text-ink">
                  County commission, city decisions, public safety, and development.
                </h3>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="page-frame grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div className="media-sweep overflow-hidden rounded-[2.25rem]">
              <Image
                src={SITE_CONFIG.scenicImage}
                alt={SITE_CONFIG.scenicImageAlt}
                width={1200}
                height={900}
                quality={75}
                className="h-[24rem] w-full object-cover sm:h-[30rem]"
              />
            </div>

            <div className="surface-tint rounded-[2rem] p-7 sm:p-10">
              <p className="eyebrow mb-4">About the publication</p>
              <h2 className="headline-balance text-4xl font-semibold text-ink sm:text-5xl">
                A calmer kind of community news source.
              </h2>
              <p className="copy-balance mt-5 text-lg text-slate">
                The Griffin Grapevine exists for readers who want trustworthy local reporting without the noise. We cover civic decisions, neighborhood business openings, community events, schools, and the people who make Spalding County feel distinct.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/about" className="btn-primary">
                  Learn more about us
                </Link>
                <Link href="/advertise" className="btn-secondary">
                  Advertising details
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-16 pt-4 sm:pb-20">
          <div className="page-frame">
            <div className="overflow-hidden rounded-[2.5rem] border border-[rgb(29_36_64_/_0.12)] bg-[linear-gradient(135deg,#201e36_0%,#1d2440_40%,#6f5731_140%)] px-6 py-10 text-white shadow-[0_30px_80px_rgb(20_24_38_/_0.18)] sm:px-10 sm:py-12 lg:flex lg:items-end lg:justify-between lg:gap-10">
              <div className="max-w-2xl">
                <p className="eyebrow mb-4 text-white before:bg-[rgba(255,255,255,0.5)]">Subscribe</p>
                <h2 className="headline-balance text-4xl font-semibold text-white sm:text-5xl">
                  Join your neighbors before the next issue lands.
                </h2>
                <p className="mt-4 max-w-xl text-lg text-white/76">
                  A free weekly briefing on the stories worth knowing around Spalding County.
                </p>
              </div>
              <div className="mt-8 w-full max-w-xl lg:mt-0">
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
