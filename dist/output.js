export function writeData(stdout, data, options = {}) {
    if (options.quiet)
        return;
    const projected = options.fields?.length ? selectFields(data, options.fields) : data;
    if (options.raw && typeof projected === "string") {
        stdout.write(projected.endsWith("\n") ? projected : `${projected}\n`);
        return;
    }
    stdout.write(`${JSON.stringify(projected, null, options.pretty ? 2 : 0)}\n`);
}
export function writeText(stdout, value) {
    stdout.write(value.endsWith("\n") ? value : `${value}\n`);
}
export function writeError(stderr, error, pretty = false) {
    const body = {
        error: error.message,
        code: error.code,
    };
    if (error.details !== undefined)
        body.details = toJsonValue(error.details);
    stderr.write(`${JSON.stringify(body, null, pretty ? 2 : 0)}\n`);
}
export function selectFields(value, fields) {
    if (Array.isArray(value))
        return value.map((item) => selectFields(item, fields));
    if (!isRecord(value))
        return value;
    const selected = {};
    for (const field of fields) {
        selected[field] = getPath(value, field);
    }
    return selected;
}
function getPath(value, path) {
    return path.split(".").reduce((current, segment) => {
        if (!isRecord(current))
            return undefined;
        return current[segment];
    }, value);
}
function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
function toJsonValue(value) {
    if (value === null)
        return null;
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean")
        return value;
    if (Array.isArray(value))
        return value.map(toJsonValue);
    if (isRecord(value)) {
        const object = {};
        for (const [key, nested] of Object.entries(value))
            object[key] = toJsonValue(nested);
        return object;
    }
    return String(value);
}
//# sourceMappingURL=output.js.map