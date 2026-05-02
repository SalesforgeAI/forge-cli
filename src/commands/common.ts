import type { ApiRequest, CommandDefinition, JsonObject, ParamDefinition, ProductId } from "../types.js";

const enc = encodeURIComponent;

export type ReqArgs = JsonObject;

type CommandInput = {
  name: string;
  product: ProductId;
  group: string;
  subcommand: string;
  description: string;
  params?: ParamDefinition[];
  request: (args: ReqArgs) => ApiRequest;
  aliases?: string[][];
};

export const pagingParams = [param("limit", "number"), param("offset", "number")];
export const enrichmentParams = [param("personIDs", "array"), param("people", "array"), param("webhookURL"), param("clientRequestID")];

export function cmd(input: CommandInput): CommandDefinition {
  const aliases: string[][] = [
    [input.product, input.group, input.subcommand],
    ...(input.product === "salesforge" ? [[input.group, input.subcommand]] : []),
    ...(input.aliases ?? []),
  ];
  return { ...input, aliases };
}

export function param(name: string, type: ParamDefinition["type"] = "string", required = false, description?: string): ParamDefinition {
  return {
    name,
    ...(type ? { type } : {}),
    ...(required ? { required } : {}),
    ...(description ? { description } : {}),
  };
}

export function salesforgeApi(method: ApiRequest["method"], path: string, options: Partial<ApiRequest> = {}): ApiRequest {
  return { product: "salesforge", method, path, ...options };
}

export function api(product: ProductId, method: ApiRequest["method"], path: string, options: Partial<ApiRequest> = {}): ApiRequest {
  return { product, method, path, ...options };
}

export function simpleProductCommands(product: ProductId): CommandDefinition[] {
  return [
    cmd({ name: `${product}_list_workspaces`, product, group: "workspaces", subcommand: "list", description: `List ${product} workspaces.`, request: () => api(product, "GET", "/workspaces") }),
    cmd({ name: `${product}_create_workspace`, product, group: "workspaces", subcommand: "create", description: `Create a ${product} workspace.`, params: [param("name", "string", true)], request: (a) => api(product, "POST", "/workspaces", { body: pick(a, ["name"]) }) }),
  ];
}

export function pick(args: ReqArgs, keys: readonly string[]): JsonObject {
  const result: JsonObject = {};
  for (const key of keys) {
    if (args[key] !== undefined) result[key] = args[key];
  }
  return result;
}

export function omit(args: ReqArgs, keys: readonly string[]): JsonObject {
  const blocked = new Set(keys);
  const result: JsonObject = {};
  for (const [key, value] of Object.entries(args)) {
    if (!blocked.has(key) && value !== undefined) result[key] = value;
  }
  return result;
}

export function clean<T extends Record<string, unknown>>(object: T): JsonObject {
  const result: JsonObject = {};
  for (const [key, value] of Object.entries(object)) {
    if (value !== undefined) result[key] = value as JsonObject[string];
  }
  return result;
}

export function encStr(value: unknown): string {
  return enc(String(value));
}

export function appendArrayQuery(query: JsonObject, key: string, value: unknown): void {
  if (!Array.isArray(value)) return;
  query[key] = value.map(String);
}

export function assertEnrichment(args: ReqArgs): JsonObject {
  const hasIDs = Array.isArray(args.personIDs) && args.personIDs.length > 0;
  const hasPeople = Array.isArray(args.people) && args.people.length > 0;
  if (hasIDs === hasPeople) throw new Error("Provide exactly one of personIDs or people.");
  return args;
}

export function num(value: unknown): number | undefined {
  return typeof value === "number" ? value : undefined;
}
