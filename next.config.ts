import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Disable the development-mode floating build indicator
  // so it never appears as part of the Toolora UI
  devIndicators: false,
};

export default nextConfig;
