import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { JsonLd, MetaPixel } from "@/components";
import { generateOrganizationSchema } from "@/lib/seo/schemas";
import { ALL_KEYWORDS, SITE_CONFIG } from "@/lib/seo/constants";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#1c1e4d",
  colorScheme: "light",
};

export const metadata: Metadata = {
  title: {
    default: "Griffin Grapevine | Spalding County GA News & Community Updates",
    template: "%s | Griffin Grapevine - Spalding County News",
  },
  description:
    "Your trusted source for Spalding County GA news. Local news, events, and community updates from Griffin, Orchard Hill, and Sunny Side. Free weekly newsletter.",
  keywords: ALL_KEYWORDS,
  authors: [{ name: "Griffin Grapevine" }],
  creator: "Griffin Grapevine",
  publisher: "Griffin Grapevine",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: "Griffin Grapevine | Spalding County GA News & Community Updates",
    description:
      "Your trusted source for Spalding County GA news. Local news, events, and community updates from Griffin, Orchard Hill, and Sunny Side.",
    images: [
      {
        url: `${SITE_CONFIG.url}/OG-image.png`,
        width: 1200,
        height: 630,
        alt: "Griffin Grapevine - Local News with Character for Spalding County, GA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Griffin Grapevine | Spalding County GA News",
    description:
      "Your trusted source for Spalding County GA news. Local news from Griffin, Orchard Hill, Sunny Side & more.",
    images: [`${SITE_CONFIG.url}/OG-image.png`],
  },
  metadataBase: new URL(SITE_CONFIG.url),
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/Favicon.jpg", type: "image/jpeg" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  // Geo-targeting meta tags for local SEO
  other: {
    "geo.region": "US-GA",
    "geo.placename": "Spalding County, Georgia",
    "geo.position": `${SITE_CONFIG.location.latitude};${SITE_CONFIG.location.longitude}`,
    ICBM: `${SITE_CONFIG.location.latitude}, ${SITE_CONFIG.location.longitude}`,
    "content-language": "en-US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = generateOrganizationSchema();
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

  return (
    <html lang="en">
      <head>
        <JsonLd data={organizationSchema} />
        <MetaPixel pixelId={metaPixelId} />
      </head>
      <body className={`${inter.variable} ${sourceSerif.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
