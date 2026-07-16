import { layout, physical, rootRoute } from '@tanstack/virtual-file-routes'

export const routes = rootRoute('__root.tsx', [
  layout('_public', '../modules/app/layouts/_public.tsx', [
    physical('../modules/app/routes/public'),
    physical('../modules/auth/routes/public'),
  ]),
  layout('_panel', '../modules/app/layouts/_panel.tsx', [
    physical('../modules/app/routes/panel'),
    physical('/users', '../modules/user/routes'),
    physical('/profile', '../modules/auth/routes/profile'),
    physical('/schedule', '../modules/schedule/routes'),
    physical('/appointments', '../modules/appointment/routes'),
  ]),
])
