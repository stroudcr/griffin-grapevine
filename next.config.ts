import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  turbopack: {
    root: process.cwd(),
  },

  async redirects() {
    return [
      { source: "/griffin-ga-news", destination: "/issues", permanent: true },
      { source: "/local-government", destination: "/spalding-county-events", permanent: true },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.beehiiv.com",
      },
      {
        protocol: "https",
        hostname: "media.beehiiv.com",
      },
      {
        protocol: "https",
        hostname: "beehiiv-images-production.s3.amazonaws.com",
      },
      {
        // Photos business owners upload to their guide listings (Vercel Blob)
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
    formats: ["image/webp", "image/avif"],
    qualities: [75, 80, 85],
  },
};

export default nextConfig;
