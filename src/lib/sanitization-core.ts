import sanitizeHtml from "sanitize-html";

import { normalizeBeehiivAttributes } from "./beehiiv-normalization";
import { scopeCSS } from "./css-scoping-core";

interface SanitizeBeehiivOptions {
  defaultImageAlt?: string;
  stripFirstHeading?: boolean;
}

const EMAIL_ONLY_URL_PATTERNS = [
  /\/preferences(?:\?|$)/i,
  /\/subscribe\/.*\/preferences/i,
  /hp\.beehiiv\.com/i,
  /email\.beehiivstatus\.com/i,
  /beehiiv\.com\/\?/i,
  /unsubscribe/i,
];

const EMAIL_ONLY_TEXT_PATTERNS = [
  /Update your email preferences/i,
  /unsubscribe/i,
  /manage preferences/i,
  /Powered by beehiiv/i,
  /228 Park Ave S/i,
  /New York,\s*New York\s*10003/i,
];

export function sanitizeBeehiivContent(
  html: string,
  options: SanitizeBeehiivOptions = {}
): string {
  const styleMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
  const styles = styleMatches
    ? styleMatches
        .map((match) => match.replace(/<\/?style[^>]*>/gi, ""))
        .join("\n")
    : "";

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const rawBodyContent = bodyMatch ? bodyMatch[1] : html;
  const bodyContent = stripEmailOnlyMarkup(
    options.stripFirstHeading ? removeFirstHeading(rawBodyContent) : rawBodyContent
  );

  const sanitizedBody = sanitizeHtml(bodyContent, {
    allowVulnerableTags: true,
    allowedTags: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "s",
      "b",
      "i",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "a",
      "img",
      "figure",
      "figcaption",
      "blockquote",
      "pre",
      "code",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "div",
      "span",
      "hr",
      "section",
      "article",
      "header",
      "footer",
      "style",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading", "style"],
      iframe: ["src", "width", "height", "frameborder", "allowfullscreen"],
      "*": ["class", "id", "style"],
    },
    allowedIframeHostnames: [
      "www.youtube.com",
      "player.vimeo.com",
      "open.spotify.com",
      "twitter.com",
      "platform.twitter.com",
    ],
    allowedStyles: {
      "*": {
        color: [/.*/],
        "background-color": [/.*/],
        "font-size": [/.*/],
        "font-family": [/.*/],
        "font-weight": [/.*/],
        "text-align": [/.*/],
        margin: [/.*/],
        padding: [/.*/],
        border: [/.*/],
        width: [/.*/],
        height: [/.*/],
        "max-width": [/.*/],
        display: [/.*/],
        "line-height": [/.*/],
      },
    },
    textFilter: (text, tagName) => {
      if (tagName === "a" && text.trim().toLowerCase() === "here") {
        return "Learn more";
      }

      return text.replace(/SUBSCRIBER_ID/g, "");
    },
    exclusiveFilter: (frame) => {
      const href = frame.attribs.href || "";
      const src = frame.attribs.src || "";
      const text = frame.text || "";

      if (isEmailOnlyUrl(href) || isEmailOnlyUrl(src)) {
        return true;
      }

      if (EMAIL_ONLY_TEXT_PATTERNS.some((pattern) => pattern.test(text))) {
        return true;
      }

      return false;
    },
    transformTags: {
      "*": (tagName, attribs) => ({
        tagName,
        attribs: normalizeBeehiivAttributes(tagName, attribs, {
          defaultImageAlt: options.defaultImageAlt,
        }),
      }),
    },
  });

  if (styles) {
    const scopedStyles = scopeCSS(styles, { scopeClass: ".newsletter-content" });
    return `<style>${scopedStyles}</style>\n${sanitizedBody}`;
  }

  return sanitizedBody;
}

function stripEmailOnlyMarkup(html: string): string {
  return html
    .replace(
      /<tr\b[^>]*>(?:(?!<\/tr>)[\s\S])*(?:Update your email preferences|Powered by beehiiv|email\.beehiivstatus\.com|hp\.beehiiv\.com)(?:(?!<\/tr>)[\s\S])*<\/tr>/gi,
      ""
    )
    .replace(
      /<p\b[^>]*>(?:(?!<\/p>)[\s\S])*(?:Update your email preferences|unsubscribe|manage preferences|228 Park Ave S|New York,\s*New York\s*10003)(?:(?!<\/p>)[\s\S])*<\/p>/gi,
      ""
    )
    .replace(
      /<a\b[^>]*href=["'][^"']*(?:\/preferences|hp\.beehiiv\.com|email\.beehiivstatus\.com|beehiiv\.com\/\?|unsubscribe)[^"']*["'][^>]*>[\s\S]*?<\/a>/gi,
      ""
    );
}

function removeFirstHeading(html: string): string {
  return html.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/i, "");
}

function isEmailOnlyUrl(value: string): boolean {
  return EMAIL_ONLY_URL_PATTERNS.some((pattern) => pattern.test(value));
}
