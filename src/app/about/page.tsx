import { Metadata } from "next";
import Image from "next/image";
import { Footer, Header, SubscribeForm } from "@/components";
import { SITE_CONFIG } from "@/lib/seo/constants";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "About | Your Local Spalding County News Source",
  description:
    "The Griffin Grapevine is a free local newsletter covering Griffin, Orchard Hill, Sunny Side, and the rest of Spalding County, Georgia.",
  path: "/about",
});

const coverage = [
  { title: "Local government", body: "County commission, city council, schools, and zoning." },
  { title: "Things to do", body: "Festivals, markets, library programs, and sports." },
  { title: "Neighbors and businesses", body: "Openings, milestones, and the people behind them." },
];

export default function AboutPage() {
  return (
    <div className="page-shell min-h-screen">
      <Header />

      <main>
        <section className="py-12 sm:py-16">
          <div className="page-frame grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-2xl">
              <p className="eyebrow mb-5">About</p>
              <h1 className="headline-balance text-4xl font-semibold text-ink sm:text-6xl">
                Local news for Spalding County.
              </h1>
              <p className="copy-balance mt-5 text-lg leading-8 text-slate-deep">
                The {SITE_CONFIG.name} is a free newsletter that lands twice a week with the news, events,
                and public meetings that matter in {SITE_CONFIG.phrases.cityList}. Short stories, no paywall.
              </p>
              <p className="mt-4 text-slate">
                We&apos;re part of{" "}
                <a href="https://www.welldiem.com" className="font-semibold text-ink underline decoration-accent underline-offset-4">
                  WellDiem Company
                </a>
                , which publishes local newsletters across Georgia.
              </p>
            </div>

            <div className="media-sweep overflow-hidden rounded-[2rem]">
              <Image
                src={SITE_CONFIG.scenicImage}
                alt={SITE_CONFIG.scenicImageAlt}
                width={1200}
                height={900}
                quality={75}
                className="h-72 w-full object-cover sm:h-96"
              />
            </div>
          </div>
        </section>

        <section className="pb-12 sm:pb-16">
          <div className="page-frame grid gap-4 md:grid-cols-3">
            {coverage.map((item) => (
              <div key={item.title} className="surface-panel rounded-[1.5rem] p-6">
                <h2 className="text-xl font-semibold text-ink">{item.title}</h2>
                <p className="mt-2 text-slate">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="pb-16 sm:pb-20">
          <div className="page-frame">
            <SubscribeForm variant="card" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
