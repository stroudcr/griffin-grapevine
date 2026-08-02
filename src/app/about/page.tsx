import { Metadata } from "next";
import Image from "next/image";
import { Footer, Header, SubscribeForm } from "@/components";
import { SITE_CONFIG } from "@/lib/seo/constants";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "About | Your Local Spalding County News Source",
  description:
    "Learn about the Griffin Grapevine, Spalding County Georgia's trusted hyperlocal newsletter covering Griffin, Orchard Hill, Sunny Side, and surrounding communities.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="page-shell min-h-screen">
      <Header />

      <main>
        <section className="section-rule py-14 sm:py-18">
          <div className="page-frame pt-14">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.42fr)] lg:items-end">
              <div className="max-w-3xl">
                <p className="eyebrow mb-5">About the Griffin Grapevine</p>
                <h1 className="headline-balance text-5xl font-semibold text-ink sm:text-6xl">
                  Local news with more attention, less noise.
                </h1>
                <p className="copy-balance mt-5 text-lg text-slate sm:text-xl">
                  We started the Griffin Grapevine to make local reporting feel useful again: civic coverage, community stories, business openings, and events delivered with a clear sense of place.
                </p>
              </div>

              <div className="surface-panel rounded-[2rem] p-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-ink-soft">
                  Coverage focus
                </p>
                <div className="space-y-3 text-sm leading-7 text-slate">
                  <p>County and city decisions that shape daily life</p>
                  <p>Openings, closings, and local business movement</p>
                  <p>Schools, sports, events, and standout neighbors</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-6 sm:py-8">
          <div className="page-frame grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="media-sweep overflow-hidden rounded-[2.25rem]">
              <Image
                src={SITE_CONFIG.scenicImage}
                alt={SITE_CONFIG.scenicImageAlt}
                width={1200}
                height={1400}
                loading="eager"
                quality={75}
                className="h-full min-h-[24rem] w-full object-cover"
              />
            </div>

            <div className="surface-panel rounded-[2.25rem] p-7 sm:p-10">
              <div className="prose prose-lg prose-slate">
                <h2>Our mission</h2>
                <p>
                  The Griffin Grapevine exists to keep Spalding County residents informed about what matters most in their community. From local government decisions that affect daily life to small business openings, community events, and high school sports, we cover the stories that bring neighbors together.
                </p>
                <p>
                  Griffin Grapevine is part of <a href="https://www.welldiem.com">WellDiem Company</a>, a network of locally focused publications serving communities across Georgia.
                </p>

                <h2>Why we started</h2>
                <p>
                  National headlines travel fast. Useful local reporting often does not. We believe Spalding County deserves a publication that feels trustworthy, current, and grounded in the rhythms of community life.
                </p>

                <h2>What we cover</h2>
                <ul>
                  <li><strong>Local government:</strong> county commission meetings, city council decisions, zoning changes, and public policy that affects the community.</li>
                  <li><strong>Community events:</strong> festivals, fundraisers, concerts, and gatherings that bring Spalding County together.</li>
                  <li><strong>Business news:</strong> new openings, closings, and the entrepreneurs building businesses in our community.</li>
                  <li><strong>Schools and sports:</strong> updates from Spalding County schools, including high school athletics and academic achievements.</li>
                  <li><strong>People and places:</strong> the neighbors, landmarks, and institutions that make Spalding County unique.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-16 pt-10 sm:pb-20">
          <div className="page-frame">
            <SubscribeForm variant="card" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
