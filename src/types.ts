export const CLI_VERSION = "0.1.0";

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
export type JsonObject = { [key: string]: JsonValue };

export type ProductId =
  | "salesforge"
  | "primeforge"
  | "leadsforge"
  | "infraforge"
  | "warmforge"
  | "mailforge";

export interface ProductDefinition {
  id: ProductId;
  displayName: string;
  envVar: string;
  header: string;
  toolPrefix?: string;
  baseUrl: string;
  authScheme?: "raw" | "bearer";
}

export const DEFAULT_PROFILE = "default";

export const SALESFORGE_CORE_BASE_URL = "https://api.salesforge.ai/public/v2";
export const SALESFORGE_MULTICHANNEL_BASE_URL = "https://multichannel-api.salesforge.ai/public";

export const PRODUCTS: readonly ProductDefinition[] = [
  {
    id: "salesforge",
    displayName: "Salesforge",
    envVar: "SALESFORGE_API_KEY",
    header: "X-Salesforge-Key",
    baseUrl: SALESFORGE_CORE_BASE_URL,
  },
  {
    id: "primeforge",
    displayName: "Primeforge",
    envVar: "PRIMEFORGE_API_KEY",
    header: "X-Primeforge-Key",
    toolPrefix: "primeforge_",
    baseUrl: "https://api.primeforge.ai/public",
  },
  {
    id: "leadsforge",
    displayName: "Leadsforge",
    envVar: "LEADSFORGE_API_KEY",
    header: "X-Leadsforge-Key",
    toolPrefix: "leadsforge_",
    baseUrl: "https://api.leadsforge.ai/public/v1",
  },
  {
    id: "infraforge",
    displayName: "Infraforge",
    envVar: "INFRAFORGE_API_KEY",
    header: "X-Infraforge-Key",
    toolPrefix: "infraforge_",
    baseUrl: "https://api.infraforge.ai/public",
  },
  {
    id: "warmforge",
    displayName: "Warmforge",
    envVar: "WARMFORGE_API_KEY",
    header: "X-Warmforge-Key",
    toolPrefix: "warmforge_",
    baseUrl: "https://api.warmforge.ai/public/v1",
    authScheme: "bearer",
  },
  {
    id: "mailforge",
    displayName: "Mailforge",
    envVar: "MAILFORGE_API_KEY",
    header: "X-Mailforge-Key",
    toolPrefix: "mailforge_",
    baseUrl: "https://api.mailforge.ai/public",
  },
] as const;

export const PRODUCT_IDS = PRODUCTS.map((product) => product.id);

export function isProductId(value: string): value is ProductId {
  return PRODUCT_IDS.includes(value as ProductId);
}

export function getProduct(value: ProductId): ProductDefinition {
  return PRODUCTS.find((product) => product.id === value)!;
}

export function productFromToolName(toolName: string): ProductId {
  const product = PRODUCTS.find((candidate) => candidate.toolPrefix && toolName.startsWith(candidate.toolPrefix));
  return product?.id ?? "salesforge";
}

export function redactSecret(value: string): string {
  if (value.length <= 8) return "****";
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

export type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export type ParamType = "string" | "number" | "boolean" | "array" | "object" | "json";

export interface ParamDefinition {
  name: string;
  type?: ParamType;
  required?: boolean;
  description?: string;
}

export interface ApiRequest {
  product: ProductId;
  method: HttpMethod;
  path: string;
  query?: Record<string, unknown>;
  body?: unknown;
  raw?: boolean;
  salesforgeApi?: "core" | "multichannel";
}

export interface CommandDefinition {
  name: string;
  product: ProductId;
  group: string;
  subcommand: string;
  description: string;
  params?: ParamDefinition[];
  aliases?: string[][];
  request: (args: JsonObject) => ApiRequest;
}
