import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/GraphQL",
  assetPrefix: "/GraphQL/",
  trailingSlash: true,
  output: 'export',
  images: {
    unoptimized: true
  }
};

export default nextConfig;
