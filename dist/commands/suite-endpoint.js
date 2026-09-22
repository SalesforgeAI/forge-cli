import { z } from "zod";
import { contractEndpoint } from "./endpoint.js";
import { publicApiContracts } from "./contracts.js";
import { suiteOptions } from "./suite-options.js";
/** Build a product command while retaining its established input names and body wrappers. */
export function productEndpoint(product, name, group, subcommand, method, path, options = {}) {
    const contract = publicApiContracts[`${product} ${method} ${path}`];
    if (!contract)
        throw new Error(`Missing public API contract: ${product} ${method} ${path}`);
    const overrides = suiteOptions[name] ?? {};
    const names = { "Idempotency-Key": "idempotencyKey", with_credentials: "withCredentials", workspace_id: "workspaceId", ...options.names, ...overrides.names };
    const extra = {
        ...(options.legacyWorkspace ? { workspaceId: z.string().min(1).optional().describe("Required for account-wide keys; omit for legacy workspace-scoped keys") } : {}),
        ...options.extra, ...overrides.extra,
    };
    return contractEndpoint(product, contract, name, group, subcommand, method, path, {
        preserveNames: true, ...options, ...overrides, names, extra,
    });
}
//# sourceMappingURL=suite-endpoint.js.map