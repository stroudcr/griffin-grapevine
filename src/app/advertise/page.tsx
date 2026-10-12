import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import { Footer, Header } from "@/components";
import { SITE_CONFIG } from "@/lib/seo/constants";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import styles from "./advertise.module.css";

export const metadata: Metadata = buildPageMetadata({
  title: "Advertise | Reach Spalding County Residents",
  description:
    "Put your business in front of Spalding County locals. Explore Griffin Grapevine advertising: Local Business Spotlight $360/month, Presenting Partner $500/month, Section Partner $200/month, and Sponsored Event Feature $50.",
  path: "/advertise",
});

function Arrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={styles.arrow}>
      <path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InquiryLink({ children, subject, light = false }: { children: ReactNode; subject: string; light?: boolean }) {
  return (
    <a
      href={`mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent(`Griffin Grapevine: ${subject}`)}`}
      className={`${styles.button} ${light ? styles.buttonGold : ""}`}
    >
      {children}<Arrow />
    </a>
  );
}

function Price({ amount, oneTime = false }: { amount: number; oneTime?: boolean }) {
  return (
    <p className={styles.price}>
      <span>${amount}</span>
      <span className={styles.pricePeriod}>{oneTime ? "one-time" : "/month"}</span>
    </p>
  );
}

function Includes({ items, columns = false }: { items: string[]; columns?: boolean }) {
  return (
    <div className={styles.includes}>
      <h4 className={styles.includesHeading}>Includes</h4>
      <ul className={`${styles.featureList} ${columns ? styles.featureColumns : ""}`}>
        {items.map((item) => (
          <li key={item}>
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
              <path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AdvertisePage() {
  return (
    <div className={`${styles.page} min-h-screen`}>
      <Header />
      <main>
        <section className={styles.hero} aria-labelledby="advertise-heading">
          <div className={`page-frame ${styles.heroGrid}`}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>Advertise with Griffin Grapevine</p>
              <h1 id="advertise-heading">Reach readers who already care about this community.</h1>
              <p className={styles.heroLead}>Put your business in front of Spalding County locals.</p>
              <p>Griffin Grapevine is a twice-weekly local publication built specifically for people who live, work, shop, eat, own homes, raise families, and make decisions right here in Griffin, Orchard Hill, Sunny Side, and across Spalding County.</p>
              <p>Instead of competing for attention in a crowded social media feed, your business shows up directly alongside the local information our readers already make time to read.</p>
              <div className={styles.heroActions}>
                <a href="#advertising-options" className={styles.button}>Explore advertising options <Arrow /></a>
                <a href="#lets-talk" className={styles.textLink}>Let&apos;s talk <Arrow /></a>
              </div>
            </div>
            <figure className={styles.heroFigure}>
              <div className={styles.heroImage}>
                <Image
                  src="/DowntownGriffin.webp"
                  alt="Aerial view of downtown Griffin, Georgia"
                  fill
                  sizes="(max-width: 760px) calc(100vw - 2rem), (max-width: 1200px) 38vw, 440px"
                  className={`${styles.photo} ${styles.photoCentered}`}
                  priority
                />
              </div>
              <figcaption>Rooted in Spalding County. Read by your neighbors.</figcaption>
            </figure>
          </div>
          <div className={`page-frame ${styles.readerStrip}`}>
            <div>
              <h2>Local readers</h2>
              <p>Your message goes directly to Spalding County residents and households.</p>
            </div>
            <div>
              <h2>Intentionally limited advertising</h2>
              <p>Better for our readers. Better for our advertisers.</p>
            </div>
            <div>
              <h2>A voice readers recognize</h2>
              <p>Your business alongside the local information our readers already make time to read.</p>
            </div>
          </div>
        </section>

        <section id="advertising-options" className={`page-frame ${styles.options}`} aria-labelledby="options-heading">
          <div className={styles.sectionIntro}>
            <h2 id="options-heading">2027 Advertising Options</h2>
            <p>We keep advertising intentionally limited. Griffin Grapevine isn&apos;t built around filling every available inch with ads, and we think that&apos;s better for both our readers and our advertisers.</p>
          </div>
          <article className={`${styles.featuredPackage} ${styles.spotlight}`} aria-labelledby="spotlight-heading">
            <div className={styles.packageSummary}>
              <p className={styles.eyebrow}>Our most popular option</p>
              <h3 id="spotlight-heading">Local Business Spotlight</h3>
              <Price amount={360} />
              <p>Our most popular option, and where we&apos;d recommend most Griffin-area businesses start.</p>
              <InquiryLink subject="Local Business Spotlight">Ask about the Spotlight</InquiryLink>
            </div>
            <div className={styles.packageDetails}>
              <div className={styles.packageCopy}>
                <p>Your business gets four native advertising features over a four-week campaign, giving you repeated exposure without showing up so often that readers tune you out.</p>
                <p>Each placement is written or refined in the Griffin Grapevine voice and can include your photo or logo, a direct link, and a clear call to action.</p>
                <p>Your campaign also includes category exclusivity. While your Spotlight campaign is active, we won&apos;t run another Local Business Spotlight from a direct competitor in your category.</p>
                <p>You&apos;ll receive a performance recap after your campaign.</p>
              </div>
              <Includes columns items={[
                "4 Griffin Grapevine placements", "Custom-written or edited copy", "Photo or logo",
                "Direct link and call to action", "Category exclusivity", "Campaign performance recap",
              ]} />
            </div>
          </article>

          <article className={`${styles.featuredPackage} ${styles.presenting}`} aria-labelledby="presenting-heading">
            <div className={styles.packageSummary}>
              <h3 id="presenting-heading">Presenting Partner</h3>
              <Price amount={500} />
              <p>The biggest presence we offer.</p>
              <InquiryLink subject="Presenting Partner" light>Ask about a partnership</InquiryLink>
            </div>
            <div className={styles.packageDetails}>
              <div className={styles.packageCopy}>
                <p>Become the Presenting Partner of Griffin Grapevine for an entire month.</p>
                <p>Your business receives premium placement across every Griffin Grapevine issue that month, putting your name in front of Spalding County readers approximately eight times throughout the campaign.</p>
                <blockquote>&ldquo;Today&apos;s Griffin Grapevine is presented by [Your Business].&rdquo;</blockquote>
                <p>Your partnership includes prominent branding, custom sponsor messaging, links to your business, category exclusivity, performance reporting, and additional visibility through Griffin Grapevine&apos;s social media.</p>
                <p className={styles.availability}>There is only one Presenting Partner available per month. When a month is booked, it&apos;s booked.</p>
              </div>
              <Includes columns items={[
                "Placement in every issue that month", "Approximately 8 newsletter appearances",
                "Premium top-of-publication positioning", "Custom sponsor messaging", "Logo/photo and links",
                "Category exclusivity", "Instagram exposure", "Monthly performance recap",
              ]} />
            </div>
          </article>

          <div className={styles.secondaryPackages}>
            <article className={styles.secondaryPackage} aria-labelledby="section-partner-heading">
              <h3 id="section-partner-heading">Section Partner</h3>
              <Price amount={200} />
              <p className={styles.packageLead}>An affordable way to stay consistently visible to Spalding County.</p>
              <div className={styles.packageCopy}>
                <p>Put your business alongside one of the recurring parts of Griffin Grapevine readers already recognize.</p>
                <p>Your business receives a &ldquo;Presented by&rdquo; or &ldquo;Brought to you by&rdquo; placement at the beginning of the sponsored section throughout the month.</p>
                <p>Potential sections include:</p>
                <ul className={styles.sectionsList}>
                  <li>WHAT&apos;S HAPPENIN&apos;</li><li>THE DIGEST</li><li>WEATHER</li><li>DOG OF THE WEEK</li><li>CIVIL NEWS</li>
                </ul>
                <p>Section Partnerships are intentionally subtle. You&apos;re not interrupting the publication with another large advertisement. You&apos;re associating your business with something readers already come to Griffin Grapevine for.</p>
                <p>Each section is limited to one partner at a time, with category exclusivity.</p>
              </div>
              <Includes items={[
                "Presence throughout the month", "Approximately 8 appearances", "Logo/business name",
                "Direct link", "Recurring section placement", "Category exclusivity",
              ]} />
              <div className={styles.secondaryAction}>
                <InquiryLink subject="Section Partner">Ask about a section</InquiryLink>
              </div>
            </article>
            <article className={styles.secondaryPackage} aria-labelledby="event-heading">
              <h3 id="event-heading">Sponsored Event Feature</h3>
              <Price amount={50} oneTime />
              <p className={styles.packageLead}>Have something happening that Spalding County should know about?</p>
              <div className={styles.packageCopy}>
                <p>This option is designed for grand openings, community events, open houses, special promotions, anniversary celebrations, fundraisers, and other time-sensitive happenings around Griffin and Spalding County.</p>
                <p>We&apos;ll create an editorial-style sponsored feature with your photo, event information, and a direct link, then place it in a Griffin Grapevine issue ahead of your event or promotion.</p>
                <p>No monthly commitment required.</p>
              </div>
              <Includes items={[
                "One sponsored feature", "Custom-written or edited copy", "Photo", "Direct link", "Prominent placement in one issue",
              ]} />
              <div className={styles.secondaryAction}>
                <InquiryLink subject="Sponsored Event Feature">Tell us about your event</InquiryLink>
              </div>
            </article>
          </div>
        </section>

        <section id="lets-talk" className={`page-frame ${styles.contact}`} aria-labelledby="contact-heading">
          <div>
            <h2 id="contact-heading">Not sure which one makes sense?</h2>
            <p className={styles.packageLead}>Our goal isn&apos;t to sell you the biggest package.</p>
            <p>It&apos;s to help local businesses find an advertising option that actually makes sense for them.</p>
          </div>
          <div>
            <p className={styles.contactLead}>Tell us about your business and what you&apos;re trying to accomplish.</p>
            <p>If you&apos;re testing Griffin Grapevine for the first time, we&apos;ll tell you where we&apos;d start. If you&apos;re trying to build consistent recognition throughout Spalding County, we&apos;ll point you toward a campaign. And if one of the larger packages doesn&apos;t make sense for what you&apos;re trying to accomplish, we&apos;ll tell you that too.</p>
            <InquiryLink subject="Advertising inquiry">Let&apos;s talk about your business</InquiryLink>
            <a href={`mailto:${SITE_CONFIG.email}`} className={styles.email}>{SITE_CONFIG.email}</a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
