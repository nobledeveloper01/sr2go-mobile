/**
 * The legal surface both stores require.
 *
 * Apple review guideline 5.1.1(v) and Google Play's User Data policy both
 * require a reachable privacy policy, and Apple additionally requires that an
 * app which lets you create an account also lets you delete it from inside the
 * app. These URLs point at the live site; swap them if legal moves them.
 */
export const LEGAL_URLS = {
  terms: 'https://shareride2go.com/terms',
  privacy: 'https://shareride2go.com/privacy',
  support: 'https://shareride2go.com/contact',
} as const;

export const LEGAL_LABELS = {
  terms: 'Terms of Service',
  privacy: 'Privacy Policy',
  support: 'Contact support',
} as const;
