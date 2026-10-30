"use client";

import { useId, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SearchIcon } from "./icons";

export interface SearchEntry {
  label: string;
  href: string;
  /** Small line under the label, e.g. "Category · Home Services". */
  meta: string;
  /** Lowercase text the query is matched against. */
  terms: string;
}

const MAX_RESULTS = 8;

function normalize(text: string) {
  return text.toLowerCase().replace(/&/g, "and").replace(/\s+/g, " ").trim();
}

/** Instant search over the guide's categories and businesses. */
export function DirectorySearch({ entries }: { entries: SearchEntry[] }) {
  const router = useRouter();
  const inputId = useId();
  const resultsId = useId();
  const [query, setQuery] = useState("");
  const [submittedEmpty, setSubmittedEmpty] = useState(false);

  const q = normalize(query);
  const results = useMemo(() => {
    if (!q) return [];
    const words = q.split(" ");
    return entries
      .filter((entry) => {
        const haystack = normalize(`${entry.label} ${entry.terms}`);
        return words.every((word) => haystack.includes(word));
      })
      .slice(0, MAX_RESULTS);
  }, [entries, q]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (results[0]) {
      router.push(results[0].href);
    } else {
      setSubmittedEmpty(true);
    }
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="hero-entrance-delay relative mx-auto mt-9 max-w-[720px] text-left">
      <label htmlFor={inputId} className="sr-only">
        Search the Local Business Guide
      </label>
      <div className="flex flex-wrap items-center gap-2 rounded-[1.75rem] border border-white/40 bg-white/95 p-2 shadow-[0_28px_80px_rgb(20_24_38_/_0.35)] backdrop-blur-xl sm:rounded-full">
        <div className="flex min-w-0 flex-[1_1_18rem] items-center gap-3 pl-4">
          <SearchIcon className="h-[22px] w-[22px] shrink-0 text-accent-deep" />
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSubmittedEmpty(false);
            }}
            placeholder="Plumber, vet, Mexican food…"
            autoComplete="off"
            aria-controls={resultsId}
            className="min-w-0 flex-1 bg-transparent py-3 font-serif text-[1.3rem] text-ink outline-none placeholder:text-slate/55"
          />
        </div>
        <button type="submit" className="btn-primary min-h-[3.25rem] flex-[1_1_auto] px-7 text-[15px] sm:flex-none">
          Search the guide
        </button>
      </div>

      <div id={resultsId} aria-live="polite">
        {q && results.length > 0 && (
          <ul className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-[1.5rem] border border-navy/[0.12] bg-white shadow-[var(--shadow-lifted)]">
            {results.map((result) => (
              <li key={result.href} className="border-b border-navy/10 last:border-b-0">
                <Link href={result.href} className="flex flex-col px-6 py-3 transition hover:bg-paper hover:!no-underline">
                  <span className="font-serif text-lg font-semibold text-ink">{result.label}</span>
                  <span className="text-sm text-slate">{result.meta}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {q && results.length === 0 && (
          <p className={`mt-3 text-center text-sm ${submittedEmpty ? "font-medium text-white" : "text-white/80"}`}>
            Nothing matches “{query.trim()}” yet. Try a broader word, like “dentist” or “plumber”.
          </p>
        )}
      </div>
    </form>
  );
}
