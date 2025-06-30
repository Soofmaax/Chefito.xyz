/** @type {import('next').NextConfig} */
const path = require('path');

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
    // Utilise un chemin relatif simple au lieu de path.resolve
    loaderFile: './src/lib/imageLoader.js'
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
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },
  typescript: {
    ignoreBuildErrors: false,
  }
};

module.exports = nextConfig;
