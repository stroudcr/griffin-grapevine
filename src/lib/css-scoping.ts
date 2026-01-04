import "server-only";

/**
 * Scopes CSS selectors to prevent global style pollution
 * Transforms: "ol { ... }" → ".newsletter-content ol { ... }"
 */

export interface ScopeCSSOptions {
  scopeClass?: string;
  preserveKeyframes?: boolean;
}

export function scopeCSS(
  css: string,
  options: ScopeCSSOptions = {}
): string {
  const { scopeClass = '.newsletter-content', preserveKeyframes = true } = options;

  let result = css;
  const keyframes: string[] = [];

  // Extract and preserve @keyframes (animations are referenced globally by name)
  if (preserveKeyframes) {
    result = result.replace(
      /@keyframes\s+([\w-]+)\s*\{((?:[^{}]|\{[^{}]*\})*?)\}/g,
      (_match, name, content) => {
        const fullKeyframe = `@keyframes ${name} {${content}}`;
        keyframes.push(fullKeyframe);
        return `/* KEYFRAME_PLACEHOLDER_${keyframes.length - 1} */`;
      }
    );
  }

  // Process @media queries recursively
  result = result.replace(
    /@media\s*([^{]+)\s*\{([\s\S]*?)\}\s*(?=\s*[@}]|$)/g,
    (_match, mediaQuery, content) => {
      const scopedContent = scopeSelectors(content, scopeClass);
      return `@media ${mediaQuery} {\n${scopedContent}\n}`;
    }
  );

  // Process regular CSS rules
  result = scopeSelectors(result, scopeClass);

  // Restore keyframes at the end
  keyframes.forEach((kf, index) => {
    result = result.replace(`/* KEYFRAME_PLACEHOLDER_${index} */`, kf);
  });

  return result;
}

function scopeSelectors(css: string, scopeClass: string): string {
  // Split into rules: "selector { properties }"
  const rulePattern = /([^{]+)\s*\{([^}]*)\}/g;

  return css.replace(rulePattern, (match, selectorList, properties) => {
    // Skip at-rules that aren't selector-based
    const trimmedSelectorList = selectorList.trim();
    if (trimmedSelectorList.startsWith('@')) {
      return match;
    }

    // Skip comment placeholders
    if (trimmedSelectorList.startsWith('/*')) {
      return match;
    }

    // Split multiple selectors (comma-separated)
    const selectors = selectorList.split(',').map((s: string) => s.trim());

    // Scope each selector
    const scopedSelectors = selectors.map((selector: string) => {
      return scopeSelector(selector, scopeClass);
    });

    return `${scopedSelectors.join(',\n')} {${properties}}`;
  });
}

function scopeSelector(selector: string, scopeClass: string): string {
  const trimmed = selector.trim();

  // Skip empty selectors
  if (!trimmed) {
    return trimmed;
  }

  // Skip selectors that should not be scoped
  const skipPatterns = [
    /^:root$/,
    /^html/,
    /^body$/,
    /^body\s/,
    /^@/,  // At-rules
    /^\/\*/,  // Comments
  ];

  for (const pattern of skipPatterns) {
    if (pattern.test(trimmed)) {
      return trimmed;
    }
  }

  // Already scoped - avoid double scoping
  if (trimmed.startsWith(scopeClass)) {
    return trimmed;
  }

  // Special case: Universal selector alone
  if (trimmed === '*') {
    return `${scopeClass} *`;
  }

  // Standard case: Prefix with scope class
  // This handles:
  // - Element selectors (div, p, ol)
  // - Class selectors (.class)
  // - ID selectors (#id)
  // - Pseudo-classes (:hover, :focus)
  // - Pseudo-elements (::before, ::after)
  // - Attribute selectors ([type="text"])
  // - Combinators (>, +, ~, space)
  return `${scopeClass} ${trimmed}`;
}
