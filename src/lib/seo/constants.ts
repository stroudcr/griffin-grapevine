export const SITE_CONFIG = {
  name: "Griffin Grapevine",
  tagline: "Local News with Character",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.griffingrapevine.com",
  email: "griffin@welldiem.com",
  locale: "en_US",

  // Location data for Spalding County, GA
  location: {
    county: "Spalding County",
    state: "Georgia",
    stateCode: "GA",
    country: "US",
    latitude: 33.2468,
    longitude: -84.2641,
  },

  // Cities served within Spalding County
  cities: [
    "Griffin",
    "Orchard Hill",
    "Sunny Side",
  ] as const,

  // Social media profiles (placeholder - update when accounts are created)
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61586121189986",
    instagram: "https://www.instagram.com/griffingrapevine",
  },

  // Default images
  defaultOgImage: "https://www.griffingrapevine.com/griffin-og-image.png",
  logo: "https://www.griffingrapevine.com/horizontal.jpg",
  logoWidth: 1215,
  logoHeight: 238,
};

export const TARGET_KEYWORDS = {
  primary: [
    "spalding county news",
    "spalding county ga news",
  ],
  secondary: [
    "griffin ga news",
    "orchard hill ga news",
    "sunny side ga news",
  ],
  longTail: [
    "spalding county local news",
    "griffin georgia news",
    "spalding county community news",
    "south metro atlanta news",
    "spalding county events",
    "spalding county newsletter",
  ],
};

// Flattened keywords array for metadata
export const ALL_KEYWORDS = [
  ...TARGET_KEYWORDS.primary,
  ...TARGET_KEYWORDS.secondary,
  ...TARGET_KEYWORDS.longTail,
  "Spalding County",
  "Georgia",
  "local news",
  "newsletter",
  "community",
];
