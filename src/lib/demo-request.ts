export type DemoRequest = {
  name: string;
  email: string;
  company: string;
  website: string;
  message: string;
};

export type DemoRequestResult = { received: true };

export class DemoRequestValidationError extends Error {}

export function validateDemoRequest(request: DemoRequest): void {
  if (!request.name.trim() || !request.company.trim()) throw new DemoRequestValidationError("Please add your name and company name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.email.trim())) throw new DemoRequestValidationError("Please enter a valid work email address.");
  if (request.name.length > 120 || request.company.length > 160 || request.email.length > 254 || request.website.length > 2048 || request.message.length > 1000) throw new DemoRequestValidationError("One of your entries is too long. Please shorten it and try again.");
  if (request.website.trim()) {
    let url: URL;
    try { url = new URL(request.website); } catch { throw new DemoRequestValidationError("Please enter a website address starting with https:// or http://."); }
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) throw new DemoRequestValidationError("Please use an http:// or https:// website address without login details.");
  }
}

export function normalizeDemoRequest(value: unknown): DemoRequest {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new DemoRequestValidationError("Please check your details and try again.");
  const input = value as Record<string, unknown>;
  const result = {} as DemoRequest;
  for (const key of ["name", "email", "company", "website", "message"] as const) {
    const field = input[key] ?? (key === "website" || key === "message" ? "" : null);
    if (typeof field !== "string" || field.length > 4096 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(field)) throw new DemoRequestValidationError("Please check your details and try again.");
    result[key] = field.trim();
  }
  result.email = result.email.toLowerCase();
  if (/[\r\n]/.test(result.name + result.company)) throw new DemoRequestValidationError("Please keep your name and company on one line.");
  validateDemoRequest(result);
  return result;
}

export async function submitDemoRequest(request: DemoRequest, honeypot = ""): Promise<DemoRequestResult> {
  validateDemoRequest(request);
  const response = await fetch("/api/demo-requests", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...request, company_website: honeypot }),
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new DemoRequestValidationError(response.status === 429
    ? "Please wait a little before requesting another demo."
    : "We couldn’t send your request right now. Please try again.");
  const result: unknown = await response.json();
  if (!result || typeof result !== "object" || !("received" in result) || result.received !== true) throw new Error("Invalid confirmation");
  return { received: true };
}
