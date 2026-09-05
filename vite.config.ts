// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

/**
 * Canonical origin for sitemap generation.
 *
 * Kept in sync with SITE_URL in src/data/site.ts — set VITE_SITE_URL in the
 * deploy environment so the emitted sitemap uses the production domain.
 */
const SITE_URL = (
  process.env["VITE_SITE_URL"] ?? "[INSERT_PRODUCTION_DOMAIN_HERE]"
).replace(/\/+$/, "");

/**
 * Meta Pixel: keep non-production deploys out of the live ad dataset.
 *
 * Vercel builds a preview deployment for every branch and pull request. A pixel
 * firing there reports our own testing as real patient activity, which is worse
 * than having no data at all.
 *
 * This is decided here rather than in the Vercel dashboard on purpose. Setting
 * VITE_META_PIXEL_ID to an empty value there is not dependable — an empty value
 * can reach the build as undefined, which falls straight through the `??` in
 * lib/meta-pixel.ts to the hard-coded production ID, silently enabling the very
 * thing it was meant to switch off. Deriving it from Vercel's own VERCEL_ENV
 * cannot be forgotten when someone adds a branch, and fails safe.
 *
 * An explicit VITE_META_PIXEL_ID still wins, so a preview can opt in to a test
 * pixel when someone is deliberately debugging the tracking.
 */
if (
  process.env["VERCEL_ENV"] &&
  process.env["VERCEL_ENV"] !== "production" &&
  process.env["VITE_META_PIXEL_ID"] === undefined
) {
  process.env["VITE_META_PIXEL_ID"] = "";
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },

    // Emits public/sitemap.xml at build time from the `pages` list below.
    sitemap: {
      enabled: true,
      host: SITE_URL,
      outputPath: "sitemap.xml",
    },
    pages: [
      { path: "/", sitemap: { priority: 1.0, changefreq: "weekly" } },
      { path: "/privacy", sitemap: { priority: 0.3, changefreq: "yearly" } },
    ],
  },
});
