import test from "node:test";
import assert from "node:assert/strict";

import postcss from "postcss";

import { scopeCSS } from "./css-scoping-core";

test("scopes regular selectors without changing exempt global selectors", () => {
  const input = `
    :root { color-scheme: light; }
    body { margin: 0; }
    body .hero { color: red; }
    p, .lede, * { color: #222; }
  `;

  const output = scopeCSS(input);
  const compact = output.replace(/\s+/g, " ");

  assert.match(output, /:root\s*\{\s*color-scheme:\s*light;\s*\}/);
  assert.match(output, /body\s*\{\s*margin:\s*0;\s*\}/);
  assert.match(output, /body \.hero\s*\{\s*color:\s*red;\s*\}/);
  assert.match(
    compact,
    /\.newsletter-content p,\s*\.newsletter-content\s+\.lede,\s*\.newsletter-content\s+\*\s*\{/
  );
});

test("preserves keyframes while scoping nested media query selectors", () => {
  const input = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @media only screen and (max-width: 667px) {
      .aa, .w100pc { width: 100% !important; }
      .social-mobile { float: left !important; margin-top: 10px !important; }
    }

    @media screen and (max-width: 320px) {
      .tok-heart { padding-top: 65% !important; }
    }
  `;

  const output = scopeCSS(input);
  const compact = output.replace(/\s+/g, " ");
  const root = postcss.parse(output);
  const mediaRules = root.nodes.filter(
    (node) => node.type === "atrule" && node.name === "media"
  );

  assert.equal(mediaRules.length, 2);
  assert.match(output, /@keyframes fadeIn/);
  assert.ok(!output.includes("}.newsletter-content }"));
  assert.match(
    compact,
    /@media only screen and \(max-width: 667px\) \{[\s\S]*\.newsletter-content \.aa,\s*\.newsletter-content\s+\.w100pc/
  );
  assert.match(
    compact,
    /@media screen and \(max-width: 320px\) \{[\s\S]*\.newsletter-content \.tok-heart/
  );
});

test("does not double-scope selectors that are already inside the newsletter scope", () => {
  const input = `
    .newsletter-content .already-scoped { color: blue; }
    .newsletter-content .already-scoped:hover { color: navy; }
  `;

  const output = scopeCSS(input);

  assert.equal(
    output.match(/\.newsletter-content \.already-scoped/g)?.length,
    2
  );
  assert.ok(!output.includes(".newsletter-content .newsletter-content"));
});

test("keeps a Beehiiv-style mobile stylesheet syntactically valid", () => {
  const input = `
    body { margin: 0; min-width: 100% !important; }
    .body { word-wrap: normal; word-spacing: normal; }
    .embed-img { padding: 0px 0px 12px 0px !important; }

    @media only screen and (max-width:667px)  {
      .aa,
      .w100pc { width: 100% !important; }
      .bb img { width: 100% !important; height: auto !important; max-width: none !important; }
      .mob-show { display: block !important; width: auto !important; }
      .social-mobile { float:left !important; margin-top:10px !important; }
    }

    @media screen and (max-width: 480px) {
      u + .a .gg { width: 100% !important; width: 100vw !important; }
      .tok-heart { padding-top: 75% !important; }
      .tok-play { padding-top: 250px !important; }
    }

    @media screen and (max-width: 320px) {
      .tok-heart { padding-top: 65% !important; }
    }
  `;

  const output = scopeCSS(input);
  const compact = output.replace(/\s+/g, " ");
  const parsed = postcss.parse(output);
  const mediaRules = parsed.nodes.filter(
    (node) => node.type === "atrule" && node.name === "media"
  );

  assert.equal(mediaRules.length, 3);
  assert.ok(!output.includes("}.newsletter-content }"));
  assert.ok(!output.includes("@media screen and (max-width: 320px) {\n\n    .tok-heart"));
  assert.match(
    compact,
    /@media screen and \(max-width: 480px\) \{[\s\S]*\.newsletter-content u \+ \.a \.gg/
  );
  assert.match(
    compact,
    /@media screen and \(max-width: 320px\) \{[\s\S]*\.newsletter-content \.tok-heart/
  );
});
