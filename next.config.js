/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    // Disable webpack cache to prevent ArrayBuffer issues
    webpackBuildWorker: false,
  },
  webpack: (config, { dev, isServer }) => {
    // Disable webpack cache in development to prevent corruption
    if (dev) {
      config.cache = false;
    }
    
    // Handle pg module for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }
    
    return config;
  },
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com', 'images.pexels.com'],
    unoptimized: true,
  },
  // Disable static optimization for pages that use server-side features
  experimental: {
    esmExternals: 'loose',
  },
};

module.exports = nextConfig;