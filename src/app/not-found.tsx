import Link from "next/link";
import { Header, Footer } from "@/components";

export default function NotFound() {
  return (
    <div className="page-shell min-h-screen">
      <Header />

      <main className="page-frame flex min-h-[52vh] items-center justify-center py-16">
        <div className="surface-panel max-w-xl rounded-[2.25rem] p-8 text-center sm:p-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[rgb(177_142_87_/_0.12)] text-accent">
            <svg
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.7}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="headline-balance text-4xl font-semibold text-ink">
            Page not found
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-slate">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have moved or no longer exists.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/" className="btn-primary">
              Go home
            </Link>
            <Link href="/issues" className="btn-secondary">
              Browse issues
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
