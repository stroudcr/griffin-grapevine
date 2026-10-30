import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { VineIcon } from "@/components/VineIcon";
import { TodayHours } from "@/components/directory/TodayHours";
import { TrackView, TrackedLink } from "@/components/directory/TrackedLink";
import { CheckIcon, GlobeIcon, PhoneIcon, PinIcon } from "@/components/directory/icons";
import {
  DAY_LABELS,
  DAY_ORDER,
  DIRECTORY_PATH,
  GUIDE_NAME,
  TAGS,
  businessHref,
  capitalize,
  categoryHref,
  claimMailto,
  directionsUrl,
  displayHost,
  formatIntervals,
  formatMonthYear,
  formatShortDate,
  getGroup,
  mapEmbedUrl,
  streetLine,
  telHref,
  townCode,
} from "@/lib/directory";
import type { Business, Category } from "@/lib/directory/types";
import { SITE_CONFIG } from "@/lib/seo/constants";

const chip = "rounded-full border border-navy/[0.12] bg-white/70 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-ink";
const sectionHeading = "mb-3 mt-10 text-[1.4rem] font-semibold text-ink";

interface BusinessProfileProps {
  business: Business;
  category: Category;
  /** Up to three other listings in the same category. */
  others: Business[];
  /** Where "Is this your business?" goes. */
  manage: { href: string; label: string };
  /** Shown above the profile, e.g. a preview notice. */
  banner?: ReactNode;
  /** Count a page view for the owner's report (public pages only). */
  trackViews?: boolean;
}

/** The business page layout, shared by the public page and owner/admin previews. */
export function BusinessProfile({ business, category, others, manage, banner, trackViews = false }: BusinessProfileProps) {
  const group = getGroup(category.group);
  const featured = business.tier === "featured";
  const tags = business.tags ?? [];
  const photos = business.photos ?? [];
  const description = business.description?.filter((p) => p.trim()) ?? [];
  const hasHours = business.hours && DAY_ORDER.some((d) => business.hours?.[d]);
  const { city, state, zip } = business.address;

  return (
    <>
      {banner}
      {trackViews && <TrackView business={business.slug} />}

      {/* ---------- Profile header ---------- */}
      <section className="border-b border-navy/10 bg-white/55">
        <div className="page-frame pb-12 pt-7">
          <nav aria-label="Breadcrumb" className="text-[13px] text-slate">
            <Link href={DIRECTORY_PATH}>{GUIDE_NAME}</Link>
            <span aria-hidden="true" className="mx-2 text-gold">›</span>
            <span>{group?.name}</span>
            <span aria-hidden="true" className="mx-2 text-gold">›</span>
            <Link href={categoryHref(category.slug)}>{category.heading}</Link>
            <span aria-hidden="true" className="mx-2 text-gold">›</span>
            <span aria-current="page">{business.name}</span>
          </nav>

          <div className="mt-8 flex flex-wrap items-start gap-10">
            <div className="min-w-0 flex-[999_1_520px]">
              {(featured || business.perk || tags.length > 0) && (
                <div className="flex flex-wrap gap-2">
                  {featured && (
                    <span className="rounded-full bg-gold-soft px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-ink-deep">
                      Featured member
                    </span>
                  )}
                  {business.perk && <span className={chip}>Grapevine Perk</span>}
                  {tags.map((tag) => (
                    <span key={tag} className={chip}>
                      {TAGS[tag]}
                    </span>
                  ))}
                </div>
              )}
              <h1 className="headline-balance mt-4 text-[clamp(2.4rem,5vw,3.75rem)] font-semibold leading-[1.02] text-ink">{business.name}</h1>
              <p className="mt-2.5 text-slate">
                {capitalize(category.singular)} in {business.town}, GA
              </p>
              {business.tagline && (
                <p className="mt-5 max-w-[600px] font-serif text-[1.3rem] italic leading-8 text-slate-deep">{business.tagline}</p>
              )}
              <div className="mt-6 flex flex-wrap gap-2.5">
                {business.phone && (
                  <TrackedLink
                    href={telHref(business.phone)}
                    business={business.slug}
                    action="call"
                    className="btn-primary !text-white"
                  >
                    <PhoneIcon className="h-4 w-4" />
                    Call {business.phone}
                  </TrackedLink>
                )}
                {business.website && (
                  <TrackedLink
                    href={business.website}
                    business={business.slug}
                    action="website"
                    target="_blank"
                    rel="noopener"
                    className="btn-secondary"
                  >
                    <GlobeIcon className="h-4 w-4" />
                    Website
                  </TrackedLink>
                )}
                <TrackedLink
                  href={directionsUrl(business)}
                  business={business.slug}
                  action="directions"
                  target="_blank"
                  rel="noopener"
                  className="btn-secondary"
                >
                  <PinIcon className="h-4 w-4" />
                  Directions
                </TrackedLink>
              </div>
            </div>

            {/* Details card */}
            <aside
              aria-label="Business details"
              className="page-shell-dark min-w-0 flex-[1_1_320px] overflow-hidden rounded-[1.75rem] text-white shadow-[0_30px_60px_-34px_rgba(20,24,38,0.7)]"
            >
              <div className="flex items-center justify-between border-b border-white/[0.14] px-6 py-4">
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-gold-soft">
                  {category.name} · {townCode(business.town)}
                </span>
                <VineIcon className="h-5 w-5 text-gold-soft" />
              </div>
              <dl className="grid gap-4 px-6 pb-6 pt-5 text-[15px]">
                <div>
                  <dt className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/60">Address</dt>
                  <dd className="mt-1 leading-[22px]">
                    {streetLine(business)}
                    <br />
                    {city}, {state} {zip}
                  </dd>
                </div>
                {business.hours && <TodayHours hours={business.hours} />}
                {business.phone && (
                  <div>
                    <dt className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/60">Phone</dt>
                    <dd className="mt-1">
                      <TrackedLink href={telHref(business.phone)} business={business.slug} action="call" className="!text-white">
                        {business.phone}
                      </TrackedLink>
                    </dd>
                  </div>
                )}
                {business.website && (
                  <div>
                    <dt className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/60">Web</dt>
                    <dd className="mt-1">
                      <TrackedLink
                        href={business.website}
                        business={business.slug}
                        action="website"
                        target="_blank"
                        rel="noopener"
                        className="break-all !text-white"
                      >
                        {displayHost(business.website)}
                      </TrackedLink>
                    </dd>
                  </div>
                )}
              </dl>
            </aside>
          </div>
        </div>
      </section>

      {/* ---------- Photos ---------- */}
      {photos.length > 0 && (
        <section className="page-frame pt-10">
          <div className={`grid gap-4 ${photos.length > 1 ? "md:grid-cols-3" : ""}`}>
            <div className={`relative min-h-[320px] overflow-hidden rounded-[1.5rem] bg-navy/[0.08] ${photos.length > 1 ? "md:col-span-2" : ""}`}>
              <Image src={photos[0].src} alt={photos[0].alt} fill priority sizes="(max-width: 768px) 100vw, 760px" className="object-cover" />
            </div>
            {photos.length > 1 && (
              <div className="grid gap-4">
                {photos.slice(1, 3).map((photo) => (
                  <div key={photo.src} className="relative min-h-[152px] overflow-hidden rounded-[1.5rem] bg-navy/[0.08]">
                    <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 768px) 100vw, 380px" className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ---------- Body ---------- */}
      <section className="page-frame flex flex-wrap items-start gap-12 pb-20 pt-12">
        <div className="min-w-0 flex-[999_1_560px]">
          {description.length > 0 ? (
            <>
              <h2 className="text-3xl font-semibold text-ink">About {business.name}</h2>
              {description.map((paragraph) => (
                <p key={paragraph} className="mt-3.5 max-w-[66ch] font-serif text-[19px] leading-8 text-slate-deep">
                  {paragraph}
                </p>
              ))}
            </>
          ) : (
            !featured && (
              <div className="rounded-[1.75rem] border border-dashed border-navy/30 bg-white/70 p-7">
                <p className="font-serif text-2xl font-semibold text-ink">Is this your business?</p>
                <p className="mt-2 max-w-[56ch] leading-7 text-slate">
                  This is a free listing. Claim it to add a description, photos, hours and a Grapevine Perk for readers.
                </p>
                <a href={claimMailto(business.name)} className="btn-primary mt-5 !text-white">
                  Claim this listing
                </a>
              </div>
            )
          )}

          {business.services && business.services.length > 0 && (
            <>
              <h3 className={sectionHeading}>Services</h3>
              <ul className="flex flex-wrap gap-2">
                {business.services.map((service) => (
                  <li key={service} className="rounded-full border border-navy/15 bg-white/80 px-3.5 py-2 text-sm text-ink">
                    {service}
                  </li>
                ))}
              </ul>
            </>
          )}

          {business.perk && (
            <div className="mt-10 flex flex-wrap overflow-hidden rounded-[1.5rem] border-2 border-dashed border-gold bg-white/90">
              <div className="min-w-0 flex-[999_1_320px] px-[26px] py-6">
                <div className="flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-gold-ink"><VineIcon className="h-4 w-4 text-accent" />Grapevine Perk · for readers</div>
                <p className="mt-2 font-serif text-[1.65rem] font-semibold leading-tight text-ink">{business.perk.title}</p>
                {business.perk.details && <p className="mt-2 text-[15px] leading-6 text-slate">{business.perk.details}</p>}
              </div>
              {business.perk.code && (
                <div className="flex flex-[1_1_180px] flex-col justify-center gap-2.5 border-l-2 border-dashed border-gold bg-gold/10 px-[26px] py-6">
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-slate">Code</span>
                  <span className="text-[1.4rem] font-bold tracking-[0.12em] text-ink">{business.perk.code}</span>
                </div>
              )}
            </div>
          )}

          {business.mentions && business.mentions.length > 0 && (
            <>
              <h3 className={sectionHeading}>Heard on the Grapevine</h3>
              <ul className="overflow-hidden rounded-[1.5rem] border border-navy/[0.12] bg-white/80">
                {business.mentions.map((mention) => (
                  <li key={mention.url} className="border-b border-navy/10 last:border-b-0">
                    <Link href={mention.url} className="flex flex-wrap items-baseline gap-x-6 gap-y-2 px-5 py-4">
                      <time dateTime={mention.date} className="text-xs font-bold uppercase tracking-[0.16em] text-gold-ink">
                        {formatShortDate(mention.date)}
                      </time>
                      <span className="font-serif text-lg font-semibold">{mention.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Sidebar */}
        <aside className="flex min-w-0 flex-[1_1_320px] flex-col gap-5">
          {hasHours && business.hours && (
            <div className="rounded-[1.5rem] border border-navy/[0.12] bg-white/85 px-6 py-[22px]">
              <h2 className="mb-3 text-xl font-semibold text-ink">Hours</h2>
              <table className="w-full border-collapse text-sm tabular-nums">
                <tbody>
                  {DAY_ORDER.filter((day) => business.hours?.[day]).map((day) => {
                    const intervals = business.hours?.[day] ?? [];
                    return (
                      <tr key={day} className="border-t border-dashed border-navy/[0.12]">
                        <th scope="row" className="py-2 text-left text-xs font-bold uppercase tracking-[0.12em] text-slate">
                          <abbr title={DAY_LABELS[day].long} className="no-underline">
                            {DAY_LABELS[day].short}
                          </abbr>
                        </th>
                        <td className={`py-2 text-right ${intervals.length ? "text-ink" : "text-slate"}`}>{formatIntervals(intervals)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="overflow-hidden rounded-[1.5rem] border border-navy/[0.12] bg-white/85">
            <iframe
              title={`Map showing ${business.name}`}
              src={mapEmbedUrl(business)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-[200px] w-full border-0"
            />
            {tags.length > 0 && (
              <ul className="grid gap-2.5 px-6 py-[18px] text-sm">
                {tags.map((tag) => (
                  <li key={tag} className="flex gap-2.5">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {TAGS[tag]}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <p className="px-1 text-[13px] leading-5 text-slate">
            {business.verifiedAt && (
              <>
                Checked by the {SITE_CONFIG.name} · {formatMonthYear(business.verifiedAt)}
                <br />
              </>
            )}
            Is this your business?{" "}
            <a href={manage.href} className="font-semibold text-ink">
              {manage.label}
            </a>
          </p>
        </aside>
      </section>

      {/* ---------- Also in this category ---------- */}
      {others.length > 0 && (
        <section className="border-t border-navy/10 bg-white/55">
          <div className="page-frame py-16">
            <div className="mb-[18px] flex flex-wrap items-end justify-between gap-3">
              <h2 className="text-3xl font-semibold text-ink">Also in {category.heading}</h2>
              <Link href={categoryHref(category.slug)} className="font-semibold text-ink">
                See them all <span aria-hidden="true">→</span>
              </Link>
            </div>
            <ul className="overflow-hidden rounded-[1.5rem] border border-navy/[0.12] bg-white/85">
              {others.map((b) => (
                <li key={b.slug} className="border-b border-navy/10 last:border-b-0">
                  <Link href={businessHref(b)} className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 px-6 py-[18px] transition hover:bg-white hover:!no-underline">
                    <span>
                      <span className="block font-serif text-xl font-semibold text-ink group-hover:underline group-hover:decoration-gold group-hover:underline-offset-4">
                        {b.name}
                      </span>
                      <span className="mt-0.5 block text-sm text-slate">
                        {b.town}
                        {b.tier === "featured" ? " · Featured member" : ""}
                        {b.perk ? " · Grapevine Perk" : ""}
                      </span>
                    </span>
                    <span aria-hidden="true" className="text-gold">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
