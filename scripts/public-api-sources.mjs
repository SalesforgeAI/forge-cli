export const publicApiSources = {
  salesforge: {
    url: "https://api.salesforge.ai/public/v2/swagger/doc.json",
  },
  multichannel: {
    url: "https://multichannel-api.salesforge.ai/public/multichannel/swagger/doc.json",
  },
  warmforge: {
    url: "https://api.warmforge.ai/public/swagger/doc.json",
  },
  infraforge: {
    url: "https://api.infraforge.ai/public/swagger/doc.json",
  },
  primeforge: {
    url: "https://api.primeforge.ai/public/swagger/doc.json",
  },
  mailforge: {
    url: "https://api.mailforge.ai/swagger/doc.json",
  },
  leadsforge: {
    url: "https://api.leadsforge.ai/public/swagger/doc.json",
  },
};

// Mailforge's Swagger mixes public and private APIs. Exclude known private
// endpoint groups for every HTTP method, including future routes in those groups.
const mailforgeExcludedPaths = [/^\/api-keys/, /^\/spam-check/, /\/analytics(?:\/|$)/];

/** Fetch a schema from its unauthenticated production documentation URL. */
export async function readPublicApiDocument(service, { fetchImpl = fetch } = {}) {
  const source = publicApiSources[service];
  if (!source) throw new Error(`Unknown public API service: ${service}`);
  try {
    const response = await fetchImpl(source.url, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(30_000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const document = await response.json();
    if (!(document?.swagger === "2.0" || /^3\./.test(document?.openapi ?? "")) || !document.paths || typeof document.paths !== "object" || Array.isArray(document.paths) || !Object.keys(document.paths).length) {
      throw new Error("Expected a non-empty Swagger 2 or OpenAPI 3 document");
    }
    return document;
  } catch (error) {
    throw new Error(`${service}: cannot read ${source.url}: ${error.message}`, { cause: error });
  }
}

/** Apply audited public-scope restrictions and corrections to production documentation. */
export function publicDocument(product, source) {
  const document = structuredClone(source);
  if (product === "mailforge") {
    // These are outside /public and use Firebase or a service secret:
    // external-api/delivery/http/handler.go, mailbox_analytics/delivery/http/handler.go,
    // spam-check/delivery/http/handler.go.
    for (const path of Object.keys(document.paths)) {
      if (mailforgeExcludedPaths.some((pattern) => pattern.test(path))) delete document.paths[path];
    }
  }
  if (product === "primeforge") {
    // infrastructure/transport/http/routes.go registers PATCH, not the documented PUT.
    const dns = document.paths["/domains/{id}/dns/{dnsId}"];
    if (dns.put) { dns.patch = dns.put; delete dns.put; }
    // GET DNS uses {id}, but the generated parameter is named domainId.
    document.paths["/domains/{id}/dns"].get.parameters.find((p) => p.in === "path").name = "id";
    // Existing public workspace forwarding route is omitted from the external Swagger.
    document.paths["/workspaces/{id}/domains/forwarding"] = { post: {
      summary: "Set domain forwarding in a workspace",
      parameters: [{ name: "id", in: "path", type: "string", required: true }, { name: "body", in: "body", required: true, schema: { $ref: "#/definitions/requests.ExternalSetDomainForwardingRequest" } }],
    } };
  }
  if (product === "infraforge") {
    // Registered in infrastructure/transport/http/routes.go; request constraints in requests/external-api.go.
    document.paths["/domains/{domainID}/max-mailboxes"] = { patch: {
      summary: "Adjust the maximum mailboxes on a domain",
      parameters: [{ name: "domainID", in: "path", type: "string", required: true }, { name: "body", in: "body", required: true, schema: {
        type: "object", required: ["maxMailboxesPerDomain"], properties: { maxMailboxesPerDomain: { type: "integer", minimum: 11, maximum: 50 } },
      } }],
    } };
  }
  // Some Swagger paths use Echo's :param syntax, omit parameters, or include
  // unrelated path fields. Only actual path segments become required CLI IDs.
  document.paths = Object.fromEntries(Object.entries(document.paths).map(([raw, methods]) => {
    const path = raw.replace(/:([A-Za-z][A-Za-z0-9]*)/g, "{$1}");
    const names = [...path.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]);
    for (const op of Object.values(methods)) {
      op.parameters = (op.parameters ?? []).filter((p) => p.in !== "path" || names.includes(p.name));
      for (const name of names) if (!op.parameters.some((p) => p.in === "path" && p.name === name)) op.parameters.unshift({ name, in: "path", type: "string", required: true });
    }
    return [path, methods];
  }));
  return document;
}
