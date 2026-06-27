import postcss, { AtRule, Node, Rule } from "postcss";
import selectorParser from "postcss-selector-parser";

export interface ScopeCSSOptions {
  scopeClass?: string;
  preserveKeyframes?: boolean;
}

const DEFAULT_SCOPE_CLASS = ".newsletter-content";

export function scopeCSS(
  css: string,
  options: ScopeCSSOptions = {}
): string {
  const {
    scopeClass = DEFAULT_SCOPE_CLASS,
    preserveKeyframes = true,
  } = options;

  const root = postcss.parse(css);

  root.walkRules((rule) => {
    if (shouldSkipRule(rule, scopeClass, preserveKeyframes)) {
      return;
    }

    rule.selector = scopeSelectorList(rule.selector, scopeClass);
  });

  return root.toString();
}

function shouldSkipRule(
  rule: Rule,
  scopeClass: string,
  preserveKeyframes: boolean
): boolean {
  const selector = rule.selector?.trim();

  if (!selector) {
    return true;
  }

  if (selector.startsWith("/*")) {
    return true;
  }

  if (selector.startsWith(scopeClass)) {
    return true;
  }

  if (preserveKeyframes && isInsideKeyframes(rule)) {
    return true;
  }

  return false;
}

function isInsideKeyframes(rule: Rule): boolean {
  let current: Node | undefined = rule.parent ?? undefined;

  while (current) {
    if (
      current.type === "atrule" &&
      isKeyframesAtRule(current as AtRule)
    ) {
      return true;
    }

    current = current.parent ?? undefined;
  }

  return false;
}

function isKeyframesAtRule(node: AtRule): boolean {
  return /keyframes$/i.test(node.name);
}

function scopeSelectorList(selectorList: string, scopeClass: string): string {
  return selectorParser((selectors) => {
    selectors.each((selector) => {
      const rawSelector = selector.toString().trim();

      if (!rawSelector || shouldSkipSelector(rawSelector, scopeClass)) {
        return;
      }

      selector.prepend(selectorParser.combinator({ value: " " }));
      prependScope(selector, scopeClass);
    });
  }).processSync(selectorList);
}

function prependScope(
  selector: selectorParser.Selector,
  scopeClass: string
): void {
  const scopeAst = selectorParser().astSync(scopeClass);
  const scopeNodes = scopeAst.first?.nodes ?? [];

  for (let index = scopeNodes.length - 1; index >= 0; index -= 1) {
    selector.prepend(scopeNodes[index].clone());
  }
}

function shouldSkipSelector(selector: string, scopeClass: string): boolean {
  const trimmed = selector.trim();

  if (!trimmed) {
    return true;
  }

  if (trimmed.startsWith(scopeClass)) {
    return true;
  }

  return (
    trimmed === ":root" ||
    trimmed === "html" ||
    trimmed === "body" ||
    trimmed.startsWith("html ") ||
    trimmed.startsWith("body ")
  );
}
