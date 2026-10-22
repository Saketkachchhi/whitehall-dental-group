/**
 * Google Analytics 4 (gtag.js).
 *
 * The base snippet is injected into <head> from __root.tsx so it loads on every
 * page. Conversion events are NOT fired from here — they flow through
 * `trackEvent()` in lib/analytics.ts, which already calls `gtag` and is wired
 * into every CTA on the site, so there is one place that decides what counts as
 * a conversion. Those arrive in GA4 under the site's own event names
 * (`book_appointment`, `call_started`, ...); mark the ones that matter as key
 * events in the GA4 UI rather than renaming them here.
 *
 * The measurement ID is not a secret (it is readable in any visitor's page
 * source). VITE_GA_MEASUREMENT_ID can override it per environment — see
 * vite.config.ts, which blanks it on non-production deploys.
 */

const DEFAULT_MEASUREMENT_ID = "G-DGQRN0MGZ3";

export const GA_MEASUREMENT_ID =
  import.meta.env?.["VITE_GA_MEASUREMENT_ID"] ?? DEFAULT_MEASUREMENT_ID;

export const gaEnabled = Boolean(GA_MEASUREMENT_ID);

/** The gtag.js loader. Rendered as `<script async src>`, exactly as Google ships it. */
export const googleTagSrc = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;

/**
 * Google's official base snippet, with `js` + `config`.
 *
 * Kept verbatim from Google Analytics (only the ID is interpolated), so the
 * install passes Google's own Tag Assistant verification.
 *
 * The `js`/`config` pair is wrapped in a one-shot guard. TanStack Start
 * re-injects <head> scripts on client-side navigation, which re-executes this
 * block — and `config` sends a page_view every time it runs, so without this
 * flag every SPA navigation produced a duplicate measurement config plus a
 * second page_view on top of the one `trackGaPageView()` fires. The
 * `window.dataLayer` and `gtag` lines stay outside the guard: they are
 * idempotent, and `gtag` must exist as a global for lib/analytics.ts to find.
 * Subsequent page views are owned solely by RoutePageViews in __root.tsx.
 */
export const googleTagBaseCode = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
if(!window.__wdgGaReady){window.__wdgGaReady=1;
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');}`;

interface GtagWindow extends Window {
  gtag?: (...args: unknown[]) => void;
}

/**
 * Fires a page_view for a client-side route change.
 *
 * The base snippet only reports once, on initial document load, so without this
 * an SPA navigation (Home -> Privacy Policy) can go unreported. Deliberately NOT
 * called for hash changes — this site is built around #anchor links, and
 * counting those as page views would inflate the numbers badly.
 *
 * WHY THE PAGE DETAILS ARE PASSED AS EVENT PARAMETERS
 *
 * gtag snapshots `page_location` and `page_title` when `config` runs, so a bare
 * page_view reports the landing page rather than the one just navigated to.
 * Passing them as event parameters fixes that without calling `gtag('set')`,
 * which would also rewrite the page context for every later event.
 *
 * `page_referrer` is left alone on purpose: it still holds the genuine external
 * referrer, which is what GA4 attributes the session's traffic source from.
 * Overwriting it with the previous in-site URL would turn ordinary navigation
 * into self-referral noise.
 *
 * CAVEAT, IF PAGE VIEWS EVER LOOK INFLATED
 *
 * GA4 data streams enable "page changes based on browser history events" by
 * default, and it was seen emitting its own extra, delayed page_view for the
 * same navigation. If the Pages report ever shows roughly double the real
 * traffic for /privacy, turn that option off in the data stream's Enhanced
 * Measurement settings rather than deleting this call: this one carries the
 * correct title and ignores #anchor links, which the automatic one does not.
 */
export function trackGaPageView(): void {
  if (typeof window === "undefined" || !gaEnabled) return;
  const gtag = (window as GtagWindow).gtag;
  if (!gtag) return;

  gtag("event", "page_view", {
    page_location: window.location.href,
    page_title: document.title,
  });
}
