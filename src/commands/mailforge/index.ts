import type { CommandDefinition } from "../../types.js";
import { productEndpoint } from "../suite-endpoint.js";

export function mailforgeCommands(): CommandDefinition[] {
  return [
    productEndpoint("mailforge", "mailforge_list_workspaces", "workspaces", "list", "GET", "/workspaces"),
    productEndpoint("mailforge", "mailforge_create_workspace", "workspaces", "create", "POST", "/workspaces", {"required":["name"]}),
    productEndpoint("mailforge", "mailforge_update_workspace", "workspaces", "update", "PATCH", "/workspaces/{workspaceID}", {"required":["workspaceID","name"]}),
    productEndpoint("mailforge", "mailforge_delete_workspace", "workspaces", "delete", "DELETE", "/workspaces/{workspaceID}", {"required":["workspaceID"]}),
    productEndpoint("mailforge", "mailforge_list_mailboxes", "mailboxes", "list", "GET", "/mailboxes"),
    productEndpoint("mailforge", "mailforge_get_mailbox", "mailboxes", "get", "GET", "/mailboxes/{mailboxID}", {"required":["mailboxID"]}),
    productEndpoint("mailforge", "mailforge_purchase_mailboxes", "mailboxes", "purchase", "POST", "/mailboxes", {"required":["mailboxes"]}),
    productEndpoint("mailforge", "mailforge_update_mailbox", "mailboxes", "update", "PATCH", "/mailboxes/{mailboxID}", {"required":["mailboxID"]}),
    productEndpoint("mailforge", "mailforge_delete_mailbox", "mailboxes", "delete", "DELETE", "/mailboxes/{mailboxID}", {"required":["mailboxID"]}),
    productEndpoint("mailforge", "mailforge_bulk_forward_mailboxes", "mailboxes", "bulk-forward", "POST", "/mailboxes/bulk-forward", {"required":["forwardingEmail"]}),
    productEndpoint("mailforge", "mailforge_adjust_topup_amount", "mailboxes", "adjust-topup", "POST", "/adjust-mailbox-topup-amount", {"required":["amount"]}),
    productEndpoint("mailforge", "mailforge_list_domains", "domains", "list", "GET", "/domains"),
    productEndpoint("mailforge", "mailforge_purchase_domains", "domains", "purchase", "POST", "/domains", {"required":["domains","workspaceId","contactDetails"]}),
    productEndpoint("mailforge", "mailforge_check_domain_availability", "domains", "check", "GET", "/check-domain-availability", {"required":["domain"]}),
    productEndpoint("mailforge", "mailforge_check_domain_availability_bulk", "domains", "check-bulk", "POST", "/check-domain-availability-bulk", {"required":["domains"]}),
    productEndpoint("mailforge", "mailforge_transfer_domains", "domains", "transfer", "POST", "/domains/transfer", {"required":["domains","workspaceId"]}),
    productEndpoint("mailforge", "mailforge_get_domain_dns", "domains", "dns", "GET", "/domains/{domainID}/dns", {"required":["domainID"]}),
    productEndpoint("mailforge", "mailforge_update_domain_dns", "domains", "update-dns", "PUT", "/domains/{domainID}/dns", {"required":["domainID","records"]}),
    productEndpoint("mailforge", "mailforge_bulk_dns_update", "domains", "bulk-dns", "PUT", "/domains/bulk-dns", {"required":["domains"]}),
    productEndpoint("mailforge", "mailforge_enable_autorenew", "domains", "enable-autorenew", "PUT", "/domains/{domainID}/enable-autorenew", {"required":["domainID"]}),
    productEndpoint("mailforge", "mailforge_disable_autorenew", "domains", "disable-autorenew", "PUT", "/domains/{domainID}/disable-autorenew", {"required":["domainID"]}),
    productEndpoint("mailforge", "mailforge_bulk_enable_autorenew", "domains", "bulk-enable-autorenew", "POST", "/domains/bulk-enable-autorenew", {"required":["domainIds"]}),
    productEndpoint("mailforge", "mailforge_bulk_disable_autorenew", "domains", "bulk-disable-autorenew", "POST", "/domains/bulk-disable-autorenew", {"required":["domainIds"]}),
    productEndpoint("mailforge", "mailforge_update_domain_forwards", "domains", "update-forwards", "PATCH", "/domains/forwards", {"bodyKey":"forwards","required":["forwards"]}),
    productEndpoint("mailforge", "mailforge_purchase_domain_masking", "domains", "purchase-masking", "POST", "/domains/masking", {"required":["domainIds","purchaseMasking"]}),
    productEndpoint("mailforge", "mailforge_delete_domain_masking", "domains", "delete-masking", "DELETE", "/domains/{domainID}/masking", {"required":["domainID"]}),
    productEndpoint("mailforge", "mailforge_get_alternative_domains", "domains", "alternatives", "POST", "/domains/alternative-domains"),
    productEndpoint("mailforge", "mailforge_get_domain_extra_fields", "domains", "extra-fields", "GET", "/domains/extra-fields"),
    productEndpoint("mailforge", "mailforge_purchase_prewarmed_domains", "domains", "purchase-prewarmed", "POST", "/domains/pre-warmed"),
    productEndpoint("mailforge", "mailforge_list_prewarmed_domains", "domains", "prewarmed", "GET", "/mailboxes/pre-warmed"),
  ];
}
