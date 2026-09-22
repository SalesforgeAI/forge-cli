# Forge CLI

Command line interface for the Salesforge product suite: Salesforge, Primeforge, Leadsforge, Infraforge, Warmforge, and Mailforge.

The CLI uses a shared command registry. Normal CLI commands execute direct product API requests. The optional `forge mcp` entrypoint exposes the same command definitions as MCP tools.

## Install

```bash
npm install -g @salesforge/forge-cli
```

Requires Node.js 20.11 or newer.

## Authenticate

Use one or more product keys. Commands only need the key for the product they call.

```bash
# Recommended for local use. Reads from stdin so the key is not stored in shell history.
printf '%s' "$SALESFORGE_API_KEY" | forge login salesforge --key-stdin
printf '%s' "$MAILFORGE_API_KEY" | forge login mailforge --key-stdin

# Check which products are configured.
forge status --pretty

# CI and automation can use environment variables.
export SALESFORGE_API_KEY="..."
export PRIMEFORGE_API_KEY="..."
export LEADSFORGE_API_KEY="..."
export INFRAFORGE_API_KEY="..."
export WARMFORGE_API_KEY="..."
export MAILFORGE_API_KEY="..."

# Per-command flags override env and stored config.
forge --salesforge-key "..." salesforge workspaces list
```

Stored config lives at `~/.config/forge-cli/config.json` by default and is written with mode `0600`. Use `--profile` for multiple accounts and `--config` to choose another file.

## Usage

Commands can be run in grouped form or by registry name.

```bash
# Discover commands.
forge commands list --available --names
forge commands list --pretty
forge commands list --product mailforge --names
forge commands describe mailforge_list_domains --pretty
forge mailforge domains list --help

# Grouped commands.
forge salesforge workspaces list --limit 50 --pretty
forge salesforge workspaces get --workspace-id ws_123
forge mailforge domains list --status active

# Registry-name form, useful for scripts.
forge list_workspaces --limit 50
forge mailforge_list_domains --status active

# Nested inputs.
forge leadsforge_search --json '{"limit":10,"leadLocations":{"include":["United States"]}}'
forge create_contact --file contact.json
cat search.json | forge leadsforge_search --stdin
```

Flags use kebab-case and are mapped to command input names, so `--workspace-id` becomes `workspaceId` and `--domain-id` maps to `domainID` where the command uses that spelling.

String inputs preserve numeric IDs, passwords, and leading-zero OTPs. Array inputs accept JSON or repeated flags, for example `--tag-ids tag_1 --tag-ids tag_2`. Use `commands describe` for the complete nested input schema. Commands validate types, required fields, and documented constraints before sending requests; unknown top-level options are usage errors.

## Salesforge API coverage

The registry covers all 111 operations in the Salesforge and multichannel public API schemas, plus contact update aliases and the combined subsequence creation workflow. Existing command names and grouped forms remain available.

| Group | Operations |
| --- | --- |
| `contacts`, `tags` | Contact upserts, bulk creation/deletion, filtering, tag discovery |
| `mailboxes` | SMTP/IMAP connection, OAuth links, settings, deletion, replies and attachments |
| `linkedin` | Account connection, OTP, reconnection/disconnection, magic links |
| `sender-profiles` | Creation, bulk creation, updates and sequence assignments |
| `sequences`, `nodes`, `branches` | Multichannel sequence management, schedules, settings, analytics and workflow nodes |
| `enrollments`, `validations` | Preflight, move preview, confirmation, removal and email validation |
| `subsequences` | Creation, parent assignments, members and label triggers |
| `threads` | Email and workspace threads, labels, LinkedIn replies and attachments |
| `dnc`, `webhooks`, `products`, `analytics` | DNC listing/removal, webhooks, product data and workspace metrics |
| `legacy-sequences` | Legacy sequence management, contacts, mailboxes, steps, schedules, validation and analytics |

`salesforge sequences` uses the multichannel API. Use `salesforge legacy-sequences` for Salesforge legacy sequence operations and legacy IDs such as `seq_...`. Use the fully qualified `forge salesforge products list` for workspace products; `forge products` lists the CLI's supported products.

```bash
# Multichannel pagination uses page (starting at 1), plus limit.
forge salesforge sequences list --workspace-id ws_123 --page 2 --limit 20
forge salesforge tags list --workspace-id ws_123 --search customers

# Review enrollment conflicts, then submit your decision using the returned preflight ID.
forge salesforge enrollments preflight --workspace-id ws_123 --sequence-id 42 \
  --json '{"filters":{"leadIds":["lead_123"]}}'
forge salesforge enrollments move-preview --workspace-id ws_123 --sequence-id 42 \
  --preflight-id pf_123 --move-source-sequence-ids '[12]' --skip-replied=true
forge salesforge enrollments confirm --workspace-id ws_123 --sequence-id 42 \
  --preflight-id pf_123 --action move --move-source-sequence-ids '[12]' --skip-replied=true

# Connect accounts using JSON files to keep credentials out of shell history.
forge salesforge mailboxes connect --file mailbox.json
forge salesforge linkedin connect --file linkedin.json
forge salesforge linkedin otp --workspace-id ws_123 --linkedin-account-id 7 --code 001234

# Create a subsequence, attach it to a parent, and add its label trigger.
forge salesforge subsequences create --workspace-id ws_123 --parent-sequence-id 42 \
  --name "Positive replies" --label-id label_123
forge salesforge subsequences members --workspace-id ws_123 --subsequence-id 43

forge salesforge webhooks create --workspace-id ws_123 --name Replies \
  --url https://example.com/webhook --type email_replied --sequence-ids '["42","43"]'
forge salesforge legacy-sequences list --workspace-id ws_123 --limit 20
```

`list_sequences --offset` remains supported when it is a multiple of `limit` (default 20); it is translated to `page`. Supplying both `page` and `offset` is an error. Other multichannel lists expose `page` directly. Salesforge lists use `limit` and `offset`.

`enroll_contacts` is deprecated in favor of preflight and confirmation. Moving contacts requires an explicit `skipReplied` decision. `start_email_validation` accepts `limit` and `strict`; `strict` defaults to false, matching forge-mcp. `create_subsequence` attempts to delete the new subsequence if assignment or trigger creation fails, and reports its ID if cleanup also fails.

## Other public APIs

The registry covers 174 additional public operations across these five products using production public API schemas. Mailforge's mixed Swagger document uses a blacklist for API-key management, mailbox analytics, and spam-check routes. Other documented endpoints are included automatically during schema sync.

| Product | Public operations | Coverage |
| --- | ---: | --- |
| Warmforge | 15 | Workspaces, mailbox connections and settings, warmup stats, placement tests |
| Infraforge | 45 | Domains, DNS, transfers, mailbox limits, prewarmed inventory, mailboxes, exports, credits, workspace IPs |
| Primeforge | 43 | Domains, DNS records, transfers, deletion cancellation, mailboxes, analytics, OTP, exports |
| Mailforge | 30 | Domains, DNS, forwarding, transfers, prewarmed inventory, mailboxes, workspaces |
| Leadsforge | 41 | Lead search and filters, email/phone/LinkedIn enrichment, lookalikes, company followers, maps discovery and owner enrichment |

Warmforge accepts an optional `--workspace-id` on mailbox and placement-test commands for account-wide keys. Omit it for legacy workspace-scoped keys. Warmup stats require `--from` and `--to`; `placement-tests latest-mailbox-results` accepts 1–100 mailbox IDs. Existing commands with a `body` or `forwards` input retain that wrapper, now with typed nested fields.

Leadsforge job creation accepts `--idempotency-key` where supported and sends it as an HTTP header. Async enrichment takes exactly one of `personIDs` or `people`. Synchronous enrichment takes a person ID, LinkedIn URL, or name and company identity.

Primeforge exports require the credentials and platform accepted by the public API. The old `exportType` input remains an alias for `platform`; unsupported export `search` filters fail validation. Workspace forwarding now requires `domainIds`. Infraforge mailbox listing supports `workspaceId`, `withCredentials`, and `search`; the previously advertised `page`/`size` and domain-list `workspaceId` filters are rejected because the public handlers do not consume them.

```bash
forge primeforge domains update-dns-record --domain-id dom_123 --dns-id dns_123 \
  --content target.example.com
forge infraforge domains max-mailboxes --domain-id dom_123 --max-mailboxes-per-domain 20
forge infraforge mailboxes list --workspace-id ws_123 --with-credentials=false
forge infraforge workspaces export-mailboxes --workspace-id ws_123 \
  --body '{"exportType":"sf"}' --raw > mailboxes.csv
forge mailforge domains alternatives --input-sld example --output-tld com --count 5
forge leadsforge maps-discovery search --idempotency-key discovery_123 \
  --json '{"lat":44.81,"lng":20.46,"radiusKm":5,"categories":["dentist"],"limit":25}'
forge leadsforge enrichment enrich-emails --person-ids '["person_123"]' --save-to-list=false
```

## MCP Entry Point

`forge mcp` starts a local stdio MCP server from the same command registry used by the CLI.

```json
{
  "mcpServers": {
    "forge": {
      "command": "forge",
      "args": ["mcp"],
      "env": {
        "SALESFORGE_API_KEY": "...",
        "MAILFORGE_API_KEY": "..."
      }
    }
  }
}
```

This is not used by normal CLI execution. CLI commands call the product APIs directly. If only some product keys are configured, the MCP server registers only those products' tools.

## Output

Commands print compact JSON to stdout by default.

```bash
forge salesforge workspaces list
forge salesforge workspaces list --pretty
forge mailforge domains list --fields id,name,status
forge salesforge workspaces create --name "Outbound" --quiet
```

Errors are JSON on stderr:

```json
{"error":"Salesforge API key is required","code":"AUTH_ERROR"}
```

Exit codes:

| Code | Meaning |
| --- | --- |
| 0 | Success |
| 1 | Runtime, network, API, or command error |
| 2 | Usage error |
| 3 | Authentication/configuration error |

## Supported Products

| Product | Environment variable |
| --- | --- |
| Salesforge | `SALESFORGE_API_KEY` |
| Primeforge | `PRIMEFORGE_API_KEY` |
| Leadsforge | `LEADSFORGE_API_KEY` |
| Infraforge | `INFRAFORGE_API_KEY` |
| Warmforge | `WARMFORGE_API_KEY` |
| Mailforge | `MAILFORGE_API_KEY` |

## Development

```bash
npm run typecheck
npm test

# Read the deployed schemas over HTTPS (no API keys needed).
npm run check:public-api
npm run sync:public-api
```

`src/commands/contracts.ts` is the single generated contract registry for all 285 public operations. CLI and MCP share its schemas and request builders; 288 commands include the Salesforge update aliases and subsequence workflow. Tests use mocked HTTP and stdio MCP transports; they do not call live APIs.

`npm run sync:public-api` fetches all seven production schemas and regenerates the contract snapshot. `npm run check:public-api` compares production schemas with that snapshot without writing it. No sibling repositories or local schema sources are used. Failed downloads or invalid schemas abort before writing the snapshot. Mailforge's blacklist applies to all HTTP methods; add exclusions if its Swagger introduces another private endpoint group.

`scripts/public-api-sources.mjs` lists production URLs and records public-scope restrictions and corrections for inaccurate or missing Swagger entries. Review snapshot changes and update the product command declarations before running tests. Normal builds, tests, CLI commands, and MCP use the checked-in snapshot and do not fetch live schemas.

| API | Production schema |
| --- | --- |
| Salesforge | [OpenAPI](https://api.salesforge.ai/public/v2/swagger/doc.json) |
| Multichannel | [OpenAPI](https://multichannel-api.salesforge.ai/public/multichannel/swagger/doc.json) |
| Warmforge | [Swagger](https://api.warmforge.ai/public/swagger/doc.json) |
| Infraforge | [Swagger](https://api.infraforge.ai/public/swagger/doc.json) |
| Primeforge | [Swagger](https://api.primeforge.ai/public/swagger/doc.json) |
| Mailforge | [Swagger](https://api.mailforge.ai/swagger/doc.json) |
| Leadsforge | [Swagger](https://api.leadsforge.ai/public/swagger/doc.json) |
