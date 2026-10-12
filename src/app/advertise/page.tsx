import { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "@/components";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Advertise | Reach Spalding County Residents",
  description:
    "Sponsor the Griffin Grapevine and reach Spalding County residents in Griffin, Orchard Hill, and Sunny Side twice a week.",
  path: "/advertise",
});

const reasons = [
  { title: "Local readers only", body: "Every subscriber signed up for Spalding County news." },
  { title: "Real attention", body: "People open the newsletter to read it, not scroll past it." },
  { title: "Trusted company", body: "Your business appears next to news your neighbors rely on." },
];

const formats = [
  { title: "Newsletter sponsor", body: "Your logo, a short description, and a link inside an issue." },
  { title: "Website placement", body: "Visibility on the site for readers browsing issues and events." },
];

export default function AdvertisePage() {
  return (
    <div className="page-shell min-h-screen">
      <Header />

      <main>
        <section className="py-12 sm:py-16">
          <div className="page-frame">
            <div className="max-w-3xl">
              <p className="eyebrow mb-5">Advertise</p>
              <h1 className="headline-balance text-4xl font-semibold text-ink sm:text-6xl">
                Reach your neighbors in Spalding County.
              </h1>
              <p className="copy-balance mt-5 text-lg text-slate-deep">
                A good fit for restaurants, shops, home services, healthcare, real estate, and local events.
              </p>
            </div>
          </div>
        </section>

        <section className="pb-12 sm:pb-16">
          <div className="page-frame grid gap-4 md:grid-cols-3">
            {reasons.map((item) => (
              <div key={item.title} className="surface-panel rounded-[1.5rem] p-6">
                <h2 className="text-xl font-semibold text-ink">{item.title}</h2>
                <p className="mt-2 text-slate">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="pb-16 sm:pb-20">
          <div className="page-frame grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="surface-tint rounded-[1.75rem] p-6 sm:p-8">
              <p className="eyebrow mb-5">Options</p>
              <div className="space-y-5">
                {formats.map((item) => (
                  <div key={item.title}>
                    <h3 className="text-xl font-semibold text-ink">{item.title}</h3>
                    <p className="mt-1 text-slate">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-[1.75rem] bg-[linear-gradient(135deg,#201e36_0%,#1d2440_46%,#705a35_140%)] p-6 text-white shadow-[0_26px_80px_rgb(20_24_38_/_0.16)] sm:p-8">
              <h2 className="headline-balance text-3xl font-semibold text-white">
                Let&apos;s put together a package.
              </h2>
              <p className="mt-3 text-white/75">Tell us about your business and timing.</p>
              <Link href="/contact" className="btn-secondary mt-6 self-start border-white/18 bg-white/10 text-white hover:bg-white/16">
                Contact us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
