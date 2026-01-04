import "server-only";
import sanitizeHtml from 'sanitize-html';
import { scopeCSS } from './css-scoping';

/**
 * Sanitizes HTML content from Beehiiv newsletter API
 * Configured to allow typical newsletter content while preventing XSS
 *
 * Defense-in-depth: Even though Beehiiv strips dangerous content,
 * we apply our own sanitization layer for security.
 */
export function sanitizeBeehiivContent(html: string): string {
  // Beehiiv returns a full HTML document with <html>, <head>, <body>, and <style> tags
  // We need to extract the CSS and body content separately

  // Extract CSS from style tags
  const styleMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
  const styles = styleMatches ? styleMatches.map(match => {
    return match.replace(/<\/?style[^>]*>/gi, '');
  }).join('\n') : '';

  // Extract body content
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyContent = bodyMatch ? bodyMatch[1] : html;

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
      'a', 'img', 'figure', 'figcaption',
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
      'a': (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          rel: 'noopener noreferrer',
          target: attribs.target || '_blank',
        },
      }),
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
