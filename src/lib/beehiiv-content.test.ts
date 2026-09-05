import test from "node:test";
import assert from "node:assert/strict";
import { choosePublicIssueContent } from "./beehiiv-content";

test("uses the web edition even when an ad only exists in email", () => {
  const web = "<p>Published web story<br>Second line</p>";
  const email = "<table><tr><td>In partnership with an email sponsor</td></tr></table>";
  assert.equal(choosePublicIssueContent(web, email, undefined), web);
});

test("preserves sponsorship already published in the web edition", () => {
  const web = '<div>In partnership with <a href="https://example.com/?_bhiiv=opp_123">Sponsor</a></div><p>Story</p>';
  assert.equal(choosePublicIssueContent(web, "Email version", undefined), web);
});

test("uses availability fallbacks only when web content is absent", () => {
  assert.equal(choosePublicIssueContent(" \n", "Email", "RSS"), "Email");
  assert.equal(choosePublicIssueContent(undefined, "", "RSS"), "RSS");
  assert.equal(choosePublicIssueContent(undefined, undefined, undefined), undefined);
});
