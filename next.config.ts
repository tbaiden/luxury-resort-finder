import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.soneva.com",
      },
      {
        protocol: "https",
        hostname: "cache.marriott.com",
      },
      {
        protocol: "https",
        hostname: "www.aman.com",
      },
      {
        protocol: "https",
        hostname: "www.chevalblanc.com",
      },
      {
        protocol: "https",
        hostname: "www.sixsenses.com",
      },
    ],
  },
};

export default nextConfig;
