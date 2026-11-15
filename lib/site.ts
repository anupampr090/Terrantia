/**
 * The public address of the site, used for canonical links, the sitemap, robots.txt,
 * share images and structured data.
 *
 * Set NEXT_PUBLIC_SITE_URL in production (for example https://www.example.com).
 * On Vercel it falls back to the project's production domain, then the deployment URL.
 * Locally it falls back to http://localhost:3000.
 */
function resolve(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/\/+$/, "")}`;
  return "http://localhost:3000";
}

export const siteUrl = resolve();

/** True when a production build is still pointing at localhost. */
export const siteUrlIsPlaceholder = process.env.NODE_ENV === "production" && siteUrl.includes("localhost");
