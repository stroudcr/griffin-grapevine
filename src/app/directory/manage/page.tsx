import type { Metadata } from "next";
import Link from "next/link";
import { DIRECTORY_PATH, GUIDE_NAME, PRICING, getCategory } from "@/lib/directory";
import { SITE_CONFIG } from "@/lib/seo/constants";
import { isPublic, type ListingRow } from "@/lib/guide/content";
import { hasDatabase } from "@/lib/guide/env";
import { activityLast30Days, listingsForOwner, type ActivityAction } from "@/lib/guide/listings";
import { getSession } from "@/lib/guide/session";
import { TONE_CLASSES, describeStatus, formatDate, missingPieces } from "@/lib/guide/status";
import { completeSignIn, openBillingPortal, signOut } from "./actions";
import { SignInForm } from "./SignInForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: `Manage your listing | ${SITE_CONFIG.name}` },
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ token?: string; signin?: string; welcome?: string; checkout?: string; billing?: string }>;
}

function Shell({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <main className="flex-1">
      <div className={`mx-auto px-4 pb-20 pt-8 sm:px-6 lg:px-8 ${wide ? "max-w-6xl" : "max-w-2xl"}`}>
        <nav aria-label="Breadcrumb" className="text-[13px] text-slate">
          <Link href={DIRECTORY_PATH}>{GUIDE_NAME}</Link>
          <span aria-hidden="true" className="mx-2 text-gold">›</span>
          <span aria-current="page">Manage your listing</span>
        </nav>
        {children}
      </div>
    </main>
  );
}

function Heading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mt-8 border-t border-navy/[0.12] pt-6">
      <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-ink">For business owners</span>
      <h1 className="mt-2 text-[clamp(2.2rem,5vw,3.2rem)] font-semibold leading-tight text-ink">{title}</h1>
      {subtitle && <p className="mt-2 text-[17px] leading-7 text-slate">{subtitle}</p>}
    </div>
  );
}

const ACTIVITY_LABELS: [ActivityAction, string, string][] = [
  ["view", "page view", "page views"],
  ["call", "call", "calls"],
  ["website", "website visit", "website visits"],
  ["directions", "directions request", "directions requests"],
];

function ListingCard({ listing, activity }: { listing: ListingRow; activity?: Record<ActivityAction, number> }) {
  const status = describeStatus(listing);
  const category = getCategory(listing.category);
  const missing = missingPieces(listing);
  const renews = formatDate(listing.current_period_end);
  const live = isPublic(listing);
  const canEdit = listing.status !== "rejected" && listing.status !== "canceled";

  return (
    <li className="rounded-[1.75rem] border border-navy/[0.12] bg-white/85 p-6 shadow-[var(--shadow-soft)] sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-serif text-2xl font-semibold text-ink">{listing.content.name}</h2>
          <p className="mt-0.5 text-sm text-slate">
            {category?.heading ?? listing.category} · {listing.content.town}
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${TONE_CLASSES[status.tone]}`}>{status.label}</span>
      </div>
      <p className="mt-3 leading-7 text-slate">{status.detail}</p>

      {canEdit && missing.length > 0 && (
        <p className="mt-3 rounded-2xl bg-gold/10 px-4 py-2.5 text-[15px] text-ink">
          Finish your page: add {missing.join(", ").replace(/, ([^,]*)$/, " and $1")}.
        </p>
      )}

      {live && (
        <div className="mt-4 rounded-2xl border border-navy/10 bg-paper/70 px-4 py-3">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-gold-ink">Last 30 days</p>
          <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
            {ACTIVITY_LABELS.map(([key, one, many]) => {
              const n = activity?.[key] ?? 0;
              return (
                <div key={key}>
                  <dt className="sr-only">{many}</dt>
                  <dd>
                    <span className="block font-serif text-2xl font-semibold tabular-nums text-ink">{n.toLocaleString("en-US")}</span>
                    <span className="block text-[13px] text-slate">{n === 1 ? one : many}</span>
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      )}

      <p className="mt-4 tabular-nums text-[11px] font-semibold uppercase tracking-[0.14em] text-slate">
        {listing.plan === "yearly" ? `Yearly · $${PRICING.yearly}` : `Monthly · $${PRICING.monthly}`}
        {renews && listing.status !== "canceled" && listing.status !== "rejected" && (
          <> · {listing.cancel_at_period_end ? "Ends" : "Renews"} {renews}</>
        )}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {canEdit && (
          <Link href={`/directory/manage/${listing.id}`} className="btn-primary inline-flex min-h-11 items-center !text-white">
            Edit listing
          </Link>
        )}
        {live ? (
          <Link href={`/directory/${listing.category}/${listing.slug}`} className="btn-secondary inline-flex min-h-11 items-center">
            View live page
          </Link>
        ) : (
          canEdit && (
            <Link href={`/directory/manage/${listing.id}/preview`} className="btn-secondary inline-flex min-h-11 items-center">
              Preview
            </Link>
          )
        )}
        {listing.stripe_customer_id && (
          <form action={openBillingPortal}>
            <input type="hidden" name="id" value={listing.id} />
            <button type="submit" className="inline-flex min-h-11 items-center px-2 font-medium text-ink underline underline-offset-4">
              Billing
            </button>
          </form>
        )}
      </div>
    </li>
  );
}

export default async function ManagePage({ searchParams }: Props) {
  const params = await searchParams;

  if (!hasDatabase()) {
    return (
      <Shell>
        <Heading title="Manage your listing" subtitle={`Online accounts are being set up. Email ${SITE_CONFIG.email} for help with your listing.`} />
      </Shell>
    );
  }

  // Step 2 of signing in: a button (not an automatic GET) so email link scanners can't use up the link.
  if (params.token) {
    return (
      <Shell>
        <Heading title="Finish signing in" subtitle="One more click and you're in." />
        <form action={completeSignIn} className="mt-6">
          <input type="hidden" name="token" value={params.token} />
          <button type="submit" className="btn-primary min-h-12">
            Sign in to manage your listing
          </button>
        </form>
      </Shell>
    );
  }

  const session = await getSession();
  if (!session) {
    return (
      <Shell>
        <Heading title="Sign in" subtitle="We'll email you a link. No password needed." />
        {params.signin === "expired" && (
          <p role="alert" className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[15px] text-amber-900">
            That sign-in link has expired or was already used. Request a new one below.
          </p>
        )}
        {params.checkout === "processing" && (
          <p role="status" className="mt-6 rounded-2xl border border-navy/15 bg-white/85 px-4 py-3 text-[15px] text-slate">
            Thanks! We&apos;re still confirming your payment. Sign in below in a minute to finish your listing.
          </p>
        )}
        <div className="mt-6">
          <SignInForm />
        </div>
        <p className="mt-8 text-sm text-slate">
          New here?{" "}
          <Link href="/directory/join" className="font-medium">
            Become a featured member
          </Link>
          .
        </p>
      </Shell>
    );
  }

  const listings = await listingsForOwner(session.email);
  const activity = await activityLast30Days(listings.map((l) => l.slug)).catch((error) => {
    console.error("[guide manage] Could not load activity:", error);
    return new Map<string, Record<ActivityAction, number>>();
  });
  const welcome = params.welcome ? listings.find((l) => l.id === params.welcome) : undefined;

  return (
    <Shell wide>
      <Heading title="Your listings" />
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate">
        <span>
          Signed in as <strong className="font-semibold text-ink">{session.email}</strong>
        </span>
        {session.isAdmin && (
          <Link href="/directory/admin" className="font-medium">
            Admin: review listings
          </Link>
        )}
        <form action={signOut}>
          <button type="submit" className="font-medium text-ink underline underline-offset-4">
            Sign out
          </button>
        </form>
      </div>

      {welcome && (
        <div role="status" className="page-shell-dark mt-6 rounded-[1.75rem] p-6 text-white sm:p-7">
          <p className="font-serif text-2xl font-semibold">Payment received. Welcome to the Grapevine!</p>
          <p className="mt-2 leading-7 text-white/85">
            {welcome.content.name} is in review. While you wait, add a description, photos, hours and a Grapevine Perk so your page is ready the day it goes live.
          </p>
          <Link
            href={`/directory/manage/${welcome.id}`}
            className="mt-4 inline-flex min-h-11 items-center rounded-full bg-gold-soft px-5 font-semibold !text-ink-deep hover:!no-underline"
          >
            Finish your listing
          </Link>
        </div>
      )}
      {params.billing === "unavailable" && (
        <p role="alert" className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[15px] text-amber-900">
          Billing couldn&apos;t be opened right now. Please try again, or email {SITE_CONFIG.email}.
        </p>
      )}

      {listings.length === 0 ? (
        <div className="mt-8 rounded-[1.75rem] border border-navy/[0.12] bg-white/85 p-7">
          <p className="font-serif text-2xl font-semibold text-ink">No listings for this email yet</p>
          <p className="mt-2 leading-7 text-slate">
            If you signed up with a different email, sign out and use that one. Otherwise,{" "}
            <Link href="/directory/join" className="font-medium">
              become a featured member
            </Link>
            .
          </p>
        </div>
      ) : (
        <ul className="mt-8 grid gap-5">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} activity={activity.get(listing.slug)} />
          ))}
        </ul>
      )}
    </Shell>
  );
}
