#!/usr/bin/env bun

import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { generateSW } from 'workbox-build'

const publicDir = resolve(process.cwd(), '.output/public')

if (!existsSync(publicDir)) {
  console.error('Missing .output/public — run vite build first.')
  process.exit(1)
}

const { count, size, warnings } = await generateSW({
  globDirectory: publicDir,
  globPatterns: ['**/*.{js,css,ico,png,svg,ttf,woff2,webmanifest}'],
  swDest: resolve(publicDir, 'sw.js'),
  clientsClaim: true,
  skipWaiting: true,
})

for (const warning of warnings) {
  console.warn(`[pwa] ${warning}`)
}

console.log(`[pwa] Generated sw.js — precached ${count} files (${(size / 1024).toFixed(1)} KiB)`)
