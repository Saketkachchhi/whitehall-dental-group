/**
 * Analytics integration points.
 *
 * No tracking IDs are hard-coded. When GA4, Meta Pixel, Clarity or GTM is added
 * later, these events flow through automatically via `dataLayer` / `gtag` /
 * `fbq` if those globals exist. Until then, the calls are no-ops.
 */
export type SiteEvent =
  | "book_appointment"
  | "phone_click"
  | "email_click"
  | "get_directions"
  | "contact_form_submit"
  | "cta_click";

type EventPayload = Record<string, string | number | boolean | undefined>;

interface AnalyticsWindow extends Window {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
  clarity?: (...args: unknown[]) => void;
}

export function trackEvent(event: SiteEvent, payload: EventPayload = {}): void {
  if (typeof window === "undefined") return;
  const w = window as AnalyticsWindow;

  w.dataLayer?.push({ event, ...payload });
  w.gtag?.("event", event, payload);
  w.clarity?.("event", event);

  if (event === "book_appointment") w.fbq?.("track", "Schedule", payload);
  if (event === "phone_click") w.fbq?.("track", "Contact", payload);
}
