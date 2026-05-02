const enc = encodeURIComponent;
export const pagingParams = [param("limit", "number"), param("offset", "number")];
export const enrichmentParams = [param("personIDs", "array"), param("people", "array"), param("webhookURL"), param("clientRequestID")];
export function cmd(input) {
    const aliases = [
        [input.product, input.group, input.subcommand],
        ...(input.product === "salesforge" ? [[input.group, input.subcommand]] : []),
        ...(input.aliases ?? []),
    ];
    return { ...input, aliases };
}
export function param(name, type = "string", required = false, description) {
    return {
        name,
        ...(type ? { type } : {}),
        ...(required ? { required } : {}),
        ...(description ? { description } : {}),
    };
}
export function salesforgeApi(method, path, options = {}) {
    return { product: "salesforge", method, path, ...options };
}
export function api(product, method, path, options = {}) {
    return { product, method, path, ...options };
}
export function simpleProductCommands(product) {
    return [
        cmd({ name: `${product}_list_workspaces`, product, group: "workspaces", subcommand: "list", description: `List ${product} workspaces.`, request: () => api(product, "GET", "/workspaces") }),
        cmd({ name: `${product}_create_workspace`, product, group: "workspaces", subcommand: "create", description: `Create a ${product} workspace.`, params: [param("name", "string", true)], request: (a) => api(product, "POST", "/workspaces", { body: pick(a, ["name"]) }) }),
    ];
}
export function pick(args, keys) {
    const result = {};
    for (const key of keys) {
        if (args[key] !== undefined)
            result[key] = args[key];
    }
    return result;
}
export function omit(args, keys) {
    const blocked = new Set(keys);
    const result = {};
    for (const [key, value] of Object.entries(args)) {
        if (!blocked.has(key) && value !== undefined)
            result[key] = value;
    }
    return result;
}
export function clean(object) {
    const result = {};
    for (const [key, value] of Object.entries(object)) {
        if (value !== undefined)
            result[key] = value;
    }
    return result;
}
export function encStr(value) {
    return enc(String(value));
}
export function appendArrayQuery(query, key, value) {
    if (!Array.isArray(value))
        return;
    query[key] = value.map(String);
}
export function assertEnrichment(args) {
    const hasIDs = Array.isArray(args.personIDs) && args.personIDs.length > 0;
    const hasPeople = Array.isArray(args.people) && args.people.length > 0;
    if (hasIDs === hasPeople)
        throw new Error("Provide exactly one of personIDs or people.");
    return args;
}
export function num(value) {
    return typeof value === "number" ? value : undefined;
}
//# sourceMappingURL=common.js.map