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
  
  // Performance optimizations
  reactStrictMode: true,
  
  // Compiler options for better performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Optimize images for faster loading
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // Enable optimizations for faster imports
    optimizePackageImports: [
      '@radix-ui/react-accordion',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-label',
      '@radix-ui/react-popover',
      '@radix-ui/react-progress',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-slot',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      '@radix-ui/react-tooltip',
      'lucide-react',
    ],
  },
};

export default nextConfig;
