import { z } from "zod";
const strings = z.array(z.string());
const positive = z.number().int().positive();
const connection = z.object({
    host: z.string().min(1), port: positive.max(65535), username: z.string().min(1), password: z.string().min(1),
}).strict();
const credentials = {
    password: z.string().min(1),
    proxy: z.object({ host: z.string().min(1), port: positive, username: z.string().optional(), password: z.string().optional() }).strict().optional(),
};
const profile = z.object({ name: z.string().min(1), mailboxIds: strings.optional(), linkedinAccountId: positive.optional() }).strict();
// Explicit compatibility mappings and constraints not fully represented in generated OpenAPI.
export const endpointOptions = {
    list_contacts: {
        names: { "validation_statuses[]": "validationStatuses" },
        excludeQuery: ["tagIds", "notInSequenceId", "validationStatus"],
        extra: { hasValidLinkedIn: z.boolean().optional(), notInEsps: strings.optional() },
        query: { hasValidLinkedIn: "has_valid_linkedin", notInEsps: "not_in_esps[]" },
    },
    bulk_create_contacts: { description: "Create or update 1–100 contacts matched by email or LinkedIn URL. Each entry requires tags or tagIds.", refine: (a, ctx) => {
            if (!Array.isArray(a.contacts) || !a.contacts.length)
                ctx.addIssue({ code: "custom", path: ["contacts"], message: "Provide 1–100 contacts" });
        } },
    list_mailboxes: {
        extra: { status: z.enum(["active", "access_lost", "pending"]).optional() },
        query: { status: "statuses[]" },
    },
    connect_mailbox: { extra: { smtp: connection, imap: connection } },
    update_mailbox_connection_settings: {
        extra: { smtp: connection.optional(), imap: connection.optional() },
        refine: (a, ctx) => {
            if (a.smtp === undefined && a.imap === undefined)
                ctx.addIssue({ code: "custom", message: "Provide smtp or imap settings" });
        },
    },
    delete_mailbox: { description: "Delete the Salesforge mailbox connection. The provider email account remains available." },
    download_email_attachments: { raw: true },
    download_email_attachment: { raw: true },
    download_linkedin_attachments: { raw: true },
    download_linkedin_attachment: { raw: true },
    reply_to_email: {
        names: { content: "body", ccs: "cc", bccs: "bcc" },
        extra: { body: z.string().min(1) },
        description: "Queue an email reply. HTML is supported; include the mailbox signature in the body if wanted. Supports attachments with filename, contentType, and contentBase64.",
    },
    list_primebox_threads: { names: { q: "searchQuery" }, extra: { isUnread: z.boolean().optional() }, query: { isUnread: "isUnread" } },
    create_webhook: { names: { sequenceID: "sequenceId" } },
    list_sequences: {
        extra: { offset: z.number().int().nonnegative().optional().describe("Compatibility offset; must be a multiple of limit. Prefer page.") },
        pageOffset: true,
        refine: (a, ctx) => {
            if (a.offset !== undefined && a.page !== undefined)
                ctx.addIssue({ code: "custom", message: "Use page or offset, not both" });
            if (a.offset !== undefined && Number(a.offset) % Number(a.limit ?? 20) !== 0)
                ctx.addIssue({ code: "custom", path: ["offset"], message: "Must be a multiple of limit; use page for multichannel pagination" });
        },
    },
    launch_sequence: { emptyBody: true },
    update_sequence_settings: { bodyKey: "settings" },
    update_sender_profile: {
        bodyKey: "updates",
        extra: { updates: profile.partial().extend({ linkedinAccountId: positive.nullable().optional() }) },
        description: "Update name or mailboxIds, or attach a LinkedIn account to an unlinked sender profile. Omitted fields remain unchanged; null leaves the LinkedIn association unchanged.",
    },
    delete_sender_profile: { description: "Delete a sender profile and its attached LinkedIn account, if any." },
    create_sender_profile: { extra: profile.shape },
    bulk_create_sender_profiles: { extra: { profiles: z.array(profile).min(1).max(100) } },
    connect_linkedin_account: { extra: { ...credentials, email: z.email() } },
    reconnect_linkedin_account: { extra: { ...credentials, email: z.email().optional() } },
    disconnect_linkedin_account: { description: "Disconnect a LinkedIn session while preserving its account, sender-profile association, limits, and history." },
    enroll_contacts: { description: "Deprecated: enroll matching contacts immediately. Prefer preflight_enrollments and confirm_enrollment_preflight to review conflicts first.", extra: { limit: positive.optional() } },
    remove_enrollments: { extra: { limit: positive.optional() } },
    preflight_enrollments: {
        extra: { limit: positive.optional() },
        description: "Check candidates and save an enrollment preflight for 15 minutes. Provide filters or limit. Review conflicts, then confirm with skip or move. Enrollment does not launch a draft sequence.",
        refine: (a, ctx) => {
            if (a.limit === undefined && (!a.filters || !Object.keys(a.filters).length))
                ctx.addIssue({ code: "custom", message: "Provide at least one filter or a limit" });
        },
    },
    preview_enrollment_move: { extra: { moveSourceSequenceIds: z.array(positive).optional() } },
    confirm_enrollment_preflight: {
        extra: { moveSourceSequenceIds: z.array(positive).optional() },
        refine: (a, ctx) => {
            if (a.action === "move" && a.skipReplied === undefined)
                ctx.addIssue({ code: "custom", path: ["skipReplied"], message: "Required when action is move" });
        },
    },
    start_email_validation: {
        defaults: { strict: false }, extra: { limit: positive.optional() },
        description: "Start an email validation run with non-empty contact filters. strict defaults to false, returning a completed empty run when matched contacts cannot be validated. Set strict=true to fail instead.",
        refine: (a, ctx) => {
            if (!a.filters || !Object.keys(a.filters).length)
                ctx.addIssue({ code: "custom", path: ["filters"], message: "Provide non-empty contact filters" });
        },
    },
    assign_subsequence: { names: { sequenceID: "parentSequenceId" } },
    list_subsequence_members: { extra: { page: positive.optional(), limit: positive.max(100).optional() } },
    legacy_sequences_update: { bodyKey: "updates" },
};
//# sourceMappingURL=options.js.map