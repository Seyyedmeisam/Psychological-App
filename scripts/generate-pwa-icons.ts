#!/usr/bin/env bun
/**
 * Generates site + PWA icons from public/brand/logo.svg
 * Run: bun run pwa:icons
 */
import { copyFileSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import sharp from 'sharp'

const root = resolve(import.meta.dir, '..')
const brandLogo = resolve(root, 'public/brand/logo.svg')
const maskableLogo = resolve(root, 'public/pwa/icon-maskable.svg')
const pwaDir = resolve(root, 'public/pwa')
const publicDir = resolve(root, 'public')

const logoSvg = readFileSync(brandLogo)
const maskableSvg = readFileSync(maskableLogo)

// Keep SVG copies in sync with the brand source.
copyFileSync(brandLogo, resolve(publicDir, 'favicon.svg'))
copyFileSync(brandLogo, resolve(pwaDir, 'icon-192.svg'))
copyFileSync(brandLogo, resolve(pwaDir, 'icon-512.svg'))

const targets: Array<{ file: string; size: number; input: Buffer; dir?: string }> =
  [
    { file: 'favicon-16.png', size: 16, input: logoSvg, dir: publicDir },
    { file: 'favicon-32.png', size: 32, input: logoSvg, dir: publicDir },
    { file: 'icon-192.png', size: 192, input: logoSvg, dir: pwaDir },
    { file: 'icon-512.png', size: 512, input: logoSvg, dir: pwaDir },
    { file: 'apple-touch-icon.png', size: 180, input: logoSvg, dir: pwaDir },
    {
      file: 'icon-maskable-512.png',
      size: 512,
      input: maskableSvg,
      dir: pwaDir,
    },
  ]

for (const target of targets) {
  const png = await sharp(target.input)
    .resize(target.size, target.size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()
  const out = resolve(target.dir ?? pwaDir, target.file)
  writeFileSync(out, png)
  console.log(`wrote ${target.file} (${target.size}x${target.size})`)
}

console.log('synced favicon.svg + pwa/*.svg from brand/logo.svg')
