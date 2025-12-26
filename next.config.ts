import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Suppress middleware deprecation warning in Next.js 16
    // The middleware.ts file is still the correct approach for auth
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
