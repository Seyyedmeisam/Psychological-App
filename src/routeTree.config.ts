import { layout, physical, rootRoute } from '@tanstack/virtual-file-routes'

export const routes = rootRoute('__root.tsx', [
  layout('_public', '../modules/app/layouts/_public.tsx', [
    physical('../modules/app/routes/public'),
    physical('../modules/auth/routes/public'),
  ]),
  layout('_panel', '../modules/app/layouts/_panel.tsx', [
    physical('../modules/app/routes/panel'),
    physical('/books', '../modules/book/routes'),
    physical('/users', '../modules/user/routes'),
    physical('/profile', '../modules/auth/routes/profile'),
  ]),
])
