import { SALESFORGE_MULTICHANNEL_BASE_URL } from "../../types.js";
import { cmd } from "../common.js";
import { contractEndpoint } from "../endpoint.js";
import { publicApiContracts } from "../contracts.js";
/** Adapt Salesforge and multichannel contracts to the shared endpoint builder. */
export function endpoint(name, group, subcommand, method, path, options = {}) {
    const service = path.startsWith("/multichannel/") ? "multichannel" : "salesforge";
    const contract = publicApiContracts[`${service} ${method} ${path}`];
    if (!contract)
        throw new Error(`Missing public API contract: ${method} ${path}`);
    const command = contractEndpoint("salesforge", contract, name, group, subcommand, method, path, options);
    const request = command.request;
    return service === "salesforge" ? command : { ...command, request: (args) => ({ ...request(args), baseUrl: SALESFORGE_MULTICHANNEL_BASE_URL }) };
}
/** Clone an upsert command under its existing MCP update name and grouped alias. */
export function upsertAlias(command, name, subcommand) {
    const { aliases: _, ...definition } = command;
    return cmd({ ...definition, name, subcommand, description: `${command.description} Existing contacts matched by email or LinkedIn URL are updated.` });
}
//# sourceMappingURL=endpoint.js.map