import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  turbopack: {
    root: process.cwd(),
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
    ],
    formats: ["image/webp", "image/avif"],
    qualities: [75, 80, 85],
  },
};

export default nextConfig;
