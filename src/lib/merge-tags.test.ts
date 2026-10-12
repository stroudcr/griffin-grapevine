import test from "node:test";
import assert from "node:assert/strict";

import { stripMergeTagsFromText, stripMergeTagsFromUrl } from "./merge-tags";

test("drops query parameters that hold an unfilled merge tag", () => {
  assert.equal(
    stripMergeTagsFromUrl("https://ads.example.com/click?id=42&sub={{email_address_id}}&ref=web"),
    "https://ads.example.com/click?id=42&ref=web"
  );
  assert.equal(
    stripMergeTagsFromUrl("https://ads.example.com/click?sub=%7B%7Bemail_address_id%7D%7D"),
    "https://ads.example.com/click"
  );
});

test("leaves ordinary links untouched", () => {
  const href = "https://www.cityofgriffin.com/events?month=10";
  assert.equal(stripMergeTagsFromUrl(href), href);
});

test("removes merge tags from visible text", () => {
  assert.equal(stripMergeTagsFromText("Hi {{ first_name }}, welcome"), "Hi , welcome");
  assert.equal(stripMergeTagsFromText("Nothing to change"), "Nothing to change");
});
