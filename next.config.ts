import type { NextConfig } from "next";

const basePath = '/Chloroplan';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  basePath,
  assetPrefix: `${basePath}/`,
  // Les chemins écrits à la main (ex. <img src>) ne reçoivent pas le basePath automatiquement
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
