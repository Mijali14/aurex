# AUREX marketing website

The approved marketing design is unchanged. Request a Demo now posts to a Next.js server route, which validates the request, commits it to Supabase, and then attempts an internal Resend notification. No provider accounts or credentials are configured yet. Unconfigured submissions return a retryable error; they never show a simulated success.

## Architecture

Browser → same-origin `POST /api/demo-requests` → Supabase database function → Resend → genuine confirmation.

This is a normal Next.js application, **not a static export**. Deploy the application with its Node runtime. Do not deploy `out/`; any old local `out/` directory is an obsolete artifact. Security headers now come from `next.config.ts`, not a static `_headers` file. The homepage remains prerendered; only the submission route needs a server.

No provider SDK or additional production dependency is needed: the server uses the providers’ HTTPS APIs. Credentials are read only inside the server-only route. There is no public Supabase client, visitor confirmation email, account system, or CRM.

## Accounts and configuration — in this order

1. **Supabase:** create an account and a new project at https://supabase.com/dashboard. Choose an appropriate database region and save the database password securely. In SQL Editor, run the complete file `supabase/migrations/202610100001_demo_requests.sql` once. It creates the table, indexes, RLS and two restricted functions in a transaction. Do not rerun it against an already migrated project. Use separate projects for development/testing and production when possible.
2. In the project connection/API settings, obtain the project URL and the server `service_role` key (legacy API keys). Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` privately. Do not use the anon/publishable key, and never put the service key in a `NEXT_PUBLIC_` variable. The implementation uses the legacy service-role key as both API key and Bearer authorization. Do not substitute another key type without verifying its authentication requirements.
3. Generate a random secret locally with `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`. Place the result only in `DEMO_HASH_SECRET` in your private environment. Do not paste it in chat or commit it. Use the same secret across instances of an environment; changing it resets matching against existing deduplication/email hashes.
4. **Domain and email:** obtain/control your real business domain and choose the actual inbox that will receive notifications. An existing monitored inbox can be the recipient; no email address has been invented in this project.
5. **Resend:** create an account at https://resend.com. Add a sending domain and publish the DNS records Resend specifies through your DNS provider. Wait for domain verification. Create a sending API key scoped to that domain where available. Set `RESEND_API_KEY`, `RESEND_FROM_EMAIL` to a sender on the verified domain, and `DEMO_NOTIFICATION_EMAIL` to the actual monitored recipient. Use plain email addresses for these settings. Verify delivery to that inbox, including spam filtering.
6. **Vercel:** create an account at https://vercel.com and import this Next.js project from your repository, setting the root directory to `aurex` if the repository contains its parent. Alternatively, deploy using the Vercel CLI from this directory. Use the Next.js preset, install command `npm ci`, build command `npm run build`, and the default Next.js output setting (never `out`). Choose a supported Node version at least 22.18. Add the private environment variables to the intended deployment environment, attach the real domain, set `SITE_URL` to its exact HTTPS origin, and redeploy. Configure separate preview environments deliberately; do not send preview submissions into production by accident.
7. Complete the live verification checklist below, establish notification monitoring, and approve the privacy/retention policy before broad public promotion.

**Never send API keys in chat.** Add them directly in your local `.env.local` or the hosting provider’s environment settings. `.env.local` is ignored. `.env.example` contains only blank variable names.

## Environment

| Variable | Purpose / missing behavior |
| --- | --- |
| `SITE_URL` | Exact public HTTPS origin, no path. Controls SEO and the accepted form Origin. Missing: noindex metadata and same-origin request-host matching for local/preview use. Set before production launch. |
| `SUPABASE_URL` | HTTPS project origin. Missing: form returns 503, no success. |
| `SUPABASE_SERVICE_ROLE_KEY` | Private server service-role credential. Missing: no submission. |
| `DEMO_HASH_SECRET` | Random secret of at least 32 characters for keyed content/email hashes. Missing/too short: no submission. |
| `RESEND_API_KEY` | Private sending key. Missing: leads can be stored; notification marked `not_configured`. |
| `RESEND_FROM_EMAIL` | Verified sender. Missing: notification inactive. |
| `DEMO_NOTIFICATION_EMAIL` | Actual internal recipient. Missing: notification inactive. |

Do not use production personal data in tests. Local development: copy `.env.example` to `.env.local`, supply only real values securely, run `npm ci`, then `npm run dev`. Without services, you can test validation and the safe unavailable state. If local `.env.local` sets a production `SITE_URL`, local browser requests will correctly be rejected; leave it blank locally. Rebuild after changing SEO configuration.

Supported baseline: Node >=22.18, npm, Next.js 16. Production portability: `npm run build` then `npm start` behind a trusted HTTPS reverse proxy. The start script binds loopback by default; for a container that requires a public bind use `npx next start --hostname 0.0.0.0`. Set the same server environment on every instance. Do not expose the Supabase service credential to the proxy/client. Keep TLS certificate verification enabled; if your machine requires its system trust store, use `NODE_OPTIONS=--use-system-ca` with a Node version that supports it.

## Storage and failure behavior

`demo_requests` stores UUID, creation time, name, email, company, optional website/message, status (`new`, `contacted`, `pilot`, `converted`, `closed`), fixed source, keyed content/email fingerprints, notification status and attempt time. No IP address, user agent or browser tracking identifiers are collected by application code. Hosting/provider infrastructure may retain its own access logs.

RLS is enabled with no browser policies. Table access is revoked from public/anon/authenticated/service_role; the route calls only the two narrowly scoped SECURITY DEFINER functions with an empty search path. Function execution is granted only to service_role. The service-role credential still carries elevated project-wide authority: keep it secret and use a dedicated project rather than assuming these table grants restrict the credential everywhere.

A database acceptance function checks and inserts in one transaction under a transaction-scoped advisory lock. Identical normalized content within 24 hours returns the existing acceptance, without another record or email. Content changes can create a distinct request subject to limits. Three new requests per normalized email per hour and 60 new requests globally per 10 minutes are the initial limits. These limits are shared across server instances and survive restarts. They limit stored requests/email volume, not all incoming traffic; duplicates bypass creation limits and return success. No in-memory limiter is presented as distributed protection.

The route also enforces JSON, a streamed 16 KiB body limit, exact Origin checks, cross-site rejection, field types/lengths, required fields, email format, HTTP(S) website URLs without embedded credentials, control-character rejection, fixed field names and an invisible/inert honeypot. Websites are never fetched. Emails are plain text. Public errors never contain provider responses or secrets. Browser loading has a synchronous double-click guard and disabled button. Errors preserve entered fields and receive focus; genuine success receives focus.

Database failure/missing configuration → retryable error. Database success → success even if email fails. Resend receives an idempotency key based on the stored request ID. `sent` means Resend accepted the API call, not proof of inbox delivery. Failures and missing settings are recorded separately and logged as fixed event names without personal data. A process stopping after storage can leave `pending`; a failed status update also leaves it pending. No background retry worker is implemented. Review Supabase and Resend before contacting/retrying such leads to avoid repeated emails. Duplicate visitor retries intentionally do not resend notifications.

Operational query (authorized Supabase SQL Editor only):

```sql
select id, created_at, notification_status, notification_attempted_at
from public.demo_requests
where notification_status <> 'sent'
order by created_at desc;
```

Set up an operational review/alert for pending entries older than a few minutes, failed and not_configured entries. Configure host request-rate/body/time limits for traffic abuse before broad promotion. The global creation cap can be exhausted by a determined attacker. Turnstile is not enabled or simulated: add a real widget/token and server Siteverify step before database acceptance if abuse warrants it; test with real configuration. No CAPTCHA bypass flag exists.

## Privacy and retention

The modal says: “AUREX will use the information you provide to respond to your demo request.” A full Privacy Policy and approved retention policy are still required before broad public launch. Establish the responsible business/contact, purposes, providers/regions, rights requests and handling procedures with appropriate advice. No compliance certification or legal page is invented.

Proposed operational starting point, subject to approval: review unconverted requests after 90 days and remove those no longer needed; keep active sales records only while there is a documented purpose. Include Supabase backups, internal notification emails and provider logs in the policy. Keyed hashes are pseudonymous, not anonymous. No automatic deletion has been enabled; assign an owner and review schedule before collection at scale.

## Verification

Run `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, then `npm run test:build`. Tests use injected inert transport fixtures, never live provider credentials. They exercise valid and invalid input, bounds, honeypot, malformed/oversized bodies, origin checks, missing configuration, duplicate responses, rate limits, database/email/status-update failures and the browser submission adapter. Database concurrency/RLS and real provider delivery must additionally be verified in the configured project.

Live verification on a staging deployment with your own test details:

1. Submit once. Confirm the success sentence, one database row, the expected notification recipient/content, and notification_status `sent`. Check actual inbox delivery in addition to API acceptance.
2. Submit the same details again within 24 hours; confirm still one row and one email. Exercise a rapid double click. Try modified requests with the same email until the fourth distinct request returns a polite rate limit; avoid doing this in production.
3. Invalid/missing fields, unsafe URLs and oversized input must fail; no row/email. Direct browser-role table insert/select and both function calls must be denied. Inspect Supabase security advisors and privileges after migration.
4. In an isolated staging environment, remove the database configuration: confirm retryable failure, retained fields and focused error. Restore it. Remove notification configuration: confirm a saved lead and `not_configured`; restore it before launch. Use tests for simulated outages instead of breaking live production services.
5. Verify keyboard focus/trapping, Escape/return focus, Sending announcement, genuine success announcement, 375/390/430px mobile, no overflow and reduced motion. Check browser bundles/network contain no private provider credentials.

Current state: implementation prepared, no accounts created, no migration applied remotely, and no real request or email delivered. Connecting and verifying providers is the next task; it has not been started.

Provider references: [Supabase functions](https://supabase.com/docs/guides/database/functions), [Resend send-email API](https://resend.com/docs/api-reference/emails/send-email), [Next.js deployment](https://nextjs.org/docs/app/getting-started/deploying).

