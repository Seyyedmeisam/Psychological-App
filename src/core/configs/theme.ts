/**
 * Programmatic access to design tokens.
 * CSS variables in tokens.css are the source of truth for styling.
 */
export const theme = {
  palette: {
    brand: 'var(--palette-brand)',
    brandForeground: 'var(--palette-brand-foreground)',
    brandMuted: 'var(--palette-brand-muted)',
    success: 'var(--palette-success)',
    warning: 'var(--palette-warning)',
    danger: 'var(--palette-danger)',
    surfaceBase: 'var(--palette-surface-base)',
    surfaceElevated: 'var(--palette-surface-elevated)',
    surfaceSecondary: 'var(--palette-surface-secondary)',
    labelPrimary: 'var(--palette-label-primary)',
    labelSecondary: 'var(--palette-label-secondary)',
    separator: 'var(--palette-separator)',
  },
  radius: {
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)',
    full: '9999px',
  },
  motion: {
    fast: 'var(--motion-duration-fast)',
    normal: 'var(--motion-duration-normal)',
    slow: 'var(--motion-duration-slow)',
    easeOut: 'var(--motion-ease-out)',
    easeSpring: 'var(--motion-ease-spring)',
  },
  font: {
    sans: 'var(--font-family-sans)',
    ltr: 'var(--font-family-ltr)',
    rtl: 'var(--font-family-rtl)',
  },
} as const

export type ThemePaletteKey = keyof typeof theme.palette
