import { clean } from "./commands/common.js";
import { commands } from "./commands/index.js";
export { commands };
export function findCommand(tokensOrName) {
    if (typeof tokensOrName === "string") {
        const normalized = normalizeName(tokensOrName);
        const command = commands.find((candidate) => normalizeName(candidate.name) === normalized);
        return command ? { command, consumed: 1 } : undefined;
    }
    const [first] = tokensOrName;
    if (!first)
        return undefined;
    const direct = findCommand(first);
    if (direct)
        return direct;
    let best;
    for (const command of commands) {
        for (const alias of command.aliases ?? []) {
            if (alias.length <= (best?.consumed ?? 0))
                continue;
            if (alias.every((part, index) => normalizeName(tokensOrName[index] ?? "") === normalizeName(part))) {
                best = { command, consumed: alias.length };
            }
        }
    }
    return best;
}
export function commandsForProduct(product) {
    return commands.filter((command) => command.product === product);
}
export function commandInputSchema(command) {
    const properties = {};
    const required = [];
    for (const input of command.params ?? []) {
        properties[input.name] = clean({
            type: jsonSchemaType(input.type),
            description: input.description,
        });
        if (input.required)
            required.push(input.name);
    }
    return clean({
        type: "object",
        properties,
        required: required.length ? required : undefined,
    });
}
export function validateCommandArgs(command, args) {
    for (const input of command.params ?? []) {
        if (input.required && args[input.name] === undefined) {
            throw new Error(`Missing required option --${toKebabCase(input.name)}`);
        }
    }
}
export function toKebabCase(value) {
    return value
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/_/g, "-")
        .toLowerCase();
}
function normalizeName(value) {
    return value.replace(/-/g, "_").toLowerCase();
}
function jsonSchemaType(type) {
    if (type === "array")
        return "array";
    if (type === "object" || type === "json")
        return "object";
    return type ?? "string";
}
//# sourceMappingURL=registry.js.map