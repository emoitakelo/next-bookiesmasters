import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // optional but recommended
  images: {
    domains: ["media.api-sports.io"], // allow API Sports logos
  },
};

export default nextConfig;
