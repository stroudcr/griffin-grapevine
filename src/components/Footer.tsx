import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { SITE_CONFIG } from "@/lib/seo/constants";

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/5 text-white/88 transition-colors hover:border-white/25 hover:bg-white/10 hover:text-white"
      aria-label={label}
    >
      {children}
    </a>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="page-shell-dark mt-auto text-white">
      <div className="page-frame py-14 sm:py-16">
        <div className="grid gap-10 border-b border-white/10 pb-10 lg:grid-cols-[1.3fr_0.9fr_0.8fr]">
          <div className="max-w-xl">
            <Logo variant="stacked" className="text-white" />
            <p className="copy-balance mt-5 text-base leading-8 text-white/72">
              {SITE_CONFIG.phrases.communityDescription}
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.26em] text-white/58">
                Browse
              </p>
              <div className="flex flex-col gap-3 text-sm text-white/78">
                <Link href="/" className="hover:text-white">Home</Link>
                <Link href="/issues" className="hover:text-white">Issues</Link>
                <Link href="/griffin-ga-news" className="hover:text-white">Griffin News</Link>
                <Link href="/spalding-county-events" className="hover:text-white">Events</Link>
                <Link href="/local-government" className="hover:text-white">Government</Link>
                <Link href="/about" className="hover:text-white">About</Link>
                <Link href="/advertise" className="hover:text-white">Advertise</Link>
                <Link href="/contact" className="hover:text-white">Contact</Link>
              </div>
            </div>

            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.26em] text-white/58">
                Resources
              </p>
              <div className="flex flex-col gap-3 text-sm text-white/78">
                <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-white">Terms of Service</Link>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/6 p-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.26em] text-white/58">
              Follow
            </p>
            <p className="mb-5 text-sm leading-7 text-white/72">
              Reach us with tips, sponsorship questions, or community updates.
            </p>
            <Link href="/contact" className="btn-secondary mb-5 w-full border-white/18 bg-white/8 text-white hover:bg-white/12">
              Contact the newsroom
            </Link>
            <div className="flex items-center gap-3">
              {SITE_CONFIG.social.facebook && (
                <SocialIcon href={SITE_CONFIG.social.facebook} label="Facebook">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.49 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </SocialIcon>
              )}
              {SITE_CONFIG.social.instagram && (
                <SocialIcon href={SITE_CONFIG.social.instagram} label="Instagram">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.205 0 3.585.013 4.85.07 3.252.15 4.771 1.692 4.92 4.92.057 1.265.069 1.644.069 4.848 0 3.206-.012 3.585-.07 4.85-.148 3.227-1.664 4.77-4.919 4.919-1.266.058-1.645.069-4.85.069-3.204 0-3.583-.011-4.848-.07-3.26-.148-4.772-1.698-4.92-4.919-.057-1.265-.069-1.644-.069-4.849 0-3.204.012-3.583.07-4.849.148-3.227 1.664-4.77 4.919-4.919C8.417 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 2.694.272.273 2.69.072 7.052.014 8.332 0 8.741 0 12c0 3.258.014 3.668.072 4.948.2 4.357 2.618 6.78 6.98 6.979 1.28.059 1.689.073 4.948.073 3.258 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.668-.072-4.948-.196-4.354-2.617-6.78-6.98-6.979C15.668.014 15.258 0 12 0zm0 5.838A6.162 6.162 0 1 0 12 18a6.162 6.162 0 0 0 0-12.162zm0 10.161A3.999 3.999 0 1 1 12 8a3.999 3.999 0 0 1 0 7.999zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
                  </svg>
                </SocialIcon>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 text-sm text-white/56 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} {SITE_CONFIG.name}. All rights reserved.</p>
          <p>Serving {SITE_CONFIG.phrases.shortCoverage}.</p>
        </div>
      </div>
    </footer>
  );
}
