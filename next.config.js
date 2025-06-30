/** @type {import('next').NextConfig} */

const nextConfig = {
  trailingSlash: true,
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,

  images: {
    unoptimized: true,
    domains: ['images.pexels.com'],
    loader: 'custom',
    loaderFile: 'src/lib/imageLoader.js' // ✅ Pas de './' ni de path.resolve
  },

  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_REVENUECAT_API_KEY: process.env.NEXT_PUBLIC_REVENUECAT_API_KEY,
  },

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

    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };

    return config;
  },

  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
