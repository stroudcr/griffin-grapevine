"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("Application error:", error);
    }
  }, [error]);

  return (
    <div className="page-shell flex min-h-screen items-center justify-center px-4">
      <div className="surface-panel w-full max-w-md rounded-[2.25rem] p-8 text-center sm:p-10">
        <h1 className="headline-balance text-4xl font-semibold text-ink">
          Something went wrong
        </h1>
        <p className="mt-4 text-slate">
          We encountered an unexpected error. Please try again or return to the home page.
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
    </div>
  );
}
