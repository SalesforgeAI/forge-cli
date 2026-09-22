import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { commands } from "../dist/registry.js";

test("stdio MCP exposes the same schemas and executes new operations and workflows", async (t) => {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: ["--import", fileURLToPath(new URL("fixtures/mock-fetch.mjs", import.meta.url)), fileURLToPath(new URL("../dist/index.js", import.meta.url)), "mcp"],
    env: { SALESFORGE_API_KEY: "test-key", FORGE_CLI_CONFIG: "/private/tmp/forge-cli-test-nonexistent/config.json" },
    stderr: "pipe",
  });
  const client = new Client({ name: "forge-cli-test", version: "1" });
  t.after(async () => { await client.close(); await transport.close(); });
  await client.connect(transport);
  const listed = (await client.listTools()).tools;
  assert.deepEqual(listed.map((t) => t.name).sort(), commands.filter((c) => c.product === "salesforge").map((c) => c.name).sort());
  const profile = listed.find((t) => t.name === "bulk_create_sender_profiles");
  assert.equal(profile.inputSchema.properties.profiles.maxItems, 100);
  const valid = await client.callTool({ name: "confirm_enrollment_preflight", arguments: { workspaceId: "w/1", sequenceId: "42", preflightId: "p", action: "move", skipReplied: false, moveSourceSequenceIds: [5] } });
  assert.ok(!valid.isError, JSON.stringify(valid));
  assert.deepEqual(JSON.parse(valid.content[0].text), { method: "POST", url: "https://multichannel-api.salesforge.ai/public/multichannel/workspaces/w%2F1/sequences/42/enrollments/preflight/p/confirm", body: { action: "move", skipReplied: false, moveSourceSequenceIds: [5] } });
  const invalid = await client.callTool({ name: "confirm_enrollment_preflight", arguments: { workspaceId: "w", sequenceId: "42", preflightId: "p", action: "move" } });
  assert.equal(invalid.isError, true);
  const workflow = await client.callTool({ name: "create_subsequence", arguments: { workspaceId: "w", parentSequenceId: "42", name: "Follow up", labelId: "label" } });
  assert.ok(!workflow.isError, JSON.stringify(workflow));
  const value = JSON.parse(workflow.content[0].text);
  assert.equal(value.subsequence.id, 77);
  assert.equal(value.assignment.body.childSequenceId, 77);
  assert.equal(value.trigger.body.labelId, "label");
});

test("stdio MCP exposes all configured products and forwards public idempotency headers", async (t) => {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: ["--import", fileURLToPath(new URL("fixtures/mock-fetch.mjs", import.meta.url)), fileURLToPath(new URL("../dist/index.js", import.meta.url)), "mcp"],
    env: { ...Object.fromEntries(["SALESFORGE", "PRIMEFORGE", "INFRAFORGE", "WARMFORGE", "MAILFORGE", "LEADSFORGE"].map((p) => [`${p}_API_KEY`, "test-key"])), FORGE_CLI_CONFIG: "/private/tmp/forge-cli-test-nonexistent/config.json" },
    stderr: "pipe",
  });
  const client = new Client({ name: "forge-suite-test", version: "1" });
  t.after(async () => { await client.close(); await transport.close(); });
  await client.connect(transport);
  const listed = (await client.listTools()).tools;
  assert.equal(listed.length, 288);
  assert.deepEqual(listed.map((t) => t.name).sort(), commands.map((c) => c.name).sort());
  const valid = await client.callTool({ name: "leadsforge_enrich_emails", arguments: { personIDs: ["p1"], saveToList: false, idempotencyKey: "request-1" } });
  assert.ok(!valid.isError, JSON.stringify(valid));
  assert.deepEqual(JSON.parse(valid.content[0].text), { url: "https://api.leadsforge.ai/public/v1/enrichment/emails", method: "POST", body: { personIDs: ["p1"], saveToList: false }, idempotencyKey: "request-1" });
  const invalid = await client.callTool({ name: "warmforge_update_mailbox", arguments: { address: "user@example.com", body: { replyRatePercent: 51 } } });
  assert.equal(invalid.isError, true);
});
