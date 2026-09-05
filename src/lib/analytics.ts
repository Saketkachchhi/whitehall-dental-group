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
  | "call_started"
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

/**
 * Site event -> Meta standard event.
 *
 * Only Meta's predefined standard events are used, so the conversions are
 * selectable as optimisation goals in Ads Manager (custom events are not, without
 * extra setup). Anything not mapped here still reaches Meta, via `trackCustom`.
 *
 * A note on what these actually mean, because it affects how you read the data:
 * "Book Appointment" scrolls the visitor to the contact panel — it is intent, not
 * a confirmed booking — so it reports as `Lead`, not `Schedule`.
 *
 * `Contact` is deliberately reserved for `call_started` — a tap that actually
 * opened the phone dialer. Plain `phone_click` counts every tap including
 * desktop ones that place no call, so it stays a custom event; promoting it to
 * `Contact` would inflate the conversion count with people who only looked at
 * the number. See lib/call-tracking.ts. Nothing here should be read as "an
 * appointment happened", and `call_started` does not mean the clinic answered.
 */
const META_STANDARD_EVENT: Partial<Record<SiteEvent, string>> = {
  book_appointment: "Lead",
  call_started: "Contact",
  email_click: "Contact",
  get_directions: "FindLocation",
  contact_form_submit: "Lead",
};

export function trackEvent(event: SiteEvent, payload: EventPayload = {}): void {
  if (typeof window === "undefined") return;
  const w = window as AnalyticsWindow;

  w.dataLayer?.push({ event, ...payload });
  w.gtag?.("event", event, payload);
  w.clarity?.("event", event);

  // Never put patient details in `payload` — it is transmitted to Meta verbatim.
  const standard = META_STANDARD_EVENT[event];
  if (standard) {
    w.fbq?.("track", standard, { content_name: event, ...payload });
  } else {
    w.fbq?.("trackCustom", event, payload);
  }
}
