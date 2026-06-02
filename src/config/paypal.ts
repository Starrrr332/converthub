/**
 * PayPal Configuration
 *
 * The Client ID is a public identifier exposed to the browser.
 * It is safe to commit to the repository.
 * Keep the SECRET key server-side only (not used in this app).
 */
export const PAYPAL_CONFIG = {
  CLIENT_ID: 'AZBgo9iER_uT3SZASbg_N5EYCnKCYNaRygyxhheO5I4OLGO5Ko6smDFlhAdxklXMrdya0oTevGjvQeLt',
  CURRENCY: 'USD',
  INTENT: 'capture' as const,
} as const;
