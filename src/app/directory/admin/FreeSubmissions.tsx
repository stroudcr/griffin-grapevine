import Link from "next/link";
import { getCategory } from "@/lib/directory";
import { DAY_LABELS, DAY_ORDER } from "@/lib/directory/format";
import type { FreeSubmission } from "@/lib/guide/free-content";
import { formatDate } from "@/lib/guide/status";
import { approveFreeListing, hideFreeListing, rejectFreeListing } from "./actions";

function Detail({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate">{label}</dt>
      <dd className="mt-0.5 text-[15px] text-ink">{children}</dd>
    </div>
  );
}

function hoursSummary(listing: FreeSubmission): string {
  const hours = listing.content.hours;
  if (!hours) return "Not provided";
  return DAY_ORDER.filter((d) => hours[d] !== undefined)
    .map((d) => `${DAY_LABELS[d].short}: ${hours[d]!.length ? hours[d]!.map((h) => `${h.opens}–${h.closes}`).join(", ") : "Closed"}`)
    .join(" · ");
}

export function FreeSubmissions({ listings }: { listings: FreeSubmission[] }) {
  const pending = listings.filter((l) => l.status === "pending");
  const reviewed = listings.filter((l) => l.status !== "pending");
  return (
    <section className="mt-10" id="free-submissions">
      <h2 className="font-serif text-3xl font-semibold text-ink">
        Free listings to review <span className="tabular-nums text-xl text-slate">({pending.length})</span>
      </h2>
      {pending.length === 0 ? (
        <p className="mt-3 text-slate">No free submissions waiting for review.</p>
      ) : (
        <ul className="mt-5 grid gap-5">
          {pending.map((listing) => {
            const c = listing.content;
            return (
              <li key={listing.id} className="rounded-[1.75rem] border border-amber-200 bg-white/90 p-6 shadow-[var(--shadow-soft)]">
                <h3 className="font-serif text-2xl font-semibold text-ink">{c.name}</h3>
                <p className="text-sm text-slate">
                  {getCategory(listing.category)?.heading ?? listing.category} · {c.town} ·{" "}
                  {listing.claimed_slug ? "Claim of an existing listing" : "New free listing"} · {formatDate(listing.created_at)}
                </p>
                {listing.claimed_slug && (
                  <p className="mt-2 text-sm">
                    <Link href={`/directory/${listing.category}/${listing.claimed_slug}`}>
                      Compare with the existing listing <span aria-hidden="true">→</span>
                    </Link>
                  </p>
                )}
                <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Detail label="Contact">
                    {listing.contact_name} ({listing.contact_role})
                    <br />
                    {listing.owner_email}
                  </Detail>
                  <Detail label="Address">
                    {c.address.street}
                    {c.address.suite ? `, ${c.address.suite}` : ""}, {c.town}, GA {c.address.zip}
                  </Detail>
                  <Detail label="Phone">{c.phone ?? "Not provided"}</Detail>
                  <Detail label="Website">
                    {c.website ? (
                      <a href={c.website} target="_blank" rel="noopener noreferrer" className="break-all">
                        {c.website}
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </Detail>
                  <Detail label="Hours" wide>
                    {hoursSummary(listing)}
                  </Detail>
                </dl>
                <p className="mt-4 text-sm text-slate">
                  Confirm the submitter represents this business before approving a claim. Contact details stay private.
                </p>
                <div className="mt-5 flex flex-wrap items-start gap-3">
                  <form action={approveFreeListing}>
                    <input type="hidden" name="id" value={listing.id} />
                    <button type="submit" className="btn-primary min-h-11">
                      Approve and publish
                    </button>
                  </form>
                  <details className="rounded-2xl border border-navy/15 px-4 py-2">
                    <summary className="cursor-pointer py-1 font-medium text-red-800">Decline submission…</summary>
                    <form action={rejectFreeListing} className="mt-3 grid gap-2 pb-2">
                      <input type="hidden" name="id" value={listing.id} />
                      <label htmlFor={`free-reason-${listing.id}`} className="text-sm font-semibold text-ink">
                        Reason (emailed to the submitter)
                      </label>
                      <textarea id={`free-reason-${listing.id}`} name="reason" rows={2} maxLength={300} className="rounded-xl border border-navy/20 px-3 py-2 text-[15px]" />
                      <button type="submit" className="justify-self-start rounded-full bg-red-700 px-5 py-2 font-medium text-white hover:bg-red-800">
                        Decline
                      </button>
                    </form>
                  </details>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {reviewed.length > 0 && (
        <details className="mt-6 rounded-[1.5rem] border border-navy/[0.12] bg-white/85 p-5">
          <summary className="cursor-pointer font-semibold text-ink">Reviewed free submissions ({reviewed.length})</summary>
          <ul className="mt-4 grid gap-4">
            {reviewed.map((l) => (
              <li key={l.id} className="flex flex-wrap items-center justify-between gap-3 border-t border-navy/10 pt-3">
                <div>
                  <p className="font-semibold text-ink">{l.content.name}</p>
                  <p className="text-sm text-slate">
                    {l.status} · {l.owner_email} · {formatDate(l.reviewed_at)}
                  </p>
                </div>
                {l.status === "live" && (
                  <form action={hideFreeListing}>
                    <input type="hidden" name="id" value={l.id} />
                    <button type="submit" className="text-sm text-ink underline underline-offset-4">
                      Remove approved submission
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
