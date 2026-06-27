"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { SITE_CONFIG } from "@/lib/seo/constants";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Archive", href: "/issues" },
  { label: "About", href: "/about" },
  { label: "Advertise", href: "/advertise" },
  { label: "Contact", href: "/contact" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/50 bg-[rgb(251_248_242_/_0.82)] backdrop-blur-xl">
      <div className="page-frame">
        <div className="flex h-20 items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Logo variant="full" />
            <div className="hidden border-l border-[rgb(29_36_64_/_0.12)] pl-3 lg:block">
              <p className="text-[0.67rem] font-semibold uppercase tracking-[0.24em] text-ink-soft">
                {SITE_CONFIG.editionLabel}
              </p>
              <p className="text-sm text-slate">{SITE_CONFIG.location.county}, {SITE_CONFIG.location.state}</p>
            </div>
          </div>

          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-[rgb(29_36_64_/_0.07)] text-ink"
                      : "text-slate hover:bg-[rgb(29_36_64_/_0.04)] hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link href="/#subscribe" className="btn-primary ml-2 text-sm">
              Subscribe Free
            </Link>
          </nav>

          <button
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[rgb(29_36_64_/_0.12)] bg-white/80 text-ink md:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden border-t border-[rgb(29_36_64_/_0.08)] bg-[rgb(250_246_239_/_0.96)] transition-[max-height,opacity] duration-300 md:hidden ${
          mobileMenuOpen ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="page-frame py-5">
          <div className="mb-4 rounded-[1.75rem] border border-[rgb(29_36_64_/_0.1)] bg-white/80 p-5 shadow-[0_20px_45px_rgb(20_24_38_/_0.08)]">
            <p className="eyebrow mb-4">This Week</p>
            <p className="copy-balance text-lg font-medium text-ink">
              Clear, local reporting from {SITE_CONFIG.phrases.shortCoverage}.
            </p>
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-[1.2rem] px-4 py-3 text-base font-medium transition-colors ${
                    active
                      ? "bg-[rgb(29_36_64_/_0.08)] text-ink"
                      : "text-slate hover:bg-[rgb(29_36_64_/_0.05)] hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link href="/#subscribe" className="btn-primary mt-2" onClick={() => setMobileMenuOpen(false)}>
              Subscribe Free
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
