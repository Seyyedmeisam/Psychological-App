import type { VitePWAOptions } from 'vite-plugin-pwa'

const themeColor = '#4f46e5'

export const pwaOptions = {
  registerType: 'autoUpdate',
  injectRegister: false,
  strategies: 'generateSW',
  filename: 'sw.js',
  includeAssets: [
    'favicon.svg',
    'favicon-16.png',
    'favicon-32.png',
    'robots.txt',
    'manifest.webmanifest',
    'brand/logo.svg',
    'pwa/icon-192.png',
    'pwa/icon-512.png',
    'pwa/icon-maskable-512.png',
    'pwa/apple-touch-icon.png',
    'pwa/icon-192.svg',
    'pwa/icon-512.svg',
    'fonts/Vazirmatn-Regular.ttf',
    'fonts/Vazirmatn-Bold.ttf',
  ],
  manifest: {
    name: 'همدل',
    short_name: 'همدل',
    description:
      'A secure platform for clients and counselors. Connect with licensed professionals and access support resources.',
    theme_color: themeColor,
    background_color: '#ffffff',
    display: 'standalone',
    orientation: 'portrait-primary',
    scope: '/',
    start_url: '/',
    lang: 'en',
    dir: 'ltr',
    categories: ['health', 'lifestyle', 'medical'],
    icons: [
      {
        src: 'pwa/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: 'pwa/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: 'pwa/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  },
  devOptions: {
    // Keep SW generation out of everyday `bun run dev` (big Windows slowdown).
    enabled: false,
    type: 'module',
    navigateFallback: 'index.html',
    suppressWarnings: true,
  },
  workbox: {
    // Intermediate Vite env builds; final SW is rebuilt in scripts/pwa-build.ts.
    globDirectory: 'public',
    globPatterns: [
      'favicon.svg',
      'manifest.webmanifest',
      'pwa/*.{png,svg}',
      'robots.txt',
    ],
    navigateFallback: undefined,
    cleanupOutdatedCaches: true,
    clientsClaim: true,
    skipWaiting: true,
  },
} satisfies Partial<VitePWAOptions>
