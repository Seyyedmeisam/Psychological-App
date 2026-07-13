import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { paraglideVitePlugin } from '@inlang/paraglide-js'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { pwaOptions } from './src/core/configs/pwa'

const rootDir = dirname(fileURLToPath(import.meta.url))

const config = defineConfig({
  resolve: {
    alias: {
      '@': resolve(rootDir, 'src'),
    },
    tsconfigPaths: true,
  },
  plugins: [
    devtools(),
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/core/i18n/paraglide',
      emitTsDeclarations: true,
      strategy: ['localStorage', 'cookie', 'baseLocale'],
    }),
    nitro({ rollupConfig: { external: [/^@sentry\//] } }),
    tailwindcss(),
    tanstackStart({
      spa: { enabled: false },
      prerender: { enabled: false },
    }),
    viteReact(),
    VitePWA(pwaOptions),
  ],
})

export default config
