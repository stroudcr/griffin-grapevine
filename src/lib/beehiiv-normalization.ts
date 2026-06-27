type HtmlAttribs = Record<string, string>;

const MOBILE_FLUID_WIDTH_PX = 280;

export function normalizeBeehiivAttributes(
  tagName: string,
  attribs: HtmlAttribs,
  options: { defaultImageAlt?: string } = {}
): HtmlAttribs {
  const nextAttribs = { ...attribs };

  if (tagName === "a") {
    const href = attribs.href || "";
    const isInternal = href.startsWith("/") || href.startsWith("#");

    if (!isInternal) {
      nextAttribs.rel = attribs.rel || "noopener noreferrer";
      nextAttribs.target = attribs.target || "_blank";
    }
  }

  if (tagName === "img") {
    nextAttribs.alt = normalizeImageAlt(nextAttribs, options.defaultImageAlt);
    nextAttribs.loading = nextAttribs.loading || "lazy";

    const widthHint = getWidthHint(nextAttribs);
    if (widthHint !== null && !nextAttribs.width) {
      nextAttribs.width = String(Math.round(widthHint));
    }
  }

  const classes = getClassNames(nextAttribs.class);
  const widthHint = getWidthHint(nextAttribs);

  if (tagName === "table" && classes.has("gg")) {
    classes.add("beehiiv-shell-root");
  }

  if (tagName === "table" && classes.has("aa")) {
    classes.add("beehiiv-shell-frame");
    classes.add("beehiiv-mobile-fluid");
  }

  if (tagName === "td" && classes.has("bodyWrapper")) {
    classes.add("beehiiv-shell-body");
    classes.add("beehiiv-mobile-fluid");
  }

  if (
    isMobileFluidCandidate(tagName) &&
    widthHint !== null &&
    widthHint >= MOBILE_FLUID_WIDTH_PX
  ) {
    classes.add("beehiiv-mobile-fluid");
  }

  if (classes.size > 0) {
    nextAttribs.class = [...classes].join(" ");
  }

  return nextAttribs;
}

function normalizeImageAlt(attribs: HtmlAttribs, defaultImageAlt?: string): string {
  const existingAlt = attribs.alt?.trim();
  if (existingAlt !== undefined) {
    return existingAlt;
  }

  const src = attribs.src || "";
  if (src.includes("/ad_network/")) {
    return "Sponsored message";
  }

  if (src.includes("facebook")) {
    return "Facebook";
  }

  if (src.includes("instagram")) {
    return "Instagram";
  }

  return defaultImageAlt || "";
}

function isMobileFluidCandidate(tagName: string): boolean {
  return tagName === "table" || tagName === "td" || tagName === "img";
}

function getClassNames(value?: string): Set<string> {
  if (!value) {
    return new Set();
  }

  return new Set(
    value
      .split(/\s+/)
      .map((className) => className.trim())
      .filter(Boolean)
  );
}

function getWidthHint(attribs: HtmlAttribs): number | null {
  const styleWidth = getPxValue(attribs.style, "width");

  if (styleWidth !== null) {
    return styleWidth;
  }

  const widthAttr = attribs.width?.trim();
  if (!widthAttr) {
    return null;
  }

  const numericWidth = Number.parseFloat(widthAttr);
  return Number.isFinite(numericWidth) ? numericWidth : null;
}

function getPxValue(styleValue: string | undefined, property: string): number | null {
  if (!styleValue) {
    return null;
  }

  const match = styleValue.match(
    new RegExp(`(?:^|;)\\s*${property}\\s*:\\s*(\\d+(?:\\.\\d+)?)px`, "i")
  );

  if (!match) {
    return null;
  }

  const numericValue = Number.parseFloat(match[1]);
  return Number.isFinite(numericValue) ? numericValue : null;
}
