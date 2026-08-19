// Editable site content. Update values here to change the website copy.

/**
 * Canonical production origin. No trailing slash.
 *
 * Set VITE_SITE_URL in the deploy environment (Cloudflare/Lovable project vars)
 * so preview builds and production each self-canonicalise correctly. The literal
 * below is the fallback used when the env var is absent.
 */
export const SITE_URL = (
  import.meta.env?.["VITE_SITE_URL"] ?? "[INSERT_PRODUCTION_DOMAIN_HERE]"
).replace(/\/+$/, "");

/** Absolute URL helper — schema and og: tags must never emit relative paths. */
export const abs = (p: string) => `${SITE_URL}${p.startsWith("/") ? p : `/${p}`}`;

/**
 * Responsive image manifest.
 *
 * `src` is the fallback (jpg/png) at its largest generated width; `widths` drives
 * srcset. Derivatives live in /images/opt/ and are produced by
 * `node scripts/optimize-images.mjs` — re-run it whenever a source image changes.
 * `w`/`h` are TRUE intrinsic dimensions of the source, so width/height attributes
 * never lie to the layout engine.
 */
export type ImageAsset = {
  base: string;
  ext: "jpg" | "png";
  widths: number[];
  w: number;
  h: number;
};

export const media = {
  logo: { base: "whitehall-logo", ext: "png", widths: [200, 300, 400], w: 1240, h: 850 },
  exterior: {
    base: "exterior",
    ext: "jpg",
    widths: [640, 960, 1280, 1600, 1836],
    w: 1836,
    h: 856,
  },
  drHN: { base: "dr-hn", ext: "jpg", widths: [320, 480, 640, 900], w: 1254, h: 1254 },
  drJVP: { base: "dr-jvp", ext: "jpg", widths: [320, 480, 640, 900], w: 1254, h: 1254 },
  drRT: { base: "dr-rt", ext: "jpg", widths: [320, 480, 640, 900], w: 1254, h: 1254 },
  reception: { base: "reception", ext: "jpg", widths: [400, 600, 900], w: 900, h: 1600 },
  waiting: { base: "waiting", ext: "jpg", widths: [400, 600, 900], w: 900, h: 1600 },
  hallway: { base: "hallway", ext: "jpg", widths: [400, 600, 900], w: 900, h: 1600 },
  treatment: {
    base: "treatment",
    ext: "jpg",
    widths: [400, 600, 900, 1200],
    w: 1600,
    h: 900,
  },
  operatory: { base: "operatory", ext: "jpg", widths: [400, 600, 900], w: 900, h: 1600 },
} satisfies Record<string, ImageAsset>;

/** 1200x630 social share card referenced by og:image / twitter:image. */
export const ogImage = "/images/opt/og-image.jpg";

export const clinic = {
  name: "Whitehall Dental Group",
  tagline: "Your Smile. Our Priority.",
  phone: "(610) 440-0075",
  phoneHref: "tel:+16104400075",
  /** E.164 — required by schema.org telephone and tel: parity. */
  phoneE164: "+1-610-440-0075",
  address: "2541 Mickley Ave, Whitehall Township, PA 18052, United States",
  addressParts: {
    street: "2541 Mickley Ave",
    city: "Whitehall Township",
    region: "PA",
    postalCode: "18052",
    country: "US",
  },
  /** Verified against the Mickley Ave address for LocalBusiness `geo`. */
  geo: { latitude: 40.6478, longitude: -75.5049 },
  /** Google-accepted band, not a price list. */
  priceRange: "$$",
  mapsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=2541%20Mickley%20Ave%2C%20Whitehall%20Township%2C%20PA%2018052",
  mapsEmbed:
    "https://www.google.com/maps?q=2541%20Mickley%20Ave%2C%20Whitehall%20Township%2C%20PA%2018052&output=embed",

  /**
   * Opening hours — MUST match the Google Business Profile exactly.
   *
   * `display` is what patients read. `spec` drives openingHoursSpecification and
   * must use 24h "HH:MM". Delete any day the practice is closed.
   */
  hours: {
    display: "[INSERT_HOURS_HERE]",
    spec: [
      { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "[INSERT_HOURS_HERE]", closes: "[INSERT_HOURS_HERE]" },
    ],
  },
  note: "Visits are scheduled by appointment — a quick phone call is all it takes.",
  reviewsUrl: "https://www.google.com/search?q=Whitehall+Dental+Group+Whitehall+Township+PA+reviews",
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61591386905373",
    instagram: "https://www.instagram.com/whitehalldentalgroup?igsh=MWxxdmx3OWZ0aTZ2Nw==",
  },
};

/** Adjacent markets used for areaServed schema and on-page geo copy. */
export const serviceAreas = [
  "Whitehall Township",
  "Allentown",
  "Bethlehem",
  "Catasauqua",
];

/** Aggregate of the practice's public Google rating. */
export const googleRating = { value: 4.9, count: 122 };

/** The four services shown up front on the homepage. */
export const featuredServices = [
  {
    title: "Dental Implants",
    icon: "implant",
    text: "Replacement teeth that look, feel, and work like your own — planned carefully, placed comfortably.",
  },
  {
    title: "Crowns",
    icon: "crown",
    text: "A damaged tooth rebuilt and protected, shaped and shaded to blend in with the rest of your smile.",
  },
  {
    title: "Root Canal",
    icon: "root",
    text: "Relief from the pain, and your natural tooth saved. Most patients tell us they felt nothing at all.",
  },
  {
    title: "Dental Cleaning",
    icon: "cleaning",
    text: "A gentle, unhurried hygiene visit that keeps your gums healthy and catches small issues early.",
  },
];

/** Everything else, revealed when a visitor asks to see all services. */
export const moreServices = [
  {
    title: "Cosmetic Dentistry",
    icon: "cosmetic",
    text: "Veneers, bonding, and refinements designed around your face — never one-size-fits-all.",
  },
  {
    title: "Deep Cleaning",
    icon: "deep",
    text: "Extra care for gums that need it, taken slowly and with your comfort in mind.",
  },
  {
    title: "Teeth Whitening",
    icon: "whitening",
    text: "A brighter, even smile with professional whitening and minimal sensitivity.",
  },
  {
    title: "Preventive Exams",
    icon: "exam",
    text: "A clear picture of your dental health, and honest advice about what actually needs doing.",
  },
];

export const services = [...featuredServices, ...moreServices];

/**
 * `credentials`, `alumniOf` and `yearsExperience` feed Person schema (E-E-A-T).
 * Fill each placeholder with the doctor's real, verifiable details — leave a
 * field blank rather than guessing; it is omitted from schema when empty.
 */
export const doctors = [
  {
    name: "Dr. Hitesh Nada",
    role: "General Dentist",
    photo: media.drHN,
    slug: "dr-hitesh-nada",
    credentials: "[INSERT_CREDENTIALS_HERE]",
    alumniOf: "[INSERT_DENTAL_SCHOOL_HERE]",
    yearsExperience: "[INSERT_YEARS_HERE]",
    intro:
      "Known for a steady, gentle hand with implants and restorative work. He'll walk you through every option before anything begins — patients often mention they didn't feel a thing.",
  },
  {
    name: "Dr. Jignesh V. Patel",
    role: "General Dentist",
    photo: media.drJVP,
    slug: "dr-jignesh-v-patel",
    credentials: "[INSERT_CREDENTIALS_HERE]",
    alumniOf: "[INSERT_DENTAL_SCHOOL_HERE]",
    yearsExperience: "[INSERT_YEARS_HERE]",
    intro:
      "Cares for the whole family, from first check-ups to cosmetic work. Calm, unhurried, and especially good with patients who arrive nervous.",
  },
  {
    name: "Dr. Rupal Tailor",
    role: "General Dentist",
    photo: media.drRT,
    slug: "dr-rupal-tailor",
    credentials: "[INSERT_CREDENTIALS_HERE]",
    alumniOf: "[INSERT_DENTAL_SCHOOL_HERE]",
    yearsExperience: "[INSERT_YEARS_HERE]",
    intro:
      "Warm, thorough, and easy to talk to. Patients regularly describe feeling genuinely cared for and completely comfortable in her chair.",
  },
];

/** Real Google reviews, lightly trimmed for readability, names anonymized. */
export const testimonials = [
  {
    quote:
      "Everyone at the clinic is great! Their patience and compassion towards me was far and beyond. Dr. Nada and the assistants were amazing — I didn't feel a thing and the procedure was quicker than I thought.",
    name: "Linette R.",
    detail: "Verified Google Patient",
  },
  {
    quote:
      "Professional, but they also make you feel extremely comfortable and informed. Always able to get you in on time, and the staff make sure you're getting the best care. I've been with them for several years now.",
    name: "Gabrielle R.",
    detail: "Verified Google Patient",
  },
  {
    quote:
      "I was so nervous because I hadn't been to a dentist in a long time, but they were all super nice, so non-judgemental, and very professional. I'm grateful for such a positive experience.",
    name: "Jennifer M.",
    detail: "Verified Google Patient",
  },
  {
    quote:
      "The best staff, the kindest doctors, and overall an amazing experience. I love coming here — everyone is so nice and accommodating.",
    name: "Devaun C.",
    detail: "Verified Google Patient",
  },
  {
    quote:
      "Appointments were quick to schedule, staff was extra friendly, and I was immediately at ease with the doctor. I made appointments for my whole family.",
    name: "Jul M.",
    detail: "Verified Google Patient",
  },
  {
    quote:
      "I really like this place. The staff are all very nice, they don't keep you waiting, and Dr. Nada is truly the very best. It's a great place.",
    name: "Mary K.",
    detail: "Verified Google Patient",
  },
];

/** A guided walk through the clinic, in the order a patient experiences it. */
export const gallery = [
  {
    img: media.reception,
    label: "Reception",
    caption: "Greeted by name. Paperwork kept short.",
  },
  {
    img: media.waiting,
    label: "Waiting Area",
    caption: "Bright and quiet — visits start on time.",
  },
  {
    img: media.hallway,
    label: "Consultation",
    caption: "Your options, explained in plain language.",
  },
  {
    img: media.treatment,
    label: "Treatment Room",
    caption: "A calm private room, at your pace.",
  },
  {
    img: media.operatory,
    label: "Chairside Care",
    caption: "Precise, smooth, and unhurried.",
  },
];


/** Patient-benefit led reasons, not a feature list. */
export const whyUs = [
  {
    icon: "gentle",
    title: "Gentle with anxious patients",
    text: "If the dentist makes you uneasy, say so. We slow down, explain everything, and stop whenever you need us to.",
  },
  {
    icon: "honest",
    title: "Honest recommendations",
    text: "You'll only ever hear about treatment you actually need — and what it will cost before we begin.",
  },
  {
    icon: "comfort",
    title: "A comfortable visit",
    text: "Short waits, a calm room, and a team that checks in with you throughout your appointment.",
  },
  {
    icon: "personal",
    title: "Care that fits your life",
    text: "Your plan is built around your health, your schedule, and what matters most to you.",
  },
  {
    icon: "family",
    title: "Families welcome",
    text: "Grandparents, parents, and children seen by the same familiar faces, year after year.",
  },
  {
    icon: "longterm",
    title: "Here for the long run",
    text: "Many of our patients have been with us for years. We'd like you to be one of them.",
  },
];

export const nav = [
  { label: "Services", href: "#services" },
  { label: "Meet Our Doctors", href: "#doctors" },
  { label: "Patient Reviews", href: "#reviews" },
  { label: "Insurance", href: "#insurance" },
  { label: "Contact", href: "#contact" },
];

/** Lightweight horizontal trust strip shown directly under the hero. */
export const trustStrip = [
  { icon: "rating", label: "4.9★ Google Rating" },
  { icon: "insurance", label: "Most Major Insurance Accepted" },
  { icon: "gentle", label: "Gentle Care for Nervous Patients" },
  { icon: "family", label: "Family Dentistry" },
  { icon: "honest", label: "Honest Recommendations" },
];

