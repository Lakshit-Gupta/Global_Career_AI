import type { NextConfig } from 'next';
import { withLingo } from '@lingo.dev/compiler/next';

const nextConfig: NextConfig = {
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

export default async function (): Promise<NextConfig> {
  // Disable Lingo.dev during production builds to avoid lock file conflicts
  // It's only needed for development with live translation
  if (process.env.NODE_ENV === 'production' || process.env.CI === 'true') {
    return nextConfig;
  }
  
  return await withLingo(nextConfig, {
    sourceRoot: './src',
    sourceLocale: 'en',
    targetLocales: ['es', 'de', 'fr', 'ja'],
    models: 'lingo.dev',
    dev: {
      usePseudotranslator: true,
      translationServerStartPort: 60000,
      translationServerUrl: 'http://localhost:60000',
    },
  });
}
