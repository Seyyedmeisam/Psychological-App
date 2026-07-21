import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type PluginOption } from 'vite'
import { paraglideVitePlugin } from '@inlang/paraglide-js'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { pwaOptions } from './src/core/configs/pwa'

const rootDir = dirname(fileURLToPath(import.meta.url))
const enableDevtools = process.env.TANSTACK_DEVTOOLS === '1'

async function createPlugins(): Promise<PluginOption[]> {
  const plugins: PluginOption[] = []

  if (enableDevtools) {
    const { devtools } = await import('@tanstack/devtools-vite')
    plugins.push(devtools())
  }

  plugins.push(
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/core/i18n/paraglide',
      emitTsDeclarations: false,
      strategy: ['localStorage', 'cookie', 'baseLocale'],
    }),
    nitro({ rollupConfig: { external: [/^@sentry\//] } }),
    tailwindcss(),
    tanstackStart({
      // Static SPA for cPanel / public_html — upload `.output/public`
      spa: {
        enabled: true,
        prerender: {
          outputPath: '/index.html',
        },
      },
      prerender: { enabled: false },
    }),
    viteReact(),
    VitePWA(pwaOptions),
  )

  return plugins
}

export default defineConfig(async () => ({
  resolve: {
    alias: {
      '@': resolve(rootDir, 'src'),
    },
    tsconfigPaths: true,
  },
  server: {
    watch: {
      // Paraglide emits hundreds of tiny files; watching them slows Windows hard.
      ignored: [
        '**/src/core/i18n/paraglide/**',
        '**/node_modules/**',
        '**/.output/**',
        '**/backend/**',
      ],
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-hook-form',
      'axios',
      'sonner',
      'clsx',
      'tailwind-merge',
      'class-variance-authority',
      'lucide-react',
      'recharts',
      'zod',
      '@tanstack/react-query',
      '@tanstack/react-router',
      'use-sync-external-store',
      'use-sync-external-store/shim',
      'use-sync-external-store/shim/with-selector',
      'use-sync-external-store/shim/with-selector.js',
    ],
  },
  plugins: await createPlugins(),
}))
