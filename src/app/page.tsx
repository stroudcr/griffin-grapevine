import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer, Header, IssueCard, JsonLd, SubscribeForm } from "@/components";
import { getLatestIssues, getRecentIssueHtml } from "@/lib/beehiiv/posts";
import type { Issue } from "@/lib/beehiiv/types";
import { displayDay, todayIn, upcomingListings, type Listing } from "@/lib/issue-listings";
import { dateParts, formatClock, relativeLabel, townFrom } from "@/lib/listing-format";
import { getIssueDisplayTitle, getIssueStoryDeck } from "@/lib/seo/issues";
import { generateWebsiteSchema } from "@/lib/seo/schemas";
import { SITE_CONFIG } from "@/lib/seo/constants";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Spalding County News | Local Updates from Griffin and Across Spalding County",
  description:
    "Free Spalding County GA news twice a week. Local news, events, and public meetings from Griffin, Orchard Hill, and Sunny Side.",
  alternates: {
    canonical: SITE_CONFIG.url,
  },
};

const TIME_ZONE = SITE_CONFIG.location.timeZone;

/** "A, B, and C. Local Spalding County News." → ["A", "B", "C"] */
function headlinesFrom(issue: Issue): string[] {
  return getIssueStoryDeck(issue)
    .replace(/\.\s*$/, "")
    .split(/,\s+(?:and\s+)?(?=[A-Z0-9“"'])/)
    .map((headline) => headline.trim())
    .filter(Boolean)
    .slice(0, 4);
}

function nowClock(): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: TIME_ZONE,
  }).format(new Date());
}

/** The next few events that haven't already finished today. */
function nextEvents(listings: Listing[], today: string, count: number): Listing[] {
  const now = nowClock();
  return listings
    .filter((listing) => listing.kind === "event")
    .filter((listing) => {
      if (listing.startDate !== today || listing.endDate !== today) return true;
      const finish = listing.endTime ?? listing.startTime;
      return !finish || finish >= now;
    })
    .slice(0, count);
}

function EventPreview({ listing, today }: { listing: Listing; today: string }) {
  const day = displayDay(listing, today);
  const parts = dateParts(day);
  const time = listing.startTime ? formatClock(listing.startTime) : null;
  const town = townFrom(listing.whereText);

  return (
    <li>
      <Link
        href={`/spalding-county-events#day-${day}`}
        className="hover-lift flex h-full flex-col rounded-[1.5rem] border border-[rgb(29_36_64_/_0.12)] bg-white/80 p-5"
      >
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-deep">
          {relativeLabel(day, today) ?? `${parts.weekdayShort}, ${parts.monthShort} ${parts.day}`}
          {" · "}
          {time ? `${time.clock} ${time.meridiem}` : "All day"}
        </p>
        <p className="mt-2 font-serif text-xl font-semibold leading-snug text-ink">{listing.title}</p>
        {town && <p className="mt-auto pt-3 text-sm text-slate">{town}</p>}
      </Link>
    </li>
  );
}

export default async function HomePage() {
  const today = todayIn(TIME_ZONE);
  let latestIssues: Issue[] = [];
  let listings: Listing[] = [];

  const [issuesResult, htmlResult] = await Promise.allSettled([
    getLatestIssues(4),
    getRecentIssueHtml(4),
  ]);

  if (issuesResult.status === "fulfilled") {
    latestIssues = issuesResult.value;
  } else if (process.env.NODE_ENV === "development") {
    console.error("Failed to fetch issues:", issuesResult.reason);
  }

  if (htmlResult.status === "fulfilled") {
    listings = upcomingListings(htmlResult.value, today);
  } else if (process.env.NODE_ENV === "development") {
    console.error("Failed to fetch events:", htmlResult.reason);
  }

  const featuredIssue = latestIssues[0] ?? null;
  const featuredHeadlines = featuredIssue ? headlinesFrom(featuredIssue) : [];
  const recentIssues = latestIssues.slice(1, 4);
  const upcoming = nextEvents(listings, today, 6);
  const eventCount = listings.filter((listing) => listing.kind === "event").length;

  return (
    <div className="page-shell min-h-screen">
      <JsonLd data={generateWebsiteSchema()} />
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
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,24,38,0.82)_0%,rgba(20,24,38,0.6)_45%,rgba(20,24,38,0.32)_100%)]" />
          </div>

          <div className="page-frame relative grid items-end gap-8 py-14 sm:py-20 lg:min-h-[38rem] lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.8fr)] lg:gap-12">
            <div className="hero-entrance max-w-2xl text-white">
              <h1 className="headline-balance text-5xl font-semibold leading-[0.95] text-white sm:text-6xl lg:text-7xl">
                Spalding County news, twice a week.
              </h1>
              <p className="copy-balance mt-5 max-w-xl text-lg leading-8 text-white/85 sm:text-xl">
                Local news, events, and public meetings from {SITE_CONFIG.phrases.cityList}. Free in your inbox.
              </p>

              <div id="subscribe" className="hero-entrance-delay mt-8 max-w-xl scroll-mt-28">
                <SubscribeForm variant="hero" />
              </div>
            </div>

            {featuredIssue && (
              <Link
                href={`/issues/${featuredIssue.slug}`}
                className="hero-entrance-delay hover-lift block rounded-[1.75rem] border border-white/40 bg-[rgb(255_255_255_/_0.9)] p-6 shadow-[0_28px_80px_rgb(20_24_38_/_0.28)] backdrop-blur-xl sm:p-7"
              >
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-deep">
                  Latest issue ·{" "}
                  {new Intl.DateTimeFormat("en-US", {
                    month: "long",
                    day: "numeric",
                    timeZone: TIME_ZONE,
                  }).format(featuredIssue.publishDate)}
                </p>
                <h2 className="headline-balance mt-2 text-3xl font-semibold text-ink">
                  {getIssueDisplayTitle(featuredIssue)}
                </h2>
                {featuredHeadlines.length > 0 && (
                  <ul className="mt-4 space-y-2 text-slate-deep">
                    {featuredHeadlines.map((headline) => (
                      <li key={headline} className="flex gap-3 leading-6">
                        <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        <span>{headline}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-5 text-sm font-semibold text-ink">
                  Read the issue <span aria-hidden="true">→</span>
                </p>
              </Link>
            )}
          </div>
        </section>

        {upcoming.length > 0 && (
          <section className="py-14 sm:py-16">
            <div className="page-frame">
              <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                <h2 className="text-3xl font-semibold text-ink sm:text-4xl">Coming up this week</h2>
                <Link href="/spalding-county-events" className="font-semibold text-ink hover:underline">
                  All {eventCount} events <span aria-hidden="true">→</span>
                </Link>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((listing) => (
                  <EventPreview key={`${listing.title}-${listing.startDate}`} listing={listing} today={today} />
                ))}
              </ul>
            </div>
          </section>
        )}

        {recentIssues.length > 0 && (
          <section className="section-rule py-14 sm:py-16">
            <div className="page-frame pt-14 sm:pt-16">
              <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                <h2 className="text-3xl font-semibold text-ink sm:text-4xl">Recent issues</h2>
                <Link href="/issues" className="font-semibold text-ink hover:underline">
                  Full archive <span aria-hidden="true">→</span>
                </Link>
              </div>
              <div className="news-grid news-grid-3">
                {recentIssues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="pb-16 pt-4 sm:pb-20">
          <div className="page-frame">
            <div className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#201e36_0%,#1d2440_45%,#6f5731_150%)] px-6 py-10 text-white shadow-[0_30px_80px_rgb(20_24_38_/_0.18)] sm:px-10 sm:py-12 lg:flex lg:items-center lg:justify-between lg:gap-10">
              <div className="max-w-xl">
                <h2 className="headline-balance text-3xl font-semibold text-white sm:text-4xl">
                  Know what&apos;s happening in Spalding County.
                </h2>
                <p className="mt-3 text-lg text-white/75">Join your neighbors. It&apos;s free.</p>
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
