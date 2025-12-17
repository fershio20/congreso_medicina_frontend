import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:1337',
  },
  async rewrites() {
    return [
      {
        source: '/api/turismo-page/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:1337'}/api/turismo-page/:path*`,
      },
      {
        source: '/api/turismos/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:1337'}/api/turismos/:path*`,
      },
    ];
  },
};

export default nextConfig;