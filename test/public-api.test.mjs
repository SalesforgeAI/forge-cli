import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { commands, commandInputSchema, findCommand, validateCommandArgs } from "../dist/registry.js";
import { publicApiContracts as allContracts } from "../dist/commands/contracts.js";
const publicApiContracts = Object.fromEntries(Object.entries(allContracts).filter(([key]) => /^(salesforge|multichannel) /.test(key)));
import { run } from "../dist/cli.js";
import { ApiExecutor } from "../dist/api.js";
import { buildToolArguments } from "../dist/args.js";

const salesforge = "https://api.salesforge.ai/public/v2";
const mc = "https://multichannel-api.salesforge.ai/public";
const workspace = "w/1";
const w = "/workspaces/w%2F1";
const mw = `/multichannel${w}`;

/** Look up a command by its public registry name. */
function command(name) {
  const found = findCommand(name)?.command;
  assert.ok(found, name);
  return found;
}

/** Supply representative values for schema-based route coverage without contacting APIs. */
function sample(schema) {
  if (schema.enum) return schema.enum[0];
  if (schema.anyOf) return sample(schema.anyOf.find((item) => item.type !== "null"));
  if (schema.type === "array") return [sample(schema.items ?? {})];
  if (schema.type === "object") return schema.properties ? Object.fromEntries(Object.entries(schema.properties).map(([key, value]) => [key, sample(value)])) : { sample: "value" };
  if (schema.type === "number" || schema.type === "integer") return Math.max(schema.minimum ?? 1, 1);
  if (schema.type === "boolean") return false;
  if (schema.format === "email") return "user@example.com";
  return "sample/value";
}

/** Execute the real CLI with isolated config and a request recorder. */
async function cli(argv, response = { ok: true }, status = 200) {
  const calls = [];
  let stdout = "", stderr = "";
  const code = await run(argv, {
    env: { SALESFORGE_API_KEY: "test-key", FORGE_CLI_CONFIG: "/private/tmp/forge-cli-test-nonexistent/config.json" },
    stdout: { write(chunk) { stdout += chunk; return true; } },
    stderr: { write(chunk) { stderr += chunk; return true; } },
    fetchImpl: async (url, init) => {
      calls.push({ url, method: init.method, body: init.body && JSON.parse(init.body), headers: init.headers });
      return new Response(status === 204 || response === undefined ? null : JSON.stringify(response), { status });
    },
  });
  return { code, stdout, stderr, calls };
}

test("all 111 documented public API operations have a command on the correct service", () => {
  const covered = new Set();
  for (const c of commands.filter((c) => c.product === "salesforge" && !c.execute)) {
    const args = sample(commandInputSchema(c));
    delete args.offset; // Prefer page where an offset compatibility input is present.
    const request = c.request(args);
    const service = request.baseUrl === mc ? "multichannel" : "salesforge";
    const matching = Object.keys(publicApiContracts).filter((key) => {
      const [expectedService, method, path] = key.split(" ");
      return expectedService === service && method === request.method && new RegExp(`^${path.replace(/\{[^}]+\}/g, "[^/]+")}$`).test(request.path);
    });
    assert.equal(matching.length, 1, c.name);
    covered.add(matching[0]);
    assert.ok(!request.path.includes("undefined"), c.name);
  }
  assert.deepEqual([...covered].sort(), Object.keys(publicApiContracts).sort());
  assert.equal(covered.size, 111);
});

test("every current MCP command and input is discoverable in the CLI", async () => {
  const fixture = JSON.parse(await readFile(new URL("fixtures/mcp-tools.json", import.meta.url)));
  for (const tool of fixture) {
    const c = command(tool.name);
    const properties = commandInputSchema(c).properties;
    for (const input of tool.inputs) assert.ok(Object.hasOwn(properties, input), `${tool.name}.${input}`);
  }
  const names = new Set(), aliases = new Set();
  for (const c of commands) {
    assert.ok(!names.has(c.name), c.name); names.add(c.name);
    for (const alias of c.aliases) {
      assert.ok(!aliases.has(alias.join(" ")), alias.join(" ")); aliases.add(alias.join(" "));
      assert.equal(findCommand(alias)?.command.name, c.name);
    }
  }
});

test("new and updated operations map inputs to public wire contracts", async () => {
  const smtp = { host: "smtp.example.com", port: 587, username: "user", password: "secret" };
  const cases = [
    ["delete_contact", { contactId: "c/1" }, "DELETE", `${salesforge}${w}/contacts/c%2F1`],
    ["bulk_delete_contacts", { contactIds: ["c1"] }, "POST", `${salesforge}${w}/contacts/bulk-delete`, { contactIds: ["c1"] }],
    ["update_contact", { firstName: "Jane", email: "jane@example.com", customVars: { role: "CTO" } }, "POST", `${salesforge}${w}/contacts`, { firstName: "Jane", email: "jane@example.com", customVars: { role: "CTO" } }],
    ["connect_mailbox", { address: "jane@example.com", firstName: "Jane", lastName: "Doe", smtp, imap: smtp }, "POST", `${salesforge}${w}/mailboxes`, { address: "jane@example.com", firstName: "Jane", lastName: "Doe", smtp, imap: smtp }],
    ["create_mailbox_oauth_link", { provider: "google", redirectUrl: "https://example.com/callback" }, "POST", `${salesforge}${w}/mailboxes/oauth-link`, { provider: "google", redirectUrl: "https://example.com/callback" }],
    ["update_mailbox_connection_settings", { mailboxId: "m/1", smtp }, "PATCH", `${salesforge}${w}/mailboxes/m%2F1/connection-settings`, { smtp }],
    ["delete_mailbox", { mailboxId: "m/1" }, "DELETE", `${salesforge}${w}/mailboxes/m%2F1`],
    ["connect_linkedin_account", { email: "jane@example.com", password: "secret", skipSenderProfile: true }, "POST", `${mc}${mw}/linkedin/accounts`, { email: "jane@example.com", password: "secret", skipSenderProfile: true }],
    ["submit_linkedin_account_otp", { linkedinAccountId: 42, code: "001234" }, "POST", `${mc}${mw}/linkedin/accounts/42/otp`, { code: "001234" }],
    ["disconnect_linkedin_account", { linkedinAccountId: 42 }, "POST", `${mc}${mw}/linkedin/accounts/42/disconnect`],
    ["reconnect_linkedin_account", { linkedinAccountId: 42, password: "new" }, "POST", `${mc}${mw}/linkedin/accounts/42/reconnect`, { password: "new" }],
    ["create_sender_profile", { name: "Sender", linkedinAccountId: 42, mailboxIds: ["m1"] }, "POST", `${mc}${mw}/sender-profiles`, { name: "Sender", linkedinAccountId: 42, mailboxIds: ["m1"] }],
    ["update_sender_profile", { senderProfileId: "9", updates: { linkedinAccountId: null, mailboxIds: [] } }, "PATCH", `${mc}${mw}/sender-profiles/9`, { linkedinAccountId: null, mailboxIds: [] }],
    ["create_sequence", { name: "Follow up", kind: "subsequence" }, "POST", `${mc}${mw}/sequences`, { name: "Follow up", kind: "subsequence" }],
    ["preflight_enrollments", { sequenceId: "9", filters: { leadIds: ["c1"] }, selectionScope: "all" }, "POST", `${mc}${mw}/sequences/9/enrollments/preflight`, { filters: { leadIds: ["c1"] }, selectionScope: "all" }],
    ["preview_enrollment_move", { sequenceId: "9", preflightId: "p/1", moveSourceSequenceIds: [3], skipReplied: false }, "POST", `${mc}${mw}/sequences/9/enrollments/preflight/p%2F1/move-preview`, { moveSourceSequenceIds: [3], skipReplied: false }],
    ["confirm_enrollment_preflight", { sequenceId: "9", preflightId: "p1", action: "skip" }, "POST", `${mc}${mw}/sequences/9/enrollments/preflight/p1/confirm`, { action: "skip" }],
    ["remove_enrollments", { sequenceId: "9", filters: { leadIds: ["c1"] }, limit: 2 }, "POST", `${mc}${mw}/sequences/9/enrollments/remove`, { filters: { leadIds: ["c1"] }, limit: 2 }],
    ["start_email_validation", { filters: { leadIds: ["c1"] }, limit: 2 }, "POST", `${mc}${mw}/validations`, { filters: { leadIds: ["c1"] }, limit: 2, strict: false }],
    ["start_email_validation", { filters: { leadIds: ["c1"] }, strict: true }, "POST", `${mc}${mw}/validations`, { filters: { leadIds: ["c1"] }, strict: true }],
    ["create_webhook", { name: "Replies", url: "https://example.com/hook", type: "linkedin_replied", sequenceId: "9", sequenceIds: ["10"] }, "POST", `${salesforge}${w}/integrations/webhooks`, { name: "Replies", url: "https://example.com/hook", type: "linkedin_replied", sequenceID: "9", sequenceIds: ["10"] }],
    ["assign_subsequence", { parentSequenceId: "9", childSequenceId: 10, priority: 0 }, "POST", `${mc}${mw}/sequences/9/subsequence-assignments`, { childSequenceId: 10, priority: 0 }],
    ["reply_to_linkedin", { threadId: "t/1", accountId: 42, message: "Hello" }, "POST", `${salesforge}${w}/threads/t%2F1/linkedin/reply`, { accountId: 42, message: "Hello" }],
    ["remove_dnc_entries", { dncs: ["example.com"] }, "POST", `${salesforge}${w}/dnc/bulk/remove`, { dncs: ["example.com"] }],
    ["legacy_sequences_assign_contacts", { sequenceId: "seq_9", contactIds: ["c1"] }, "PUT", `${salesforge}${w}/sequences/seq_9/contacts`, { contactIds: ["c1"] }],
  ];
  for (const [name, args, method, url, body] of cases) {
    const result = await cli([name, "--json", JSON.stringify({ workspaceId: workspace, ...args })]);
    assert.equal(result.code, 0, `${name}: ${result.stderr}`);
    assert.equal(result.calls.length, 1, name);
    assert.deepEqual(result.calls[0], { method, url, body, headers: { Authorization: "test-key", Accept: "application/json", "X-Source": "forge-cli", ...(body !== undefined ? { "Content-Type": "application/json" } : {}) } }, name);
  }
});

test("pagination, array queries, filters and numeric string IDs work through grouped CLI flags", async () => {
  const cases = [
    [["salesforge", "sequences", "list", "--workspace-id", "123", "--limit", "20", "--offset", "40", "--status", "active"], `${mc}/multichannel/workspaces/123/sequences?limit=20&status=active&page=3`],
    [["list_contacts", "--workspace-id", "w", "--tag-ids", "123", "--tag-ids", "456", "--validation-statuses", "safe", "--has-valid-linkedin=false"], `${salesforge}/workspaces/w/contacts?tag_ids%5B%5D=123&tag_ids%5B%5D=456&validation_statuses%5B%5D=safe&has_valid_linkedin=false`],
    [["list_tags", "--workspace-id", "w", "--search", "Sales team", "--case-sensitive=false"], `${salesforge}/workspaces/w/tags?search=Sales+team&caseSensitive=false`],
    [["list_subsequence_members", "--workspace-id", "w", "--subsequence-id", "42", "--lead-id", "c/1", "--page", "2", "--limit", "10"], `${mc}/multichannel/workspaces/w/subsequences/42/members?leadId=c%2F1&page=2&limit=10`],
    [["get_sequence_analytics", "--workspace-id", "w", "--sequence-id", "42", "--from-date", "2026-09-01", "--to-date", "2026-09-22"], `${mc}/multichannel/workspaces/w/sequences/42/analytics?from_date=2026-09-01&to_date=2026-09-22`],
  ];
  for (const [argv, url] of cases) {
    const result = await cli(argv); assert.equal(result.code, 0, result.stderr); assert.equal(result.calls[0].url, url);
  }
  const result = await cli(["submit_linkedin_account_otp", "--workspace-id", "w", "--linkedin-account-id", "42", "--code", "001234"]);
  assert.equal(result.code, 0, result.stderr); assert.deepEqual(result.calls[0].body, { code: "001234" });
});

test("invalid inputs fail with usage errors before any request", async () => {
  const cases = [
    ["update_mailbox_connection_settings", { mailboxId: "m" }],
    ["update_mailbox_connection_settings", { mailboxId: "m", smtp: { password: "x" } }],
    ["bulk_delete_contacts", { contactIds: [] }],
    ["bulk_delete_contacts", { contactIds: Array(1001).fill("c") }],
    ["bulk_create_sender_profiles", { profiles: [{ name: "" }] }],
    ["reconnect_linkedin_account", { linkedinAccountId: 42 }],
    ["preflight_enrollments", { sequenceId: "1", filters: {} }],
    ["confirm_enrollment_preflight", { sequenceId: "1", preflightId: "p", action: "move" }],
    ["start_email_validation", { filters: {} }],
    ["list_sequences", { page: 1, offset: 20 }],
    ["list_sequences", { offset: 11, limit: 10 }],
    ["set_sequence_status", { sequenceId: "1", status: "invalid" }],
    ["delete_contact", { contactId: null }],
    ["delete_contact", { contactId: "1", workspceId: "typo" }],
  ];
  for (const [name, args] of cases) {
    const result = await cli([name, "--json", JSON.stringify({ workspaceId: workspace, ...args })]);
    assert.equal(result.code, 2, `${name}: ${result.stderr}`); assert.equal(result.calls.length, 0, name);
  }
});

test("subsequence workflow returns all steps and cleans up only the newly created sequence", async () => {
  const c = command("create_subsequence");
  const args = { workspaceId: workspace, parentSequenceId: "9", name: "Follow up", labelId: "label/1", priority: 0 };
  validateCommandArgs(c, args);
  const calls = [];
  const result = await c.execute(args, async (request) => { calls.push(request); return calls.length === 1 ? { id: 10 } : { ok: true }; });
  assert.deepEqual(result, { subsequence: { id: 10 }, assignment: { ok: true }, trigger: { ok: true } });
  assert.deepEqual(calls.map(({ method, path, body }) => ({ method, path, body })), [
    { method: "POST", path: `${mw}/sequences`, body: { name: "Follow up", kind: "subsequence" } },
    { method: "POST", path: `${mw}/sequences/9/subsequence-assignments`, body: { childSequenceId: 10, priority: 0 } },
    { method: "POST", path: `${mw}/subsequences/10/triggers`, body: { labelId: "label/1", priority: 0 } },
  ]);
  for (const failAt of [2, 3]) {
    const failed = [];
    await assert.rejects(c.execute(args, async (request) => { failed.push(request); if (failed.length === failAt) throw new Error("failed step"); return { id: 10 }; }), /failed step/);
    assert.equal(failed.at(-1).method, "DELETE"); assert.equal(failed.at(-1).path, `${mw}/sequences/10`);
  }
  let count = 0;
  await assert.rejects(c.execute(args, async () => { if (++count > 1) throw new Error("unavailable"); return { id: 10 }; }), /Subsequence 10.*cleanup failed/);
});

test("API executor handles empty success, raw attachments, and structured failures", async () => {
  const c = command("download_linkedin_attachment");
  const executor = new ApiExecutor({ keys: { salesforge: "key" }, fetchImpl: async () => new Response(new Uint8Array([1, 2, 3]), { headers: { "content-type": "application/octet-stream" } }) });
  assert.deepEqual(await executor.execute(c.request({ workspaceId: "w", threadId: "t", messageId: "m", attachmentId: "a" })), { contentType: "application/octet-stream", data: "AQID" });
  for (const status of [202, 204]) {
    const empty = new ApiExecutor({ keys: { salesforge: "key" }, fetchImpl: async () => new Response(null, { status }) });
    assert.deepEqual(await empty.execute(command("delete_mailbox").request({ workspaceId: "w", mailboxId: "m" })), {});
  }
  const conflict = await cli(["delete_contact", "--workspace-id", "w", "--contact-id", "c"], { message: "conflict" }, 409);
  assert.equal(conflict.code, 1); assert.equal(JSON.parse(conflict.stderr).details.status, 409);
});

test("Primeforge lookup and Warmforge account-wide and legacy paths", async () => {
  assert.deepEqual(command("primeforge_get_mailboxes_by_ids").request({ mailboxIds: ["m1"] }).body, { mailboxIds: ["m1"] });
  const warm = command("warmforge_get_mailbox_warmup_stats");
  const args = { workspaceId: "w/1", address: "user+test@example.com", from: "2026-09-01", to: "2026-09-22" };
  assert.equal(warm.request(args).path, "/workspaces/w%2F1/mailboxes/user%2Btest%40example.com/warmup/stats");
  assert.deepEqual(warm.request(args).query, { from: args.from, to: args.to });
  delete args.workspaceId;
  assert.equal(warm.request(args).path, "/mailboxes/user%2Btest%40example.com/warmup/stats");
  const latest = command("warmforge_get_latest_mailbox_placement_results");
  assert.equal(latest.request({ workspaceId: "w", mailboxIds: ["m"] }).path, "/workspaces/w/mailboxes/placement-results/latest");
  const strings = await buildToolArguments(["--addresses", "123", "--addresses", "false"], commandInputSchema(command("primeforge_get_mailboxes_by_addresses")));
  assert.deepEqual(strings, { addresses: ["123", "false"] });
});
