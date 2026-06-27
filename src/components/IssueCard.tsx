import Link from "next/link";
import Image from "next/image";
import type { Issue } from "@/lib/beehiiv/types";
import { SITE_CONFIG } from "@/lib/seo/constants";
import { getIssueDisplayTitle, getIssueSummary } from "@/lib/seo/issues";

interface IssueCardProps {
  issue: Issue;
  featured?: boolean;
}

export function IssueCard({ issue, featured = false }: IssueCardProps) {
  const displayTitle = getIssueDisplayTitle(issue);
  const summary = getIssueSummary(issue, featured ? 190 : 130);
  const formattedDate = issue.publishDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (featured) {
    return (
      <article className="hover-lift overflow-hidden rounded-[2rem] border border-[rgb(29_36_64_/_0.12)] bg-white/82 shadow-[0_24px_70px_rgb(20_24_38_/_0.12)]">
        <Link href={`/issues/${issue.slug}`} className="block">
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="surface-tint flex flex-col justify-between p-6 sm:p-8">
              <div>
                <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-slate">
                  <time dateTime={issue.publishDate.toISOString()}>{formattedDate}</time>
                  <span className="sponsor-label">Latest Issue</span>
                </div>
                <h2 className="headline-balance mb-4 text-3xl font-semibold text-ink sm:text-4xl">
                  {displayTitle}
                </h2>
                {summary && (
                  <p className="copy-balance max-w-xl text-base text-slate-deep sm:text-lg">
                    {summary}
                  </p>
                )}
              </div>
              <div className="mt-8 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-ink-soft">
                <span>Read this issue</span>
                <span aria-hidden="true">→</span>
              </div>
            </div>

            <div className="media-sweep relative min-h-[18rem] overflow-hidden bg-[rgb(29_36_64_/_0.08)]">
              {issue.thumbnailUrl ? (
                <Image
                  src={issue.thumbnailUrl}
                  alt={displayTitle}
                  fill
                  quality={75}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-end bg-[radial-gradient(circle_at_top_left,_rgba(177,142,87,0.35),_transparent_40%),linear-gradient(180deg,_#2c3657_0%,_#171d31_100%)] p-6 text-white sm:p-8">
                  <div>
                    <p className="eyebrow mb-3 text-white before:bg-[rgba(255,255,255,0.45)]">From the Desk</p>
                    <p className="max-w-xs text-sm leading-7 text-white/78">
                      Local government, events, schools, and community stories from across {SITE_CONFIG.location.county}.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="hover-lift h-full rounded-[1.75rem] border border-[rgb(29_36_64_/_0.12)] bg-white/78">
      <Link href={`/issues/${issue.slug}`} className="flex h-full flex-col p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <time dateTime={issue.publishDate.toISOString()} className="text-sm text-slate">
            {formattedDate}
          </time>
          <span className="h-px flex-1 bg-[rgb(29_36_64_/_0.1)]" />
        </div>
        <h3 className="headline-balance text-2xl font-semibold text-ink">
          {displayTitle}
        </h3>
        {summary && (
          <p className="copy-balance mt-3 flex-1 text-slate">
            {summary}
          </p>
        )}
        <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-soft">
          <span>Open issue</span>
          <span aria-hidden="true">→</span>
        </div>
      </Link>
    </article>
  );
}
