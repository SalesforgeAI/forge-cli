import type { CommandDefinition } from "../../types.js";
import { productEndpoint } from "../suite-endpoint.js";

export function warmforgeCommands(): CommandDefinition[] {
  return [
    productEndpoint("warmforge", "warmforge_list_workspaces", "workspaces", "list", "GET", "/workspaces", {"required":["page","page_size"]}),
    productEndpoint("warmforge", "warmforge_create_workspace", "workspaces", "create", "POST", "/workspaces", {"required":["name"]}),
    productEndpoint("warmforge", "warmforge_list_mailboxes", "mailboxes", "list", "GET", "/workspaces/{workspaceID}/mailboxes", {"legacyWorkspace":true,"names":{"workspaceID":"workspaceId"},"required":["page","page_size"]}),
    productEndpoint("warmforge", "warmforge_get_mailbox", "mailboxes", "get", "GET", "/workspaces/{workspaceID}/mailboxes/{address}", {"legacyWorkspace":true,"names":{"workspaceID":"workspaceId"},"required":["address"]}),
    productEndpoint("warmforge", "warmforge_connect_smtp_mailbox", "mailboxes", "connect-smtp", "POST", "/workspaces/{workspaceID}/mailboxes/connect-smtp", {"legacyWorkspace":true,"bodyKey":"body","names":{"workspaceID":"workspaceId"},"required":["body"]}),
    productEndpoint("warmforge", "warmforge_connect_oauth2_mailbox", "mailboxes", "connect-oauth2", "POST", "/workspaces/{workspaceID}/mailboxes/connect-oauth2", {"legacyWorkspace":true,"bodyKey":"body","names":{"workspaceID":"workspaceId"},"required":["body"]}),
    productEndpoint("warmforge", "warmforge_update_mailbox", "mailboxes", "update", "PATCH", "/workspaces/{workspaceID}/mailboxes/{address}", {"legacyWorkspace":true,"bodyKey":"body","names":{"workspaceID":"workspaceId"},"required":["address","body"]}),
    productEndpoint("warmforge", "warmforge_bulk_update_mailboxes", "mailboxes", "bulk-update", "POST", "/workspaces/{workspaceID}/mailboxes/bulk-update", {"legacyWorkspace":true,"bodyKey":"body","names":{"workspaceID":"workspaceId"},"required":["body"]}),
    productEndpoint("warmforge", "warmforge_delete_mailbox", "mailboxes", "delete", "DELETE", "/workspaces/{workspaceID}/mailboxes/{address}", {"legacyWorkspace":true,"names":{"workspaceID":"workspaceId"},"required":["address"]}),
    productEndpoint("warmforge", "warmforge_get_mailbox_warmup_stats", "mailboxes", "warmup-stats", "GET", "/workspaces/{workspaceID}/mailboxes/{address}/warmup/stats", {"legacyWorkspace":true,"names":{"workspaceID":"workspaceId"},"required":["address","from","to"]}),
    productEndpoint("warmforge", "warmforge_create_placement_test", "placement-tests", "create", "POST", "/workspaces/{workspaceID}/placement-tests", {"legacyWorkspace":true,"bodyKey":"body","names":{"workspaceID":"workspaceId"},"required":["body"]}),
    productEndpoint("warmforge", "warmforge_list_placement_tests", "placement-tests", "list", "GET", "/workspaces/{workspaceID}/placement-tests", {"legacyWorkspace":true,"names":{"workspaceID":"workspaceId"},"required":["page","size"]}),
    productEndpoint("warmforge", "warmforge_get_placement_test", "placement-tests", "get", "GET", "/workspaces/{workspaceID}/placement-tests/{placementTestID}", {"legacyWorkspace":true,"names":{"workspaceID":"workspaceId"},"required":["placementTestID"]}),
    productEndpoint("warmforge", "warmforge_delete_placement_test", "placement-tests", "delete", "DELETE", "/workspaces/{workspaceID}/placement-tests/{placementTestID}", {"legacyWorkspace":true,"names":{"workspaceID":"workspaceId"},"required":["placementTestID"]}),
    productEndpoint("warmforge", "warmforge_get_latest_mailbox_placement_results", "placement-tests", "latest-mailbox-results", "POST", "/workspaces/{workspaceID}/mailboxes/placement-results/latest", {"legacyWorkspace":true,"names":{"workspaceID":"workspaceId"},"required":["mailboxIds"]}),
  ];
}
