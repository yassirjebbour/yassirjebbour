import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native / ML packages run in Node and must not be bundled.
  serverExternalPackages: ["@huggingface/transformers", "onnxruntime-node", "pg", "unpdf", "mammoth"],
  poweredByHeader: false,
  output: "standalone",
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
