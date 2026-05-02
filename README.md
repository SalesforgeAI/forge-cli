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
npm install
npm run typecheck
npm run build
npm pack --dry-run
```

Runtime dependencies are limited to the MCP SDK and Zod for the optional `forge mcp` entrypoint.
