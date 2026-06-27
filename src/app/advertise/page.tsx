import { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "@/components";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Advertise | Reach Spalding County Residents",
  description:
    "Advertise to engaged Spalding County residents. Sponsorship opportunities in our Griffin, Orchard Hill, and Sunny Side newsletter reaching local readers weekly.",
  path: "/advertise",
});

export default function AdvertisePage() {
  return (
    <div className="page-shell min-h-screen">
      <Header />

      <main>
        <section className="section-rule py-14 sm:py-18">
          <div className="page-frame pt-14">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.42fr)] lg:items-end">
              <div className="max-w-3xl">
                <p className="eyebrow mb-5">Advertise</p>
                <h1 className="headline-balance text-5xl font-semibold text-ink sm:text-6xl">
                  Reach readers who already care about this community.
                </h1>
                <p className="copy-balance mt-5 text-lg text-slate sm:text-xl">
                  Sponsorship in the Griffin Grapevine places your business inside a trusted weekly local read, not next to generic social scroll.
                </p>
              </div>

              <div className="surface-panel rounded-[2rem] p-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-ink-soft">
                  Best fit
                </p>
                <div className="space-y-3 text-sm leading-7 text-slate">
                  <p>Restaurants, retail, and neighborhood services</p>
                  <p>Healthcare, real estate, and professional practices</p>
                  <p>Events, nonprofits, and organizations serving county residents</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-6 sm:py-8">
          <div className="page-frame grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="surface-panel rounded-[2.25rem] p-7 sm:p-10">
              <div className="prose prose-lg prose-slate">
                <h2>Why sponsor the Griffin Grapevine?</h2>
                <p>
                  The Griffin Grapevine reaches engaged Spalding County residents who actively want neighborhood reporting in their inbox. That creates a stronger context for sponsors than broad social reach alone.
                </p>

                <h2>Sponsorship benefits</h2>
                <ul>
                  <li><strong>Targeted reach:</strong> your message goes directly to Spalding County residents and households.</li>
                  <li><strong>High attention:</strong> newsletter readers arrive with intent and spend time with the edition.</li>
                  <li><strong>Community credibility:</strong> appearing alongside trusted reporting supports positive brand recognition.</li>
                  <li><strong>Flexible placement:</strong> newsletter and website sponsorship formats can support different goals.</li>
                </ul>

                <h2>Sponsorship options</h2>
                <h3>Newsletter sponsorship</h3>
                <p>
                  Feature your business inside the weekly edition with a dedicated sponsor presentation, short description, and clear call to action.
                </p>

                <h3>Website placement</h3>
                <p>
                  Extend that visibility across the site for readers browsing current and archived issues.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="surface-tint rounded-[2rem] p-6 sm:p-8">
                <p className="eyebrow mb-4">Ideal sponsors</p>
                <div className="space-y-3 text-slate">
                  <p>Local restaurants and retail businesses</p>
                  <p>Home services, healthcare providers, and dental practices</p>
                  <p>Real estate, mortgage, and financial services</p>
                  <p>Community events, nonprofits, and family-focused organizations</p>
                </div>
              </div>

              <div className="rounded-[2rem] border border-[rgb(29_36_64_/_0.12)] bg-[linear-gradient(135deg,#201e36_0%,#1d2440_46%,#705a35_140%)] p-7 text-white shadow-[0_26px_80px_rgb(20_24_38_/_0.16)] sm:p-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
                  Ready to talk
                </p>
                <h2 className="headline-balance text-3xl font-semibold text-white">
                  Build a local sponsorship package that fits your audience.
                </h2>
                <p className="mt-4 text-white/74">
                  Reach out and we&apos;ll help shape an advertising plan around your goals, timing, and audience.
                </p>
                <div className="mt-6">
                  <Link href="/contact" className="btn-secondary border-white/18 bg-white/10 text-white hover:bg-white/16">
                    Contact us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
