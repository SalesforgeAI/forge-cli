import { CliError } from "./errors.js";
import type { JsonObject, JsonValue } from "./types.js";

export interface OutputOptions {
  pretty?: boolean;
  quiet?: boolean;
  raw?: boolean;
  fields?: string[];
}

export interface Writable {
  write(chunk: string): boolean;
}

export function writeData(stdout: Writable, data: unknown, options: OutputOptions = {}): void {
  if (options.quiet) return;
  const projected = options.fields?.length ? selectFields(data, options.fields) : data;

  if (options.raw && typeof projected === "string") {
    stdout.write(projected.endsWith("\n") ? projected : `${projected}\n`);
    return;
  }

  stdout.write(`${JSON.stringify(projected, null, options.pretty ? 2 : 0)}\n`);
}

export function writeText(stdout: Writable, value: string): void {
  stdout.write(value.endsWith("\n") ? value : `${value}\n`);
}

export function writeError(stderr: Writable, error: CliError, pretty = false): void {
  const body: JsonObject = {
    error: error.message,
    code: error.code,
  };
  if (error.details !== undefined) body.details = toJsonValue(error.details);
  stderr.write(`${JSON.stringify(body, null, pretty ? 2 : 0)}\n`);
}

export function selectFields(value: unknown, fields: readonly string[]): unknown {
  if (Array.isArray(value)) return value.map((item) => selectFields(item, fields));
  if (!isRecord(value)) return value;

  const selected: Record<string, unknown> = {};
  for (const field of fields) {
    selected[field] = getPath(value, field);
  }
  return selected;
}

function getPath(value: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((current, segment) => {
    if (!isRecord(current)) return undefined;
    return current[segment];
  }, value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toJsonValue(value: unknown): JsonValue {
  if (value === null) return null;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
  if (Array.isArray(value)) return value.map(toJsonValue);
  if (isRecord(value)) {
    const object: JsonObject = {};
    for (const [key, nested] of Object.entries(value)) object[key] = toJsonValue(nested);
    return object;
  }
  return String(value);
}
