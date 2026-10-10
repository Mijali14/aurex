import test from "node:test";
import assert from "node:assert/strict";
import { parseSiteUrl } from "../src/lib/site-url.ts";
import { validateDemoRequest, DemoRequestValidationError } from "../src/lib/demo-request.ts";

test("unconfigured previews have no public origin", () => {
  assert.equal(parseSiteUrl(undefined), undefined);
  assert.equal(parseSiteUrl("  "), undefined);
});
test("canonical origin is normalized", () => {
  assert.equal(parseSiteUrl(" https://www.example.com ").href, "https://www.example.com/");
});
test("unsafe or misleading deployment origins fail clearly", () => {
  for (const url of ["nonsense", "http://example.com", "https://localhost", "https://127.0.0.1", "https://[::1]", "https://site.local", "https://example.com/path", "https://example.com?x=1", "https://example.com#main", "https://user:password@example.com", "https://example.com:444"]) assert.throws(() => parseSiteUrl(url), /SITE_URL/);
});
const valid = { name: "QA", email: "qa@example.com", company: "QA Company", website: "", message: "" };
test("invalid form data cannot bypass browser validation", () => {
  for (const patch of [{ name: " " }, { company: "" }, { email: "bad" }, { email: "a@" }, { email: "a b@example.com" }, { message: "x".repeat(1001) }, { website: "javascript:alert(1)" }, { website: "https://user:pass@example.com" }]) assert.throws(() => validateDemoRequest({ ...valid, ...patch }), DemoRequestValidationError);
});
test("optional fields and normal HTTPS websites remain valid", () => {
  assert.doesNotThrow(() => validateDemoRequest(valid));
  assert.doesNotThrow(() => validateDemoRequest({ ...valid, website: "https://example.com/contact", message: "A product demo, please." }));
});
