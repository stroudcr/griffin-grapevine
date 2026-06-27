"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Header, Footer } from "@/components";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("Issue page error:", error);
    }
  }, [error]);

  return (
    <div className="page-shell min-h-screen">
      <Header />

      <main className="page-frame flex min-h-[52vh] items-center justify-center py-16">
        <div className="surface-panel w-full max-w-md rounded-[2.25rem] p-8 text-center sm:p-10">
          <h1 className="headline-balance text-3xl font-semibold text-ink">
            Failed to load this issue
          </h1>
          <p className="mt-4 text-slate">
            We couldn&apos;t load this newsletter issue. It might not exist or there could be a temporary problem.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <button onClick={() => reset()} className="btn-primary">
              Try again
            </button>
            <Link href="/issues" className="btn-secondary">
              View all issues
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
