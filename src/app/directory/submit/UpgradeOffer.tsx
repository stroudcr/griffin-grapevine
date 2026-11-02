import Link from "next/link";
import { VineIcon } from "@/components/VineIcon";
import { CheckIcon, PhoneIcon } from "@/components/directory/icons";

/** What the owner just submitted, used to show their own business as a featured listing. */
export interface UpgradePreview {
  name: string;
  categoryHeading: string;
  city: string;
  street: string;
  phone?: string;
  /** Featured signup link, pre-filled with these details. */
  href: string;
}

export interface UpgradePricing {
  monthly: number;
  yearly: number;
  /** e.g. "about 52¢ a day" */
  perDay: string;
}

/**
 * Offered after a free listing is submitted: the small step is done, so this
 * is a clearly optional next step, shown with the owner's own business.
 */
export function UpgradeOffer({ preview, pricing }: { preview: UpgradePreview; pricing: UpgradePricing }) {
  const category = preview.categoryHeading.toLowerCase();
  const perks = [
    `Listed first in ${category}, above free listings`,
    "Photos and a full description",
    "A Grapevine Perk offer for readers",
    "Monthly report of views, calls and clicks",
    "Edit your listing yourself, anytime",
  ];

  return (
    <section aria-labelledby="upgrade-heading" className="mt-10 border-t border-navy/[0.12] pt-8">
      <p className="eyebrow">Optional upgrade</p>
      <h3 id="upgrade-heading" className="headline-balance mt-3 text-[1.9rem] font-semibold leading-tight text-ink sm:text-[2.2rem]">
        Want {preview.name} to stand out?
      </h3>
      <p className="mt-2 max-w-[58ch] leading-7 text-slate">
        Here&apos;s how your business would look on the guide&apos;s {category} page, free and featured.
      </p>

      <div className="mt-6 grid items-start gap-5 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <figure>
          <figcaption className="mb-2 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-slate">Your free listing</figcaption>
          <div className="rounded-[1.5rem] border border-navy/[0.12] bg-white/80 px-5 py-[18px]">
            <p className="font-serif text-xl font-semibold text-ink">{preview.name}</p>
            <p className="mt-0.5 text-sm text-slate">
              {preview.city} · {preview.street}
              {preview.phone ? ` · ${preview.phone}` : ""}
            </p>
          </div>
        </figure>

        <figure>
          <figcaption className="mb-2 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-gold-ink">As a featured member</figcaption>
          <div className="overflow-hidden rounded-[1.75rem] border border-navy/[0.12] bg-white shadow-[var(--shadow-lifted)]">
            <div className="flex h-28 items-center justify-center gap-2.5 bg-[linear-gradient(135deg,#273154,#141826)] text-sm text-white/70">
              <VineIcon className="h-7 w-7 text-gold-soft" />
              Your photos here
            </div>
            <div className="px-6 py-5">
              <span className="sponsor-label">Featured member</span>
              <p className="mt-2.5 font-serif text-[1.45rem] font-semibold leading-tight text-ink">{preview.name}</p>
              <p className="mt-1 text-sm text-slate">
                {preview.city} · {preview.street}
              </p>
              <p className="mt-2.5 text-[15px] italic leading-6 text-slate">
                Your description: tell neighbors what makes {preview.name} worth a visit.
              </p>
              <p className="mt-3">
                <span className="rounded-full border border-dashed border-gold px-3 py-1 text-xs font-medium text-ink">Grapevine Perk: your offer for readers</span>
              </p>
              {preview.phone && (
                <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white">
                  <PhoneIcon className="h-4 w-4" />
                  Call {preview.phone}
                </p>
              )}
            </div>
          </div>
        </figure>
      </div>

      <div className="page-shell-dark mt-7 rounded-[1.75rem] p-6 text-white shadow-[0_30px_60px_-32px_rgba(20,24,38,0.7)] sm:p-8">
        <p className="font-serif text-[2rem] font-semibold leading-tight !text-white">
          {pricing.perDay.charAt(0).toUpperCase() + pricing.perDay.slice(1)}
        </p>
        <p className="mt-1 text-[15px] text-gold-soft">
          ${pricing.yearly} a year, or ${pricing.monthly} a month and cancel anytime.
        </p>
        <ul className="mt-5 grid gap-2.5 text-[15px] text-white/90 sm:grid-cols-2">
          {perks.map((perk) => (
            <li key={perk} className="flex gap-2.5">
              <CheckIcon className="mt-[3px] h-4 w-4 shrink-0 text-gold-soft" />
              {perk}
            </li>
          ))}
        </ul>
        <Link
          href={preview.href}
          className="mt-6 flex min-h-12 items-center justify-center rounded-full bg-gold-soft px-6 font-semibold !text-ink-deep transition hover:-translate-y-px hover:bg-[#d0b98a] hover:!no-underline sm:inline-flex sm:px-8"
        >
          Upgrade to featured
        </Link>
        <p className="mt-3 text-sm leading-6 text-white/75">
          Your business details carry over, so you&apos;ll just add your email and choose a plan. If you upgrade, your featured listing takes the place of the free one.
        </p>
      </div>

      <p className="mt-5 text-[15px] text-slate">
        Happy with free? You&apos;re all set.{" "}
        <Link href="/directory" className="font-semibold text-ink">
          Back to the guide
        </Link>
      </p>
    </section>
  );
}
