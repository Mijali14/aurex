import test from "node:test";
import assert from "node:assert/strict";
import { createDemoHandler } from "../src/lib/server/demo-service.ts";
import { normalizeDemoRequest, submitDemoRequest } from "../src/lib/demo-request.ts";

// Reserved domains and inert transport fixtures only; never reach a provider.
const origin = "https://aurex.example";
const valid = { name: "Alex", email: "alex@example.com", company: "Example", website: "https://example.com", message: "A demo please." };
const config = { siteUrl: origin, supabaseUrl: "https://database.example", serviceKey: "test-only", hashSecret: "test-only-hmac-material-at-least-32-characters", resendKey: "test-only", sender: "sender@example.com", recipient: "team@example.com" };
const request = (body = valid, headers = {}) => new Request(`${origin}/api/demo-requests`, { method: "POST", headers: { origin, "content-type": "application/json", ...headers }, body: JSON.stringify(body) });
function fixture(options = {}) {
  const calls = [], warnings = [], rows = new Map();
  const transport = async (url, init) => {
    const body = JSON.parse(init.body); calls.push({ url, body, headers: init.headers });
    if (url.endsWith("accept_demo_request")) {
      if (options.dbFailure) return Response.json({ error: "private provider error" }, { status: 500 });
      if (options.limited) return Response.json({ limited: true });
      const prior = rows.get(body.p_fingerprint);
      if (prior) return Response.json({ ...prior, duplicate: true });
      const row = { id: "00000000-0000-4000-8000-000000000001", created_at: "2026-10-10T00:00:00Z", duplicate: false };
      rows.set(body.p_fingerprint, row);
      return Response.json(row);
    }
    if (url.endsWith("record_demo_notification")) {
      if (options.statusFailure) throw new Error("private error");
      return new Response(null, { status: 204 });
    }
    return Response.json(options.emailFailure ? { error: "private error" } : { id: "notification-id" }, { status: options.emailFailure ? 500 : 200 });
  };
  return { handler: createDemoHandler({ ...config, ...options.config }, transport, event => warnings.push(event)), calls, warnings, rows };
}
test("valid request is trimmed, stored first, then notified; response contains no personal data or IDs", async () => {
  const f = fixture();
  const res = await f.handler(request({ ...valid, name: " Alex ", email: "ALEX@example.com" }));
  assert.equal(res.status, 201); assert.deepEqual(await res.json(), { received: true });
  assert.equal(f.calls[0].body.p_data.name, "Alex"); assert.equal(f.calls[0].body.p_data.email, valid.email);
  assert.match(f.calls[0].body.p_fingerprint, /^[a-f0-9]{64}$/);
  assert.match(f.calls[1].body.text, /Submission time:/); assert.equal(f.calls[2].body.p_state, "sent");
  assert.equal(res.headers.get("cache-control"), "no-store");
});
test("required fields, types, email, unsafe URLs, controls, long inputs, honeypot and unknown fields reject before storage", async () => {
  for (const patch of [{name:""}, {company:" "}, {email:"bad"}, {name:[]}, {website:"javascript:alert(1)"}, {website:"https://user:password@example.com"}, {message:"x".repeat(1001)}, {name:"Alex\nBcc: injected"}, {message:"\u0000"}, {company_website:"bot"}, {company_website:[]}, {extra:"ignored?"}]) {
    const f = fixture(); assert.equal((await f.handler(request({...valid,...patch}))).status,400); assert.equal(f.calls.length,0);
  }
  for (const body of [null, [], "text", 123]) assert.equal((await fixture().handler(request(body))).status,400);
});
test("optional fields may be omitted", () => assert.equal(normalizeDemoRequest({ name:"Alex",email:valid.email,company:"Example" }).message,""));
test("cross-origin, missing origin and non-JSON requests are refused", async () => {
  for (const [headers,status] of [[{origin:"https://attacker.example"},403],[{origin:""},403],[{"sec-fetch-site":"cross-site"},403],[{"content-type":"text/plain"},415]]) {
    const f = fixture(); assert.equal((await f.handler(request(valid,headers))).status,status); assert.equal(f.calls.length,0);
  }
});
test("invalid JSON and excessive bodies are rejected, including without Content-Length", async () => {
  const f=fixture();
  const req = body => new Request(`${origin}/api/demo-requests`, {method:"POST",headers:{origin,"content-type":"application/json"},body});
  assert.equal((await f.handler(req("{"))).status,400);
  assert.equal((await f.handler(req("x".repeat(16385)))).status,413);
  assert.equal((await f.handler(request(valid,{"content-length":"20000"}))).status,413);
  assert.equal(f.calls.length,0);
});
test("missing credentials fail closed without provider traffic or false success", async () => {
  for (const key of ["supabaseUrl","serviceKey","hashSecret"]) {
    const f=fixture({config:{[key]:""}}); const res=await f.handler(request());
    assert.equal(res.status,503); assert.equal(f.calls.length,0); assert.deepEqual(f.warnings,["demo_storage_not_configured"]);
  }
});
test("local hostname normalization uses Host while production remains pinned to SITE_URL", async () => {
  const local = new Request("http://localhost:3003/api/demo-requests",{method:"POST",headers:{host:"127.0.0.1:3003",origin:"http://127.0.0.1:3003","content-type":"application/json"},body:JSON.stringify(valid)});
  const f=fixture({config:{siteUrl:undefined,serviceKey:""}});
  assert.equal((await f.handler(local)).status,503);
  const pinned=fixture();
  assert.equal((await pinned.handler(request(valid,{host:"attacker.example",origin:"https://attacker.example"}))).status,403);
});
test("database failure is retryable and cannot send an email", async () => {
  const f=fixture({dbFailure:true}); const res=await f.handler(request());
  assert.equal(res.status,503); assert.equal(f.calls.length,1); assert.doesNotMatch(await res.text(),/private|provider/);
});
test("email failure does not undo stored success; failure is recorded safely", async () => {
  const f=fixture({emailFailure:true}); assert.equal((await f.handler(request())).status,201);
  assert.equal(f.calls[2].body.p_state,"failed"); assert.deepEqual(f.warnings,["demo_notification_failed"]);
});
test("missing email configuration still stores; it does not pretend to send", async () => {
  const f=fixture({config:{recipient:""}}); assert.equal((await f.handler(request())).status,201);
  assert.equal(f.calls.length,2); assert.equal(f.calls[1].body.p_state,"not_configured");
});
test("notification status failure cannot turn stored success into failure", async () => {
  const f=fixture({statusFailure:true}); assert.equal((await f.handler(request())).status,201);
  assert.deepEqual(f.warnings,["demo_notification_status_unavailable"]);
});
test("simultaneous duplicate confirmations send only one notification", async () => {
  const f=fixture(); const results=await Promise.all([f.handler(request()),f.handler(request())]);
  assert.ok(results.every(r=>r.status===201)); assert.equal(f.rows.size,1);
  assert.equal(f.calls.filter(c=>c.url==="https://api.resend.com/emails").length,1);
});
test("database rate limit returns a polite 429 and no email", async () => {
  const f=fixture({limited:true}); const res=await f.handler(request());
  assert.equal(res.status,429); assert.equal(res.headers.get("retry-after"),"3600"); assert.equal(f.calls.length,1);
});
test("client uses same-origin POST, requires real acceptance, and hides provider errors", async t => {
  let count=0;
  t.mock.method(globalThis,"fetch",async (url,init)=>{
    assert.equal(url,"/api/demo-requests"); assert.equal(init.method,"POST"); count++;
    return count===1 ? Response.json({received:true}) : Response.json({error:"private"},{status:503});
  });
  assert.deepEqual(await submitDemoRequest(valid),{received:true});
  await assert.rejects(()=>submitDemoRequest(valid),/couldn’t send/);
});
