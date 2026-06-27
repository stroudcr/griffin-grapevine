import type { Metadata } from "next";
import { SITE_CONFIG } from "./constants";

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}

export function buildPageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const url = `${SITE_CONFIG.url}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: SITE_CONFIG.locale,
      url,
      siteName: SITE_CONFIG.name,
      title,
      description,
      images: [
        {
          url: SITE_CONFIG.defaultOgImage,
          width: 1200,
          height: 630,
          alt: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline} for ${SITE_CONFIG.location.county}, ${SITE_CONFIG.location.stateCode}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SITE_CONFIG.defaultOgImage],
    },
    robots: noIndex
      ? {
          index: false,
          follow: true,
        }
      : undefined,
  };
}
