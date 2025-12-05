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
      // Vercel Blob public storage (images distantes ajoutées dynamiquement)
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
    ],
  },
  transpilePackages: ["lucide-react"],
  eslint: {
    // Ignorer les erreurs ESLint pendant le build en production
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignorer les erreurs TypeScript pendant le build si nécessaire
    // Mettre à true seulement si vous avez des problèmes de types
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
