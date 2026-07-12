import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/Appointment',
  assetPrefix: '/Appointment/',
  env: {
    NEXT_PUBLIC_BASE_PATH: '/Appointment',
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
