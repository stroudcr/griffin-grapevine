import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Footer, Header } from "@/components";
import { SITE_CONFIG } from "@/lib/seo/constants";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import styles from "./advertise.module.css";
import { PresentingPartnerExample } from "./PresentingPartnerExample";

export const metadata: Metadata = buildPageMetadata({
  title: "Advertise | Reach Spalding County Residents",
  description:
    "Put your business in front of Spalding County locals. Explore Griffin Grapevine advertising: Presenting Partner from $160, Section Partner $200/month, Featured Event $50, and Local Business Guide membership from $19/month.",
  path: "/advertise",
});

// Presenting Partner packages, shown highest first. Every package gets the
// same placement; they differ only in how many issues they run in.
const presentingPartnerTiers = [
  { features: 8, price: 500, perFeature: "$62.50", schedule: "8 issues in a row, about a month", instagram: true, recommended: false },
  { features: 4, price: 280, perFeature: "$70", schedule: "4 issues in a row: Mon, Fri, Mon, Fri", instagram: true, recommended: true },
  { features: 2, price: 160, perFeature: "$80", schedule: "2 issues", instagram: false, recommended: false },
];

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

function Includes({ items, columns = false, heading = "Includes" }: { items: string[]; columns?: boolean; heading?: string }) {
  return (
    <div className={styles.includes}>
      <h4 className={styles.includesHeading}>{heading}</h4>
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

function PresentingPartnerTiers() {
  return (
    <div className={styles.tiers}>
      <ul className={styles.tierList} aria-label="Presenting Partner packages">
        {presentingPartnerTiers.map((tier) => (
          <li key={tier.features} className={`${styles.tier} ${tier.recommended ? styles.recommendedTier : ""}`}>
            {tier.recommended && <span className={styles.tierTag}>Recommended</span>}
            <h4 className={styles.tierCount}>{tier.features} features</h4>
            <p className={styles.tierPrice}>${tier.price}</p>
            <p className={styles.tierEach}>{tier.perFeature} per feature</p>
            <ul className={styles.tierDetails}>
              <li>{tier.schedule}</li>
              {tier.instagram && <li>Instagram exposure</li>}
            </ul>
          </li>
        ))}
      </ul>
      <p className={styles.tierNote}>Four issues in a row is the run we&apos;ve seen perform best.</p>
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
          <article className={`${styles.featuredPackage} ${styles.presenting} ${styles.tiered}`} aria-labelledby="presenting-heading">
            <div className={styles.packageSummary}>
              <h3 id="presenting-heading">Presenting Partner</h3>
              <p className={styles.tieredLead}>The biggest presence we offer.</p>
              <p>Choose how many issues you want.</p>
            </div>
            <PresentingPartnerTiers />
            <div className={styles.packageDetails}>
              <div className={styles.packageCopy}>
                <p>Every feature puts your logo at the top of the issue and your message right after the morning note, the first thing Spalding County readers see when they open the Grapevine.</p>
                <PresentingPartnerExample />
                <p className={styles.availability}>There&apos;s one Presenting Partner spot per issue, about 8 a month. When they&apos;re booked, they&apos;re booked.</p>
              </div>
            </div>
            <div className={styles.tierAside}>
              <Includes heading="Every feature includes" items={[
                "Your logo at the top of the issue", "Your sponsor message right after the morning note",
                "Custom-written or edited copy", "Photo or logo and direct links to your business",
                "Category exclusivity: no direct competitor in the same issue", "Campaign performance recap",
              ]} />
              <InquiryLink subject="Presenting Partner" light>Ask about a partnership</InquiryLink>
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
              <h3 id="event-heading">Featured Event</h3>
              <Price amount={50} oneTime />
              <p className={styles.packageLead}>Have something happening that Spalding County should know about?</p>
              <div className={styles.packageCopy}>
                <p>This option is designed for grand openings, community events, open houses, special promotions, anniversary celebrations, fundraisers, and other time-sensitive happenings around Griffin and Spalding County.</p>
                <p>Your event goes first in WHAT&apos;S HAPPENIN&apos;, the Grapevine&apos;s local events section, with your event graphic, in an issue ahead of your event.</p>
                <p>No monthly commitment required.</p>
              </div>
              <Includes items={[
                "Your event graphic", "Top spot in WHAT'S HAPPENIN'", "Link to your event details", "One issue ahead of your event",
              ]} />
              <div className={styles.secondaryAction}>
                <InquiryLink subject="Featured Event">Tell us about your event</InquiryLink>
              </div>
            </article>
          </div>
        </section>

        <section id="local-business-guide" className={`page-frame ${styles.guideSection}`} aria-labelledby="guide-heading">
          <div className={styles.sectionIntro}>
            <h2 id="guide-heading">Get your business in the Local Business Guide</h2>
            <p>The Local Business Guide is Griffin Grapevine&apos;s directory of businesses across Griffin and Spalding County.</p>
          </div>
          <article className={`${styles.featuredPackage} ${styles.guidePackage}`} aria-labelledby="guide-member-heading">
            <div className={styles.packageSummary}>
              <p className={styles.eyebrow}>Local Business Guide</p>
              <h3 id="guide-member-heading">Featured member</h3>
              <Price amount={19} />
              <p>or $190 a year (save $38)</p>
              <Link href="/directory/join" className={styles.button}>Become a featured member <Arrow /></Link>
            </div>
            <div className={styles.packageDetails}>
              <div className={styles.packageCopy}>
                <p>Guide membership is separate from newsletter advertising and doesn&apos;t include placement in the Grapevine itself.</p>
                <p>Not ready for a featured profile? Every Spalding County business can <Link href="/directory/submit" className={styles.inlineLink}>claim a free listing</Link>.</p>
              </div>
              <Includes columns items={[
                "A full profile with photos and a description", "Top placement in your category",
                "A Grapevine Perk offer for readers", "A monthly report of views, calls, and clicks",
              ]} />
            </div>
          </article>
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
