import { CliError } from "./errors.js";
import { getProduct, SALESFORGE_CORE_BASE_URL, SALESFORGE_MULTICHANNEL_BASE_URL, } from "./types.js";
export class ApiExecutor {
    keys;
    timeoutMs;
    fetchImpl;
    constructor(options) {
        this.keys = options.keys;
        this.timeoutMs = options.timeoutMs ?? 30_000;
        this.fetchImpl = options.fetchImpl ?? fetch;
    }
    async execute(request) {
        const product = getProduct(request.product);
        const key = this.keys[request.product];
        if (!key) {
            throw new CliError(`${product.displayName} API key is required`, {
                code: "AUTH_ERROR",
                exitCode: 3,
            });
        }
        const url = buildUrl(this.baseUrlFor(request), request.path, request.query);
        const headers = {
            Authorization: product.authScheme === "bearer" ? withBearerPrefix(key) : key,
            Accept: request.raw ? "*/*" : "application/json",
            "X-Source": "forge-cli",
        };
        const init = {
            method: request.method,
            headers,
        };
        if (request.body !== undefined) {
            headers["Content-Type"] = "application/json";
            init.body = JSON.stringify(request.body);
        }
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
        init.signal = controller.signal;
        let response;
        try {
            response = await this.fetchImpl(url, init);
        }
        catch (error) {
            if (error instanceof Error && error.name === "AbortError") {
                throw new CliError(`API request timed out after ${this.timeoutMs}ms`, {
                    code: "REQUEST_TIMEOUT",
                    exitCode: 1,
                });
            }
            throw new CliError(error instanceof Error ? error.message : String(error), {
                code: "NETWORK_ERROR",
                exitCode: 1,
            });
        }
        finally {
            clearTimeout(timeout);
        }
        if (!response.ok) {
            const body = await response.text();
            throw new CliError(`${product.displayName} API error ${response.status}: ${body}`, {
                code: response.status === 401 || response.status === 403 ? "AUTH_ERROR" : "API_ERROR",
                exitCode: response.status === 401 || response.status === 403 ? 3 : 1,
                details: { status: response.status, body },
            });
        }
        if (response.status === 204)
            return {};
        if (request.raw) {
            const buffer = await response.arrayBuffer();
            return {
                contentType: response.headers.get("content-type") ?? "application/octet-stream",
                data: Buffer.from(buffer).toString("base64"),
            };
        }
        const text = await response.text();
        if (!text.trim())
            return undefined;
        return JSON.parse(text);
    }
    baseUrlFor(request) {
        if (request.product === "salesforge" && request.salesforgeApi === "multichannel") {
            return SALESFORGE_MULTICHANNEL_BASE_URL;
        }
        if (request.product === "salesforge")
            return SALESFORGE_CORE_BASE_URL;
        return getProduct(request.product).baseUrl;
    }
}
function buildUrl(baseUrl, path, query) {
    const url = new URL(`${baseUrl}${path}`);
    for (const [key, value] of Object.entries(query ?? {})) {
        if (Array.isArray(value)) {
            for (const item of value)
                url.searchParams.append(key, String(item));
        }
        else if (value !== undefined && value !== null && value !== "") {
            url.searchParams.append(key, String(value));
        }
    }
    return url.toString();
}
function withBearerPrefix(key) {
    return key.toLowerCase().startsWith("bearer ") ? key : `Bearer ${key}`;
}
//# sourceMappingURL=api.js.map