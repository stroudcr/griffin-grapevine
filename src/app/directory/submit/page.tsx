import Link from "next/link";
import { notFound } from "next/navigation";
import { VineRule } from "@/components/VineIcon";
import { CATEGORY_GROUPS, DIRECTORY_PATH, GUIDE_NAME, JOIN_PATH, PRICING, categoriesInGroup, perDayLabel } from "@/lib/directory";
import { getGuideBusinesses } from "@/lib/directory/data";
import { DAY_ORDER } from "@/lib/directory/format";
import { guideMetadata } from "@/lib/directory/metadata";
import { SITE_CONFIG } from "@/lib/seo/constants";
import { FreeListingForm } from "./FreeListingForm";

export const dynamic = "force-dynamic";

export const metadata = guideMetadata({
  title: `Submit a Free Business Listing | ${GUIDE_NAME} | ${SITE_CONFIG.name}`,
  description: `Add your Spalding County business to the ${SITE_CONFIG.name} ${GUIDE_NAME}. Free listings are reviewed before they're published.`,
  path: "/directory/submit",
});

interface Props {
  searchParams: Promise<{ claim?: string; category?: string }>;
}

export default async function SubmitPage({ searchParams }: Props) {
  const { claim, category } = await searchParams;
  const business = claim ? (await getGuideBusinesses()).find((b) => b.slug === claim && b.tier === "free") : undefined;
  if (claim && !business) notFound();

  // Claims start from the listing's current details; new submissions can arrive with a category picked.
  const defaults: Record<string, string> = business
    ? {
        name: business.name,
        category: business.category,
        city: business.town,
        street: business.address.street,
        suite: business.address.suite ?? "",
        zip: business.address.zip,
        phone: business.phone ?? "",
        website: business.website ?? "",
      }
    : { category: category ?? "" };
  for (const day of DAY_ORDER) {
    const intervals = business?.hours?.[day];
    defaults[`hours.${day}.mode`] = intervals === undefined ? "" : intervals.length ? "open" : "closed";
    defaults[`hours.${day}.opens`] = intervals?.[0]?.opens ?? "09:00";
    defaults[`hours.${day}.closes`] = intervals?.[0]?.closes ?? "17:00";
  }

  const categoryGroups = CATEGORY_GROUPS.map((group) => ({
    name: group.name,
    options: categoriesInGroup(group.slug).map((c) => ({ value: c.slug, label: c.heading })),
  }));

  return (
    <main className="flex-1">
      <section className="page-frame-narrow pb-6 pt-8">
        <nav aria-label="Breadcrumb" className="text-[13px] text-slate">
          <Link href={DIRECTORY_PATH}>{GUIDE_NAME}</Link>
          <span aria-hidden="true" className="mx-2 text-gold">›</span>
          <span aria-current="page">{business ? "Claim a listing" : "Free listing"}</span>
        </nav>
        <div className="mt-10">
          <p className="eyebrow">For business owners · Always free</p>
          <h1 className="headline-balance mt-4 max-w-[18ch] text-[clamp(2.4rem,5.5vw,4rem)] font-semibold leading-[1.02] text-ink">
            {business ? "Claim your listing" : "Get your business listed"}
          </h1>
          <VineRule className="mt-6" />
          <p className="copy-balance mt-5 max-w-[640px] font-serif text-[clamp(1.15rem,2.2vw,1.35rem)] italic leading-relaxed text-slate">
            {business
              ? `Check the details for ${business.name} and tell us who you are.`
              : "Help your Spalding County neighbors find you. Add your business details below."}{" "}
            We&apos;ll review your submission before it appears in the guide.
          </p>
          <p className="mt-4 max-w-[640px] text-[15px] leading-6 text-slate">
            Want photos, a full description and top placement in your category?{" "}
            <Link href={`${JOIN_PATH}?plan=yearly`} className="font-semibold text-ink">
              Become a featured member
            </Link>{" "}
            for {perDayLabel(PRICING.yearly)}.
          </p>
        </div>
      </section>

      <div className="page-frame-narrow pb-20 pt-6">
        <div className="rounded-[1.75rem] border border-navy/[0.12] bg-white/85 p-6 shadow-[var(--shadow-soft)] sm:p-9">
          <FreeListingForm
            claim={business?.slug ?? ""}
            defaults={defaults}
            categoryGroups={categoryGroups}
            pricing={{ monthly: PRICING.monthly, yearly: PRICING.yearly, perDay: perDayLabel(PRICING.yearly) }}
          />
        </div>
        <p className="mt-4 px-2 text-sm leading-6 text-slate">
          Already a featured member?{" "}
          <Link href="/directory/manage" className="font-semibold text-ink">
            Sign in
          </Link>{" "}
          to edit your listing.
        </p>
      </div>
    </main>
  );
}
