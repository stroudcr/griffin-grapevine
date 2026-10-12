/**
 * beehiiv fills {{merge_tags}} such as {{first_name}} only in the email
 * version of an issue. On the website they would show up raw in the text,
 * so this removes them. Link URLs are left alone on purpose: sponsor links
 * carry beehiiv ad-network click IDs that must reach the advertiser intact.
 */

const MERGE_TAG = /\{\{\s*[\w.]+\s*\}\}/g;

export function stripMergeTagsFromText(text: string): string {
  return text.includes("{{") ? text.replace(MERGE_TAG, "") : text;
}
