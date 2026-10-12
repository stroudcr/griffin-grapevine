import { Metadata } from "next";
import Link from "next/link";
import { Footer, Header, JsonLd, SubscribeForm } from "@/components";
import { getRecentIssueHtml } from "@/lib/beehiiv/posts";
import {
  listingToEventSchema,
  todayIn,
  upcomingListings,
  type Listing,
} from "@/lib/issue-listings";
import {
  dateParts,
  formatClock,
  groupByDay,
  relativeLabel,
} from "@/lib/listing-format";
import { SITE_CONFIG } from "@/lib/seo/constants";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const revalidate = 300;

const TIME_ZONE = SITE_CONFIG.location.timeZone;
const ISSUES_TO_SCAN = 4;

export const metadata: Metadata = buildPageMetadata({
  title: "Spalding County Events This Week | Things to Do in Griffin GA",
  description:
    "Things to do in Griffin and Spalding County this week: festivals, markets, library programs, sports, and public meetings, updated with every Griffin Grapevine issue.",
  path: "/spalding-county-events",
});

function timeLabel(listing: Listing): string {
  if (!listing.startTime) return "All day";
  const start = formatClock(listing.startTime);
  if (!listing.endTime) return `${start.clock} ${start.meridiem}`;
  const end = formatClock(listing.endTime);
  return start.meridiem === end.meridiem
    ? `${start.clock}–${end.clock} ${end.meridiem}`
    : `${start.clock} ${start.meridiem}–${end.clock} ${end.meridiem}`;
}

function runsThrough(listing: Listing, day: string): string | null {
  if (listing.endDate === day) return null;
  const end = dateParts(listing.endDate);
  return `Through ${end.weekdayShort}, ${end.monthShort} ${end.day}`;
}

function EventRow({
  listing,
  day,
  showDate = false,
}: {
  listing: Listing;
  day: string;
  showDate?: boolean;
}) {
  const through = runsThrough(listing, day);
  const date = dateParts(day);

  return (
    <li className="grid gap-x-6 gap-y-2 border-t border-[rgb(29_36_64_/_0.08)] py-5 first:border-t-0 first:pt-0 last:pb-0 sm:grid-cols-[8.5rem_1fr]">
      <div className="text-sm font-semibold tabular-nums text-accent-deep">
        {showDate && (
          <span className="block text-ink">
            {date.weekdayShort}, {date.monthShort} {date.day}
          </span>
        )}
        {timeLabel(listing)}
        {through && <span className="block text-xs font-medium text-slate">{through}</span>}
      </div>
      <div className="min-w-0">
        <h3 className="font-serif text-xl font-semibold leading-snug text-ink">
          {listing.url ? (
            <a
              href={listing.url}
              target="_blank"
              rel="noopener"
              className="decoration-accent underline-offset-4 hover:underline"
            >
              {listing.title}
            </a>
          ) : (
            listing.title
          )}
        </h3>
        {listing.whatText && (
          <p className="copy-balance mt-1.5 leading-7 text-slate-deep">{listing.whatText}</p>
        )}
        {listing.whereText && (
          <p className="mt-1.5 text-sm text-slate">{listing.whereText}</p>
        )}
      </div>
    </li>
  );
}

function DayHeading({ day, today }: { day: string; today: string }) {
  const parts = dateParts(day);
  const relative = relativeLabel(day, today);

  return (
    <div className="flex items-baseline gap-3 lg:block">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent-deep">
        {relative ?? parts.weekday}
      </p>
      <p className="font-serif text-2xl font-semibold text-ink lg:mt-1 lg:text-3xl">
        {relative ? `${parts.weekdayShort}, ` : ""}
        {parts.monthShort} {parts.day}
      </p>
    </div>
  );
}

export default async function SpaldingCountyEventsPage() {
  const today = todayIn(TIME_ZONE);
  let issues: Awaited<ReturnType<typeof getRecentIssueHtml>> = [];

  try {
    issues = await getRecentIssueHtml(ISSUES_TO_SCAN);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Failed to fetch issues for events page:", error);
    }
  }

  const listings = upcomingListings(issues, today);
  const events = listings.filter((l) => l.kind === "event");
  const meetings = listings.filter((l) => l.kind === "meeting");
  const updated = issues[0]?.publishDate;

  const eventSchema = {
    "@context": "https://schema.org",
    "@graph": listings.map((listing) => listingToEventSchema(listing, TIME_ZONE)),
  };

  return (
    <div className="page-shell min-h-screen">
      {listings.length > 0 && <JsonLd data={eventSchema} />}
      <Header />

      <main>
        <section className="py-12 sm:py-16">
          <div className="page-frame">
            <p className="eyebrow mb-5">Spalding County events</p>
            <h1 className="headline-balance max-w-3xl text-4xl font-semibold text-ink sm:text-6xl">
              Things to do around Griffin this week.
            </h1>
            <p className="mt-4 text-lg text-slate">
              Pulled from every issue of the {SITE_CONFIG.name}.
              {updated && (
                <>
                  {" "}
                  Updated{" "}
                  {new Intl.DateTimeFormat("en-US", {
                    month: "long",
                    day: "numeric",
                    timeZone: TIME_ZONE,
                  }).format(updated)}
                  .
                </>
              )}
            </p>
          </div>
        </section>

        <section className="pb-12 sm:pb-16">
          <div className="page-frame">
            {events.length > 0 ? (
              <div className="space-y-5">
                {groupByDay(events, today).map(([day, dayEvents]) => (
                  <section
                    key={day}
                    id={`day-${day}`}
                    className="surface-panel scroll-mt-24 rounded-[1.75rem] p-6 sm:p-8 lg:grid lg:grid-cols-[11rem_1fr] lg:gap-10"
                  >
                    <DayHeading day={day} today={today} />
                    <ul className="mt-5 lg:mt-0">
                      {dayEvents.map((listing) => (
                        <EventRow key={`${listing.title}-${listing.startDate}`} listing={listing} day={day} />
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            ) : (
              <div className="surface-panel rounded-[1.75rem] p-7 sm:p-10">
                <h2 className="text-2xl font-semibold text-ink">The next calendar is on its way.</h2>
                <p className="mt-3 text-slate">
                  New events go up as soon as each issue is published.
                </p>
                <Link href="/issues" className="btn-secondary mt-6">
                  Browse recent issues
                </Link>
              </div>
            )}
          </div>
        </section>

        {meetings.length > 0 && (
          <section className="pb-12 sm:pb-16">
            <div className="page-frame">
              <div className="surface-tint rounded-[1.75rem] p-6 sm:p-8">
                <p className="eyebrow mb-3">Public meetings</p>
                <h2 className="mb-6 text-3xl font-semibold text-ink">Local government this week</h2>
                <ul>
                  {meetings.map((listing) => (
                    <EventRow
                      key={`${listing.title}-${listing.startDate}`}
                      listing={{ ...listing, whatText: undefined }}
                      day={listing.startDate}
                      showDate
                    />
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        <section className="pb-16 sm:pb-20">
          <div className="page-frame grid gap-5 lg:grid-cols-2">
            <div className="surface-panel rounded-[1.75rem] p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-ink">Get the calendar in your inbox</h2>
              <p className="mb-5 mt-2 text-slate">Free, twice a week.</p>
              <SubscribeForm variant="inline" />
            </div>
            <div className="surface-tint flex flex-col justify-between rounded-[1.75rem] p-6 sm:p-8">
              <div>
                <h2 className="text-2xl font-semibold text-ink">Know about an event?</h2>
                <p className="mt-2 text-slate">Send it before the next issue goes out.</p>
              </div>
              <Link href="/contact" className="btn-secondary mt-5 self-start">
                Send an event
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
