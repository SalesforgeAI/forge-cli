import assert from "node:assert/strict";
import test from "node:test";
import { publicApiSources, publicDocument, readPublicApiDocument } from "../scripts/public-api-sources.mjs";

test("production schema reads use the public docs URL without credentials", async () => {
  for (const [service, source] of Object.entries(publicApiSources)) {
    for (const version of [{ swagger: "2.0" }, { openapi: "3.1.0" }]) {
      const document = { ...version, paths: { "/example": { get: {} } } };
      const actual = await readPublicApiDocument(service, { fetchImpl: async (url, init) => {
        assert.equal(url, source.url);
        assert.deepEqual(init.headers, { Accept: "application/json" });
        assert.ok(init.signal instanceof AbortSignal);
        return new Response(JSON.stringify(document));
      } });
      assert.deepEqual(actual, document);
    }
  }
});

test("production schema failures are explicit and never fall back to local files", async () => {
  const cases = [
    [async () => new Response("unavailable", { status: 503 }), /HTTP 503/],
    [async () => new Response("<html>login</html>"), /cannot read/],
    [async () => new Response('{"openapi":"3.1.0","paths":{}}'), /non-empty/],
    [async () => new Response('{"paths":{"/example":{}}}'), /Swagger 2 or OpenAPI 3/],
    [async () => { throw new Error("timeout"); }, /timeout/],
  ];
  for (const [fetchImpl, expected] of cases) {
    await assert.rejects(readPublicApiDocument("salesforge", { fetchImpl }), expected);
  }
});

test("live Mailforge docs retain the same private-route exclusions", async () => {
  const paths = Object.fromEntries(["/workspaces", "/api-keys", "/api-keys/{id}", "/spam-check", "/workspaces/{id}/mailboxes/analytics/summary"].map((path) => [path, { get: {} }]));
  const document = await readPublicApiDocument("mailforge", { fetchImpl: async () => new Response(JSON.stringify({ swagger: "2.0", paths })) });
  assert.deepEqual(Object.keys(publicDocument("mailforge", document).paths), ["/workspaces"]);
  assert.equal(Object.keys(document.paths).length, 5);
});

test("Mailforge blacklist excludes every method in private groups and accepts other new operations", () => {
  const excluded = ["/api-keys/new-operation", "/spam-check/results", "/workspaces/{id}/mailboxes/analytics", "/workspaces/{id}/mailboxes/analytics/new-report"];
  const included = ["/domains/new-operation", "/workspaces", "/domains/analytics-example"];
  const paths = Object.fromEntries([...excluded, ...included].map((path) => [path, { get: {}, post: {}, patch: {}, delete: {} }]));
  const document = publicDocument("mailforge", { swagger: "2.0", paths });
  assert.deepEqual(Object.keys(document.paths), included);
  for (const path of included) assert.deepEqual(Object.keys(document.paths[path]), ["get", "post", "patch", "delete"]);
});
