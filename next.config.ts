import type { NextConfig } from 'next';

// Lingo.dev Compiler integration for multilingual UI
// In production, import { withLingo } from '@lingo.dev/compiler'
// and wrap the config: export default withLingo(nextConfig, lingoConfig)

const nextConfig: NextConfig = {
  // Lingo.dev will be configured here
  // lingo: {
  //   locales: ['en', 'es', 'de', 'fr', 'ja'],
  //   defaultLocale: 'en',
  //   buildMode: 'ai', // Use 'pseudotranslator' for dev
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
