import test from "node:test";
import assert from "node:assert/strict";

import { sanitizeBeehiivContent } from "./sanitization-core";

test("annotates Beehiiv shell wrappers and wide email blocks for mobile normalization", () => {
  const html = `
    <html>
      <head>
        <style>
          @media only screen and (max-width:667px) {
            .aa { width: 100% !important; }
          }
        </style>
      </head>
      <body>
        <div style="font-size:1rem">
          <table class="gg">
            <tr>
              <td>
                <table class="aa" style="width:670px">
                  <tr>
                    <td class="bodyWrapper" style="padding:5px 8px 10px 8px">
                      <table style="width:634px">
                        <tr>
                          <td style="width:300px">
                            <img src="https://example.com/photo.jpg" width="317" style="width:317px" alt="Downtown Griffin" />
                          </td>
                          <td style="width:75px">
                            <img src="https://example.com/icon.png" width="22" style="max-width:22px" alt="social icon" />
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      </body>
    </html>
  `;

  const result = sanitizeBeehiivContent(html);

  assert.match(result, /class="[^"]*\bgg\b[^"]*\bbeehiiv-shell-root\b[^"]*"/);
  assert.match(
    result,
    /class="[^"]*\baa\b[^"]*\bbeehiiv-shell-frame\b[^"]*\bbeehiiv-mobile-fluid\b[^"]*"/
  );
  assert.match(
    result,
    /class="[^"]*\bbodyWrapper\b[^"]*\bbeehiiv-shell-body\b[^"]*\bbeehiiv-mobile-fluid\b[^"]*"/
  );
  assert.match(
    result,
    /<table(?: class="beehiiv-mobile-fluid" style="width:634px"| style="width:634px" class="beehiiv-mobile-fluid")>/
  );
  assert.match(
    result,
    /<td(?: class="beehiiv-mobile-fluid" style="width:300px"| style="width:300px" class="beehiiv-mobile-fluid")>/
  );
  assert.match(
    result,
    /<img[^>]+src="https:\/\/example.com\/photo.jpg"[^>]+alt="Downtown Griffin"[^>]+loading="lazy"[^>]+class="beehiiv-mobile-fluid"[^>]*\/>/
  );
  assert.doesNotMatch(result, /width:75px" class="beehiiv-mobile-fluid"/);
});

test("normalizes link safety while preserving scoped Beehiiv media rules", () => {
  const html = `
    <html>
      <head>
        <style>
          @media screen and (max-width: 320px) {
            .tok-heart { padding-top: 65% !important; }
          }
        </style>
      </head>
      <body>
        <table class="aa" style="width:670px">
          <tr>
            <td class="bodyWrapper">
              <a href="https://example.com/story">Read more</a>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const result = sanitizeBeehiivContent(html);

  assert.match(
    result,
    /@media screen and \(max-width: 320px\)\s*\{[\s\S]*\.newsletter-content \.tok-heart/
  );
  assert.match(
    result,
    /<a href="https:\/\/example.com\/story" rel="noopener noreferrer" target="_blank">Read more<\/a>/
  );
});

test("strips email-only footer and tracking markup from Beehiiv content", () => {
  const html = `
    <html>
      <body>
        <h2>THE DIGEST</h2>
        <p>Useful local story for Spalding County readers.</p>
        <p>
          Update your email preferences or unsubscribe
          <a href="https://newsletter.griffingrapevine.com/subscribe/SUBSCRIBER_ID/preferences">here</a>
        </p>
        <p>© 2026 Griffin Grapevine 228 Park Ave S, #29976, New York, New York 10003, United States</p>
        <table>
          <tr>
            <td>
              <a href="https://www.beehiiv.com/?utm_source=griffin_grapevine">Powered by beehiiv</a>
            </td>
          </tr>
        </table>
        <a href="https://email.beehiivstatus.com/tracking/hclick">tracking</a>
      </body>
    </html>
  `;

  const result = sanitizeBeehiivContent(html);

  assert.match(result, /Useful local story/);
  assert.doesNotMatch(result, /Update your email preferences/i);
  assert.doesNotMatch(result, /unsubscribe/i);
  assert.doesNotMatch(result, /SUBSCRIBER_ID/i);
  assert.doesNotMatch(result, /Powered by beehiiv/i);
  assert.doesNotMatch(result, /228 Park Ave S/i);
  assert.doesNotMatch(result, /email\.beehiivstatus/i);
});

test("adds safe image defaults and supports issue-specific fallback alt text", () => {
  const html = `
    <html>
      <body>
        <img src="https://example.com/photo.jpg" width="640" />
        <img src="https://beehiiv-images-production.s3.amazonaws.com/uploads/ad_network/ad.jpg" width="300" />
      </body>
    </html>
  `;

  const result = sanitizeBeehiivContent(html, {
    defaultImageAlt: "Spalding County issue image",
  });

  assert.match(result, /<img src="https:\/\/example.com\/photo.jpg" width="640" alt="Spalding County issue image" loading="lazy" class="beehiiv-mobile-fluid" \/>/);
  assert.match(result, /alt="Sponsored message"/);
});

test("preserves Beehiiv sponsor ad rows with subscriber tracking placeholders", () => {
  const html = `
    <html>
      <body>
        <table>
          <tr>
            <td>
              <p><b>In partnership with</b></p>
              <a href="https://www.masterworks.com/?utm_source=beehiiv&bhcl_id=52ead00f_SUBSCRIBER_ID_{{email_address_id}}" target="_blank" rel="noopener noreferrer nofollow">
                <img src="https://beehiiv-images-production.s3.amazonaws.com/uploads/ad_network/advertiser/logo/logo.png" width="300" style="display:block;" />
              </a>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const result = sanitizeBeehiivContent(html);

  assert.match(result, /In partnership with/);
  assert.match(result, /https:\/\/www\.masterworks\.com\/\?utm_source=beehiiv&amp;bhcl_id=52ead00f_SUBSCRIBER_ID_\{\{email_address_id\}\}/);
  assert.match(result, /uploads\/ad_network\/advertiser\/logo\/logo\.png/);
  assert.match(result, /alt="Sponsored message"/);
});

test("can strip the first Beehiiv heading when the article hero already renders it", () => {
  const html = `
    <html>
      <body>
        <h1>Original newsletter heading</h1>
        <p>Article body starts here.</p>
      </body>
    </html>
  `;

  const result = sanitizeBeehiivContent(html, { stripFirstHeading: true });

  assert.doesNotMatch(result, /Original newsletter heading/);
  assert.match(result, /Article body starts here/);
});
