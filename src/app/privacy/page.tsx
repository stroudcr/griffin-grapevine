import { Metadata } from "next";
import { Header, Footer } from "@/components";
import { SITE_CONFIG } from "@/lib/seo/constants";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description: "Privacy Policy for the Griffin Grapevine newsletter and website.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="page-shell min-h-screen">
      <Header />

      <main>
        <section className="section-rule py-14 sm:py-18">
          <div className="page-frame-narrow pt-14">
            <h1 className="headline-balance text-5xl font-semibold text-ink sm:text-6xl">
              Privacy Policy
            </h1>
            <p className="mt-5 text-slate">Last updated: December 21, 2025</p>
          </div>
        </section>

        <section className="pb-16 sm:pb-20">
          <div className="page-frame-narrow">
            <div className="surface-panel rounded-[2.25rem] p-7 sm:p-10">
            <div className="prose prose-lg prose-slate max-w-none">
              <h2>Introduction</h2>
              <p>
                The Griffin Grapevine (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to
                protecting your privacy. This Privacy Policy explains how we
                collect, use, and safeguard your information when you visit our
                website or subscribe to our newsletter.
              </p>

              <h2>Information We Collect</h2>
              <h3>Information You Provide</h3>
              <ul>
                <li>
                  <strong>Email Address:</strong> When you subscribe to our
                  newsletter, we collect your email address and subscription
                  metadata including source information (utm_source, utm_medium,
                  utm_campaign) and referring site data to help us understand
                  how you found us.
                </li>
                <li>
                  <strong>Contact Information:</strong> If you contact us through
                  our contact form, we collect your name, email, and message
                  content.
                </li>
              </ul>

              <h3>Information Collected Automatically</h3>
              <ul>
                <li>
                  <strong>Hosting Analytics:</strong> Our website is hosted on
                  Vercel, which may collect basic analytics data including pages
                  visited, referring sites, and general device information for
                  platform performance and security purposes.
                </li>
              </ul>

              <h2>How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Send you our weekly newsletter</li>
                <li>Respond to your inquiries and messages</li>
                <li>Improve our website and content</li>
                <li>Analyze usage patterns to enhance user experience</li>
              </ul>

              <h2>Newsletter Service</h2>
              <p>
                Our newsletter is delivered through Beehiiv, a third-party email
                service provider. When you subscribe, your email address and
                subscription information are stored with Beehiiv. Beehiiv manages
                subscription status, delivery, and analytics in accordance with
                their privacy policy. You will receive a welcome email upon
                subscribing. You can unsubscribe at any time by clicking the
                unsubscribe link in any newsletter email.
              </p>
              <p>
                For more information about how Beehiiv handles your data, please
                visit{" "}
                <a
                  href="https://www.beehiiv.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-navy hover:underline"
                >
                  Beehiiv&apos;s Privacy Policy
                </a>
                .
              </p>

              <h2>Data Sharing</h2>
              <p>
                We do not sell, trade, or rent your personal information to third
                parties. We may share your information with:
              </p>
              <ul>
                <li>
                  <strong>Service Providers:</strong> We use trusted third-party
                  services to operate our website and deliver content:
                  <ul>
                    <li>
                      <strong>Beehiiv</strong> - Newsletter delivery and subscriber
                      management
                    </li>
                    <li>
                      <strong>Vercel</strong> - Website hosting and deployment
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law or to
                  protect our rights.
                </li>
              </ul>

              <h2>Cookies</h2>
              <p>
                Our website and hosting provider (Vercel) may use essential
                cookies for functionality and performance. These cookies help
                ensure the website operates correctly and may include session
                management and security features. You can control cookie settings
                through your browser preferences, though some functionality may be
                limited if cookies are disabled.
              </p>

              <h2>Data Security</h2>
              <p>
                We implement appropriate security measures to protect your
                personal information. However, no method of transmission over the
                internet is 100% secure, and we cannot guarantee absolute security.
              </p>

              <h2>Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Unsubscribe from our newsletter at any time</li>
              </ul>

              <h2>Data Retention</h2>
              <p>
                We retain your personal information only as long as necessary for
                the purposes outlined in this Privacy Policy:
              </p>
              <ul>
                <li>
                  <strong>Newsletter Subscriptions:</strong> Your email and
                  subscription data are retained by Beehiiv for as long as you
                  remain subscribed. Upon unsubscribing, your data is removed in
                  accordance with Beehiiv&apos;s retention policies.
                </li>
                <li>
                  <strong>Contact Form Submissions:</strong> Messages sent through
                  our contact form are retained for as long as necessary to respond
                  to your inquiry and maintain a record of our correspondence.
                </li>
              </ul>

              <h2>Children&apos;s Privacy</h2>
              <p>
                Our website is not intended for children under 13 years of age. We
                do not knowingly collect personal information from children under
                13.
              </p>

              <h2>Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will
                notify you of any significant changes by posting the new policy on
                this page and updating the &quot;Last updated&quot; date.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or your personal
                information, please contact us at:
              </p>
              <p>
                <a href={`mailto:${SITE_CONFIG.email}`} className="text-navy hover:underline">
                  {SITE_CONFIG.email}
                </a>
              </p>
            </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
