import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // other config options
  typescript: {
    // This allows deployment even if there are type errors
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
