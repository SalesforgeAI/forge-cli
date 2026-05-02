import type { CommandDefinition, ProductId } from "../../types.js";
import { api, cmd, encStr, param, pick } from "../common.js";

export function warmforgeCommands(): CommandDefinition[] {
  const product: ProductId = "warmforge";
  return [
    cmd({ name: "warmforge_list_mailboxes", product, group: "mailboxes", subcommand: "list", description: "List Warmforge mailboxes.", params: [param("page", "number", true), param("page_size", "number", true), param("search"), param("status"), param("external_reference")], request: (a) => api(product, "GET", "/mailboxes", { query: pick(a, ["page", "page_size", "search", "status", "external_reference"]) }) }),
    cmd({ name: "warmforge_get_mailbox", product, group: "mailboxes", subcommand: "get", description: "Get a Warmforge mailbox by email.", params: [param("address", "string", true)], request: (a) => api(product, "GET", `/mailboxes/${encStr(a.address)}`) }),
    cmd({ name: "warmforge_connect_smtp_mailbox", product, group: "mailboxes", subcommand: "connect-smtp", description: "Connect an SMTP mailbox.", params: [param("body", "object", true)], request: (a) => api(product, "POST", "/mailboxes/connect-smtp", { body: a.body }) }),
    cmd({ name: "warmforge_connect_oauth2_mailbox", product, group: "mailboxes", subcommand: "connect-oauth2", description: "Connect an OAuth2 mailbox.", params: [param("body", "object", true)], request: (a) => api(product, "POST", "/mailboxes/connect-oauth2", { body: a.body }) }),
    cmd({ name: "warmforge_update_mailbox", product, group: "mailboxes", subcommand: "update", description: "Update a Warmforge mailbox.", params: [param("address", "string", true), param("body", "object", true)], request: (a) => api(product, "PATCH", `/mailboxes/${encStr(a.address)}`, { body: a.body }) }),
    cmd({ name: "warmforge_bulk_update_mailboxes", product, group: "mailboxes", subcommand: "bulk-update", description: "Bulk update Warmforge mailboxes.", params: [param("body", "object", true)], request: (a) => api(product, "POST", "/mailboxes/bulk-update", { body: a.body }) }),
    cmd({ name: "warmforge_delete_mailbox", product, group: "mailboxes", subcommand: "delete", description: "Delete a Warmforge mailbox.", params: [param("address", "string", true)], request: (a) => api(product, "DELETE", `/mailboxes/${encStr(a.address)}`) }),
    cmd({ name: "warmforge_get_mailbox_warmup_stats", product, group: "mailboxes", subcommand: "warmup-stats", description: "Get Warmforge mailbox warmup stats.", params: [param("address", "string", true)], request: (a) => api(product, "GET", `/mailboxes/${encStr(a.address)}/warmup/stats`) }),
    cmd({ name: "warmforge_create_placement_test", product, group: "placement-tests", subcommand: "create", description: "Create a placement test.", params: [param("body", "object", true)], request: (a) => api(product, "POST", "/placement-tests", { body: a.body }) }),
    cmd({ name: "warmforge_list_placement_tests", product, group: "placement-tests", subcommand: "list", description: "List placement tests.", params: [param("page", "number", true), param("size", "number", true), param("search"), param("external_reference")], request: (a) => api(product, "GET", "/placement-tests", { query: pick(a, ["page", "size", "search", "external_reference"]) }) }),
    cmd({ name: "warmforge_get_placement_test", product, group: "placement-tests", subcommand: "get", description: "Get a placement test.", params: [param("placementTestID", "string", true)], request: (a) => api(product, "GET", `/placement-tests/${encStr(a.placementTestID)}`) }),
    cmd({ name: "warmforge_delete_placement_test", product, group: "placement-tests", subcommand: "delete", description: "Delete a placement test.", params: [param("placementTestID", "string", true)], request: (a) => api(product, "DELETE", `/placement-tests/${encStr(a.placementTestID)}`) }),
  ];
}
