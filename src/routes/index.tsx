import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { StickyCallBar } from "@/components/site/StickyCallBar";
import {
  Contact,
  Doctors,
  FinalCta,
  Gallery,
  Hero,
  Insurance,
  Services,
  Testimonials,
  TrustBar,
  WhyChoose,
} from "@/components/site/Sections";

import { SITE_URL, abs, media, ogImage } from "@/data/site";
import { homepageGraph } from "@/data/schema";
import { preloadImage } from "@/components/site/Picture";

const title = "Dentist in Whitehall Township, PA | Whitehall Dental Group";
const description =
  "Family and cosmetic dentist in Whitehall Township, PA. Implants, crowns, root canals and cleanings, serving Allentown, Bethlehem and Catasauqua. Most major insurance accepted. Call (610) 440-0075.";

/** Matches the Hero <picture> sizes attribute so the preload hits the same candidate. */
const HERO_SIZES = "100vw";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },

      /* Open Graph */
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:image", content: abs(ogImage) },
      { property: "og:image:secure_url", content: abs(ogImage) },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: "Exterior of the Whitehall Dental Group clinic in Whitehall Township, PA",
      },

      /* Twitter / X — card type now has a real image to reference */
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: abs(ogImage) },
      {
        name: "twitter:image:alt",
        content: "Exterior of the Whitehall Dental Group clinic in Whitehall Township, PA",
      },

      /* Local relevance hints */
      { name: "geo.region", content: "US-PA" },
      { name: "geo.placename", content: "Whitehall Township" },
      { name: "geo.position", content: "40.6478;-75.5049" },
      { name: "ICBM", content: "40.6478, -75.5049" },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/` },
      preloadImage(media.exterior, HERO_SIZES),
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(homepageGraph({ name: title, description })),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <TrustBar />
        <Services />
        <Doctors />
        <WhyChoose />
        <Gallery />
        <Testimonials />
        <Insurance />
        <Contact />
        <FinalCta />

      </main>
      <SiteFooter />
      <StickyCallBar />
    </div>
  );
}
