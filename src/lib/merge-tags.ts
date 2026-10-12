/**
 * beehiiv fills {{merge_tags}} such as {{email_address_id}} only in the email
 * version of an issue. On the website they show up raw, so this removes them.
 */

const MERGE_TAG = /\{\{\s*[\w.]+\s*\}\}|%7B%7B\s*[\w.]+\s*%7D%7D/gi;

function hasMergeTag(value: string): boolean {
  return /\{\{|%7B%7B/i.test(value);
}

/** Drops query parameters whose value is an unfilled merge tag. */
export function stripMergeTagsFromUrl(href: string): string {
  if (!hasMergeTag(href)) return href;

  try {
    const url = new URL(href);
    for (const [key, value] of [...url.searchParams.entries()]) {
      if (hasMergeTag(value)) url.searchParams.delete(key);
    }
    return url.toString();
  } catch {
    return href.replace(MERGE_TAG, "");
  }
}

/** Removes merge tags from visible text. */
export function stripMergeTagsFromText(text: string): string {
  return hasMergeTag(text) ? text.replace(MERGE_TAG, "") : text;
}
