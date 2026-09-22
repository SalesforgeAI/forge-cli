import { z } from "zod";
import type { JsonObject } from "../types.js";
import type { EndpointOptions } from "./endpoint.js";

const platforms = z.enum(["salesforge", "warmforge", "instantly", "smartlead", "emailbison", "lemlist", "replyio", "snovio", "woodpecker"]);
const exportAliases: Record<string, string> = { sf: "salesforge", wf: "warmforge", inst: "instantly", sl: "smartlead", reply_io: "replyio" };

/** Reject formerly advertised inputs which the public handlers do not consume. */
function unsupported(args: JsonObject, ctx: z.RefinementCtx, keys: string[]): void {
  for (const key of keys) if (args[key] !== undefined) ctx.addIssue({ code: "custom", path: [key], message: "Not supported by this public API; use the documented filters" });
}

/** Require exactly one of the public enrichment identity representations. */
function enrichmentIdentity(args: JsonObject, ctx: z.RefinementCtx): void {
  const ids = Array.isArray(args.personIDs) && args.personIDs.length > 0;
  const people = Array.isArray(args.people) && args.people.length > 0;
  if (ids === people) ctx.addIssue({ code: "custom", message: "Provide exactly one of personIDs or people" });
}

/** Require one identity for synchronous enrichment without silently combining people. */
function syncIdentity(args: JsonObject, ctx: z.RefinementCtx): void {
  const identities = [Boolean(args.personID), Boolean(args.linkedinURL), Boolean(args.firstName && args.lastName && (args.companyDomain || args.company))];
  if (identities.filter(Boolean).length !== 1) ctx.addIssue({ code: "custom", message: "Provide exactly one identity: personID, linkedinURL, or firstName + lastName + companyDomain/company" });
}

export const suiteOptions: Record<string, EndpointOptions> = {
  primeforge_set_domain_forwarding: { names: { forwardingUrl: "forwardToDomain" } },
  primeforge_export_mailboxes: {
    extra: { platform: platforms.optional(), exportType: z.string().optional().describe("Compatibility alias for platform (sf, wf, inst and sl are accepted)"), search: z.string().optional() },
    prepare: (args) => ({ ...args, ...(args.platform === undefined && args.exportType !== undefined ? { platform: exportAliases[String(args.exportType)] ?? args.exportType } : {}) }),
    refine: (args, ctx) => {
      if (!platforms.safeParse(args.platform).success) ctx.addIssue({ code: "custom", path: ["platform"], message: "Provide a supported export platform" });
      if (args.exportType !== undefined && (exportAliases[String(args.exportType)] ?? args.exportType) !== args.platform) ctx.addIssue({ code: "custom", message: "platform and exportType must agree" });
      unsupported(args, ctx, ["search"]);
    },
  },
  primeforge_export_to_salesforge: {
    extra: { exportType: z.enum(["sf", "salesforge"]).optional().describe("Deprecated; this command always exports to Salesforge") },
  },
  primeforge_get_mailboxes_by_ids: { extra: { mailboxIds: z.array(z.string().min(1)).min(1).max(100) } },
  primeforge_get_mailboxes_by_addresses: { extra: { addresses: z.array(z.string().min(1)).min(1).max(100) } },
  infraforge_list_domains: {
    extra: { workspaceId: z.string().optional().describe("Unsupported by the public API; use search") },
    refine: (args, ctx) => unsupported(args, ctx, ["workspaceId"]),
  },
  infraforge_list_mailboxes: {
    extra: { page: z.number().optional().describe("Unsupported; this API returns the matching collection"), size: z.number().optional().describe("Unsupported; this API returns the matching collection") },
    refine: (args, ctx) => unsupported(args, ctx, ["page", "size"]),
  },
  infraforge_export_mailboxes: { text: true, description: "Export mailbox credentials as CSV. Use --raw to print the CSV directly." },
  leadsforge_search: { prepare: (args) => args.cursor ? { cursor: args.cursor } : args },
  leadsforge_enrich_emails: { refine: enrichmentIdentity },
  leadsforge_enrich_phones: { refine: enrichmentIdentity },
  leadsforge_enrich_linkedin: { refine: enrichmentIdentity },
  leadsforge_enrich_email: { refine: syncIdentity },
  leadsforge_enrich_phone: { refine: syncIdentity },
  leadsforge_get_enrichment_results: { extra: { limit: z.number().int().min(1).max(500).optional() }, queryDefaults: { limit: 100 } },
  leadsforge_search_lookalikes: { defaults: { page: 1, pageSize: 25 } },
};
