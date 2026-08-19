import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { StickyCallBar } from "@/components/site/StickyCallBar";
import { abs, clinic, ogImage } from "@/data/site";
import { privacyGraph } from "@/data/schema";

const title = "Privacy Policy | Whitehall Dental Group";
const description =
  "How Whitehall Dental Group collects, uses, and protects patient information across our website and dental practice in Whitehall Township, PA.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: abs("/privacy") },
      { property: "og:image", content: abs(ogImage) },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: abs(ogImage) },
    ],
    links: [{ rel: "canonical", href: abs("/privacy") }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(privacyGraph({ name: title, description })),
      },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 pb-20 pt-36 lg:px-8">
        <h1 className="text-4xl">Privacy Policy</h1>
        <div className="mt-8 space-y-6 text-base leading-relaxed text-muted-foreground">
          <p>
            {clinic.name} respects your privacy. This page explains what information we collect
            through this website and how it is used.
          </p>
          <div>
            <h2 className="text-2xl text-foreground">Information we collect</h2>
            <p className="mt-3">
              We collect only the information you choose to share with us, such as your name, phone
              number, and reason for visit when you contact the practice. Standard analytics data
              (pages visited, device type) may be collected to improve the site.
            </p>
          </div>
          <div>
            <h2 className="text-2xl text-foreground">How we use it</h2>
            <p className="mt-3">
              Information is used to schedule and confirm appointments, verify insurance benefits,
              and respond to your questions. We do not sell patient information.
            </p>
          </div>
          <div>
            <h2 className="text-2xl text-foreground">Protected health information</h2>
            <p className="mt-3">
              Clinical records are maintained in accordance with HIPAA and applicable Pennsylvania
              law. Please do not send detailed medical information through this website.
            </p>
          </div>
          <div>
            <h2 className="text-2xl text-foreground">Questions</h2>
            <p className="mt-3">
              Call us at{" "}
              <a href={clinic.phoneHref} className="font-bold text-primary">
                {clinic.phone}
              </a>{" "}
              or visit us at {clinic.address}.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
      <StickyCallBar />
    </div>
  );
}
