import { Link } from "@tanstack/react-router";
import { Clock, Facebook, Instagram, MapPin, Phone } from "lucide-react";
import { clinic, media, nav, serviceAreas } from "@/data/site";
import { Picture } from "./Picture";
import { OpeningHours } from "./OpeningHours";
import { trackEvent } from "@/lib/analytics";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-tint pt-20 pb-28 lg:pb-20">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-16 lg:px-8">
        <div>
          <Picture
            img={media.logo}
            alt={`${clinic.name} logo`}
            sizes="176px"
            className="block"
            imgClassName="h-22 w-auto md:h-26"
          />
          <p className="mt-6 max-w-sm text-base leading-relaxed text-muted-foreground">
            A neighborhood dental practice in Whitehall Township, caring for{" "}
            {serviceAreas.slice(1).join(", ")} and the wider Lehigh Valley — gently and honestly.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <a
              href={clinic.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${clinic.name} on Facebook`}
              className="flex size-13 items-center justify-center rounded-full border border-border bg-background text-primary transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent hover:shadow-soft"
            >
              <Facebook className="size-6" aria-hidden="true" />
            </a>
            <a
              href={clinic.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${clinic.name} on Instagram`}
              className="flex size-13 items-center justify-center rounded-full border border-border bg-background text-primary transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent hover:shadow-soft"
            >
              <Instagram className="size-6" aria-hidden="true" />
            </a>
          </div>
        </div>


        <nav aria-label="Footer">
          <h2 className="text-base font-bold">Explore</h2>
          <ul className="mt-4 space-y-2.5">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-base font-bold">Visit Us</h2>
          <ul className="mt-4 space-y-3.5 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <a
                href={clinic.phoneHref}
                onClick={() => trackEvent("phone_click", { location: "footer" })}
                className="font-semibold text-primary hover:underline"
              >
                {clinic.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <address className="not-italic">{clinic.address}</address>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <OpeningHours compact className="max-w-2xs" />
                <p className="mt-3">By appointment — please call ahead.</p>
              </div>
            </li>
          </ul>
          <a
            href={clinic.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("get_directions", { location: "footer" })}
            className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
          >
            Get Directions
          </a>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-3 border-t border-border px-5 pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <p>
          © {new Date().getFullYear()} {clinic.name}. All rights reserved.
        </p>
        <Link to="/privacy" className="hover:text-primary">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}
