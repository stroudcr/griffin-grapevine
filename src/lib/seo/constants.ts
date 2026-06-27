export const SITE_CONFIG = {
  name: "Griffin Grapevine",
  tagline: "Local News with Character",
  editionLabel: "Local Edition",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.griffingrapevine.com",
  email: "griffin@welldiem.com",
  locale: "en_US",
  foundedYear: "2025",

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
  fallbackOgImage: "https://www.griffingrapevine.com/griffin-og-image.png",
  logo: "https://www.griffingrapevine.com/horizontal.jpg",
  logoPath: "/horizontal.jpg",
  logoWidth: 1215,
  logoHeight: 238,
  heroImage: "/DowntownGriffin.webp",
  heroImageAlt: "Aerial view of downtown Griffin, Georgia",
  scenicImage: "/DowntownGriffin.webp",
  scenicImageAlt: "A scenic view over downtown Griffin, Georgia",

  beehiiv: {
    apiKeyEnv: "BEEHIIV_API_KEY",
    publicationIdEnv: "BEEHIIV_PUBLICATION_ID",
  },

  newsletter: {
    successMessage: "Welcome to the Griffin Grapevine!",
    heroAudience: "Join your neighbors in inboxes across Spalding County.",
    deliveryPromise: "Weekly delivery. Local reporting. Always free.",
    signupContentName: "griffin_grapevine_newsletter",
  },

  phrases: {
    market: "Spalding County",
    primaryCity: "Griffin",
    cityList: "Griffin, Orchard Hill, and Sunny Side",
    shortCoverage: "Griffin and communities across Spalding County",
    communityDescription:
      "Trusted local reporting for Spalding County, with a calmer inbox rhythm and a closer read on the stories shaping daily life in Griffin, Orchard Hill, Sunny Side, and nearby communities.",
  },
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
