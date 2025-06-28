/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration pour le déploiement Netlify
  trailingSlash: true,
  
  // Images configuration
  images: {
    unoptimized: true,
    domains: ['images.pexels.com'],
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.js'
  },
  
  // Variables d'environnement
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_REVENUECAT_API_KEY: process.env.NEXT_PUBLIC_REVENUECAT_API_KEY,
  },
  
  // Configuration webpack pour résoudre les erreurs
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        path: false,
        os: false,
        stream: false,
        util: false,
        buffer: false,
        events: false,
        url: false,
        querystring: false,
      };
    }
    
    // Résoudre les alias de chemins
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };
    
    return config;
  },
  
  // Désactiver le mode strict pour éviter les erreurs
  reactStrictMode: false,
  
  // Configuration ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Configuration TypeScript
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig