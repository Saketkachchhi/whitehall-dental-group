import { useCallback, useEffect, useState, type ComponentType } from "react";
import {
  Phone,
  Star,
  ShieldCheck,
  Sparkles,
  Users,
  HeartHandshake,
  Quote,
  MapPin,
  Clock,
  X,
  Feather,
  MessageSquareHeart,
  Sofa,
  UserCog,
  Home,
  Handshake,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "./Reveal";
import {
  ToothImplantIcon,
  ToothCrownIcon,
  ToothRootIcon,
  ToothSparkleIcon,
  ToothBrushIcon,
  ToothDropletIcon,
  ToothMirrorIcon,
  ToothShieldIcon,
} from "./DentalIcons";
import { BookCta, CallCta, DirectionsCta, GhostCta } from "./CtaButtons";
import { Picture, fallbackSrc } from "./Picture";
import {
  clinic,
  doctors,
  featuredServices,
  gallery,
  media,
  moreServices,
  serviceAreas,
  testimonials,
  trustStrip,
  whyUs,
} from "@/data/site";

import { trackEvent } from "@/lib/analytics";

export function Hero() {
  return (
    <section id="home" className="relative isolate flex min-h-[92svh] items-center pt-28">
      <Picture
        img={media.exterior}
        alt="Exterior of the Whitehall Dental Group clinic in Whitehall Township, PA on a sunny day"
        sizes="100vw"
        priority
        fetchPriority="high"
        className="absolute inset-0 -z-10 size-full"
        imgClassName="size-full object-cover"
      />
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,oklch(1_0_0/0.95)_0%,oklch(1_0_0/0.86)_40%,oklch(1_0_0/0.4)_70%,oklch(1_0_0/0.08)_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,oklch(1_0_0/0.92),oklch(1_0_0/0.74)_55%,oklch(1_0_0/0.5))] lg:hidden"
        aria-hidden="true"
      />
      {/* Tight top padding on mobile (the section already clears the header via
          pt-28) keeps the CTAs above the fold; the generous bottom padding keeps
          them clear of the fixed StickyCallBar. */}
      <div className="mx-auto w-full max-w-7xl px-5 pt-6 pb-28 lg:px-8 lg:py-20">
        <Reveal className="max-w-3xl">
          <p className="text-sm font-bold tracking-[0.22em] text-primary uppercase">
            {clinic.tagline}
          </p>
          {/*
            Each line is its own block so text extractors read whole words —
            a bare <br/> made crawlers see "familycan".
          */}
          <h1 className="mt-5 text-4xl leading-[1.08] text-foreground sm:text-5xl lg:text-6xl">
            <span className="block">Family &amp; Cosmetic Dentist</span>{" "}
            <span className="block">in Whitehall Township, PA</span>
          </h1>
          <p className="mt-5 max-w-xl text-xl leading-snug font-bold text-foreground/90 sm:text-3xl">
            A dentist your family can feel at home with.
          </p>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-foreground/80">
            Whether you're overdue for a cleaning or nervous about a bigger procedure, you'll be
            listened to, treated gently, and told the truth about what you need — proudly serving{" "}
            {serviceAreas.slice(1, -1).join(", ")} and {serviceAreas[serviceAreas.length - 1]}.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <BookCta location="hero" />
            <CallCta location="hero" />
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-3">
            {["Five-star Google reviews", "Most insurance accepted", "Gentle with nervous patients"].map(
              (item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground"
                >
                  <Star className="size-4 fill-current text-primary" aria-hidden="true" />
                  {item}
                </li>
              ),
            )}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

const stripIcons: Record<string, LucideIcon> = {
  rating: Star,
  insurance: ShieldCheck,
  gentle: Feather,
  family: Home,
  honest: MessageSquareHeart,
};

export function TrustBar() {
  return (
    <section
      className="border-y border-border/60 bg-tint py-7"
      aria-label="Why patients trust Whitehall Dental Group"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {trustStrip.map((item) => {
            const Icon = stripIcons[item.icon] ?? Sparkles;
            return (
              <li
                key={item.label}
                className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-foreground/80"
              >
                <Icon className="size-4.5 shrink-0 text-primary" aria-hidden="true" />
                {item.label}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}


export function SectionHeading({
  eyebrow,
  title,
  text,
  light = false,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  light?: boolean;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <p
          className={`text-xs font-bold tracking-[0.22em] uppercase ${
            light ? "text-primary-foreground/75" : "text-primary"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`mt-3 text-3xl sm:text-4xl ${light ? "text-primary-foreground" : "text-foreground"}`}
      >
        {title}
      </h2>
      {text && (
        <p
          className={`mt-4 text-lg leading-relaxed ${
            light ? "text-primary-foreground/85" : "text-muted-foreground"
          }`}
        >
          {text}
        </p>
      )}
    </div>
  );
}

const serviceIcons: Record<string, ComponentType<{ className?: string }>> = {
  implant: ToothImplantIcon,
  crown: ToothCrownIcon,
  root: ToothRootIcon,
  cosmetic: ToothSparkleIcon,
  cleaning: ToothBrushIcon,
  deep: ToothDropletIcon,
  whitening: ToothSparkleIcon,
  exam: ToothMirrorIcon,
};

function ServiceCard({
  service,
}: {
  service: { title: string; icon: string; text: string };
}) {
  const Icon = serviceIcons[service.icon] ?? ToothShieldIcon;
  return (
    <article className="group flex h-full flex-col rounded-3xl border border-border/60 bg-card p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lift">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-accent text-primary transition-transform duration-300 group-hover:scale-105">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <h3 className="mt-6 text-xl">{service.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{service.text}</p>
    </article>
  );
}

export function Services() {
  const [showAll, setShowAll] = useState(false);

  return (
    <section id="services" className="section-pad bg-background">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Services"
            title="Care for whatever brought you here"
            text="Most visits fall into one of these four. Whatever you need, you'll hear your options in plain language first."
          />
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredServices.map((service, i) => (
            <Reveal key={service.title} delay={i * 70} className="h-full">
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>

        {showAll && (
          <div className="mt-6 grid animate-[fade-in_0.35s_ease-out] gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {moreServices.map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            aria-expanded={showAll}
            className="group inline-flex items-center gap-2 rounded-full border border-primary/25 px-7 py-3.5 text-base font-semibold text-primary transition-all duration-300 hover:bg-accent"
          >
            {showAll ? "Show fewer services" : "View all services"}
            <ArrowRight
              className={`size-4 transition-transform duration-300 ${
                showAll ? "-rotate-90" : "group-hover:translate-x-1"
              }`}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </section>
  );
}

export function Doctors() {
  return (
    <section id="doctors" className="section-pad bg-tint">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Meet Our Doctors"
            title="The people who'll be looking after you"
            text="You'll see the same familiar faces each visit — dentists who take the time to explain, and to listen."
          />
        </Reveal>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {doctors.map((doctor, i) => (
            <Reveal key={doctor.name} delay={i * 90} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                <div className="overflow-hidden">
                  {/* width/height come from the true 1254x1254 source; the 4:5
                      presentation crop is CSS-only. */}
                  <Picture
                    img={doctor.photo}
                    alt={`Portrait of ${doctor.name}, ${doctor.role} at Whitehall Dental Group in Whitehall Township, PA`}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="block"
                    imgClassName="aspect-4/5 w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-8">
                  <h3 className="text-xl">{doctor.name}</h3>
                  <p className="mt-1 text-xs font-bold tracking-[0.18em] text-primary uppercase">
                    {doctor.role}
                  </p>
                  <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                    {doctor.intro}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <GhostCta href="#contact" label="Book with our team" location="doctors" />
        </div>
      </div>
    </section>
  );
}

const whyIcons: Record<string, LucideIcon> = {
  gentle: Feather,
  honest: MessageSquareHeart,
  comfort: Sofa,
  personal: UserCog,
  family: Home,
  longterm: Handshake,
};

export function WhyChoose() {
  return (
    <section className="section-pad bg-background">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Why Families Choose Whitehall"
            title="It's less about the equipment, more about how you're treated"
            text="The things patients tell us made the difference — long after the appointment is over."
          />
        </Reveal>
        <div className="mt-14 grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {whyUs.map((item, i) => {
            const Icon = whyIcons[item.icon] ?? HeartHandshake;
            return (
              <Reveal key={item.title} delay={i * 70}>
                <div className="flex gap-5">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary">
                    <Icon className="size-5" aria-hidden="true" />

                  </span>
                  <div>
                    <h3 className="text-lg">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Gallery() {
  const [active, setActive] = useState<number | null>(null);
  const activeItem = active === null ? null : gallery[active];

  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close]);

  return (
    <section className="section-pad bg-tint">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="A Look Inside"
            title="Walk through the clinic before you arrive"
            text="Five steps, from the front desk to the chair."
          />
        </Reveal>

        {/*
          Masonry columns instead of a fixed grid: the source photos are mixed
          portrait (900x1600) and landscape (1600x900), so any single forced
          aspect ratio cropped most of the frame away. Each image now renders at
          its natural ratio — nothing is cropped.
        */}
        <ol className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3">
          {gallery.map((item, i) => (
            <li key={item.label} className="mb-6 break-inside-avoid">
              <Reveal delay={i * 60}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Enlarge photo of ${item.label}`}
                  className="group block w-full overflow-hidden rounded-3xl border border-border/50 bg-card text-left shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift"
                >
                  <span className="block overflow-hidden">
                    <Picture
                      img={item.img}
                      alt={`${item.label} at the Whitehall Dental Group clinic in Whitehall Township, PA`}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="block"
                      imgClassName="w-full h-auto transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    />
                  </span>
                  <span className="flex items-baseline gap-3 p-6">
                    <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block text-lg font-bold">{item.label}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                        {item.caption}
                      </span>
                    </span>
                  </span>
                </button>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>

      {activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${activeItem.label} enlarged photo`}
          className="fixed inset-0 z-60 flex animate-[fade-in_0.25s_ease-out] items-center justify-center bg-[oklch(0.15_0.03_262/0.9)] p-4"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close photo"
            className="absolute top-5 right-5 flex size-12 items-center justify-center rounded-full bg-background text-foreground"
          >
            <X className="size-5" />
          </button>
          <img
            src={fallbackSrc(activeItem.img)}
            alt={`${activeItem.label} at Whitehall Dental Group`}
            className="max-h-[85vh] w-auto max-w-full rounded-2xl object-contain"
          />
        </div>
      )}
    </section>
  );
}

export function Testimonials() {
  const lead = testimonials[0]!;
  const rest = testimonials.slice(1);
  return (
    <section id="reviews" className="section-pad bg-background">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="In Our Patients' Words"
            title="“I didn't feel a thing.”"
            text="Real Google reviews, shared with first names only."
          />
        </Reveal>

        <Reveal>
          <figure className="mt-14 text-center">
            <Quote
              className="mx-auto size-12 text-primary/25 sm:size-16"
              aria-hidden="true"
            />
            <blockquote className="mx-auto mt-6 max-w-3xl text-2xl leading-[1.45] text-foreground sm:text-3xl">
              {lead.quote}
            </blockquote>
            <figcaption className="mt-8 text-sm font-bold tracking-[0.16em] text-primary uppercase">
              {lead.name}
            </figcaption>
          </figure>
        </Reveal>

        <div className="mt-20 grid gap-x-12 gap-y-14 md:grid-cols-2">
          {rest.map((t, i) => (
            <Reveal key={t.name} delay={i * 60}>
              <figure className="border-t border-border pt-8">
                <Quote className="size-7 text-primary/25" aria-hidden="true" />
                <blockquote className="mt-4 text-lg leading-relaxed text-foreground/90">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-primary uppercase">
                  <Star className="size-3.5 fill-primary text-primary" aria-hidden="true" />
                  {t.name}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <GhostCta
            href={clinic.reviewsUrl}
            label="Read more reviews on Google"
            external
            location="reviews"
          />
        </div>
      </div>
    </section>
  );
}


export function Insurance() {
  return (
    <section id="insurance" className="section-pad bg-tint">
      <div className="mx-auto max-w-3xl px-5 text-center lg:px-8">
        <Reveal>
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-accent text-primary">
            <ShieldCheck className="size-6" aria-hidden="true" />
          </span>
          <h2 className="mt-6 text-3xl sm:text-4xl">Dental Insurance? We've Got You.</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Our team will gladly help verify your benefits before your visit.
          </p>
          <div className="mt-9 flex justify-center">
            <CallCta
              location="insurance"
              variant="solid"
              label="Questions About Your Coverage? Give Us a Call"
              className="max-w-full text-center"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="section-pad bg-background">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Contact"
            title="Come see us"
            text="One short call is all it takes to find a time that suits you."
          />
        </Reveal>
        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft">
              <h3 className="text-xl">{clinic.name}</h3>
              <ul className="mt-6 space-y-5">
                <li className="flex gap-4">
                  <Phone className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                  <a
                    href={clinic.phoneHref}
                    onClick={() => trackEvent("phone_click", { location: "contact" })}
                    className="text-lg font-bold text-primary hover:underline"
                  >
                    {clinic.phone}
                  </a>
                </li>
                <li className="flex gap-4">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                  <address className="text-base not-italic">{clinic.address}</address>
                </li>
                <li className="flex gap-4">
                  <Clock className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-bold tracking-[0.18em] text-primary uppercase">
                      Opening Hours
                    </p>
                    <p className="mt-1.5 text-base font-semibold">{clinic.hours.display}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {clinic.note}
                    </p>
                  </div>
                </li>
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <CallCta
                  className="flex-1"
                  variant="solid"
                  label="Schedule Your Visit"
                  location="contact"
                />
                <DirectionsCta className="flex-1" location="contact" />
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="h-full min-h-100 overflow-hidden rounded-3xl border border-border/60 shadow-soft">
              <iframe
                title={`Map showing Whitehall Dental Group at ${clinic.address}`}
                src={clinic.mapsEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="size-full min-h-100"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="section-pad bg-primary">
      <div className="mx-auto max-w-3xl px-5 text-center lg:px-8">
        <Reveal>
          <h2 className="text-3xl text-primary-foreground sm:text-5xl">
            We'd love to meet you
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-primary-foreground/85">
            Whenever you're ready, we'll find a time that works and take good care of you from
            there.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <BookCta
              className="bg-background text-primary hover:bg-background hover:opacity-90"
              label="Book an Appointment"
              location="final-cta"
            />
            <a
              href={clinic.phoneHref}
              onClick={() => trackEvent("phone_click", { location: "final-cta" })}
              className="group inline-flex min-h-13 items-center justify-center gap-2 rounded-full border-2 border-primary-foreground/70 px-7 py-3.5 text-base font-bold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-foreground/10"
            >
              <Phone
                className="size-5 transition-transform duration-300 group-hover:scale-110"
                aria-hidden="true"
              />
              {clinic.phone}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
