/** Build-time public origin. Unconfigured previews must never advertise localhost. */
export function parseSiteUrl(value: string | undefined): URL | undefined {
  if (!value?.trim()) return undefined;
  let url: URL;
  try { url = new URL(value.trim()); } catch { throw new Error("SITE_URL must be a valid public HTTPS origin."); }
  const host = url.hostname.toLowerCase();
  if (url.protocol !== "https:" || url.username || url.password || url.port || url.pathname !== "/" || url.search || url.hash || !host.includes(".") || /(^|\.)localhost$|\.(local|test|invalid|example)$|^[\d.]+$|:/.test(host)) {
    throw new Error("SITE_URL must be a public HTTPS origin without credentials, a port, path, query, or fragment.");
  }
  return url;
}

export const siteUrl = parseSiteUrl(process.env.SITE_URL);
