import Link from "next/link";
import { CheckIcon } from "@/components/directory/icons";
import { FREE_LISTING_MAILTO, GUIDE_NAME, PRICING } from "@/lib/directory";

const FREE_FEATURES = ["Name, address, phone and hours", "Listed in your category", "Link to your website"];
const FEATURED_FEATURES = [
  "Everything in the free listing",
  "Full profile with photos and description",
  "Top placement in your category",
  "A Grapevine Perk offer for readers",
  "Spotlight in the Grapevine newsletter",
  "Monthly report of views, calls and clicks",
];

/**
 * "Get your business in the Local Business Guide": the free vs featured pricing block.
 * Closes the guide home and every category page; links elsewhere point at its #get-listed anchor.
 */
export function GetListed() {
  return (
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
  );
}
