import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BAWSALA",
    short_name: "BAWSALA",
    description: "Discover what you can do, prove it, and get ready for real opportunities.",
    start_url: "/app",
    scope: "/",
    display: "standalone",
    background_color: "#F8F6EF",
    theme_color: "#0F3D36",
    icons: [
      { src: "/brand/bawsala-app-icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/brand/app-icon-1024.png", sizes: "1024x1024", type: "image/png", purpose: "any" },
    ],
  };
}
