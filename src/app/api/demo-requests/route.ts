import "server-only";
import { createDemoHandler } from "@/lib/server/demo-service";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  return createDemoHandler({
    siteUrl: process.env.SITE_URL,
    supabaseUrl: process.env.SUPABASE_URL?.replace(/\/$/, ""),
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    hashSecret: process.env.DEMO_HASH_SECRET,
    resendKey: process.env.RESEND_API_KEY,
    sender: process.env.RESEND_FROM_EMAIL,
    recipient: process.env.DEMO_NOTIFICATION_EMAIL,
  })(request);
}
