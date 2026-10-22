import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useRef, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import {
  gaEnabled,
  googleTagBaseCode,
  googleTagSrc,
  trackGaPageView,
} from "../lib/google-analytics";
import {
  metaPixelBaseCode,
  metaPixelNoscriptSrc,
  pixelEnabled,
  trackPixelPageView,
} from "../lib/meta-pixel";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Whitehall Dental Group | Dentist in Whitehall Township, PA" },
      {
        name: "description",
        content:
          "Modern, compassionate dental care in Whitehall Township, PA. Book your appointment or call (610) 440-0075.",
      },
      { name: "author", content: "Whitehall Dental Group" },
      { name: "theme-color", content: "#153E90" },
      /* Global defaults — per-route head() overrides title/description/og:*. */
      {
        name: "robots",
        content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
      { property: "og:site_name", content: "Whitehall Dental Group" },
      { property: "og:locale", content: "en_US" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&family=PT+Serif:wght@400;700&display=swap",
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", type: "image/png" },
      /* Shave a round-trip off the pixel request. */
      ...(pixelEnabled
        ? [
            { rel: "preconnect", href: "https://connect.facebook.net" },
            { rel: "dns-prefetch", href: "https://www.facebook.com" },
          ]
        : []),
      /* Same, for the gtag.js loader and the endpoint it reports to. */
      ...(gaEnabled
        ? [
            { rel: "preconnect", href: "https://www.googletagmanager.com" },
            { rel: "dns-prefetch", href: "https://www.google-analytics.com" },
          ]
        : []),
    ],
    scripts: [
      ...(gaEnabled ? [{ async: true, src: googleTagSrc }, { children: googleTagBaseCode }] : []),
      ...(pixelEnabled ? [{ children: metaPixelBaseCode }] : []),
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {pixelEnabled && (
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={metaPixelNoscriptSrc}
              alt=""
            />
          </noscript>
        )}
        {children}
        <Scripts />
      </body>
    </html>
  );
}

/** Backstop for a route whose title never changes, so no mutation ever arrives. */
const TITLE_SETTLE_TIMEOUT_MS = 500;

/**
 * Runs `report` once <head> has caught up with the route the router just
 * entered. Returns a cancel function.
 *
 * `document.title` still holds the PREVIOUS page's title when a route-change
 * effect runs: HeadContent commits the new one a beat later. Reporting straight
 * away therefore labelled every GA4 page view with the title of the page the
 * visitor had just left — right URL, wrong title, which is the sort of thing
 * nobody notices until the Pages report is already months deep in bad data.
 *
 * Measured on this site, the swap lands ~20ms after the pathname changes, which
 * is after `requestAnimationFrame` and after a 0ms timeout — so any fixed delay
 * is a guess that a slower device or a heavier route would break. Watching for
 * the swap is exact and does not depend on the router's commit scheduling.
 */
function reportAfterTitleSettles(report: () => void): () => void {
  const previousTitle = document.title;
  let settled = false;

  const stop = () => {
    settled = true;
    observer.disconnect();
    window.clearTimeout(timer);
  };
  const settle = () => {
    stop();
    report();
  };

  const observer = new MutationObserver(() => {
    if (settled || document.title === previousTitle) return;
    settle();
  });
  // React swaps the whole <title> element rather than editing it, so the
  // listener has to cover the subtree, not just one node.
  observer.observe(document.head, { childList: true, subtree: true, characterData: true });
  const timer = window.setTimeout(settle, TITLE_SETTLE_TIMEOUT_MS);

  return stop;
}

/**
 * Reports a page view to every analytics tag on client-side route changes.
 *
 * Both base snippets fire once on document load, so SPA navigations would
 * otherwise never be recorded. Keyed on pathname only: hash changes (#services,
 * #contact — which this site uses heavily) are the same page and must not count
 * as page views. The first pathname is recorded without firing, because the base
 * snippets have already reported it.
 *
 * Meta and GA4 share this one component so they can never drift onto different
 * definitions of "a page view" — a discrepancy that is painful to spot later,
 * when the two dashboards simply disagree and neither is obviously wrong. Each
 * tracker no-ops when its own tag is disabled.
 */
function RoutePageViews() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (lastPath.current === null) {
      lastPath.current = pathname;
      return;
    }
    if (lastPath.current === pathname) return;

    lastPath.current = pathname;
    return reportAfterTitleSettles(() => {
      trackGaPageView();
      trackPixelPageView();
    });
  }, [pathname]);

  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {(gaEnabled || pixelEnabled) && <RoutePageViews />}
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
