/**
 * Trajetta Marketing Analytics & UTM Tracking Module
 * Captures, stores, and forwards UTMs across the entire conversion funnel.
 * Dispatches standard marketing events to PostHog, GTM dataLayer, or fallback logger.
 */

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
}

const STORAGE_KEY = 'trajetta_utm_params';

/**
 * Capture UTMs from current URL and store in sessionStorage / localStorage
 */
export function captureUtmParams(): UtmParams {
  if (typeof window === 'undefined') return {};

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utms: UtmParams = {};

    const keys: (keyof UtmParams)[] = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_content',
      'utm_term'
    ];

    let hasUtm = false;
    keys.forEach((k) => {
      const val = urlParams.get(k);
      if (val) {
        utms[k] = val;
        hasUtm = true;
      }
    });

    if (document.referrer && !utms.referrer) {
      utms.referrer = document.referrer;
    }

    if (hasUtm) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utms));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(utms));
      } catch {}
      return utms;
    }

    // Fallback to stored UTMs from previous page within session
    const stored = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('[Analytics UTM error]:', e);
  }

  return {};
}

/**
 * Get currently active UTMs for appending to links or API requests
 */
export function getStoredUtmParams(): UtmParams {
  if (typeof window === 'undefined') return {};
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return captureUtmParams();
}

/**
 * Append current UTMs to an internal target link (e.g. /register or /auth)
 */
export function appendUtmToUrl(targetUrl: string): string {
  if (typeof window === 'undefined') return targetUrl;
  const utms = getStoredUtmParams();
  const searchParams = new URLSearchParams();

  Object.entries(utms).forEach(([k, v]) => {
    if (v) searchParams.set(k, v);
  });

  const queryStr = searchParams.toString();
  if (!queryStr) return targetUrl;

  const [pathPart, existingQuery] = targetUrl.split('?');
  if (existingQuery) {
    return `${pathPart}?${existingQuery}&${queryStr}`;
  }
  return `${pathPart}?${queryStr}`;
}

export type MarketingEventName =
  | 'page_view'
  | 'hero_cta_clicked'
  | 'secondary_cta_clicked'
  | 'section_viewed'
  | 'pricing_viewed'
  | 'plan_selected'
  | 'trial_started'
  | 'signup_started'
  | 'signup_completed'
  | 'waitlist_submit_attempt'
  | 'waitlist_success'
  | 'faq_opened'
  | 'scroll_depth';

/**
 * Track high-intent marketing and product events
 */
export function trackMarketingEvent(
  eventName: MarketingEventName,
  properties: Record<string, any> = {}
) {
  if (typeof window === 'undefined') return;

  const utms = getStoredUtmParams();
  const payload = {
    event: eventName,
    timestamp: new Date().toISOString(),
    path: window.location.pathname,
    ...utms,
    ...properties,
  };

  // 1. Google Tag Manager / dataLayer
  if ((window as any).dataLayer && Array.isArray((window as any).dataLayer)) {
    (window as any).dataLayer.push(payload);
  }

  // 2. PostHog if available
  if ((window as any).posthog && typeof (window as any).posthog.capture === 'function') {
    (window as any).posthog.capture(eventName, payload);
  }

  // 3. Development logger
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Analytics Event] ${eventName}:`, payload);
  }
}

/**
 * Initialize scroll depth observer (25%, 50%, 75%, 100%)
 */
export function initScrollDepthTracking() {
  if (typeof window === 'undefined') return () => {};

  const thresholds = [25, 50, 75, 100];
  const reached = new Set<number>();

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;
    const currentPercent = Math.min(100, Math.round((window.scrollY / scrollHeight) * 100));

    thresholds.forEach((threshold) => {
      if (currentPercent >= threshold && !reached.has(threshold)) {
        reached.add(threshold);
        trackMarketingEvent('scroll_depth', { depth_percent: threshold });
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}
