import { Metadata } from "next";
import { Footer, Header } from "@/components";
import { SITE_CONFIG } from "@/lib/seo/constants";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact | Spalding County News Tips & Inquiries",
  description:
    "Contact the Griffin Grapevine with news tips, feedback, or advertising inquiries. We cover Spalding County GA including Griffin, Orchard Hill, and Sunny Side.",
  path: "/contact",
});

function SocialLink({
  href,
  label,
  path,
}: {
  href: string;
  label: string;
  path: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[rgb(29_36_64_/_0.12)] bg-white/75 text-ink transition-colors hover:bg-white"
    >
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d={path} />
      </svg>
    </a>
  );
}

export default function ContactPage() {
  return (
    <div className="page-shell min-h-screen">
      <Header />

      <main>
        <section className="section-rule py-14 sm:py-18">
          <div className="page-frame pt-14">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.42fr)] lg:items-end">
              <div className="max-w-3xl">
                <p className="eyebrow mb-5">Contact</p>
                <h1 className="headline-balance text-5xl font-semibold text-ink sm:text-6xl">
                  Send a tip, ask a question, or start a sponsorship conversation.
                </h1>
                <p className="copy-balance mt-5 text-lg text-slate sm:text-xl">
                  The Griffin Grapevine is built around local reporting and useful community conversation. We&apos;d love to hear from you.
                </p>
              </div>

              <div className="surface-panel rounded-[2rem] p-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-ink-soft">
                  Primary inbox
                </p>
                <a href={`mailto:${SITE_CONFIG.email}`} className="text-lg font-semibold text-ink hover:underline">
                  {SITE_CONFIG.email}
                </a>
                <p className="mt-3 text-sm leading-7 text-slate">
                  Use this address for story tips, feedback, and partnership inquiries.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-6 pb-16 sm:pb-20">
          <div className="page-frame grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="surface-panel rounded-[2.25rem] p-7 sm:p-10">
              <div className="space-y-8">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-ink-soft">
                    News tips
                  </p>
                  <h2 className="text-3xl font-semibold text-ink">Have a story idea?</h2>
                  <p className="mt-3 max-w-2xl text-slate">
                    If there&apos;s a local development, community issue, or person worth knowing about, send it our way. Hyperlocal leads are exactly what this publication is for.
                  </p>
                </div>

                <div className="rounded-[1.75rem] border border-[rgb(29_36_64_/_0.1)] bg-[rgb(255_255_255_/_0.62)] p-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-ink-soft">
                    Advertising
                  </p>
                  <p className="text-slate">
                    Interested in reaching Spalding County readers through the weekly edition or website placements? Send a note and we&apos;ll follow up with options.
                  </p>
                </div>

                <div className="rounded-[1.75rem] border border-[rgb(29_36_64_/_0.1)] bg-[rgb(255_255_255_/_0.62)] p-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-ink-soft">
                    General feedback
                  </p>
                  <p className="text-slate">
                    Questions, corrections, and thoughtful feedback are always welcome. We care about clarity and local trust.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="surface-tint rounded-[2rem] p-6 sm:p-8">
                <p className="eyebrow mb-4">Email</p>
                <a href={`mailto:${SITE_CONFIG.email}`} className="text-2xl font-semibold text-ink hover:underline">
                  {SITE_CONFIG.email}
                </a>
                <p className="mt-4 text-slate">
                  We monitor the inbox for reader questions, news tips, and community updates.
                </p>
              </div>

              <div className="surface-panel rounded-[2rem] p-6 sm:p-8">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-ink-soft">
                  Follow along
                </p>
                <div className="flex items-center gap-3">
                  {SITE_CONFIG.social.facebook && (
                    <SocialLink
                      href={SITE_CONFIG.social.facebook}
                      label="Facebook"
                      path="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.49 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    />
                  )}
                  {SITE_CONFIG.social.instagram && (
                    <SocialLink
                      href={SITE_CONFIG.social.instagram}
                      label="Instagram"
                      path="M12 2.163c3.205 0 3.585.013 4.85.07 3.252.15 4.771 1.692 4.92 4.92.057 1.265.069 1.644.069 4.848 0 3.206-.012 3.585-.07 4.85-.148 3.227-1.664 4.77-4.919 4.919-1.266.058-1.645.069-4.85.069-3.204 0-3.583-.011-4.848-.07-3.26-.148-4.772-1.698-4.92-4.919-.057-1.265-.069-1.644-.069-4.849 0-3.204.012-3.583.07-4.849.148-3.227 1.664-4.77 4.919-4.919C8.417 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 2.694.272.273 2.69.072 7.052.014 8.332 0 8.741 0 12c0 3.258.014 3.668.072 4.948.2 4.357 2.618 6.78 6.98 6.979 1.28.059 1.689.073 4.948.073 3.258 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.668-.072-4.948-.196-4.354-2.617-6.78-6.98-6.979C15.668.014 15.258 0 12 0zm0 5.838A6.162 6.162 0 1 0 12 18a6.162 6.162 0 0 0 0-12.162zm0 10.161A3.999 3.999 0 1 1 12 8a3.999 3.999 0 0 1 0 7.999zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"
                    />
                  )}
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
