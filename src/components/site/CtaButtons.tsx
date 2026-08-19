import { ArrowRight, CalendarCheck, MapPin, Phone } from "lucide-react";
import { clinic } from "@/data/site";
import { trackEvent, type SiteEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const base =
  "group inline-flex min-h-13 items-center justify-center gap-2 rounded-full px-7 py-3.5 text-base font-bold transition-all duration-300 active:scale-[0.98]";

export function BookCta({
  className,
  label = "Book Appointment",
  location = "page",
}: {
  className?: string;
  label?: string;
  location?: string;
}) {
  return (
    <a
      href="#contact"
      onClick={() => trackEvent("book_appointment", { location })}
      className={cn(
        base,
        "bg-primary text-primary-foreground shadow-soft hover:-translate-y-0.5 hover:bg-secondary hover:shadow-lift",
        className,
      )}
    >
      <CalendarCheck
        className="size-5 transition-transform duration-300 group-hover:-rotate-6"
        aria-hidden="true"
      />
      {label}
    </a>
  );
}

export function CallCta({
  className,
  location = "page",
  showNumber = true,
  label,
  variant = "outline",
}: {
  className?: string;
  location?: string;
  showNumber?: boolean;
  label?: string;
  variant?: "outline" | "solid";
}) {
  return (
    <a
      href={clinic.phoneHref}
      onClick={() => trackEvent("phone_click", { location })}
      className={cn(
        base,
        variant === "solid"
          ? "bg-primary text-primary-foreground shadow-soft hover:-translate-y-0.5 hover:bg-secondary hover:shadow-lift"
          : "border-2 border-primary bg-background text-primary hover:-translate-y-0.5 hover:bg-accent",
        className,
      )}
    >
      <Phone
        className="size-5 transition-transform duration-300 group-hover:scale-110"
        aria-hidden="true"
      />
      {label ?? (showNumber ? `Call ${clinic.phone}` : "Call Now")}
    </a>
  );
}

export function DirectionsCta({
  className,
  location = "page",
}: {
  className?: string;
  location?: string;
}) {
  return (
    <a
      href={clinic.mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("get_directions", { location })}
      className={cn(
        base,
        "border-2 border-primary/25 bg-surface text-primary hover:-translate-y-0.5 hover:border-primary hover:bg-accent",
        className,
      )}
    >
      <MapPin
        className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5"
        aria-hidden="true"
      />
      Get Directions
    </a>
  );
}

export function GhostCta({
  href,
  label,
  className,
  event = "cta_click",
  location = "page",
  external = false,
}: {
  href: string;
  label: string;
  className?: string;
  event?: SiteEvent;
  location?: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={() => trackEvent(event, { location })}
      className={cn(
        "group inline-flex items-center gap-2 text-base font-bold text-primary transition-colors duration-300 hover:text-secondary",
        className,
      )}
    >
      {label}
      <ArrowRight
        className="size-4 transition-transform duration-300 group-hover:translate-x-1"
        aria-hidden="true"
      />
    </a>
  );
}

