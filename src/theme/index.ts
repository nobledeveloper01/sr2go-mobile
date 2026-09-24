/**
 * One source of truth for how the app looks.
 *
 * The palette and the gradients are taken from shareride2go.com rather than
 * invented, so the app reads as the same product as the website. If the brand
 * moves, this file moves with it and nothing else has to.
 */

export const colors = {
  /** The blue used across their marketing site. Decorative only. */
  brand: '#0099F9',
  brandBright: '#4FA8FF',
  brandDeep: '#0D6BFF',

  /**
   * The blue to use for text, icons and links on a light surface.
   *
   * The marketing blue is #0099F9, which measures 3.03:1 against white and so
   * fails WCAG AA for body text. This darker blue reads as the same colour at
   * a glance and measures 5.90:1. Use `brand` to fill a shape, `brandInk` for
   * anything a person has to read.
   */
  brandInk: '#0B5FD0',

  /** The navy the site uses behind hero sections. */
  navy: '#0B1F3B',
  navyDark: '#0A1628',
  navyMid: '#032C92',

  text: '#111827',
  textMuted: '#6B7280',
  textOnDark: '#FFFFFF',
  textOnDarkMuted: 'rgba(255,255,255,0.72)',

  surface: '#FFFFFF',
  surfaceSunken: '#F6F8FB',
  /** Field fill on a light form. Light enough to keep placeholder text at AA. */
  field: '#F2F5FA',
  border: '#E5E7EB',

  success: '#12B76A',
  danger: '#E5484D',
  warning: '#F79009',
} as const;

/**
 * Gradients as tuples, matching the CSS on their site.
 *
 * Kept here rather than inline so every screen uses the same three, which is
 * what stops a product looking assembled by different people.
 */
export const gradients = {
  hero: ['#1E90FF', '#0B1F3B'] as const,
  deep: ['#0A1628', '#032C92', '#0A1628'] as const,
  /**
   * The primary button. Darkened from the marketing pair so a white label
   * passes AA across the whole sweep: the original started at #4FA8FF, where
   * white measures 2.51:1. These ends measure 5.90:1 and 10.24:1.
   */
  bright: ['#0B5FD0', '#063C8F'] as const,
} as const;

/** A 4pt grid. Every margin in the app is a multiple of this. */
export const spacing = (units: number): number => units * 4;

export const radii = { sm: 8, md: 12, lg: 16, xl: 24, pill: 999 } as const;

export const typography = {
  display: { fontSize: 32, fontWeight: '700', letterSpacing: -0.5 },
  title: { fontSize: 22, fontWeight: '700', letterSpacing: -0.3 },
  heading: { fontSize: 17, fontWeight: '600' },
  body: { fontSize: 15, fontWeight: '400' },
  label: { fontSize: 13, fontWeight: '600' },
  caption: { fontSize: 12, fontWeight: '500' },
} as const;

export const shadow = {
  card: {
    shadowColor: '#0B1F3B',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
} as const;
