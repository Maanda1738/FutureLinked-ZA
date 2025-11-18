/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    NEXT_PUBLIC_GOOGLE_ADSENSE_ID: process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/:path*`,
      },
    ];
  },
  // Configure webpack to properly handle PDF parsing libraries
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Don't bundle these server-only packages
      config.externals = config.externals || [];
      config.externals.push('pdf-parse', 'canvas');
    }
    return config;
  },
};

module.exports = nextConfig;