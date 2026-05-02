import { readFile } from "node:fs/promises";
import { usageError } from "./errors.js";
import type { JsonObject, JsonValue } from "./types.js";

export interface ParsedFlags {
  flags: Map<string, string[]>;
  positionals: string[];
}

export interface GlobalOptions {
  help: boolean;
  version: boolean;
  pretty: boolean;
  quiet: boolean;
  raw: boolean;
  profile?: string;
  config?: string;
  fields?: string[];
  timeoutMs?: number;
  productKeys: Record<string, string>;
}

const GLOBAL_BOOLEAN_FLAGS = new Set(["help", "version", "pretty", "quiet", "raw"]);
const GLOBAL_VALUE_FLAGS = new Set([
  "profile",
  "config",
  "fields",
  "timeout",
  "salesforge-key",
  "primeforge-key",
  "leadsforge-key",
  "infraforge-key",
  "warmforge-key",
  "mailforge-key",
]);

export function parseFlags(tokens: readonly string[]): ParsedFlags {
  const flags = new Map<string, string[]>();
  const positionals: string[] = [];

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token === undefined) continue;

    if (token === "--") {
      positionals.push(...tokens.slice(index + 1));
      break;
    }

    if (token === "-h") {
      addFlag(flags, "help", "true");
      continue;
    }

    if (token === "-V") {
      addFlag(flags, "version", "true");
      continue;
    }

    if (!token.startsWith("--") || token === "--") {
      positionals.push(token);
      continue;
    }

    const parsed = splitLongOption(token);
    let { name, value } = parsed;

    if (name.startsWith("no-") && value === undefined) {
      name = name.slice(3);
      value = "false";
    }

    if (value === undefined) {
      const next = tokens[index + 1];
      if (next !== undefined && !next.startsWith("-")) {
        value = next;
        index += 1;
      } else {
        value = "true";
      }
    }

    addFlag(flags, name, value);
  }

  return { flags, positionals };
}

export function extractGlobalOptions(argv: readonly string[]): { globals: GlobalOptions; tokens: string[] } {
  const tokens: string[] = [];
  const globals: GlobalOptions = {
    help: false,
    version: false,
    pretty: false,
    quiet: false,
    raw: false,
    productKeys: {},
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === undefined) continue;

    if (token === "--") {
      tokens.push(...argv.slice(index));
      break;
    }

    if (token === "-h") {
      globals.help = true;
      continue;
    }

    if (token === "-V") {
      globals.version = true;
      continue;
    }

    if (!token.startsWith("--")) {
      tokens.push(token);
      continue;
    }

    const parsed = splitLongOption(token);
    const name = parsed.name;
    if (!GLOBAL_BOOLEAN_FLAGS.has(name) && !GLOBAL_VALUE_FLAGS.has(name)) {
      tokens.push(token);
      continue;
    }

    if (GLOBAL_BOOLEAN_FLAGS.has(name)) {
      setGlobalBoolean(globals, name, parsed.value);
      continue;
    }

    const value = parsed.value ?? argv[index + 1];
    if (value === undefined || value.startsWith("--")) {
      throw usageError(`--${name} requires a value`);
    }
    if (parsed.value === undefined) index += 1;

    setGlobalValue(globals, name, value);
  }

  return { globals, tokens };
}

export function getFlag(flags: Map<string, string[]>, name: string): string | undefined {
  return flags.get(name)?.at(-1);
}

export function hasFlag(flags: Map<string, string[]>, name: string): boolean {
  return flags.has(name);
}

export function getRepeatedFlag(flags: Map<string, string[]>, name: string): string[] {
  return flags.get(name) ?? [];
}

export async function buildToolArguments(
  tokens: readonly string[],
  inputSchema?: JsonObject,
  stdin?: NodeJS.ReadableStream,
): Promise<JsonObject> {
  const parsed = parseFlags(tokens);
  if (parsed.positionals.length > 0) {
    throw usageError(`Unexpected positional argument: ${parsed.positionals[0]}`);
  }

  const args: JsonObject = {};

  const jsonValues = getRepeatedFlag(parsed.flags, "json");
  for (const jsonValue of jsonValues) {
    Object.assign(args, parseJsonObject(jsonValue, "--json"));
  }

  const fileValues = getRepeatedFlag(parsed.flags, "file");
  for (const fileValue of fileValues) {
    Object.assign(args, parseJsonObject(await readInputFile(fileValue, stdin), `--file ${fileValue}`));
  }

  if (hasFlag(parsed.flags, "stdin")) {
    Object.assign(args, parseJsonObject(await readInputFile("-", stdin), "--stdin"));
  }

  const paramValues = getRepeatedFlag(parsed.flags, "param");
  for (const param of paramValues) {
    const separator = param.indexOf("=");
    if (separator === -1) {
      throw usageError("--param values must be in key=value format");
    }
    const key = param.slice(0, separator);
    const value = param.slice(separator + 1);
    args[resolveSchemaKey(key, inputSchema)] = coerceCliValue(value);
  }

  for (const [rawName, values] of parsed.flags) {
    if (rawName === "json" || rawName === "file" || rawName === "stdin" || rawName === "param") continue;
    const key = resolveSchemaKey(rawName, inputSchema);
    const coercedValues = values.map((value) => coerceCliValue(value));
    args[key] = coercedValues.length === 1 ? coercedValues[0]! : coercedValues;
  }

  return args;
}

export function coerceCliValue(value: string): JsonValue {
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null") return null;
  if (/^-?(0|[1-9]\d*)(\.\d+)?$/.test(value)) return Number(value);

  const trimmed = value.trim();
  if (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  ) {
    try {
      return JSON.parse(trimmed) as JsonValue;
    } catch {
      return value;
    }
  }

  return value;
}

export function resolveSchemaKey(rawName: string, inputSchema?: JsonObject): string {
  const properties = getSchemaProperties(inputSchema);
  const candidates = [rawName, toCamelCase(rawName)];
  const propertyNames = Object.keys(properties);

  for (const candidate of candidates) {
    if (Object.hasOwn(properties, candidate)) return candidate;
  }

  const normalized = normalizeName(rawName);
  const match = propertyNames.find((name) => normalizeName(name) === normalized);
  return match ?? toCamelCase(rawName);
}

export function toCamelCase(value: string): string {
  return value.replace(/[-_]+([a-zA-Z0-9])/g, (_, char: string) => char.toUpperCase());
}

function splitLongOption(token: string): { name: string; value?: string } {
  const body = token.slice(2);
  const separator = body.indexOf("=");
  if (separator === -1) return { name: body };
  return {
    name: body.slice(0, separator),
    value: body.slice(separator + 1),
  };
}

function addFlag(flags: Map<string, string[]>, name: string, value: string): void {
  const values = flags.get(name) ?? [];
  values.push(value);
  flags.set(name, values);
}

function setGlobalBoolean(globals: GlobalOptions, name: string, value: string | undefined): void {
  const boolValue = value === undefined ? true : coerceCliValue(value) !== false;
  if (name === "help") globals.help = boolValue;
  if (name === "version") globals.version = boolValue;
  if (name === "pretty") globals.pretty = boolValue;
  if (name === "quiet") globals.quiet = boolValue;
  if (name === "raw") globals.raw = boolValue;
}

function setGlobalValue(globals: GlobalOptions, name: string, value: string): void {
  if (name === "profile") globals.profile = value;
  if (name === "config") globals.config = value;
  if (name === "fields") globals.fields = value.split(",").map((field) => field.trim()).filter(Boolean);
  if (name === "timeout") {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) throw usageError("--timeout must be a positive number of milliseconds");
    globals.timeoutMs = parsed;
  }

  const productKey = name.match(/^(.+)-key$/);
  if (productKey?.[1]) globals.productKeys[productKey[1]] = value;
}

function parseJsonObject(value: string, source: string): JsonObject {
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch (error) {
    throw usageError(`${source} must contain valid JSON`, error instanceof Error ? error.message : undefined);
  }

  if (!isPlainObject(parsed)) {
    throw usageError(`${source} must be a JSON object`);
  }

  return parsed as JsonObject;
}

async function readInputFile(filePath: string, stdin?: NodeJS.ReadableStream): Promise<string> {
  if (filePath !== "-") return readFile(filePath, "utf8");
  if (!stdin) throw usageError("stdin is not available");
  return readStream(stdin);
}

async function readStream(stream: NodeJS.ReadableStream): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
  }
  return Buffer.concat(chunks).toString("utf8");
}

function getSchemaProperties(inputSchema?: JsonObject): JsonObject {
  const properties = inputSchema?.properties;
  return isPlainObject(properties) ? (properties as JsonObject) : {};
}

function normalizeName(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
