import assert from "node:assert/strict";
import test from "node:test";
import { commands, commandInputSchema } from "../dist/registry.js";
import { publicApiContracts } from "../dist/commands/contracts.js";
import { run } from "../dist/cli.js";

const products = { warmforge: 15, infraforge: 45, primeforge: 43, mailforge: 30, leadsforge: 41 };

/** Supply representative inputs to inspect every route without contacting a service. */
function sample(schema) {
  if (schema.enum) return schema.enum[0];
  if (schema.type === "array") return [sample(schema.items ?? {})];
  if (schema.type === "object") return Object.fromEntries(Object.entries(schema.properties ?? {}).map(([key, value]) => [key, sample(value)]));
  if (["integer", "number"].includes(schema.type)) return Math.max(schema.minimum ?? 1, 1);
  if (schema.type === "boolean") return false;
  return "sample/value";
}

/** Run the CLI with isolated credentials and capture requests using a fake transport. */
async function cli(argv, response = '{"ok":true}') {
  const calls = [];
  let stdout = "", stderr = "";
  const code = await run(argv, {
    env: { ...Object.fromEntries(Object.keys(products).map((p) => [`${p.toUpperCase()}_API_KEY`, "test-key"])), FORGE_CLI_CONFIG: "/private/tmp/forge-cli-test-nonexistent/config.json" },
    stdout: { write(chunk) { stdout += chunk; return true; } },
    stderr: { write(chunk) { stderr += chunk; return true; } },
    fetchImpl: async (url, init) => {
      calls.push({ url, method: init.method, body: init.body && JSON.parse(init.body), headers: init.headers });
      return new Response(response);
    },
  });
  return { code, calls, stdout, stderr };
}

test("all 174 additional public operations have exactly one command", () => {
  for (const [product, count] of Object.entries(products)) {
    const expected = Object.keys(publicApiContracts).filter((key) => key.startsWith(`${product} `));
    const covered = [];
    for (const c of commands.filter((c) => c.product === product)) {
      const request = c.request(sample(commandInputSchema(c)));
      const exact = `${product} ${request.method} ${request.path}`;
      const matches = expected.includes(exact) ? [exact] : expected.filter((key) => {
        const [, method, path] = key.split(" ");
        return method === request.method && new RegExp(`^${path.replace(/\{[^}]+\}/g, "[^/]+")}$`).test(request.path);
      });
      assert.equal(matches.length, 1, c.name);
      assert.ok(!request.path.includes("undefined"), c.name);
      covered.push(matches[0]);
    }
    assert.equal(covered.length, count, product);
    assert.deepEqual(covered.sort(), expected.sort(), product);
  }
  const mailforge = Object.keys(publicApiContracts).filter((key) => key.startsWith("mailforge "));
  assert.ok(mailforge.every((key) => !/\/api-keys|\/spam-check|\/analytics\//.test(key)), "Private Mailforge routes must stay excluded");
});

test("product requests honor corrected paths, query spellings, headers and typed payloads", async () => {
  const cases = [
    ["infraforge_list_mailboxes", { workspaceId: "w/1", withCredentials: false, search: "user" }, "GET", "https://api.infraforge.ai/public/mailboxes?workspace_id=w%2F1&with_credentials=false&search=user"],
    ["infraforge_adjust_domain_max_mailboxes", { domainID: "d/1", maxMailboxesPerDomain: 11 }, "PATCH", "https://api.infraforge.ai/public/domains/d%2F1/max-mailboxes", { maxMailboxesPerDomain: 11 }],
    ["primeforge_update_domain_dns_record", { domainId: "d/1", dnsId: "dns/1", content: "target.example.com", ttl: 0 }, "PATCH", "https://api.primeforge.ai/public/domains/d%2F1/dns/dns%2F1", { content: "target.example.com", ttl: 0 }],
    ["primeforge_set_domain_forwarding", { workspaceId: "w/1", domainIds: ["d1"], forwardToDomain: "https://example.com" }, "POST", "https://api.primeforge.ai/public/workspaces/w%2F1/domains/forwarding", { domainIds: ["d1"], forwardingUrl: "https://example.com" }],
    ["primeforge_export_mailboxes", { workspaceId: "w", email: "user@example.com", password: "00123", exportType: "sf", includedIds: ["m"] }, "POST", "https://api.primeforge.ai/public/workspaces/w/exports", { email: "user@example.com", password: "00123", platform: "salesforge", includedIds: ["m"] }],
    ["mailforge_get_alternative_domains", { count: 3, inputSld: "example", outputTld: "com" }, "POST", "https://api.mailforge.ai/public/domains/alternative-domains", { count: 3, inputSld: "example", outputTld: "com" }],
    ["warmforge_update_mailbox", { workspaceId: "w/1", address: "user+test@example.com", body: { warmupEnabled: false, emailRampUp: 0 } }, "PATCH", "https://api.warmforge.ai/public/v1/workspaces/w%2F1/mailboxes/user%2Btest%40example.com", { warmupEnabled: false, emailRampUp: 0 }],
    ["warmforge_update_mailbox", { address: "user@example.com", body: { signature: "" } }, "PATCH", "https://api.warmforge.ai/public/v1/mailboxes/user%40example.com", { signature: "" }],
    ["leadsforge_search_maps", { lat: 0, lng: 0, radiusKm: 5, categories: ["dentist"], limit: 10, idempotencyKey: "job-1" }, "POST", "https://api.leadsforge.ai/public/v1/maps-discovery/search", { lat: 0, lng: 0, radiusKm: 5, categories: ["dentist"], limit: 10 }],
    ["leadsforge_enrich_emails", { personIDs: ["p"], saveToList: false, idempotencyKey: "job-2" }, "POST", "https://api.leadsforge.ai/public/v1/enrichment/emails", { personIDs: ["p"], saveToList: false }],
    ["leadsforge_get_enrichment_results", { jobID: "j/1" }, "GET", "https://api.leadsforge.ai/public/v1/enrichment/jobs/j%2F1/results?limit=100"],
    ["leadsforge_search", { cursor: "next", limit: 10 }, "POST", "https://api.leadsforge.ai/public/v1/search?cursor=next", {}],
  ];
  for (const [name, args, method, url, body] of cases) {
    const result = await cli([name, "--json", JSON.stringify(args)]);
    assert.equal(result.code, 0, `${name}: ${result.stderr}`);
    assert.equal(result.calls.length, 1, name);
    const actual = result.calls[0];
    // Compare URL query entries without depending on their serialized order.
    assert.equal(new URL(actual.url).origin + new URL(actual.url).pathname, new URL(url).origin + new URL(url).pathname, name);
    assert.deepEqual([...new URL(actual.url).searchParams].sort(), [...new URL(url).searchParams].sort(), name);
    assert.equal(actual.method, method, name);
    assert.deepEqual(actual.body, body, name);
    assert.equal(actual.headers.Authorization, name.startsWith("warmforge_") ? "Bearer test-key" : "test-key", name);
    assert.equal(actual.headers["Idempotency-Key"], args.idempotencyKey, name);
  }
});

test("invalid public payloads and unsupported legacy filters fail before sending", async () => {
  const cases = [
    ["infraforge_list_mailboxes", { page: 2 }],
    ["infraforge_list_domains", { workspaceId: "w" }],
    ["infraforge_adjust_domain_max_mailboxes", { domainID: "d", maxMailboxesPerDomain: 10 }],
    ["infraforge_adjust_domain_max_mailboxes", { domainID: "d", maxMailboxesPerDomain: 51 }],
    ["primeforge_export_mailboxes", { workspaceId: "w", email: "user@example.com", password: "p", platform: "salesforge", exportType: "wf" }],
    ["primeforge_set_domain_forwarding", { workspaceId: "w", forwardToDomain: "https://example.com" }],
    ["primeforge_get_mailboxes_by_ids", { mailboxIds: Array(101).fill("m") }],
    ["warmforge_update_mailbox", { address: "user@example.com", body: { replyRatePercent: 51 } }],
    ["warmforge_connect_smtp_mailbox", { body: { address: "user@example.com" } }],
    ["leadsforge_enrich_emails", {}],
    ["leadsforge_enrich_emails", { personIDs: ["p"], people: [{ linkedinURL: "https://linkedin.com/in/person" }] }],
    ["leadsforge_enrich_email", { firstName: "Jane" }],
    ["leadsforge_search_maps", { categories: [], radiusKm: 1, limit: 10 }],
    ["leadsforge_search_maps", { lat: 91, categories: ["dentist"], radiusKm: 1, limit: 10 }],
    ["mailforge_get_alternative_domains", { unknown: true }],
  ];
  for (const [name, args] of cases) {
    const result = await cli([name, "--json", JSON.stringify(args)]);
    assert.equal(result.code, 2, `${name}: ${result.stderr}`);
    assert.equal(result.calls.length, 0, name);
  }
});

test("Infraforge export preserves CSV as raw output or a JSON string", async () => {
  const csv = "email,password\nuser@example.com,001234\n";
  const args = ["infraforge", "workspaces", "export-mailboxes", "--workspace-id", "w/1", "--body", '{"exportType":"sf","includedIds":["m"]}'];
  const result = await cli([...args, "--raw"], csv);
  assert.equal(result.code, 0, result.stderr);
  assert.equal(result.stdout, csv);
  assert.equal(result.calls[0].url, "https://api.infraforge.ai/public/workspaces/w%2F1/mailboxes/export");
  assert.deepEqual(result.calls[0].body, { exportType: "sf", includedIds: ["m"] });
  const json = await cli(args, csv);
  assert.equal(json.code, 0, json.stderr);
  assert.equal(JSON.parse(json.stdout), csv);
});
