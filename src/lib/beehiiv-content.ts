/** Use the published web edition; email/RSS are only availability fallbacks. */
export function choosePublicIssueContent(
  webContent: string | undefined,
  emailContent: string | undefined,
  rssContent: string | undefined
): string | undefined {
  return [webContent, emailContent, rssContent].find((content) => content?.trim());
}
