import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd, SubscribeForm } from "@/components";
import { VineRule } from "@/components/VineIcon";
import { CategoryBrowser, type ListingCard } from "@/components/directory/CategoryBrowser";
import {
  CATEGORIES,
  DIRECTORY_PATH,
  FREE_LISTING_MAILTO,
  GUIDE_NAME,
  PRICING,
  businessHref,
  businessesInCategory,
  capitalize,
  categoriesInGroup,
  categoryHref,
  claimMailto,
  formatMonthYear,
  getCategory,
  getGroup,
  isCategoryIndexable,
  lastUpdated,
  recommendMailto,
  streetLine,
  telHref,
} from "@/lib/directory";
import { getGuideBusinesses } from "@/lib/directory/data";
import { guideMetadata } from "@/lib/directory/metadata";
import { generateCategorySchema } from "@/lib/directory/schemas";
import { SITE_CONFIG } from "@/lib/seo/constants";
import { generateBreadcrumbSchema } from "@/lib/seo/schemas";

export const dynamicParams = false;
export const revalidate = 300;

interface Props {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};

  return guideMetadata({
    title: `${category.heading} in Griffin & Spalding County, GA | ${SITE_CONFIG.name}`,
    description: `Find ${category.heading.toLowerCase()} in Griffin and Spalding County, GA: ${category.blurb}. Local listings in Griffin, Orchard Hill and Sunny Side from the ${SITE_CONFIG.name} ${GUIDE_NAME}.`,
    path: categoryHref(category.slug),
    index: isCategoryIndexable(await getGuideBusinesses(), category.slug),
  });
}

function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const group = getGroup(category.group);
  const businesses = businessesInCategory(await getGuideBusinesses(), category.slug);
  const perkCount = businesses.filter((b) => b.perk).length;
  const updated = lastUpdated(businesses);
  const related = categoriesInGroup(category.group).filter((c) => c.slug !== category.slug);
  const headingLower = category.heading.toLowerCase();

  const listings: ListingCard[] = businesses.map((b) => ({
    slug: b.slug,
    name: b.name,
    href: businessHref(b),
    featured: b.tier === "featured",
    town: b.town,
    street: streetLine(b),
    phone: b.phone,
    tel: b.phone ? telHref(b.phone) : undefined,
    summary: b.tagline ?? b.description?.[0],
    perkTitle: b.perk?.title,
    tags: b.tags ?? [],
    photo: b.photos?.[0],
    claimHref: claimMailto(b.name),
  }));

  const byline =
    businesses.length > 0
      ? [
          plural(businesses.length, "listing"),
          perkCount > 0 ? plural(perkCount, "Grapevine Perk") : null,
          updated ? `Updated ${formatMonthYear(updated)}` : null,
          `Kept by the ${SITE_CONFIG.name}`,
        ]
      : ["Now accepting listings", `Kept by the ${SITE_CONFIG.name}`];

  const faqs = [
    ...(category.faqs ?? []),
    {
      question: `How do I get my business listed?`,
      answer: `A basic listing is free: email ${SITE_CONFIG.email} with your business name, address, phone and website. Featured members ($${PRICING.monthly} a month or $${PRICING.yearly} a year) sign up at griffingrapevine.com/directory/join and get a full profile with photos, top placement, a Grapevine Perk for readers and a spotlight in the newsletter.`,
    },
  ];

  return (
    <main className="flex-1">
      <JsonLd data={generateCategorySchema(category, businesses)} />
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Home", url: SITE_CONFIG.url },
          { name: GUIDE_NAME, url: `${SITE_CONFIG.url}${DIRECTORY_PATH}` },
          { name: category.heading, url: `${SITE_CONFIG.url}${categoryHref(category.slug)}` },
        ])}
      />

      {/* ---------- Editorial head ---------- */}
      <section className="page-frame pb-12 pt-8">
        <nav aria-label="Breadcrumb" className="text-[13px] text-slate">
          <Link href={DIRECTORY_PATH}>{GUIDE_NAME}</Link>
          <span aria-hidden="true" className="mx-2 text-gold">›</span>
          <span>{group?.name}</span>
          <span aria-hidden="true" className="mx-2 text-gold">›</span>
          <span aria-current="page">{category.heading}</span>
        </nav>

        <div className="mt-10 max-w-4xl">
          <p className="eyebrow">{group?.name}</p>
          <h1 className="headline-balance mt-4 max-w-[17ch] text-[clamp(2.6rem,6vw,4.5rem)] font-semibold leading-[0.98] text-ink">
            {category.heading} in Spalding County
          </h1>
          <VineRule className="mt-6" />
          <p className="copy-balance mt-5 max-w-[660px] font-serif text-[clamp(1.15rem,2.2vw,1.4rem)] italic leading-relaxed text-slate">
            A guide to {headingLower} serving Griffin, Orchard Hill, Sunny Side and nearby: {category.blurb}.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {byline.filter(Boolean).map((item) => (
              <li key={item} className="rounded-full border border-navy/[0.12] bg-white/70 px-3.5 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-slate-deep">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Listings + sidebar ---------- */}
      <div className="page-frame pb-20">
        <CategoryBrowser
          listings={listings}
          listHeading={`All ${headingLower}, A to Z`}
          emptyState={
            <div className="rounded-[1.75rem] border border-navy/[0.12] bg-white/85 p-8 shadow-[var(--shadow-soft)] sm:p-10">
              <p className="eyebrow">Now accepting listings</p>
              <h2 className="mt-4 text-3xl font-semibold text-ink">No {headingLower} are listed yet.</h2>
              <p className="mt-3 max-w-[56ch] text-[17px] leading-7 text-slate">
                The {GUIDE_NAME} is brand new. If your Spalding County business belongs here, your basic listing is free. Know a great one? Tell us and we’ll reach out.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={FREE_LISTING_MAILTO} className="btn-primary !text-white">
                  List your business free
                </a>
                <a href={recommendMailto(category.heading)} className="btn-secondary">
                  Recommend one
                </a>
              </div>
            </div>
          }
          afterList={
            <div className="mt-14 border-t border-navy/[0.12] pt-8">
              <p className="eyebrow">From the Grapevine</p>
              {category.guide?.length ? (
                <>
                  <h2 className="mt-3 text-[2rem] font-semibold text-ink">How to choose {headingLower} here</h2>
                  {category.guide.map((paragraph) => (
                    <p key={paragraph} className="mt-4 max-w-[68ch] font-serif text-[19px] leading-8 text-slate-deep">
                      {paragraph}
                    </p>
                  ))}
                </>
              ) : (
                <h2 className="mt-3 text-[2rem] font-semibold text-ink">Questions</h2>
              )}
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <h3 className="mb-1.5 mt-6 text-[1.3rem] font-semibold text-ink">{faq.question}</h3>
                  <p className="max-w-[68ch] leading-[27px] text-slate">{faq.answer}</p>
                </div>
              ))}
            </div>
          }
          sidebar={
            <>
              <SubscribeForm variant="card" className="!rounded-[1.5rem] !p-6" />

              <div className="rounded-[1.5rem] border border-dashed border-navy/30 bg-white/50 px-6 py-[22px]">
                <p className="font-serif text-[1.2rem] font-semibold text-ink">Is your business missing?</p>
                <p className="mt-1.5 text-sm leading-[22px] text-slate">
                  Claim your free listing, or become a featured member for ${PRICING.monthly} a month.
                </p>
                <Link href="/directory/join" className="mt-3 inline-block text-[15px] font-semibold text-ink">
                  Become a featured member <span aria-hidden="true">→</span>
                </Link>
                <Link href={`${DIRECTORY_PATH}#get-listed`} className="mt-1 block text-sm text-slate">
                  Compare free and featured
                </Link>
              </div>

              {related.length > 0 && (
                <nav aria-label="Related categories" className="px-1">
                  <p className="mb-2 text-[0.72rem] font-bold uppercase tracking-[0.2em] text-gold-ink">Related</p>
                  <ul className="grid gap-1.5 text-[15px] text-slate-deep">
                    {related.map((c) => (
                      <li key={c.slug}>
                        <Link href={categoryHref(c.slug)}>{capitalize(c.name)}</Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </>
          }
        />
      </div>
    </main>
  );
}
