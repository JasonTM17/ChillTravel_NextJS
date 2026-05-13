import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@vietwander/shared'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'cdn.wanderviet.local' },
    ],
    // Optimize image formats
    formats: ['image/avif', 'image/webp'],
    // Cache optimized images for 1 year (immutable content-addressed)
    minimumCacheTTL: 31536000,
  },
  // Set Cache-Control headers for hashed static assets (Req 5.8)
  headers: async () => [
    {
      // Match Next.js hashed static assets (JS, CSS, media in /_next/static/)
      source: '/_next/static/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      // Match public assets with hash in filename (e.g. logo-abc123.png)
      source: '/brand/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
};

export default nextConfig;
