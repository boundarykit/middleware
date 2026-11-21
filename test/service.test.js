import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { authorize } from "../src/policy-engine.ts";
import { service } from "../src/server.ts";

test("require both credential and organization", () => {
  assert.equal(authorize("", "", "", ""), false);
  assert.equal(authorize("key", "other", "key", "org"), false);
  assert.equal(authorize("bad", "org", "key", "org"), false);
});

test("serve contract and scoped status", async t => {
  const server = service("fixture", "sample").listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = "http://127.0.0.1:" + server.address().port;
  const headers = {"X-API-Key": "fixture", "X-Organization-Id": "sample"};
  assert.ok((await (await fetch(base + "/openapi.json")).json()).paths);
  assert.equal((await fetch(base + "/v1/status/summary")).status, 403);
  assert.equal((await (await fetch(base + "/v1/status/summary", {headers})).json()).organization, "sample");
  assert.equal((await fetch(base + "/missing", {headers})).status, 404);
});
