import test from "node:test";
import assert from "node:assert/strict";

import { stripMergeTagsFromText } from "./merge-tags";

test("removes merge tags from visible text", () => {
  assert.equal(stripMergeTagsFromText("Hi {{ first_name }}, welcome"), "Hi , welcome");
  assert.equal(stripMergeTagsFromText("Nothing to change"), "Nothing to change");
});
