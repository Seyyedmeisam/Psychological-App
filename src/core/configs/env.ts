export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api',
  appName: import.meta.env.VITE_APP_NAME ?? 'همدل',
  defaultLocale: import.meta.env.VITE_DEFAULT_LOCALE ?? 'fa',
  fallbackLocale: import.meta.env.VITE_FALLBACK_LOCALE ?? 'en',
} as const
