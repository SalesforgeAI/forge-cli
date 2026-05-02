import { readFile } from "node:fs/promises";
import { ApiExecutor } from "./api.js";
import { authError, asCliError, usageError } from "./errors.js";
import {
  buildToolArguments,
  extractGlobalOptions,
  getFlag,
  hasFlag,
  parseFlags,
  type GlobalOptions,
} from "./args.js";
import {
  assertHasAtLeastOneKey,
  clearStoredProfile,
  getProductDisplay,
  loadConfig,
  resolveConfigPath,
  resolveRuntimeConfig,
  saveConfig,
  setStoredKey,
  unsetStoredKey,
  type Env,
  type ResolvedRuntimeConfig,
} from "./config.js";
import { authHelp, callHelp, commandHelp, commandsHelp, mainHelp, productsHelp } from "./help.js";
import {
  commandInputSchema,
  commands,
  commandsForProduct,
  findCommand,
  toKebabCase,
  validateCommandArgs,
} from "./registry.js";
import { writeData, writeError, writeText, type Writable } from "./output.js";
import {
  CLI_VERSION,
  DEFAULT_PROFILE,
  PRODUCTS,
  isProductId,
  redactSecret,
  type CommandDefinition,
} from "./types.js";

export interface CliContext {
  env?: Env;
  stdout?: Writable;
  stderr?: Writable;
  stdin?: NodeJS.ReadableStream;
  fetchImpl?: typeof fetch;
}

interface HandlerContext {
  globals: GlobalOptions;
  env: Env;
  stdout: Writable;
  stderr: Writable;
  stdin: NodeJS.ReadableStream;
  fetchImpl: typeof fetch | undefined;
}

export async function run(argv: readonly string[], context: CliContext = {}): Promise<number> {
  const stdout = context.stdout ?? process.stdout;
  const stderr = context.stderr ?? process.stderr;
  const env = context.env ?? process.env;

  try {
    const { globals, tokens } = extractGlobalOptions(argv);

    if (globals.version) {
      writeText(stdout, CLI_VERSION);
      return 0;
    }

    if (globals.help) {
      writeText(stdout, helpForTokens(tokens));
      return 0;
    }

    if (tokens.length === 0) {
      writeText(stdout, mainHelp());
      return 0;
    }

    const handlerContext: HandlerContext = {
      globals,
      env,
      stdout,
      stderr,
      stdin: context.stdin ?? process.stdin,
      fetchImpl: context.fetchImpl,
    };

    const [command, ...rest] = tokens;
    if (command === undefined) throw usageError("Missing command");

    if (command === "help") {
      writeText(stdout, helpForTokens(rest));
      return 0;
    }
    if (command === "auth" || command === "login") return await handleAuth(command === "login" ? ["set", ...rest] : rest, handlerContext);
    if (command === "logout") return await handleAuth(["unset", ...rest], handlerContext);
    if (command === "status") return await handleAuth(["list", ...rest], handlerContext);
    if (command === "commands" || command === "tools") return await handleCommands(rest, handlerContext);
    if (command === "products") return await handleProducts(handlerContext);
    if (command === "mcp") return await handleMcp(handlerContext);
    if (command === "call" || command === "run") return await handleCall(rest, handlerContext);

    return await handleDirectCommand(tokens, handlerContext);
  } catch (error) {
    const cliError = asCliError(error);
    writeError(stderr, cliError, context.env?.FORGE_CLI_DEBUG === "1");
    return cliError.exitCode;
  }
}

async function handleAuth(tokens: readonly string[], context: HandlerContext): Promise<number> {
  const [action, ...rest] = tokens;
  const profile = context.globals.profile ?? context.env.FORGE_CLI_PROFILE ?? DEFAULT_PROFILE;
  const configPath = resolveConfigPath(context.env, context.globals.config);

  if (!action || action === "help" || action === "--help") {
    writeText(context.stdout, authHelp());
    return 0;
  }

  if (action === "path") {
    writeData(context.stdout, { configPath, profile }, context.globals);
    return 0;
  }

  if (action === "list" || action === "status") {
    const runtime = await resolveRuntimeConfig(context.globals, context.env);
    const rows = PRODUCTS.map((product) => {
      const key = runtime.keys[product.id];
      return {
        product: product.id,
        displayName: product.displayName,
        configured: Boolean(key),
        source: runtime.keySources[product.id] ?? null,
        key: key ? redactSecret(key) : null,
      };
    });
    writeData(context.stdout, { profile: runtime.profile, configPath, products: rows }, context.globals);
    return 0;
  }

  if (action === "set") {
    const [productId, ...flagTokens] = rest;
    if (!productId || !isProductId(productId)) throw usageError("Usage: forge auth set <product> --key-stdin");
    const parsed = parseFlags(flagTokens);
    const key = await resolveKeyInput(parsed.flags, context.stdin);
    await setStoredKey(configPath, profile, productId, key);
    writeData(
      context.stdout,
      { profile, product: productId, displayName: getProductDisplay(productId), configured: true, configPath },
      context.globals,
    );
    return 0;
  }

  if (action === "unset") {
    const [productId] = rest;
    if (!productId || !isProductId(productId)) throw usageError("Usage: forge auth unset <product>");
    await unsetStoredKey(configPath, profile, productId);
    writeData(context.stdout, { profile, product: productId, configured: false, configPath }, context.globals);
    return 0;
  }

  if (action === "clear") {
    await clearStoredProfile(configPath, profile);
    writeData(context.stdout, { profile, cleared: true, configPath }, context.globals);
    return 0;
  }

  throw usageError(`Unknown auth command "${action}"`);
}

async function handleProducts(context: HandlerContext): Promise<number> {
  const runtime = await resolveRuntimeConfig(context.globals, context.env);
  writeData(
    context.stdout,
    PRODUCTS.map((product) => ({
      product: product.id,
      displayName: product.displayName,
      envVar: product.envVar,
      authenticated: Boolean(runtime.keys[product.id]),
      source: runtime.keySources[product.id] ?? null,
      commands: commandsForProduct(product.id).length,
    })),
    context.globals,
  );
  return 0;
}

async function handleCommands(tokens: readonly string[], context: HandlerContext): Promise<number> {
  const [action, ...rest] = tokens;
  if (!action || action === "help" || action === "--help") {
    writeText(context.stdout, commandsHelp());
    return 0;
  }

  if (action === "list") {
    const parsed = parseFlags(rest);
    const productFilter = getFlag(parsed.flags, "product");
    if (productFilter && !isProductId(productFilter)) throw usageError(`Unknown product "${productFilter}"`);
    const availableOnly = hasFlag(parsed.flags, "available");
    const runtime = availableOnly ? await resolveRuntimeConfig(context.globals, context.env) : undefined;
    const availableProducts = runtime ? new Set(Object.keys(runtime.keys)) : undefined;
    const selected = (productFilter ? commandsForProduct(productFilter as typeof PRODUCTS[number]["id"]) : [...commands])
      .filter((command) => !availableProducts || availableProducts.has(command.product));

    if (hasFlag(parsed.flags, "names")) {
      writeText(context.stdout, selected.map((command) => command.name).join("\n"));
      return 0;
    }

    writeData(
      context.stdout,
      selected.map((command) => ({
        name: command.name,
        product: command.product,
        group: command.group,
        subcommand: command.subcommand,
        usage: usageFor(command),
        description: command.description,
      })),
      context.globals,
    );
    return 0;
  }

  if (action === "describe") {
    const [name] = rest;
    if (!name) throw usageError("Usage: forge commands describe <command-name>");
    const match = findCommand(name);
    if (!match) throw unknownCommand(name);
    writeData(
      context.stdout,
      {
        ...match.command,
        inputSchema: commandInputSchema(match.command),
      },
      context.globals,
    );
    return 0;
  }

  throw usageError(`Unknown commands command "${action}"`);
}

async function handleMcp(context: HandlerContext): Promise<number> {
  assertHasAtLeastOneKey(await resolveRuntimeConfig(context.globals, context.env));
  const { startMcpServer } = await import("./mcp.js");
  await startMcpServer({ env: context.env });
  return 0;
}

async function handleCall(tokens: readonly string[], context: HandlerContext): Promise<number> {
  const [commandName, ...argTokens] = tokens;
  if (!commandName || commandName === "help" || commandName === "--help") {
    writeText(context.stdout, callHelp());
    return 0;
  }

  const match = findCommand(commandName);
  if (!match) throw unknownCommand(commandName);
  return executeCommand(match.command, argTokens, context);
}

async function handleDirectCommand(tokens: readonly string[], context: HandlerContext): Promise<number> {
  const match = findCommand(tokens);
  if (!match) throw unknownCommand(tokens.join(" "));
  return executeCommand(match.command, tokens.slice(match.consumed), context);
}

async function executeCommand(command: CommandDefinition, argTokens: readonly string[], context: HandlerContext): Promise<number> {
  const runtime = await resolveRuntimeConfig(context.globals, context.env);
  assertHasAtLeastOneKey(runtime);
  const args = await buildToolArguments(argTokens, commandInputSchema(command), context.stdin);
  validateCommandArgs(command, args);
  const executor = createExecutor(runtime, context);
  const result = await executor.execute(command.request(args));
  writeData(context.stdout, result, context.globals);
  return 0;
}

function createExecutor(runtime: ResolvedRuntimeConfig, context: HandlerContext): ApiExecutor {
  return new ApiExecutor({
    keys: runtime.keys,
    timeoutMs: context.globals.timeoutMs,
    fetchImpl: context.fetchImpl,
  });
}

function unknownCommand(name: string): Error {
  const suggestions = suggestCommands(name);
  const suffix = suggestions.length ? ` Did you mean: ${suggestions.join(", ")}?` : "";
  return usageError(`Unknown command "${name}".${suffix}`);
}

function suggestCommands(name: string): string[] {
  const normalized = name.replace(/-/g, "_").toLowerCase();
  return commands
    .map((command) => ({
      label: suggestionFor(command),
      score: levenshtein(command.name.toLowerCase(), normalized),
    }))
    .sort((a, b) => a.score - b.score || a.label.localeCompare(b.label))
    .slice(0, 5)
    .map((command) => command.label);
}

function suggestionFor(command: CommandDefinition): string {
  const alias = command.aliases?.[0];
  if (!alias) return command.name;
  return `${alias.join(" ")} (${command.name})`;
}

async function resolveKeyInput(flags: Map<string, string[]>, stdin?: NodeJS.ReadableStream): Promise<string> {
  const key = getFlag(flags, "key");
  if (key) return key.trim();

  if (hasFlag(flags, "key-stdin")) {
    const value = await readAll(stdin);
    if (!value.trim()) throw authError("No API key was provided on stdin");
    return value.trim();
  }

  const keyFile = getFlag(flags, "key-file");
  if (keyFile) {
    const value = await readFile(keyFile, "utf8");
    if (!value.trim()) throw authError(`No API key found in ${keyFile}`);
    return value.trim();
  }

  throw usageError("Provide --key, --key-stdin, or --key-file");
}

async function readAll(stream?: NodeJS.ReadableStream): Promise<string> {
  if (!stream) return "";
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
  }
  return Buffer.concat(chunks).toString("utf8");
}

function helpForTokens(tokens: readonly string[]): string {
  const [topic] = tokens;
  if (tokens.length > 0) {
    const match = findCommand(tokens);
    if (match) return commandHelp(match.command);
  }
  return helpFor(topic);
}

function helpFor(topic?: string): string {
  if (topic === "auth" || topic === "login") return authHelp();
  if (topic === "logout" || topic === "status" || topic === "products") return topic === "products" ? productsHelp() : authHelp();
  if (topic === "commands" || topic === "tools") return commandsHelp();
  if (topic === "call" || topic === "run") return callHelp();
  return mainHelp();
}

function usageFor(command: CommandDefinition): string {
  const alias = command.aliases?.[0] ?? [command.name];
  const params = (command.params ?? []).map((input) => input.required ? `--${toKebabCase(input.name)} <value>` : `[--${toKebabCase(input.name)} <value>]`);
  return `forge ${alias.join(" ")} ${params.join(" ")}`.trim();
}

function levenshtein(a: string, b: string): number {
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  const current = Array.from({ length: b.length + 1 }, () => 0);

  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(previous[j]! + 1, current[j - 1]! + 1, previous[j - 1]! + cost);
    }
    previous.splice(0, previous.length, ...current);
  }

  return previous[b.length]!;
}

export async function writeDefaultConfig(configPath: string): Promise<void> {
  const current = await loadConfig(configPath);
  current.defaultProfile ??= DEFAULT_PROFILE;
  current.profiles ??= { [DEFAULT_PROFILE]: {} };
  await saveConfig(configPath, current);
}
