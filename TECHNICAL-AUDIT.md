# Technical launch audit — 10 October 2026

## Demo submission architecture update — 10 October 2026

This update supersedes the historical static-export/mock-form findings below. The approved homepage is unchanged. Static export has been removed; deploy a normal Next.js Node application, not `out/`. Security headers are now supplied by Next.js configuration. The browser posts to `/api/demo-requests`; server-only configuration connects a validated submission to Supabase and then Resend. The migration enables RLS, revokes direct table access and grants two scoped functions only to the server role. Atomic database deduplication and email/global creation limits work across instances. No IP or user-agent collection was added.

The active mock, simulated confirmation notices and static export check are removed. The modal preserves its design, fields and focus behavior, adds a truthful privacy disclosure, accessible pending/error handling and an inert honeypot. Success requires confirmed storage. Email failure or missing email configuration is recorded separately and never makes an already stored lead appear to fail. No credentials, provider accounts or fake destinations were added.

Verification for this update: lint, TypeScript, 19 automated tests, production build and production bundle/anchor checks passed. The built route returned the expected 503 with a safe error, no-store and security headers when credentials were absent. Browser checks confirmed required-field validation, retained input after failure, focus on the error, re-enabled retry, forward/reverse focus trapping, Escape and opener focus restoration. Actual CSS viewports 375/390/430/1440 × 900 had no page or dialog horizontal overflow; reduced-motion preference remained respected. Screenshots are under `.qa/demo-server-*.png` and are not deployed. Successful storage, duplicate acceptance and email failures were exercised with injected test transports; genuine provider-backed success, live SQL concurrency/RLS, transient pending UI timing and inbox delivery are not claimed as browser-verified. Removed one obsolete FAQ sentence describing the form as mocked; no homepage layout changes.

Launch limitations: services are not configured; the SQL migration and RLS/concurrency behavior still require verification in a real Supabase project, and actual Resend acceptance/inbox delivery is unverified. Missing database configuration safely returns 503. Notification monitoring/manual recovery is needed for failed or pending delivery; no background retry worker exists. Creation limits are not edge-level DDoS protection; Turnstile is neither enabled nor simulated. A full privacy policy and approved retention process remain outstanding. See README for exact setup and staging checks. Historical performance figures below predate this change.

## Assessment

The approved homepage started with a sound static architecture: Next.js 16.4.0, React 19.3, two locally hosted variable Geist fonts, no animation library, no external application services, and no live customer-data collection. The main gaps were launch metadata/configuration, sharing imagery, deployment header guidance, branded recovery pages, and a few form/accessibility details.

## Implemented

- Added build-time `SITE_URL` validation. Missing configuration produces noindex/nofollow, disallow-all robots, no canonical, and an empty sitemap. Malformed/non-public origins fail clearly.
- Added the approved SEO title/description, Open Graph and Twitter metadata, a generated local 1200×630 branded OG image, robots and sitemap routes, and a homepage-only canonical URL.
- Added a branded not-found page and a generic error boundary that never displays exception details. Preserved the existing AUREX SVG favicon.
- Prepared static-host headers: nosniff, restrictive referrer policy, denied framing, limited browser permissions, and a compatible baseline CSP. These were exercised on a loopback audit server; real hosting must apply them independently.
- Deferred the demo modal JavaScript until it is opened. The separate modal chunk is approximately 5.4 KB uncompressed and is absent from the initial HTML script list.
- Changed the animated score bar from width animation to `transform: scaleX`. Timed hero playback already stops offscreen/in hidden tabs and at completion; no decorative loops were introduced.
- Added adapter-level required/email/length/website validation, a synchronous duplicate-submission guard, safe error messages, submitting-state accessibility, and focus on the success heading. Kept the local mock and both notices intact.
- Enlarged the home-link touch area to 45px on mobile without moving the mark. Added scrolling for the mobile menu on short viewports.
- Removed an unused animation rule; retained useful QA evidence outside the deployed export. No production dependencies were unnecessary, so none were removed or upgraded.
- Added dependency-free Node tests and export checks. Updated the README and environment example for another developer to install, build, verify, and deploy.

## Verification

- Lint, TypeScript, production build, six Node tests, and export checks passed. Application lint warnings discovered while implementing error recovery were fixed.
- Tested configured metadata using `https://example.com` only as a temporary reserved-domain fixture. Canonical, OG/Twitter images, robots and sitemap matched the fixture. Restored the final unconfigured/noindex build afterward; no domain has been invented for AUREX.
- Reviewed all requested widths: 320, 375, 390, 430, 768, 1024, 1280, 1440, 1920px. No horizontal overflow or out-of-bounds main/footer elements. Also checked the menu and dialog at 375×320.
- Exercised navbar, mobile menu, footer/section anchors, FAQ toggles, property replay, transcript disclosure, demo entry points, required-field validation, invalid website handling, success state, focus trapping, Escape, and focus restoration. The mock made no POST request.
- One H1 and logical section headings. All 425 rendered text samples checked passed the applicable WCAG AA text contrast threshold under their computed solid backgrounds. This is a targeted check, not accessibility certification. Main form fields have labels; errors use a live alert; FAQ state and hidden panels remain synchronized.
- Reduced-motion mode showed the completed hero and readable content; computed animation names were `none`. Browser preferences in this environment force reduced motion. Normal-motion hero replay/pause/offscreen behavior was reviewed in code but could not be visually exercised here. Property replay was tested with keyboard input.
- Observed homepage resources were same-origin: two fonts, two stylesheets, and application scripts. The lazy modal loads locally on demand. No observed application analytics or third-party calls; no application console/hydration warnings during the exercised flow. Intentional missing-route checks produced expected 404 responses.
- HTTP checks: homepage, robots, sitemap, favicon and OG image returned 200; an unknown route returned the branded HTML with 404. Header values were returned by the audit server and did not break the tested flow. The existing simple port-3001 preview does not itself interpret `_headers`.
- Export checks verify asset existence, anchor destinations, metadata, OG dimensions, no source maps/environment files/QA directories, and no canonical on the 404 page.
- Secret-pattern scan of 35 current source/public files found no matches. Only `.env.example` was present; no private credentials, unsafe HTML injection, query-driven rendering, browser storage, or application fetch calls were found. This workspace is not a Git repository, so no historical commit-secret audit was possible.

## Performance evidence and limits

The site stays statically rendered. Geist uses `next/font/local` through the Geist package, with two preloaded WOFF2 variable files totaling 141,020 bytes; there are no external font requests or separate downloads for each weight. Sans includes metric-adjusted fallback. The mono font uses its supplied monospace fallback stack.

The initial script-tag set is approximately 525 KB uncompressed / 157 KB gzip; total emitted JavaScript is approximately 643 KB / 199 KB gzip, including other routes, deferred modal and legacy code. CSS is approximately 72 KB / 14 KB gzip. The OG image is 42,483 bytes and is not downloaded by the homepage. Gzip values are local compression estimates, not measured transfer sizes. The host still needs compression and cache headers.

The audit adds SEO/error infrastructure, so total output is not claimed to be smaller than before. The concrete performance improvements are deferred modal loading and compositor-friendly score animation. Existing static rendering, local fonts, bounded timers and server-rendered static children were preserved.

Lighthouse is not installed and browser timing APIs are not exposed through the available inspection surface. No reliable FCP, LCP, CLS, INP or Lighthouse result is claimed. Run a mobile production audit and field monitoring after hosting is chosen; local desktop rendering does not establish average-mobile performance.

## Security / dependency findings

`npm audit --omit=dev`: zero findings. Full audit: five high findings in one development-only chain (`eslint-config-next` → `@next/eslint-plugin-next` → `fast-glob` → `micromatch` → `braces`). The upstream advisory [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) reports no patched version. It concerns stack exhaustion from deeply nested brace patterns. npm's suggested fix downgrades the lint configuration to Next 14, which is unsuitable for this Next 16 project. No forced downgrade or security-check bypass was applied. Do not feed untrusted glob patterns into the tooling; reassess compatible upstream fixes. Static hosting receives only `out/`, not this toolchain.

The baseline CSP deliberately does not restrict script/style sources. It prevents base URL replacement, object embedding and framing, and confines native form actions to self. It is not a full XSS policy. A strict policy needs per-build inline-script hashes (or a different rendering architecture for request nonces), style handling, report-only testing, and host verification. HTTPS, HSTS scope, compression, cache rules and canonical redirects belong to the chosen deployment environment.

## Public deployment decision

The code is ready for a static staging deployment and an explicitly labelled public preview, provided the actual domain is supplied and HTTPS, headers, 404 handling, compression and caching are applied and verified on the host. The current local build is intentionally unconfigured and not indexable.

It is not yet a functioning lead-acquisition launch: demo submissions are mock only. Before enabling collection, agree on appropriate privacy information, retention, processing/storage, deletion and a real contact path; implement verified delivery and server protections separately. Normal-motion device testing, screen-reader testing and hosted performance measurement remain release checks. No live-domain or cross-browser/device sign-off is claimed.

## Intentionally not implemented / next task

No redesign, new homepage sections, SaaS backend, AI API, database, authentication, billing, pilot activation, analytics, cookie banners, real contact integration, or invented legal policies were added. Later measurement can cover demo CTA/open/submission, product-demo clicks, FAQ/property engagement and coarse scroll depth, without collecting form contents in event payloads.

The single next development task is **real demo-request delivery with agreed privacy/data-handling requirements and server-side validation/abuse protection**. That task has not been started.
