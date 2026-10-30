import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components";
import { VineIcon, VineRule } from "@/components/VineIcon";
import { DirectorySearch, type SearchEntry } from "@/components/directory/DirectorySearch";
import { CheckIcon } from "@/components/directory/icons";
import {
  CATEGORIES,
  CATEGORY_GROUPS,
  DIRECTORY_PATH,
  FREE_LISTING_MAILTO,
  GUIDE_NAME,
  PRICING,
  businessHref,
  capitalize,
  categoriesInGroup,
  categoryHref,
  formatShortDate,
  getCategory,
  getGroup,
  guideEdition,
  recentlyAdded,
  townCode,
} from "@/lib/directory";
import { getGuideBusinesses } from "@/lib/directory/data";
import { guideMetadata } from "@/lib/directory/metadata";
import { generateGuideSchema } from "@/lib/directory/schemas";
import { SITE_CONFIG } from "@/lib/seo/constants";
import { generateBreadcrumbSchema } from "@/lib/seo/schemas";

// Paid listings change through the database; pages also refresh on demand when they do.
export const revalidate = 300;

export const metadata = guideMetadata({
  title: `${GUIDE_NAME} | Griffin & Spalding County, GA Businesses | ${SITE_CONFIG.name}`,
  description:
    "Find local businesses in Griffin and Spalding County, GA: restaurants, home services, health care, farm and garden stores, vets and more, kept current by the Griffin Grapevine.",
  path: DIRECTORY_PATH,
});

const FREE_FEATURES = ["Name, address, phone and hours", "Listed in your category", "Link to your website"];
const FEATURED_FEATURES = [
  "Everything in the free listing",
  "Full profile with photos and description",
  "Top placement in your category",
  "A Grapevine Perk offer for readers",
  "Spotlight in the Grapevine newsletter",
  "Monthly report of views, calls and clicks",
];

function SectionEyebrow({ number, label, inverse = false }: { number: number; label: string; inverse?: boolean }) {
  return (
    <p className={`flex items-center gap-3 text-[0.72rem] font-bold uppercase tracking-[0.24em] ${inverse ? "text-gold-soft" : "text-gold-ink"}`}>
      <span className="tabular-nums">{String(number).padStart(2, "0")}</span>
      <span aria-hidden="true" className={`h-px w-10 ${inverse ? "bg-gold-soft/60" : "bg-gold/60"}`} />
      <span>{label}</span>
    </p>
  );
}

export default async function DirectoryHomePage() {
  const businesses = await getGuideBusinesses();
  const counts = new Map<string, number>();
  for (const b of businesses) counts.set(b.category, (counts.get(b.category) ?? 0) + 1);

  const featured = businesses.filter((b) => b.tier === "featured").slice(0, 3);
  const perks = businesses.filter((b) => b.perk).slice(0, 4);
  const recent = recentlyAdded(businesses, 6);
  const popular = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([slug]) => getCategory(slug))
    .filter((c) => c !== undefined);

  const searchEntries: SearchEntry[] = [
    ...CATEGORIES.map((c) => ({
      label: c.heading,
      href: categoryHref(c.slug),
      meta: `Category · ${getGroup(c.group)?.name ?? ""}`,
      terms: [c.name, c.singular, c.blurb, ...(c.keywords ?? [])].join(" "),
    })),
    ...businesses.map((b) => {
      const category = getCategory(b.category);
      return {
        label: b.name,
        href: businessHref(b),
        meta: `${capitalize(category?.singular ?? "")} · ${b.town}`,
        terms: [category?.name, category?.singular, ...(category?.keywords ?? []), b.town].join(" "),
      };
    }),
  ];

  let section = 1;

  return (
    <main className="flex-1">
      <JsonLd data={generateGuideSchema(CATEGORIES)} />
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Home", url: SITE_CONFIG.url },
          { name: GUIDE_NAME, url: `${SITE_CONFIG.url}${DIRECTORY_PATH}` },
        ])}
      />

      {/* ---------- Masthead ---------- */}
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <Image
            src={SITE_CONFIG.heroImage}
            alt=""
            fill
            priority
            quality={75}
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,24,38,0.78)_0%,rgba(20,24,38,0.7)_55%,rgba(20,24,38,0.88)_100%)]" />
        </div>

        <div className="page-frame relative pb-10 pt-14 text-center sm:pb-12 sm:pt-20">
          <p className="hero-entrance text-[0.74rem] font-bold uppercase tracking-[0.3em] text-gold-soft">The {SITE_CONFIG.name}</p>
          <h1 className="hero-entrance mt-4 font-serif text-[clamp(2.9rem,8vw,6.25rem)] font-semibold leading-[0.95] !text-white">
            <span className="italic text-gold-soft">Local</span> Business Guide
          </h1>
          <VineRule className="mt-6 justify-center" tone="text-gold-soft" />
          <p className="copy-balance mx-auto mt-5 max-w-[640px] font-serif text-[clamp(1.15rem,2.4vw,1.4rem)] italic leading-relaxed text-white/85">
            Every business worth knowing in Spalding County, kept current by the people who write your newsletter.
          </p>

          <DirectorySearch entries={searchEntries} />

          {popular.length > 0 && (
            <p className="mt-5 text-sm text-white/75">
              Popular:{" "}
              {popular.map((c, i) => (
                <span key={c.slug}>
                  {i > 0 && <span aria-hidden="true"> · </span>}
                  <Link href={categoryHref(c.slug)} className="font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-gold-soft">
                    {c.name}
                  </Link>
                </span>
              ))}
            </p>
          )}

          <div className="mx-auto mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-white/15 pt-5 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-white/70">
            <span>{guideEdition()} edition</span>
            <span aria-hidden="true" className="text-gold-soft">•</span>
            <span>{SITE_CONFIG.cities.join(" · ")}</span>
            <span aria-hidden="true" className="text-gold-soft">•</span>
            <span>{businesses.length > 0 ? `${businesses.length} local businesses` : "Now accepting listings"}</span>
          </div>
        </div>
      </section>

      {/* ---------- The index ---------- */}
      <section className="py-16 sm:py-20">
        <div className="page-frame">
          <div className="mb-10 max-w-2xl">
            <SectionEyebrow number={section++} label="The index" />
            <h2 className="mt-3 text-4xl font-semibold text-ink sm:text-[2.6rem]">Browse by category</h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORY_GROUPS.map((group) => (
              <div key={group.slug} className="rounded-[1.5rem] border border-navy/[0.12] bg-white/80 p-6 shadow-[0_18px_50px_-40px_rgba(20,24,38,0.45)]">
                <h3 className="flex items-center gap-2.5 border-b border-navy/10 pb-3 text-[1.3rem] font-semibold text-ink">
                  <VineIcon className="h-4 w-4 shrink-0 text-accent" />
                  {group.name}
                </h3>
                <ul className="mt-1.5">
                  {categoriesInGroup(group.slug).map((category) => {
                    const count = counts.get(category.slug) ?? 0;
                    return (
                      <li key={category.slug}>
                        <Link href={categoryHref(category.slug)} className="group flex items-baseline gap-2 py-2 text-[15px] text-slate-deep hover:!no-underline">
                          <span className="group-hover:text-ink group-hover:underline group-hover:decoration-gold group-hover:underline-offset-4">{category.name}</span>
                          <span aria-hidden="true" className="flex-1 border-b border-dotted border-navy/25" />
                          {count > 0 ? (
                            <span className="text-[13px] font-semibold tabular-nums text-gold-ink">
                              {count}
                              <span className="sr-only"> listings</span>
                            </span>
                          ) : (
                            <span aria-hidden="true" className="text-[13px] text-gold">→</span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Grapevine picks ---------- */}
      {featured.length > 0 && (
        <section className="section-rule pb-16 sm:pb-20">
          <div className="page-frame pt-16 sm:pt-20">
            <SectionEyebrow number={section++} label="Grapevine picks" />
            <h2 className="mb-9 mt-3 text-4xl font-semibold text-ink sm:text-[2.6rem]">Featured members</h2>
            <div className="flex flex-wrap gap-6">
              {featured.map((b, i) => {
                const category = getCategory(b.category);
                const lead = i === 0;
                const photo = b.photos?.[0];
                return (
                  <Link
                    key={b.slug}
                    href={businessHref(b)}
                    className={`hover-lift block min-w-0 overflow-hidden rounded-[1.75rem] border border-navy/[0.12] bg-white/90 hover:!no-underline ${
                      lead ? "flex-[1.4_1_520px]" : "flex-[1_1_340px]"
                    }`}
                  >
                    {lead && (
                      <div className="relative flex aspect-video items-center justify-center bg-[linear-gradient(135deg,#273154,#141826)]">
                        {photo ? (
                          <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 768px) 100vw, 640px" className="object-cover" />
                        ) : (
                          <VineIcon className="h-14 w-14 text-gold-soft" />
                        )}
                      </div>
                    )}
                    <div className={lead ? "px-8 pb-8 pt-7" : "p-7"}>
                      <span className="sponsor-label">Featured member · {capitalize(category?.singular ?? "")}</span>
                      <h3 className={`mt-3 font-semibold leading-tight text-ink ${lead ? "text-[2rem]" : "text-2xl"}`}>{b.name}</h3>
                      {(b.tagline || b.description?.[0]) && (
                        <p className={`mt-2.5 text-slate ${lead ? "text-[17px] leading-7" : "leading-[26px]"}`}>{b.tagline ?? b.description?.[0]}</p>
                      )}
                      <span className="mt-4 inline-block font-semibold text-ink">
                        Read the profile <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ---------- Grapevine perks ---------- */}
      {perks.length > 0 && (
        <section className="page-shell-dark text-white">
          <div className="page-frame py-16 sm:py-20">
            <SectionEyebrow number={section++} label="Grapevine perks" inverse />
            <h2 className="mb-8 mt-3 text-4xl font-semibold !text-white sm:text-[2.6rem]">Deals for Grapevine readers</h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {perks.map((b) => {
                const category = getCategory(b.category);
                return (
                  <li key={b.slug}>
                    <Link
                      href={businessHref(b)}
                      className="block h-full rounded-[1.5rem] border-2 border-dashed border-gold/60 p-6 !text-white transition hover:border-gold-soft hover:bg-white/[0.04] hover:!no-underline"
                    >
                      <span className="block text-[0.68rem] font-bold uppercase tracking-[0.2em] text-gold-soft">
                        {category?.name} · {townCode(b.town)}
                      </span>
                      <span className="mt-2.5 block font-serif text-[1.4rem] font-semibold leading-tight">{b.perk?.title}</span>
                      <span className="mt-2 block text-sm text-white/75">{b.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* ---------- Fresh on the vine ---------- */}
      {recent.length > 0 && (
        <section className="section-rule">
          <div className="page-frame py-16 sm:py-20">
            <SectionEyebrow number={section++} label="Fresh on the vine" />
            <h2 className="mb-7 mt-3 text-4xl font-semibold text-ink sm:text-[2.6rem]">Recently added</h2>
            <ul className="overflow-hidden rounded-[1.75rem] border border-navy/[0.12] bg-white/80">
              {recent.map((b) => {
                const category = getCategory(b.category);
                return (
                  <li key={b.slug} className="border-b border-navy/10 last:border-b-0">
                    <Link
                      href={businessHref(b)}
                      className="group grid gap-1.5 px-6 py-5 transition hover:bg-white hover:!no-underline sm:grid-cols-[9rem_1fr_auto] sm:items-baseline sm:gap-8 sm:px-8"
                    >
                      <time dateTime={b.addedAt} className="text-xs font-bold uppercase tracking-[0.16em] text-gold-ink">
                        {formatShortDate(b.addedAt)}
                      </time>
                      <span>
                        <span className="block font-serif text-[1.3rem] font-semibold text-ink group-hover:underline group-hover:decoration-gold group-hover:underline-offset-4">
                          {b.name}
                        </span>
                        <span className="mt-0.5 block text-[15px] text-slate">
                          {capitalize(category?.singular ?? "")} · {b.town}
                        </span>
                      </span>
                      <span aria-hidden="true" className="hidden text-gold sm:block">→</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* ---------- Pricing ---------- */}
      <section id="get-listed" className="section-rule scroll-mt-24">
        <div className="page-frame py-16 sm:py-24">
          <div className="text-center">
            <p className="eyebrow justify-center">For business owners</p>
            <h2 className="headline-balance mx-auto mt-4 max-w-[20ch] text-4xl font-semibold leading-[1.08] text-ink sm:text-[2.9rem]">
              Get your business in the {GUIDE_NAME}
            </h2>
            <p className="copy-balance mx-auto mt-4 max-w-[580px] text-[17px] leading-7 text-slate">
              Every Spalding County business can have a free listing. Featured members get a full profile, top placement and a spot in the newsletter.
            </p>
          </div>

          <div className="mx-auto mt-12 flex max-w-[940px] flex-wrap gap-6">
            <div className="min-w-0 flex-[1_1_340px] rounded-[1.75rem] border border-navy/[0.12] bg-white/85 p-8 shadow-[var(--shadow-soft)]">
              <h3 className="text-2xl font-semibold text-ink">Free listing</h3>
              <p className="mt-3 font-serif text-5xl font-semibold text-ink">$0</p>
              <p className="mt-1 text-sm text-slate">Always free</p>
              <ul className="mt-6 grid gap-2.5 text-[15px] text-slate-deep">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <CheckIcon className="mt-[3px] h-4 w-4 shrink-0 text-accent" />
                    {f}
                  </li>
                ))}
              </ul>
              <a href={FREE_LISTING_MAILTO} className="btn-secondary mt-8 w-full">
                Claim your free listing
              </a>
            </div>

            <div className="page-shell-dark relative min-w-0 flex-[1_1_340px] rounded-[1.75rem] p-8 text-white shadow-[0_34px_70px_-34px_rgba(20,24,38,0.7)]">
              <span className="absolute -top-3 left-8 rounded-full bg-gold-soft px-3.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-ink-deep">
                Most popular
              </span>
              <h3 className="text-2xl font-semibold !text-white">Featured member</h3>
              <p className="mt-3 flex flex-wrap items-baseline gap-x-2">
                <span className="font-serif text-5xl font-semibold">${PRICING.monthly}</span>
                <span className="text-white/75">a month</span>
              </p>
              <p className="mt-1 text-sm text-gold-soft">
                or ${PRICING.yearly} a year, two months free (save ${PRICING.yearlySavings})
              </p>
              <ul className="mt-6 grid gap-2.5 text-[15px] text-white/90">
                {FEATURED_FEATURES.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <CheckIcon className="mt-[3px] h-4 w-4 shrink-0 text-gold-soft" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/directory/join"
                className="mt-8 flex min-h-12 items-center justify-center rounded-full bg-gold-soft px-6 font-semibold !text-ink-deep transition hover:-translate-y-px hover:bg-[#d0b98a] hover:!no-underline"
              >
                Become a featured member
              </Link>
              <p className="mt-3 text-center text-sm text-white/70">
                Already a member?{" "}
                <Link href="/directory/manage" className="font-medium !text-white underline underline-offset-4">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
