import type { VitePWAOptions } from 'vite-plugin-pwa'

const themeColor = '#4f46e5'

export const pwaOptions = {
  registerType: 'autoUpdate',
  injectRegister: false,
  includeAssets: ['favicon.svg', 'robots.txt', 'pwa/icon-192.svg', 'pwa/icon-512.svg', 'fonts/Vazirmatn-Regular.ttf', 'fonts/Vazirmatn-Bold.ttf'],
  manifest: {
    name: 'Psychological Support',
    short_name: 'PsySupport',
    description:
      'A secure platform for clients and counselors. Connect with licensed professionals and access support resources.',
    theme_color: themeColor,
    background_color: '#ffffff',
    display: 'standalone',
    orientation: 'portrait',
    scope: '/',
    start_url: '/',
    icons: [
      {
        src: 'pwa/icon-192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: 'pwa/icon-512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: 'pwa/icon-maskable.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
      {
        src: 'favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  },
  devOptions: {
    enabled: true,
    type: 'module',
  },
} satisfies Partial<VitePWAOptions>
