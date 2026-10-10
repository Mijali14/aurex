import { createHmac } from "node:crypto";
import { normalizeDemoRequest, DemoRequestValidationError, type DemoRequest } from "../demo-request.ts";

type Config = { siteUrl?: string; supabaseUrl?: string; serviceKey?: string; hashSecret?: string; resendKey?: string; sender?: string; recipient?: string };
type Saved = { id: string; created_at: string; duplicate: boolean };
const failure = "We couldn’t send your request right now. Please try again.";
const reply = (status: number, body: object) => Response.json(body, { status, headers: { "Cache-Control": "no-store", ...(status === 429 ? { "Retry-After": "3600" } : {}) } });
class Rejected extends Error { status: number; constructor(status: number) { super("Request rejected"); this.status = status; } }

// Pure service boundary: configuration and transport are injected for deterministic tests.
// Only the server-only route reads secrets. This module also requires Node crypto.
export function createDemoHandler(config: Config, transport: typeof fetch = fetch, warn: (event: string) => void = console.warn) {
  async function rpc(name: string, body: object) {
    const response = await transport(`${config.supabaseUrl}/rest/v1/rpc/${name}`, {
      method: "POST", headers: { "Content-Type": "application/json", apikey: config.serviceKey!, Authorization: `Bearer ${config.serviceKey}` },
      body: JSON.stringify(body), cache: "no-store", redirect: "error", signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error("Storage unavailable");
    return response.status === 204 ? null : response.json();
  }
  async function notify(data: DemoRequest, saved: Saved) {
    let state = "not_configured";
    if (config.resendKey && config.sender && config.recipient) {
      state = "failed";
      try {
        const response = await transport("https://api.resend.com/emails", {
          method: "POST", headers: { Authorization: `Bearer ${config.resendKey}`, "Content-Type": "application/json", "Idempotency-Key": `demo-request/${saved.id}` },
          body: JSON.stringify({ from: config.sender, to: [config.recipient], subject: `New AUREX Demo Request — ${data.company}`,
            text: `Name: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company}\nWebsite: ${data.website || "Not provided"}\nSubmission time: ${saved.created_at}\n\nMessage:\n${data.message || "Not provided"}` }),
          signal: AbortSignal.timeout(6000), redirect: "error",
        });
        if (response.ok && typeof (await response.json()).id === "string") state = "sent";
      } catch { /* A stored lead remains accepted even if the notification fails. */ }
    }
    if (state !== "sent") warn(`demo_notification_${state}`);
    try { await rpc("record_demo_notification", { p_id: saved.id, p_state: state }); }
    catch { warn("demo_notification_status_unavailable"); }
  }
  return async function POST(request: Request): Promise<Response> {
    try {
      if (request.method !== "POST") return reply(405, { error: failure });
      const requestUrl = new URL(request.url);
      // Next may normalize the internal URL hostname to localhost. The browser's
      // Host remains the correct local/preview authority; production pins SITE_URL.
      const requestOrigin = new URL(`${requestUrl.protocol}//${request.headers.get("host") || requestUrl.host}`).origin;
      const expectedOrigin = config.siteUrl ? new URL(config.siteUrl).origin : requestOrigin;
      if (request.headers.get("origin") !== expectedOrigin || request.headers.get("sec-fetch-site") === "cross-site") return reply(403, { error: failure });
      if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") return reply(415, { error: failure });
      if (Number(request.headers.get("content-length")) > 16384) return reply(413, { error: failure });
      const reader = request.body?.getReader();
      if (!reader) return reply(400, { error: failure });
      const chunks: Uint8Array[] = [];
      let size = 0;
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          size += value.byteLength;
          if (size > 16384) { await reader.cancel(); return reply(413, { error: failure }); }
          chunks.push(value);
        }
      } finally { reader.releaseLock(); }
      let input: unknown;
      try { input = JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { return reply(400, { error: failure }); }
      const data = normalizeDemoRequest(input);
      const fields = input as Record<string, unknown>;
      if (Object.keys(fields).some(key => !["name", "email", "company", "website", "message", "company_website"].includes(key)) || (fields.company_website !== undefined && fields.company_website !== "")) return reply(400, { error: failure });
      if (!config.supabaseUrl || !config.serviceKey || !config.hashSecret || config.hashSecret.length < 32) { warn("demo_storage_not_configured"); return reply(503, { error: failure }); }
      const dbUrl = new URL(config.supabaseUrl);
      if (dbUrl.protocol !== "https:" || dbUrl.username || dbUrl.password || dbUrl.pathname !== "/" || dbUrl.search || dbUrl.hash) throw new Error("Invalid storage configuration");
      const hash = (value: string) => createHmac("sha256", config.hashSecret!).update(value).digest("hex");
      const saved = await rpc("accept_demo_request", { p_data: data, p_fingerprint: hash(JSON.stringify(data)), p_email_hash: hash(data.email) });
      if (saved?.limited === true) throw new Rejected(429);
      if (!saved || typeof saved.id !== "string" || typeof saved.created_at !== "string" || typeof saved.duplicate !== "boolean") throw new Error("Invalid storage response");
      if (!saved.duplicate) await notify(data, saved);
      return reply(201, { received: true });
    } catch (error) {
      if (error instanceof DemoRequestValidationError) return reply(400, { error: error.message });
      if (error instanceof Rejected) return reply(error.status, { error: "Please wait a little before requesting another demo." });
      warn("demo_submission_unavailable");
      return reply(503, { error: failure });
    }
  };
}
