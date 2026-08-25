/**
 * Meta (Facebook) Pixel.
 *
 * The base snippet is injected into <head> from __root.tsx so it loads on every
 * page. Conversion events are NOT fired from here — they flow through
 * `trackEvent()` in lib/analytics.ts, which is already wired into every CTA on
 * the site, so there is one place that decides what counts as a conversion.
 *
 * The pixel ID is not a secret (it is readable in any visitor's page source).
 * VITE_META_PIXEL_ID can override it per environment — set it to an empty string
 * in a preview/staging environment to keep test traffic out of the real dataset.
 */

const DEFAULT_PIXEL_ID = "902144385749711";

export const META_PIXEL_ID =
  import.meta.env?.["VITE_META_PIXEL_ID"] ?? DEFAULT_PIXEL_ID;

export const pixelEnabled = Boolean(META_PIXEL_ID);

/**
 * Meta's official base snippet, with `init` + the first `PageView`.
 *
 * The loader is verbatim from Events Manager (only the ID is interpolated), so
 * the install passes Meta's own verification.
 *
 * The `init`/`PageView` pair is wrapped in a one-shot guard. TanStack Start
 * re-injects <head> scripts on client-side navigation, which re-executes this
 * block — Meta's own `if(f.fbq)return;` only guards the loader, not the two
 * calls beneath it, so without this flag every SPA navigation produced a
 * duplicate `init` and a second PageView on top of the one
 * `trackPixelPageView()` fires. Subsequent page views are owned solely by
 * MetaPixelPageViews in __root.tsx.
 */
export const metaPixelBaseCode = `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
if(!window.__wdgPixelReady){window.__wdgPixelReady=1;
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');}`;

/** <noscript> fallback so visitors with JS disabled still register a PageView. */
export const metaPixelNoscriptSrc = `https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`;

interface PixelWindow extends Window {
  fbq?: (...args: unknown[]) => void;
}

/**
 * Fires a PageView for a client-side route change.
 *
 * The base snippet only fires once, on initial document load. Without this,
 * every SPA navigation (e.g. Home -> Privacy Policy) would be invisible to Meta.
 * Deliberately NOT called for hash changes — this site is built around #anchor
 * links, and counting those as page views would inflate the numbers badly.
 */
export function trackPixelPageView(): void {
  if (typeof window === "undefined" || !pixelEnabled) return;
  (window as PixelWindow).fbq?.("track", "PageView");
}
