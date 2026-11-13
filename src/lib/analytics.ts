/** Explicit opt-in only; event names never contain patient or service data. */
export function trackConversion(name: 'quote_request_received' | 'booking_request_received' | 'booking_open' | 'contact_request_received') {
  try { if (typeof window === 'undefined' || localStorage.getItem('wenaya-cookie-consent') !== 'accepted') return;
    (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.('event', name, { transport_type: 'beacon', page_location: location.origin, page_title: 'Wenaya', page_referrer: '' });
  } catch { /* Analytics must never interrupt a user journey. */ }
}
