import { Phone, CalendarCheck } from "lucide-react";
import { clinic } from "@/data/site";
import { trackEvent } from "@/lib/analytics";

export function StickyCallBar() {
  return (
    <nav
      aria-label="Quick contact actions"
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t border-border bg-background/90 p-3 backdrop-blur-xl lg:hidden"
    >
      <a
        href={clinic.phoneHref}
        onClick={() => trackEvent("phone_click", { location: "sticky-bar" })}
        className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border-2 border-primary px-4 py-3 text-base font-bold text-primary transition-transform active:scale-[0.98]"
      >
        <Phone className="size-5" aria-hidden="true" />
        Call Now
      </a>
      <a
        href="#contact"
        onClick={() => trackEvent("book_appointment", { location: "sticky-bar" })}
        className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-base font-bold text-primary-foreground transition-transform active:scale-[0.98]"
      >
        <CalendarCheck className="size-5" aria-hidden="true" />
        Book
      </a>
    </nav>
  );
}
