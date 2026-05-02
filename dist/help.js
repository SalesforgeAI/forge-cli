import { CLI_VERSION, PRODUCTS } from "./types.js";
export function mainHelp() {
    return `Forge CLI ${CLI_VERSION}

Usage:
  forge <product> <group> <command> [arguments]
  forge <command-name> [arguments]
  forge call <command-name> [--json JSON | --file FILE | --param key=value]
  forge commands list [--product PRODUCT] [--available] [--names]
  forge commands describe <command-name>
  forge products
  forge status
  forge login <product> --key-stdin
  forge auth set <product> --key-stdin
  forge mcp

Global options:
  --profile NAME          Config profile to use
  --config PATH           Config file path
  --pretty                Pretty-print JSON output
  --fields a,b,c          Project JSON output to selected fields
  --raw                   Print raw string output when available
  --quiet                 Suppress stdout
  --timeout MS            API request timeout
  --<product>-key KEY     Use an API key for one command
  -h, --help              Show help
  -V, --version           Show version

Products:
${PRODUCTS.map((product) => `  ${product.id.padEnd(12)} ${product.envVar}`).join("\n")}

Examples:
  forge login salesforge --key-stdin
  forge login mailforge --key-stdin
  forge products --pretty
  forge commands list --available --names
  forge salesforge workspaces list --limit 50 --pretty
  forge mailforge domains list --status active --fields id,name,status
  forge call leadsforge_search --json '{"limit":10,"leadLocations":{"include":["United States"]}}'
`;
}
export function authHelp() {
    return `Usage:
  forge login <product> --key-stdin
  forge logout <product>
  forge status
  forge auth set <product> --key KEY
  forge auth set <product> --key-stdin
  forge auth unset <product>
  forge auth list
  forge auth status
  forge auth path
  forge auth clear

You can authenticate one product, a couple of products, or the full stack. Commands only require the key for the product they call.
Stored keys are written to the selected profile in the Forge CLI config file with mode 0600.
Environment variables and per-command --<product>-key flags take precedence over stored keys.
`;
}
export function commandsHelp() {
    return `Usage:
  forge commands list [--product PRODUCT] [--available] [--names]
  forge commands describe <command-name>
  forge <product> <group> <command> --help

Commands are backed by direct product API requests. The same registry is also exposed by "forge mcp".
`;
}
export function callHelp() {
    return `Usage:
  forge call <tool-name> [arguments]
  forge <tool-name> [arguments]
  forge <product> <group> <command> [arguments]

Argument inputs:
  --json JSON             Merge a JSON object into tool arguments
  --file FILE             Merge a JSON object from a file, or - for stdin
  --stdin                 Read a JSON object from stdin
  --param key=value       Add one argument with type coercion
  --some-flag value       Add a tool argument; kebab-case is mapped to schema keys
  --no-some-flag          Add a boolean false tool argument

Examples:
  forge get_workspace --workspace-id ws_123
  forge salesforge workspaces get --workspace-id ws_123
  forge call create_workspace --name "Outbound"
  forge leadsforge_search --json '{"limit":25}'
`;
}
export function productsHelp() {
    return `Usage:
  forge products
  forge status

Shows each product, its API key source, and the number of commands available for it.
`;
}
export function commandHelp(command) {
    const params = command.params ?? [];
    const groupedUsage = usageFor(command);
    const registryUsage = `forge ${command.name}${optionUsage(params)}`;
    return `${command.description}

Usage:
  ${groupedUsage}
  ${registryUsage}

Product: ${command.product}
Command: ${command.name}

Options:
${params.length ? params.map(formatParam).join("\n") : "  This command has no input options."}
`;
}
function usageFor(command) {
    const alias = command.aliases?.[0] ?? [command.name];
    return `forge ${alias.join(" ")}${optionUsage(command.params ?? [])}`;
}
function optionUsage(params) {
    const rendered = params.map((input) => input.required ? ` --${toKebabCase(input.name)} <value>` : ` [--${toKebabCase(input.name)} <value>]`);
    return rendered.join("");
}
function formatParam(input) {
    const name = `--${toKebabCase(input.name)}`;
    const required = input.required ? "required" : "optional";
    const type = input.type ?? "string";
    const description = input.description ? ` - ${input.description}` : "";
    return `  ${name.padEnd(24)} ${type}, ${required}${description}`;
}
function toKebabCase(value) {
    return value
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/_/g, "-")
        .toLowerCase();
}
//# sourceMappingURL=help.js.map