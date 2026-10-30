import Link from "next/link";
import { VineRule } from "@/components/VineIcon";
import { CheckIcon } from "@/components/directory/icons";
import { CATEGORY_GROUPS, DIRECTORY_PATH, GUIDE_NAME, PRICING, categoriesInGroup } from "@/lib/directory";
import { guideMetadata } from "@/lib/directory/metadata";
import { SITE_CONFIG } from "@/lib/seo/constants";
import { JoinForm } from "./JoinForm";

export const metadata = guideMetadata({
  title: `Become a Featured Member | ${GUIDE_NAME} | ${SITE_CONFIG.name}`,
  description: `Put your Spalding County business in front of Griffin Grapevine readers: a full profile with photos, top placement in your category and a newsletter spotlight, for $${PRICING.monthly} a month or $${PRICING.yearly} a year.`,
  path: "/directory/join",
});

const INCLUDED = [
  "A full profile with photos, hours and a description",
  "Top placement in your category",
  "A Grapevine Perk offer shown to readers",
  "A spotlight in the Grapevine newsletter",
  "A monthly report of views, calls and clicks",
  "Edit your listing yourself, anytime",
];

interface Props {
  searchParams: Promise<{ plan?: string; canceled?: string }>;
}

export default async function JoinPage({ searchParams }: Props) {
  const { plan, canceled } = await searchParams;
  const categoryGroups = CATEGORY_GROUPS.map((group) => ({
    name: group.name,
    options: categoriesInGroup(group.slug).map((c) => ({ value: c.slug, label: c.heading })),
  }));

  return (
    <main className="flex-1">
      <section className="page-frame pb-6 pt-8">
        <nav aria-label="Breadcrumb" className="text-[13px] text-slate">
          <Link href={DIRECTORY_PATH}>{GUIDE_NAME}</Link>
          <span aria-hidden="true" className="mx-2 text-gold">›</span>
          <span aria-current="page">Become a featured member</span>
        </nav>
        <div className="mt-10 max-w-3xl">
          <p className="eyebrow">For business owners</p>
          <h1 className="headline-balance mt-4 max-w-[18ch] text-[clamp(2.4rem,5.5vw,4rem)] font-semibold leading-[1.02] text-ink">
            Become a featured member
          </h1>
          <VineRule className="mt-6" />
          <p className="copy-balance mt-5 max-w-[640px] font-serif text-[clamp(1.15rem,2.2vw,1.35rem)] italic leading-relaxed text-slate">
            Put your business in front of the Spalding County neighbors who read the Grapevine twice a week.
          </p>
        </div>
      </section>

      <div className="page-frame flex flex-wrap items-start gap-10 pb-20 pt-6 lg:gap-12">
        <div className="min-w-0 flex-[999_1_560px] rounded-[1.75rem] border border-navy/[0.12] bg-white/85 p-6 shadow-[var(--shadow-soft)] sm:p-9">
          {canceled && (
            <p className="mb-6 rounded-2xl border border-navy/15 bg-paper px-4 py-3 text-[15px] text-slate-deep">
              Checkout was canceled and you weren&apos;t charged. Your details are below if you&apos;d like to try again.
            </p>
          )}
          <JoinForm
            categoryGroups={categoryGroups}
            towns={[...SITE_CONFIG.cities]}
            defaultPlan={plan === "yearly" ? "yearly" : "monthly"}
            pricing={{ monthly: PRICING.monthly, yearly: PRICING.yearly, savings: PRICING.yearlySavings }}
          />
        </div>

        <aside className="min-w-0 flex-[1_1_300px] max-lg:order-first lg:sticky lg:top-28">
          <div className="page-shell-dark rounded-[1.75rem] p-7 text-white shadow-[0_30px_60px_-32px_rgba(20,24,38,0.7)]">
            <h2 className="text-2xl font-semibold !text-white">Featured member</h2>
            <p className="mt-2 flex flex-wrap items-baseline gap-x-2">
              <span className="font-serif text-4xl font-semibold">${PRICING.monthly}</span>
              <span className="text-white/75">a month</span>
            </p>
            <p className="text-sm text-gold-soft">
              or ${PRICING.yearly} a year, two months free (save ${PRICING.yearlySavings})
            </p>
            <ul className="mt-5 grid gap-2.5 text-[15px] text-white/90">
              {INCLUDED.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <CheckIcon className="mt-[3px] h-4 w-4 shrink-0 text-gold-soft" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 px-2 text-sm leading-6 text-slate">
            Just want a basic listing? It&apos;s free:{" "}
            <Link href={`${DIRECTORY_PATH}#get-listed`} className="font-semibold text-ink">
              see the free option
            </Link>
            . Already a member?{" "}
            <Link href="/directory/manage" className="font-semibold text-ink">
              Sign in
            </Link>
            .
          </p>
        </aside>
      </div>
    </main>
  );
}
