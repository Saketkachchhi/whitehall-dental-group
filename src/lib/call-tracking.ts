/**
 * Phone call tracking.
 *
 * Every `tel:` link on the site goes through `phoneLinkProps()`, so the number
 * and the tracking live in exactly one place. If we ever move to a call
 * tracking vendor (CallRail, Twilio) that swaps in a forwarding number, this
 * file is the only thing that has to change.
 *
 * WHY TWO EVENTS
 *
 * A tap on a `tel:` link is not a phone call. On a desktop it usually does
 * nothing at all — the visitor is reading the number, or missed the link — and
 * counting those as conversions makes the ad reporting look far better than
 * reality. So taps and calls are reported separately:
 *
 *   phone_click   every tap, any device. The raw interest number.
 *   call_started  a tap that actually opened the dialer. The real-call number.
 *
 * HOW `call_started` IS DETECTED
 *
 * There is no browser API that reports "a call was placed" — only a call
 * tracking vendor with a real forwarding number can tell you that. What a
 * browser can tell us is that the page was backgrounded: when a `tel:` tap
 * genuinely hands off to the phone app, this document becomes hidden. If it
 * stays visible, no dialer opened.
 *
 * That makes `call_started` a good proxy but not proof. It counts a visitor who
 * reached the dialer and hung up before it rang, and it misses one whose
 * browser suppresses the handoff. It also cannot tell you whether anyone at the
 * clinic picked up. Read it as "reached the dialer", not "spoke to us".
 */
import { clinic } from "@/data/site";
import { trackEvent } from "@/lib/analytics";

/**
 * How long after a tap a backgrounded page still counts as that tap's dialer.
 *
 * Generous on purpose: iOS shows a confirmation sheet before handing off, so
 * the page can stay visible for as long as the visitor takes to hit "Call".
 * The cost of the wide window is that switching apps for an unrelated reason
 * within it is miscounted as a call, which is the cheaper error to make.
 */
const DIALER_HANDOFF_WINDOW_MS = 25_000;

/**
 * Whether this device can place a call from a `tel:` link.
 *
 * Touch input plus a coarse pointer means phone or tablet. Tablets are counted
 * in, since they hand off to a paired phone or FaceTime often enough to matter;
 * the visibility check below is what actually decides whether a dialer opened.
 */
function isCallCapableDevice(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(pointer: coarse)").matches === true && navigator.maxTouchPoints > 0;
}

/** The tap we are currently waiting on, if any. Only ever one at a time. */
let pendingTap: { location: string; timer: number } | null = null;

function stopWaiting(): void {
  if (!pendingTap) return;
  window.clearTimeout(pendingTap.timer);
  document.removeEventListener("visibilitychange", onVisibilityChange);
  pendingTap = null;
}

function onVisibilityChange(): void {
  if (!pendingTap || document.visibilityState !== "hidden") return;
  const { location } = pendingTap;
  // Clear first: this fires once per tap, even if the visitor returns to the
  // page and leaves again before the window closes.
  stopWaiting();
  trackEvent("call_started", { location, device: "mobile" });
}

/**
 * Records a tap on a phone number, and watches for the dialer opening.
 *
 * Safe to call on any device — the dialer watch is only armed where a call is
 * actually possible.
 */
export function trackPhoneCall(location: string): void {
  if (typeof window === "undefined") return;

  const device = isCallCapableDevice() ? "mobile" : "desktop";
  trackEvent("phone_click", { location, device });
  if (device !== "mobile") return;

  // A second tap replaces the first, so an impatient double-tap is one call.
  stopWaiting();
  document.addEventListener("visibilitychange", onVisibilityChange);
  pendingTap = {
    location,
    timer: window.setTimeout(stopWaiting, DIALER_HANDOFF_WINDOW_MS),
  };
}

/**
 * Props for a phone number link: the `href` and the tracking, together.
 *
 * Spread onto the anchor rather than wiring `clinic.phoneHref` and
 * `trackPhoneCall` by hand, so no call site can end up with one and not the
 * other. `onNavigate` runs first, for links that also need to close a menu.
 */
export function phoneLinkProps(
  location: string,
  onNavigate?: () => void,
): { href: string; onClick: () => void } {
  return {
    href: clinic.phoneHref,
    onClick: () => {
      onNavigate?.();
      trackPhoneCall(location);
    },
  };
}
