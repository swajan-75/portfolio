import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://backend-two-chi-91.vercel.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;

