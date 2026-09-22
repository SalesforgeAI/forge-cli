import { z } from "zod";
import { api, cmd, encStr } from "./common.js";
/** Convert wire field names into stable CLI inputs without altering body property names. */
function inputName(name) {
    return name.replace(/\[\]$/, "").replace(/ID$/, "Id").replace(/_([a-z])/g, (_, char) => char.toUpperCase());
}
/** Build CLI and MCP definitions from a checked-in public API operation. */
export function contractEndpoint(product, contract, name, group, subcommand, method, path, options = {}) {
    const shape = {};
    /** Resolve explicit compatibility aliases before applying the default spelling. */
    const fieldName = (wire) => options.names?.[wire] ?? (options.preserveNames ? wire : inputName(wire));
    for (const parameter of contract.parameters) {
        if (options.excludeQuery?.includes(parameter.name))
            continue;
        const key = fieldName(parameter.name);
        let schema = z.fromJSONSchema(parameter.schema);
        // Keep existing string sequence/node IDs. LinkedIn account IDs follow the MCP numeric contract.
        if (parameter.location === "path") {
            schema = (key === "linkedinAccountId" ? z.number().int().positive() : z.string().min(1)).describe(String(parameter.schema.description ?? key));
        }
        shape[key] = parameter.required ? schema : schema.optional();
    }
    const bodyProperties = contract.body?.properties;
    const bodyRequired = (contract.body?.required ?? []);
    if (options.bodyKey && contract.body) {
        shape[options.bodyKey] = z.fromJSONSchema(contract.body);
    }
    else {
        for (const [wire, definition] of Object.entries(bodyProperties ?? {})) {
            const schema = z.fromJSONSchema(definition);
            shape[options.names?.[wire] ?? wire] = bodyRequired.includes(wire) ? schema : schema.optional();
        }
    }
    Object.assign(shape, options.extra);
    for (const key of options.required ?? []) {
        if (shape[key])
            shape[key] = shape[key].nonoptional();
    }
    let inputSchema = z.object(shape).strict();
    if (options.refine)
        inputSchema = inputSchema.superRefine((args, ctx) => options.refine(options.prepare ? options.prepare(args) : args, ctx));
    const params = Object.entries(shape).map(([key, schema]) => {
        const json = z.toJSONSchema(schema, { io: "input" });
        const type = json.type === "integer" ? "number" : json.type;
        return { name: key, type: (typeof type === "string" ? type : "json"), required: !schema.isOptional(), ...(json.description ? { description: json.description } : {}) };
    });
    return cmd({
        name, product, group, subcommand,
        description: options.description ?? contract.description,
        params, inputSchema,
        request: (input) => {
            const args = options.prepare ? options.prepare(input) : input;
            const query = {};
            const headers = {};
            for (const parameter of contract.parameters) {
                if (options.excludeQuery?.includes(parameter.name))
                    continue;
                if (parameter.location === "query" && args[fieldName(parameter.name)] !== undefined)
                    query[parameter.name] = args[fieldName(parameter.name)];
            }
            for (const parameter of contract.parameters) {
                if (parameter.location === "header" && args[fieldName(parameter.name)] !== undefined)
                    headers[parameter.name] = String(args[fieldName(parameter.name)]);
            }
            for (const [key, value] of Object.entries(options.queryDefaults ?? {})) {
                if (query[key] === undefined)
                    query[key] = value;
            }
            for (const [key, wire] of Object.entries(options.query ?? {})) {
                if (args[key] !== undefined)
                    query[wire] = args[key];
            }
            if (options.pageOffset && args.offset !== undefined && args.page === undefined) {
                const limit = Number(args.limit ?? 20);
                const offset = Number(args.offset);
                if (offset % limit !== 0)
                    throw new Error("offset must be a multiple of limit; use --page for multichannel pagination");
                query.page = offset / limit + 1;
            }
            const requestPath = options.legacyWorkspace && args.workspaceId === undefined ? path.replace("/workspaces/{workspaceID}", "") : path;
            const resolvedPath = requestPath.replace(/\{([^}]+)\}/g, (_, wire) => encStr(args[fieldName(wire)]));
            let body;
            if (options.bodyKey)
                body = args[options.bodyKey];
            else if (contract.body) {
                const values = { ...options.defaults };
                for (const wire of Object.keys(bodyProperties ?? {})) {
                    const value = args[options.names?.[wire] ?? wire];
                    if (value !== undefined)
                        values[wire] = value;
                }
                body = values;
            }
            else if (options.emptyBody)
                body = {};
            return api(product, method, resolvedPath, { ...(Object.keys(query).length ? { query } : {}), ...(body !== undefined ? { body } : {}), ...(options.raw ? { raw: true } : {}), ...(options.text ? { text: true } : {}), ...(Object.keys(headers).length ? { headers } : {}) });
        },
    });
}
//# sourceMappingURL=endpoint.js.map