/**
 * Writes public/robots.txt with an absolute Sitemap: directive.
 *
 * robots.txt is a static file, so it cannot read VITE_SITE_URL at runtime the
 * way the app does — without this step the Sitemap line ships with whatever
 * literal was committed. Runs automatically via the `prebuild` npm hook, so the
 * emitted robots.txt always agrees with the sitemap the build generates.
 */
import { writeFileSync } from "node:fs";
import path from "node:path";

const SITE_URL = (
  process.env["VITE_SITE_URL"] ?? "[INSERT_PRODUCTION_DOMAIN_HERE]"
).replace(/\/+$/, "");

const body = `User-agent: Googlebot
Allow: /

User-agent: Googlebot-Image
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: *
Allow: /

# Build artefacts and framework internals — no crawl value.
Disallow: /_build/
Disallow: /_server/
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`;

const out = path.resolve("public/robots.txt");
writeFileSync(out, body);

if (SITE_URL.startsWith("[INSERT_")) {
  console.warn(
    "[robots] VITE_SITE_URL is not set — robots.txt Sitemap directive still contains a placeholder.",
  );
} else {
  console.log(`[robots] Sitemap: ${SITE_URL}/sitemap.xml`);
}
