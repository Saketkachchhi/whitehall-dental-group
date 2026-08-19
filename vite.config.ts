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
