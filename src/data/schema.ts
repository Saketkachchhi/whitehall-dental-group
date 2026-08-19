/**
 * JSON-LD graph for the site.
 *
 * Everything is emitted as a single @graph with stable @id values so the
 * entities reference each other instead of repeating themselves — this is what
 * lets Google resolve "the Dentist", "the WebSite" and "the Doctors" as one
 * connected business rather than three unrelated blobs.
 */
import {
  SITE_URL,
  abs,
  clinic,
  doctors,
  googleRating,
  media,
  ogImage,
  serviceAreas,
  services,
  testimonials,
} from "./site";

/* ---------------- stable entity ids ---------------- */
export const ID = {
  dentist: `${SITE_URL}/#dentist`,
  website: `${SITE_URL}/#website`,
  org: `${SITE_URL}/#organization`,
  webpage: `${SITE_URL}/#webpage`,
  breadcrumb: `${SITE_URL}/#breadcrumb`,
  doctor: (slug: string) => `${SITE_URL}/#${slug}`,
};

const sameAs = [clinic.social.facebook, clinic.social.instagram];

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: clinic.addressParts.street,
  addressLocality: clinic.addressParts.city,
  addressRegion: clinic.addressParts.region,
  postalCode: clinic.addressParts.postalCode,
  addressCountry: clinic.addressParts.country,
};

/** Drops keys whose value is an unfilled [INSERT_*] placeholder or empty. */
const clean = <T extends Record<string, unknown>>(obj: T): T => {
  const out = {} as T;
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null || v === "") continue;
    if (typeof v === "string" && /^\[INSERT_.*\]$/.test(v)) continue;
    out[k as keyof T] = v as T[keyof T];
  }
  return out;
};

/* ---------------- 1. Dentist / LocalBusiness ---------------- */
export const dentistSchema = {
  "@type": ["Dentist", "LocalBusiness", "MedicalBusiness"],
  "@id": ID.dentist,
  name: clinic.name,
  description:
    "Family and cosmetic dentistry in Whitehall Township, PA — implants, crowns, root canals and cleanings, serving the Lehigh Valley.",
  url: `${SITE_URL}/`,
  telephone: clinic.phoneE164,
  address: postalAddress,
  geo: {
    "@type": "GeoCoordinates",
    latitude: clinic.geo.latitude,
    longitude: clinic.geo.longitude,
  },
  hasMap: clinic.mapsUrl,
  image: abs(ogImage),
  logo: abs(`/images/opt/${media.logo.base}-400.png`),
  priceRange: clinic.priceRange,
  currenciesAccepted: "USD",
  paymentAccepted: "Cash, Credit Card, Debit Card, Dental Insurance",
  medicalSpecialty: "Dentistry",
  sameAs,
  areaServed: serviceAreas.map((name) => ({
    "@type": "City",
    name,
    containedInPlace: { "@type": "State", name: "Pennsylvania" },
  })),
  openingHoursSpecification: clinic.hours.spec.map((s) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: s.days.map((d) => `https://schema.org/${d}`),
    opens: s.opens,
    closes: s.closes,
  })),
  availableService: services.map((s) => ({
    "@type": "MedicalProcedure",
    name: s.title,
    description: s.text,
    procedureType: "https://schema.org/NoninvasiveProcedure",
  })),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Dental Services",
    itemListElement: services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "MedicalProcedure", name: s.title },
    })),
  },
  employee: doctors.map((d) => ({ "@id": ID.doctor(d.slug) })),
  parentOrganization: { "@id": ID.org },
};

/* ---------------- 2. Review + AggregateRating ----------------
 * NOTE: Google does not render review rich results for self-serving reviews on
 * LocalBusiness/Organization (reviews about yourself, on your own site). This is
 * valid schema and safe to ship, but the stars come from the Google Business
 * Profile, not from here. See the note in the accompanying message.
 */
export const aggregateRatingSchema = {
  "@type": "AggregateRating",
  "@id": `${SITE_URL}/#rating`,
  itemReviewed: { "@id": ID.dentist },
  ratingValue: googleRating.value,
  reviewCount: googleRating.count,
  bestRating: 5,
  worstRating: 1,
};

export const reviewSchemas = testimonials.map((t, i) => ({
  "@type": "Review",
  "@id": `${SITE_URL}/#review-${i + 1}`,
  itemReviewed: { "@id": ID.dentist },
  reviewBody: t.quote,
  author: { "@type": "Person", name: t.name },
  reviewRating: {
    "@type": "Rating",
    ratingValue: 5,
    bestRating: 5,
    worstRating: 1,
  },
  publisher: { "@type": "Organization", name: "Google" },
}));

/* ---------------- 3. WebSite ---------------- */
export const websiteSchema = {
  "@type": "WebSite",
  "@id": ID.website,
  url: `${SITE_URL}/`,
  name: clinic.name,
  inLanguage: "en-US",
  publisher: { "@id": ID.org },
};

export const organizationSchema = {
  "@type": "Organization",
  "@id": ID.org,
  name: clinic.name,
  url: `${SITE_URL}/`,
  telephone: clinic.phoneE164,
  address: postalAddress,
  logo: {
    "@type": "ImageObject",
    url: abs(`/images/opt/${media.logo.base}-400.png`),
    width: 400,
    height: 274,
  },
  sameAs,
};

/* ---------------- 4. BreadcrumbList ---------------- */
export const breadcrumbSchema = (
  trail: Array<{ name: string; path: string }>,
) => ({
  "@type": "BreadcrumbList",
  "@id": ID.breadcrumb,
  itemListElement: trail.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: abs(item.path),
  })),
});

/* ---------------- 5. Person (each doctor) ---------------- */
export const doctorSchemas = doctors.map((d) =>
  clean({
    "@type": ["Person", "Physician"],
    "@id": ID.doctor(d.slug),
    name: d.name,
    honorificSuffix: d.credentials,
    jobTitle: d.role,
    description: d.intro,
    image: abs(`/images/opt/${d.photo.base}-640.jpg`),
    medicalSpecialty: "Dentistry",
    worksFor: { "@id": ID.dentist },
    alumniOf: /^\[INSERT_.*\]$/.test(d.alumniOf)
      ? undefined
      : { "@type": "CollegeOrUniversity", name: d.alumniOf },
    knowsAbout: services.map((s) => s.title),
  }),
);

/* ---------------- 6. FAQPage ---------------- */
export const faqSchema = {
  "@type": "FAQPage",
  "@id": `${SITE_URL}/#faq`,
  mainEntity: [
    {
      "@type": "Question",
      name: "Do you accept dental insurance?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Whitehall Dental Group accepts most major insurance plans and verifies your benefits before treatment so you know your coverage in advance.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need an appointment?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `We see patients by appointment. Call ${clinic.phone} and we will find a time that fits your schedule, including same-day emergency visits when available.`,
      },
    },
    {
      "@type": "Question",
      name: "Where is Whitehall Dental Group located?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `${clinic.name} is located at ${clinic.address}, serving ${serviceAreas.join(", ")} and the wider Lehigh Valley.`,
      },
    },
    {
      "@type": "Question",
      name: "Which areas do you serve?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `We welcome patients from ${serviceAreas.join(", ")} and across the Lehigh Valley, PA.`,
      },
    },
  ],
};

/* ---------------- WebPage + assembled graph ---------------- */
export const webPageSchema = (opts: {
  path: string;
  name: string;
  description: string;
}) => ({
  "@type": "WebPage",
  "@id": `${abs(opts.path)}#webpage`,
  url: abs(opts.path),
  name: opts.name,
  description: opts.description,
  isPartOf: { "@id": ID.website },
  about: { "@id": ID.dentist },
  primaryImageOfPage: abs(ogImage),
  inLanguage: "en-US",
});

/** Single <script type="application/ld+json"> payload for the homepage. */
export const homepageGraph = (opts: { name: string; description: string }) => ({
  "@context": "https://schema.org",
  "@graph": [
    { ...dentistSchema, aggregateRating: aggregateRatingSchema },
    organizationSchema,
    websiteSchema,
    webPageSchema({ path: "/", ...opts }),
    breadcrumbSchema([{ name: "Home", path: "/" }]),
    ...doctorSchemas,
    ...reviewSchemas,
    faqSchema,
  ],
});

/** Graph for the privacy page. */
export const privacyGraph = (opts: { name: string; description: string }) => ({
  "@context": "https://schema.org",
  "@graph": [
    websiteSchema,
    organizationSchema,
    webPageSchema({ path: "/privacy", ...opts }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Privacy Policy", path: "/privacy" },
    ]),
  ],
});
