import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Resume PDFs (capped at 2MB in the form) go through a server action.
      bodySizeLimit: "3mb",
    },
  },
};

export default nextConfig;
