import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['10.2.134.5'],
  experimental: {
    serverActions: { bodySizeLimit: '2mb' },
  },
};
export default nextConfig;