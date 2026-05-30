import "server-only";
import sanitizeHtml from 'sanitize-html';
import { scopeCSS } from './css-scoping';

interface SanitizeBeehiivOptions {
  defaultImageAlt?: string;
  stripFirstHeading?: boolean;
}

const UTILITY_TEXT_PATTERNS = [
  /read online/i,
  /share griffin grapevine/i,
  /no longer want/i,
  /unsubscribe/i,
  /manage preferences/i,
  /update your profile/i,
  /powered by beehiiv/i,
  /beehiiv logo/i,
  /in partnership with/i,
];

function normalizeUtilityText(value: string | undefined): string {
  return (value || "").replace(/\s+/g, " ").trim();
}

function isUtilityHref(href: string | undefined): boolean {
  const value = href || "";

  return [
    "/cdn-cgi/l/email-protection",
    "/subscribe/",
    "unsubscribe",
    "preferences",
    "email-protection",
    "referral",
    "beehiiv.com",
  ].some((needle) => value.toLowerCase().includes(needle));
}

function isUtilityImage(attribs: Record<string, string | undefined>): boolean {
  const src = attribs.src || "";
  const alt = normalizeUtilityText(attribs.alt).toLowerCase();

  return (
    /static_assets\/(facebook|instagram|linkedin|twitter|x_|beehiiv)/i.test(src) ||
    /output-onlinepngtools|ad_network\/advertiser\/logo/i.test(src) ||
    ["fb", "ig", "x", "linkedin", "beehiiv logo"].includes(alt)
  );
}

function removeFirstHeading(html: string): string {
  return html.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/i, "");
}

/**
 * Sanitizes HTML content from Beehiiv newsletter API
 * Configured to allow typical newsletter content while preventing XSS
 *
 * Defense-in-depth: Even though Beehiiv strips dangerous content,
 * we apply our own sanitization layer for security.
 */
export function sanitizeBeehiivContent(
  html: string,
  options: SanitizeBeehiivOptions = {}
): string {
  // Beehiiv returns a full HTML document with <html>, <head>, <body>, and <style> tags
  // We need to extract the CSS and body content separately

  // Extract CSS from style tags
  const styleMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
  const styles = styleMatches ? styleMatches.map(match => {
    return match.replace(/<\/?style[^>]*>/gi, '');
  }).join('\n') : '';

  // Extract body content
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyContent = options.stripFirstHeading
    ? removeFirstHeading(bodyMatch ? bodyMatch[1] : html)
    : bodyMatch ? bodyMatch[1] : html;

  // Sanitize the body content
  const sanitizedBody = sanitizeHtml(bodyContent, {
    allowedTags: [
      // Text formatting
      'p', 'br', 'strong', 'em', 'u', 's', 'b', 'i',
      // Headers
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      // Lists
      'ul', 'ol', 'li',
      // Links and media
      'a', 'img', 'figure', 'figcaption', 'iframe',
      // Quotes and code
      'blockquote', 'pre', 'code',
      // Tables
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      // Layout
      'div', 'span', 'hr', 'section', 'article', 'header', 'footer',
      // Style tag (for Beehiiv CSS)
      'style',
    ],
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'style'],
      iframe: ['src', 'width', 'height', 'frameborder', 'allowfullscreen'],
      '*': ['class', 'id', 'style'],
    },
    allowedIframeHostnames: [
      'www.youtube.com',
      'player.vimeo.com',
      'open.spotify.com',
      'twitter.com',
      'platform.twitter.com',
    ],
    allowedStyles: {
      '*': {
        // Allow all CSS properties for Beehiiv's styling
        'color': [/.*/],
        'background-color': [/.*/],
        'font-size': [/.*/],
        'font-family': [/.*/],
        'font-weight': [/.*/],
        'text-align': [/.*/],
        'margin': [/.*/],
        'padding': [/.*/],
        'border': [/.*/],
        'width': [/.*/],
        'height': [/.*/],
        'max-width': [/.*/],
        'display': [/.*/],
        'line-height': [/.*/],
      },
    },
    transformTags: {
      'a': (tagName, attribs) => {
        const href = attribs.href || "";
        const isInternal = href.startsWith("/") || href.startsWith("#");

        return {
          tagName,
          attribs: {
            ...attribs,
            ...(isInternal ? {} : {
              rel: 'noopener noreferrer',
              target: attribs.target || '_blank',
            }),
          },
        };
      },
      'img': (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          alt: normalizeUtilityText(attribs.alt) || options.defaultImageAlt || "Griffin Grapevine issue image",
          loading: attribs.loading || "lazy",
        },
      }),
    },
    exclusiveFilter: (frame) => {
      const text = normalizeUtilityText(frame.text);

      if (frame.tag === "a" && isUtilityHref(frame.attribs.href)) {
        return true;
      }

      if (frame.tag === "img" && isUtilityImage(frame.attribs)) {
        return true;
      }

      if (
        ["p", "div", "section", "footer", "header", "table", "tr"].includes(frame.tag) &&
        text.length < 320 &&
        UTILITY_TEXT_PATTERNS.some((pattern) => pattern.test(text))
      ) {
        return true;
      }

      return false;
    },
  });

  // Combine CSS and sanitized content
  if (styles) {
    // Scope the CSS to prevent global pollution
    const scopedStyles = scopeCSS(styles, { scopeClass: '.newsletter-content' });
    return `<style>${scopedStyles}</style>\n${sanitizedBody}`;
  }

  return sanitizedBody;
}
