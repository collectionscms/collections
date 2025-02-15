export const gtmId = process.env.NEXT_PUBLIC_GTM_ID || '';

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}
