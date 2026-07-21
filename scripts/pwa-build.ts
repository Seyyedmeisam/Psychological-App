#!/usr/bin/env bun

import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { generateSW } from 'workbox-build'

const publicDir = resolve(process.cwd(), '.output/public')

if (!existsSync(publicDir)) {
  console.error('Missing .output/public — run vite build first.')
  process.exit(1)
}

const hasIndex = existsSync(resolve(publicDir, 'index.html'))

const { count, size, warnings } = await generateSW({
  globDirectory: publicDir,
  globPatterns: [
    '**/*.{js,css,html,ico,png,svg,ttf,woff2,webmanifest,json}',
  ],
  swDest: resolve(publicDir, 'sw.js'),
  clientsClaim: true,
  skipWaiting: true,
  cleanupOutdatedCaches: true,
  ...(hasIndex
    ? {
        navigateFallback: 'index.html',
        navigateFallbackAllowlist: [/^(?!\/api\/).*/],
      }
    : {}),
  runtimeCaching: [
    {
      urlPattern: ({ url }: { url: URL }) =>
        url.pathname.startsWith('/api/'),
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        networkTimeoutSeconds: 8,
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 60 * 5,
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: ({ request }: { request: Request }) =>
        request.destination === 'image',
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: {
          maxEntries: 80,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },
  ],
})

for (const warning of warnings) {
  console.warn(`[pwa] ${warning}`)
}

console.log(
  `[pwa] Generated sw.js — precached ${count} files (${(size / 1024).toFixed(1)} KiB)`,
)
