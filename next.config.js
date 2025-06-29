/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production configuration
  trailingSlash: true,
  
  // Images configuration
  images: {
    unoptimized: true,
    domains: ['images.pexels.com'],
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.js'
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_REVENUECAT_API_KEY: process.env.NEXT_PUBLIC_REVENUECAT_API_KEY,
  },
  
  // Webpack configuration
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
    
    // Path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };
    
    return config;
  },
  
  // React strict mode
  reactStrictMode: true,
  
  // Production optimizations
  swcMinify: true,
  
  // TypeScript configuration
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: false,
  },
  
  // Output configuration
  output: 'standalone',
  
  // Compression
  compress: true,
  
  // Powered by header
  poweredByHeader: false,
}

module.exports = nextConfig