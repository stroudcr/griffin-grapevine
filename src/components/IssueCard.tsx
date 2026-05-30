import Link from "next/link";
import Image from "next/image";
import type { Issue } from "@/lib/beehiiv/types";
import {
  getIssueDisplayTitle,
  getIssueSummary,
  getIssueTags,
} from "@/lib/seo/issues";

interface IssueCardProps {
  issue: Issue;
  featured?: boolean;
}

export function IssueCard({ issue, featured = false }: IssueCardProps) {
  const displayTitle = getIssueDisplayTitle(issue);
  const summary = getIssueSummary(issue, featured ? 190 : 130);
  const tags = getIssueTags(issue);
  const formattedDate = issue.publishDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (featured) {
    return (
      <article className="card group">
        <Link href={`/issues/${issue.slug}`} className="block">
          {issue.thumbnailUrl && (
            <div className="mb-4 -mx-6 -mt-6 overflow-hidden rounded-t-lg">
              <Image
                src={issue.thumbnailUrl}
                alt={displayTitle}
                width={800}
                height={400}
                quality={75}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-slate mb-2">
            <time dateTime={issue.publishDate.toISOString()}>{formattedDate}</time>
            <span className="inline-block px-2 py-0.5 bg-gold/10 text-gold text-xs font-medium rounded">
              Latest
            </span>
          </div>
          <h2 className="font-serif font-bold text-2xl text-navy group-hover:text-navy-dark transition-colors mb-2">
            {displayTitle}
          </h2>
          {summary && (
            <p className="text-slate line-clamp-3">{summary}</p>
          )}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map((tag) => (
                <span
                  key={`${tag.type}-${tag.slug}`}
                  className="inline-flex rounded-full bg-gold/10 px-2.5 py-1 text-xs font-medium text-navy"
                >
                  {tag.label}
                </span>
              ))}
            </div>
          )}
          <div className="mt-4 text-navy font-medium text-sm group-hover:underline">
            Read local coverage →
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="card group">
      <Link href={`/issues/${issue.slug}`} className="block">
        <div className="flex items-center gap-2 text-sm text-slate mb-2">
          <time dateTime={issue.publishDate.toISOString()}>{formattedDate}</time>
        </div>
        <h3 className="font-serif font-bold text-lg text-navy group-hover:text-navy-dark transition-colors mb-2">
          {displayTitle}
        </h3>
        {summary && (
          <p className="text-slate text-sm line-clamp-2">{summary}</p>
        )}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.slice(0, 2).map((tag) => (
              <span
                key={`${tag.type}-${tag.slug}`}
                className="inline-flex rounded-full bg-gold/10 px-2 py-0.5 text-xs font-medium text-navy"
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}
      </Link>
    </article>
  );
}
