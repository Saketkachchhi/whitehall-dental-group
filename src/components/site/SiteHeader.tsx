import { useEffect, useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { clinic, media, nav } from "@/data/site";
import { Picture } from "./Picture";
import { trackEvent } from "@/lib/analytics";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("#home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = nav
      .map((item) => document.querySelector(item.href))
      .filter((el): el is Element => Boolean(el));
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/60 bg-background/85 shadow-soft backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-background/60 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-10 px-5 py-3 lg:px-8 lg:py-4">
        <a
          href="#home"
          className="flex shrink-0 items-center transition-opacity duration-300 hover:opacity-85"
          aria-label={`${clinic.name} — back to top`}
        >
          <Picture
            img={media.logo}
            alt={`${clinic.name} logo`}
            sizes="(min-width: 768px) 160px, 120px"
            priority
            className="block"
            imgClassName="h-18 w-auto md:h-24"
          />
        </a>

        <nav aria-label="Main" className="hidden items-center gap-9 xl:gap-12 lg:flex">
          {nav.map((item) => {
            const isActive = active === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? "true" : undefined}
                className={`relative py-1.5 text-[0.9375rem] font-semibold tracking-tight transition-colors duration-300 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:bg-primary after:transition-transform after:duration-300 hover:text-primary ${
                  isActive
                    ? "text-primary after:scale-x-100"
                    : "text-foreground/75 after:scale-x-0 hover:after:scale-x-100"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <a
          href={clinic.phoneHref}
          onClick={() => trackEvent("phone_click", { location: "header" })}
          className="hidden shrink-0 items-center gap-2 rounded-full border border-primary/25 px-5 py-2.5 text-sm font-bold tracking-tight text-primary transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent lg:inline-flex"
        >
          <Phone className="size-4" aria-hidden="true" />
          {clinic.phone}
        </a>


        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-background/80 text-primary lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="animate-[fade-in_0.2s_ease-out] border-t border-border bg-background/95 backdrop-blur-xl lg:hidden"
        >
          <nav aria-label="Mobile" className="mx-auto max-w-7xl px-5 py-4">
            <ul className="flex flex-col">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active === item.href ? "true" : undefined}
                    className={`block rounded-xl px-3 py-3.5 text-base font-medium transition-colors hover:bg-muted ${
                      active === item.href ? "text-primary" : "text-foreground/90"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={clinic.phoneHref}
              onClick={() => {
                setOpen(false);
                trackEvent("phone_click", { location: "mobile-nav" });
              }}
              className="mt-3 flex items-center justify-center gap-2 rounded-full border border-primary/30 px-5 py-3.5 text-base font-semibold text-primary"
            >
              <Phone className="size-4" aria-hidden="true" />
              {clinic.phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
