import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      // Autorise les images servies par l'API si elle renvoie un domaine custom
      { protocol: "https", hostname: "node-eemi.vercel.app" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "localhost" },
    ],
  },
  transpilePackages: ["lucide-react"],
};

export default nextConfig;
