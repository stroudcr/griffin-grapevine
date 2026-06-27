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
      console.error("Issues page error:", error);
    }
  }, [error]);

  return (
    <div className="page-shell min-h-screen">
      <Header />

      <main className="page-frame flex min-h-[52vh] items-center justify-center py-16">
        <div className="surface-panel w-full max-w-md rounded-[2.25rem] p-8 text-center sm:p-10">
          <h1 className="headline-balance text-3xl font-semibold text-ink">
            Failed to load issues
          </h1>
          <p className="mt-4 text-slate">
            We couldn&apos;t load the newsletter archive. This might be a temporary issue.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <button onClick={() => reset()} className="btn-primary">
              Try again
            </button>
            <Link href="/" className="btn-secondary">
              Go home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
