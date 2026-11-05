import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Native / ML packages run in Node and must not be bundled.
  serverExternalPackages: ["@huggingface/transformers", "onnxruntime-node", "pg", "unpdf", "mammoth"],
  poweredByHeader: false,
  output: "standalone",
  // On Vercel the local embedding model is not deployed (EMBEDDINGS_PROVIDER=none), so its native runtime is
  // left out of the functions, which it would push past Vercel's size limit.
  outputFileTracingExcludes: process.env.VERCEL ? { "*": ["node_modules/onnxruntime-node/**", "node_modules/@huggingface/transformers/**", "models/**"] } : {},
  turbopack: {
    root: path.join(__dirname),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
