const enc = encodeURIComponent;
const pagingParams = [param("limit", "number"), param("offset", "number")];
const enrichmentParams = [param("personIDs", "array"), param("people", "array"), param("webhookURL"), param("clientRequestID")];
export const commands = [
    // Salesforge: identity, workspaces, contacts
    cmd({
        name: "get_me",
        product: "salesforge",
        group: "identity",
        subcommand: "me",
        description: "Validate API key and get current account info.",
        request: () => sfCore("GET", "/me"),
    }),
    cmd({
        name: "list_workspaces",
        product: "salesforge",
        group: "workspaces",
        subcommand: "list",
        description: "List Salesforge workspaces.",
        params: pagingParams,
        request: (a) => sfCore("GET", "/workspaces", { query: pick(a, ["limit", "offset"]) }),
    }),
    cmd({
        name: "create_workspace",
        product: "salesforge",
        group: "workspaces",
        subcommand: "create",
        description: "Create a Salesforge workspace.",
        params: [param("name", "string", true, "Workspace name")],
        request: (a) => sfCore("POST", "/workspaces", { body: pick(a, ["name"]) }),
    }),
    cmd({
        name: "get_workspace",
        product: "salesforge",
        group: "workspaces",
        subcommand: "get",
        description: "Get Salesforge workspace details.",
        params: [param("workspaceId", "string", true, "Workspace ID")],
        request: (a) => sfCore("GET", `/workspaces/${encStr(a.workspaceId)}`),
    }),
    cmd({
        name: "list_contacts",
        product: "salesforge",
        group: "contacts",
        subcommand: "list",
        description: "List contacts in a workspace with optional filters.",
        params: [
            param("workspaceId", "string", true, "Workspace ID"),
            ...pagingParams,
            param("tagIds", "string", false, "Comma-separated tag IDs"),
            param("validationStatus", "string", false, "Validation status filter"),
        ],
        request: (a) => sfCore("GET", `/workspaces/${encStr(a.workspaceId)}/contacts`, {
            query: pick(a, ["limit", "offset", "tagIds", "validationStatus"]),
        }),
    }),
    cmd({
        name: "create_contact",
        product: "salesforge",
        group: "contacts",
        subcommand: "create",
        description: "Create a contact in a Salesforge workspace.",
        params: [
            param("workspaceId", "string", true, "Workspace ID"),
            param("firstName", "string", true, "First name"),
            param("lastName"),
            param("email"),
            param("company"),
            param("position"),
            param("linkedinUrl"),
            param("tags", "array"),
            param("tagIds", "array"),
            param("customVars", "object"),
        ],
        request: (a) => sfCore("POST", `/workspaces/${encStr(a.workspaceId)}/contacts`, {
            body: omit(a, ["workspaceId"]),
        }),
    }),
    cmd({
        name: "bulk_create_contacts",
        product: "salesforge",
        group: "contacts",
        subcommand: "bulk-create",
        description: "Create up to 100 contacts in a workspace.",
        params: [param("workspaceId", "string", true), param("contacts", "array", true)],
        request: (a) => sfCore("POST", `/workspaces/${encStr(a.workspaceId)}/contacts/bulk`, {
            body: pick(a, ["contacts"]),
        }),
    }),
    cmd({
        name: "get_contact",
        product: "salesforge",
        group: "contacts",
        subcommand: "get",
        description: "Get a contact by ID.",
        params: [param("workspaceId", "string", true), param("contactId", "string", true)],
        request: (a) => sfCore("GET", `/workspaces/${encStr(a.workspaceId)}/contacts/${encStr(a.contactId)}`),
    }),
    // Salesforge: mailboxes, threads, DNC, variables, webhooks
    cmd({
        name: "list_mailboxes",
        product: "salesforge",
        group: "mailboxes",
        subcommand: "list",
        description: "List mailboxes in a Salesforge workspace.",
        params: [param("workspaceId", "string", true), ...pagingParams, param("search"), param("status")],
        request: (a) => sfCore("GET", `/workspaces/${encStr(a.workspaceId)}/mailboxes`, {
            query: pick(a, ["limit", "offset", "search", "status"]),
        }),
    }),
    cmd({
        name: "get_mailbox",
        product: "salesforge",
        group: "mailboxes",
        subcommand: "get",
        description: "Get mailbox details by ID.",
        params: [param("workspaceId", "string", true), param("mailboxId", "string", true)],
        request: (a) => sfCore("GET", `/workspaces/${encStr(a.workspaceId)}/mailboxes/${encStr(a.mailboxId)}`),
    }),
    cmd({
        name: "download_email_attachments",
        product: "salesforge",
        group: "mailboxes",
        subcommand: "download-attachments",
        description: "Download all attachments from an email as base64 ZIP data.",
        params: [param("workspaceId", "string", true), param("mailboxId", "string", true), param("emailId", "string", true)],
        request: (a) => sfCore("GET", `/workspaces/${encStr(a.workspaceId)}/mailboxes/${encStr(a.mailboxId)}/emails/${encStr(a.emailId)}/attachments`, { raw: true }),
    }),
    cmd({
        name: "download_email_attachment",
        product: "salesforge",
        group: "mailboxes",
        subcommand: "download-attachment",
        description: "Download a single email attachment as base64 data.",
        params: [
            param("workspaceId", "string", true),
            param("mailboxId", "string", true),
            param("emailId", "string", true),
            param("contentId", "string", true),
        ],
        request: (a) => sfCore("GET", `/workspaces/${encStr(a.workspaceId)}/mailboxes/${encStr(a.mailboxId)}/emails/${encStr(a.emailId)}/attachments/${encStr(a.contentId)}`, { raw: true }),
    }),
    cmd({
        name: "reply_to_email",
        product: "salesforge",
        group: "mailboxes",
        subcommand: "reply",
        description: "Send a reply to an email thread.",
        params: [
            param("workspaceId", "string", true),
            param("mailboxId", "string", true),
            param("emailId", "string", true),
            param("body", "string", true, "Reply body; HTML supported"),
            param("includeHistory", "boolean"),
            param("cc", "array"),
            param("bcc", "array"),
        ],
        request: (a) => sfCore("POST", `/workspaces/${encStr(a.workspaceId)}/mailboxes/${encStr(a.mailboxId)}/emails/${encStr(a.emailId)}/reply`, {
            body: clean({ content: a.body, includeHistory: a.includeHistory, ccs: a.cc, bccs: a.bcc }),
        }),
    }),
    cmd({
        name: "list_primebox_threads",
        product: "salesforge",
        group: "threads",
        subcommand: "list",
        description: "List primebox threads in a workspace.",
        params: [
            param("workspaceId", "string", true),
            param("positive", "boolean"),
            param("filter"),
            param("labels", "array"),
            param("excludeLabels", "array"),
            param("mailboxIds", "array"),
            param("sequenceIds", "array"),
            param("searchQuery"),
            ...pagingParams,
            param("isUnread", "boolean"),
        ],
        request: (a) => {
            const query = pick(a, ["positive", "filter", "limit", "offset", "isUnread"]);
            if (a.searchQuery !== undefined)
                query.q = a.searchQuery;
            appendArrayQuery(query, "labels[]", a.labels);
            appendArrayQuery(query, "exclude_labels[]", a.excludeLabels);
            appendArrayQuery(query, "mailbox_ids[]", a.mailboxIds);
            appendArrayQuery(query, "sequence_ids[]", a.sequenceIds);
            return sfCore("GET", `/workspaces/${encStr(a.workspaceId)}/threads`, { query });
        },
    }),
    cmd({
        name: "get_thread",
        product: "salesforge",
        group: "threads",
        subcommand: "get",
        description: "Get full thread details including emails and contact context.",
        params: [param("workspaceId", "string", true), param("mailboxId", "string", true), param("threadId", "string", true)],
        request: (a) => sfCore("GET", `/workspaces/${encStr(a.workspaceId)}/mailboxes/${encStr(a.mailboxId)}/threads/${encStr(a.threadId)}`),
    }),
    cmd({
        name: "list_primebox_labels",
        product: "salesforge",
        group: "threads",
        subcommand: "labels",
        description: "List primebox labels for a workspace.",
        params: [param("workspaceId", "string", true), ...pagingParams],
        request: (a) => sfCore("GET", `/workspaces/${encStr(a.workspaceId)}/primebox-labels`, {
            query: pick(a, ["limit", "offset"]),
        }),
    }),
    cmd({
        name: "update_thread_label",
        product: "salesforge",
        group: "threads",
        subcommand: "label",
        description: "Update the label of a thread.",
        params: [param("workspaceId", "string", true), param("mailboxId", "string", true), param("threadId", "string", true), param("labelId", "string", true)],
        request: (a) => sfCore("PUT", `/workspaces/${encStr(a.workspaceId)}/mailboxes/${encStr(a.mailboxId)}/threads/${encStr(a.threadId)}/label`, {
            body: pick(a, ["labelId"]),
        }),
    }),
    cmd({
        name: "add_dnc_entries",
        product: "salesforge",
        group: "dnc",
        subcommand: "add",
        description: "Add Do-Not-Contact entries to a workspace.",
        params: [param("workspaceId", "string", true), param("dncs", "array", true)],
        request: (a) => sfCore("POST", `/workspaces/${encStr(a.workspaceId)}/dnc/bulk`, { body: pick(a, ["dncs"]) }),
    }),
    cmd({
        name: "list_custom_variables",
        product: "salesforge",
        group: "custom-vars",
        subcommand: "list",
        description: "List custom variables in a workspace.",
        params: [param("workspaceId", "string", true)],
        request: (a) => sfCore("GET", `/workspaces/${encStr(a.workspaceId)}/custom-vars`),
    }),
    cmd({
        name: "list_webhooks",
        product: "salesforge",
        group: "webhooks",
        subcommand: "list",
        description: "List webhooks in a workspace.",
        params: [param("workspaceId", "string", true)],
        request: (a) => sfCore("GET", `/workspaces/${encStr(a.workspaceId)}/integrations/webhooks`),
    }),
    cmd({
        name: "create_webhook",
        product: "salesforge",
        group: "webhooks",
        subcommand: "create",
        description: "Create a webhook in a workspace.",
        params: [param("workspaceId", "string", true), param("name", "string", true), param("url", "string", true), param("type", "string", true), param("sequenceId")],
        request: (a) => sfCore("POST", `/workspaces/${encStr(a.workspaceId)}/integrations/webhooks`, {
            body: clean({ name: a.name, url: a.url, type: a.type, sequenceID: a.sequenceId }),
        }),
    }),
    cmd({
        name: "get_webhook",
        product: "salesforge",
        group: "webhooks",
        subcommand: "get",
        description: "Get webhook details by ID.",
        params: [param("workspaceId", "string", true), param("webhookId", "string", true)],
        request: (a) => sfCore("GET", `/workspaces/${encStr(a.workspaceId)}/integrations/webhooks/${encStr(a.webhookId)}`),
    }),
    // Salesforge: multichannel sequences
    cmd({
        name: "list_sequences",
        product: "salesforge",
        group: "sequences",
        subcommand: "list",
        description: "List multichannel sequences in a workspace.",
        params: [param("workspaceId", "string", true), ...pagingParams],
        request: (a) => sfMc("GET", `/multichannel/workspaces/${encStr(a.workspaceId)}/sequences`, { query: pick(a, ["limit", "offset"]) }),
    }),
    cmd({
        name: "create_sequence",
        product: "salesforge",
        group: "sequences",
        subcommand: "create",
        description: "Create a multichannel sequence.",
        params: [param("workspaceId", "string", true), param("name", "string", true), param("description"), param("timezone")],
        request: (a) => sfMc("POST", `/multichannel/workspaces/${encStr(a.workspaceId)}/sequences`, { body: omit(a, ["workspaceId"]) }),
    }),
    cmd({
        name: "get_sequence",
        product: "salesforge",
        group: "sequences",
        subcommand: "get",
        description: "Get multichannel sequence details.",
        params: [param("workspaceId", "string", true), param("sequenceId", "string", true)],
        request: (a) => sfMc("GET", seqPath(a)),
    }),
    cmd({
        name: "update_sequence",
        product: "salesforge",
        group: "sequences",
        subcommand: "update",
        description: "Update a multichannel sequence.",
        params: [param("workspaceId", "string", true), param("sequenceId", "string", true), param("name"), param("description"), param("timezone")],
        request: (a) => sfMc("PATCH", seqPath(a), { body: omit(a, ["workspaceId", "sequenceId"]) }),
    }),
    cmd({
        name: "delete_sequence",
        product: "salesforge",
        group: "sequences",
        subcommand: "delete",
        description: "Delete a multichannel sequence.",
        params: [param("workspaceId", "string", true), param("sequenceId", "string", true)],
        request: (a) => sfMc("DELETE", seqPath(a)),
    }),
    cmd({
        name: "launch_sequence",
        product: "salesforge",
        group: "sequences",
        subcommand: "launch",
        description: "Launch a multichannel sequence.",
        params: [param("workspaceId", "string", true), param("sequenceId", "string", true)],
        request: (a) => sfMc("PATCH", `${seqPath(a)}/launch`, { body: {} }),
    }),
    cmd({
        name: "set_sequence_status",
        product: "salesforge",
        group: "sequences",
        subcommand: "status",
        description: "Set sequence status to active or paused.",
        params: [param("workspaceId", "string", true), param("sequenceId", "string", true), param("status", "string", true)],
        request: (a) => sfMc("PATCH", `${seqPath(a)}/status`, { body: pick(a, ["status"]) }),
    }),
    cmd({
        name: "get_sequence_schedule",
        product: "salesforge",
        group: "sequences",
        subcommand: "schedule",
        description: "Get sequence schedule.",
        params: [param("workspaceId", "string", true), param("sequenceId", "string", true)],
        request: (a) => sfMc("GET", `${seqPath(a)}/schedule`),
    }),
    cmd({
        name: "update_sequence_schedule",
        product: "salesforge",
        group: "sequences",
        subcommand: "update-schedule",
        description: "Update sequence schedule.",
        params: [param("workspaceId", "string", true), param("sequenceId", "string", true), param("timezone", "string", true), param("schedule", "object", true)],
        request: (a) => sfMc("PUT", `${seqPath(a)}/schedule`, { body: pick(a, ["timezone", "schedule"]) }),
    }),
    cmd({
        name: "get_sequence_settings",
        product: "salesforge",
        group: "sequences",
        subcommand: "settings",
        description: "Get sequence settings.",
        params: [param("workspaceId", "string", true), param("sequenceId", "string", true)],
        request: (a) => sfMc("GET", `${seqPath(a)}/settings`),
    }),
    cmd({
        name: "update_sequence_settings",
        product: "salesforge",
        group: "sequences",
        subcommand: "update-settings",
        description: "Update sequence settings.",
        params: [param("workspaceId", "string", true), param("sequenceId", "string", true), param("settings", "object", true)],
        request: (a) => sfMc("PATCH", `${seqPath(a)}/settings`, { body: a.settings }),
    }),
    cmd({
        name: "list_sequence_branches",
        product: "salesforge",
        group: "branches",
        subcommand: "list",
        description: "List branches in a multichannel sequence.",
        params: [param("workspaceId", "string", true), param("sequenceId", "string", true)],
        request: (a) => sfMc("GET", `${seqPath(a)}/branches`),
    }),
    cmd({
        name: "list_sequence_nodes",
        product: "salesforge",
        group: "nodes",
        subcommand: "list",
        description: "List nodes in a multichannel sequence.",
        params: [param("workspaceId", "string", true), param("sequenceId", "string", true)],
        request: (a) => sfMc("GET", `${seqPath(a)}/nodes`),
    }),
    cmd({
        name: "get_sequence_node",
        product: "salesforge",
        group: "nodes",
        subcommand: "get",
        description: "Get a sequence node.",
        params: [param("workspaceId", "string", true), param("sequenceId", "string", true), param("nodeId", "string", true)],
        request: (a) => sfMc("GET", `${seqPath(a)}/nodes/${encStr(a.nodeId)}`),
    }),
    cmd({
        name: "create_action_node",
        product: "salesforge",
        group: "nodes",
        subcommand: "create-action",
        description: "Create an action node in a multichannel sequence.",
        params: [param("workspaceId", "string", true), param("sequenceId", "string", true), param("branchId", "number", true), param("actionId", "number", true), param("waitDays", "number"), param("variants", "array"), param("distributionStrategy")],
        request: (a) => sfMc("POST", `${seqPath(a)}/nodes/actions`, { body: clean(pick(a, ["branchId", "actionId", "waitDays", "variants", "distributionStrategy"])) }),
    }),
    cmd({
        name: "update_action_node",
        product: "salesforge",
        group: "nodes",
        subcommand: "update-action",
        description: "Update an action node.",
        params: [param("workspaceId", "string", true), param("sequenceId", "string", true), param("nodeId", "string", true), param("wait_in_minutes", "number"), param("variants", "array"), param("distributionStrategy")],
        request: (a) => sfMc("PATCH", `${seqPath(a)}/nodes/actions/${encStr(a.nodeId)}`, { body: clean(pick(a, ["wait_in_minutes", "variants", "distributionStrategy"])) }),
    }),
    cmd({
        name: "create_condition_node",
        product: "salesforge",
        group: "nodes",
        subcommand: "create-condition",
        description: "Create a condition node in a multichannel sequence.",
        params: [param("workspaceId", "string", true), param("sequenceId", "string", true), param("branchId", "number", true), param("conditionId", "number", true), param("minutesToWait", "number"), param("distributionStrategy")],
        request: (a) => sfMc("POST", `${seqPath(a)}/nodes/conditions`, { body: clean(pick(a, ["branchId", "conditionId", "minutesToWait", "distributionStrategy"])) }),
    }),
    cmd({
        name: "delete_sequence_node",
        product: "salesforge",
        group: "nodes",
        subcommand: "delete",
        description: "Delete a sequence node.",
        params: [param("workspaceId", "string", true), param("sequenceId", "string", true), param("nodeId", "string", true)],
        request: (a) => sfMc("DELETE", `${seqPath(a)}/nodes/${encStr(a.nodeId)}`),
    }),
    cmd({
        name: "list_action_types",
        product: "salesforge",
        group: "reference",
        subcommand: "actions",
        description: "List action types for sequence nodes.",
        request: () => sfMc("GET", "/multichannel/actions"),
    }),
    cmd({
        name: "list_condition_types",
        product: "salesforge",
        group: "reference",
        subcommand: "conditions",
        description: "List condition types for sequence branching.",
        request: () => sfMc("GET", "/multichannel/conditions"),
    }),
    cmd({
        name: "list_sender_profiles",
        product: "salesforge",
        group: "sender-profiles",
        subcommand: "list",
        description: "List sender profiles in a workspace.",
        params: [param("workspaceId", "string", true)],
        request: (a) => sfMc("GET", senderProfilesPath(a)),
    }),
    cmd({
        name: "update_sender_profile",
        product: "salesforge",
        group: "sender-profiles",
        subcommand: "update",
        description: "Update a sender profile.",
        params: [param("workspaceId", "string", true), param("senderProfileId", "string", true), param("updates", "object", true)],
        request: (a) => sfMc("PATCH", senderProfilesPath(a, "senderProfileId"), { body: a.updates }),
    }),
    cmd({
        name: "delete_sender_profile",
        product: "salesforge",
        group: "sender-profiles",
        subcommand: "delete",
        description: "Delete a sender profile.",
        params: [param("workspaceId", "string", true), param("senderProfileId", "string", true)],
        request: (a) => sfMc("DELETE", senderProfilesPath(a, "senderProfileId")),
    }),
    cmd({
        name: "list_sequence_sender_profiles",
        product: "salesforge",
        group: "sender-profiles",
        subcommand: "sequence-list",
        description: "List sender profiles assigned to a sequence.",
        params: [param("workspaceId", "string", true), param("sequenceId", "string", true)],
        request: (a) => sfMc("GET", `${seqPath(a)}/sender-profiles`),
    }),
    cmd({
        name: "assign_sender_profiles_to_sequence",
        product: "salesforge",
        group: "sender-profiles",
        subcommand: "assign",
        description: "Assign sender profiles to a sequence.",
        params: [param("workspaceId", "string", true), param("sequenceId", "string", true), param("senderProfileIds", "array", true)],
        request: (a) => sfMc("POST", `${seqPath(a)}/sender-profiles`, { body: pick(a, ["senderProfileIds"]) }),
    }),
    cmd({
        name: "remove_sender_profiles_from_sequence",
        product: "salesforge",
        group: "sender-profiles",
        subcommand: "remove",
        description: "Remove sender profiles from a sequence.",
        params: [param("workspaceId", "string", true), param("sequenceId", "string", true), param("senderProfileIds", "array", true)],
        request: (a) => sfMc("POST", `${seqPath(a)}/sender-profiles/remove`, { body: pick(a, ["senderProfileIds"]) }),
    }),
    cmd({
        name: "enroll_contacts",
        product: "salesforge",
        group: "enrollments",
        subcommand: "create",
        description: "Enroll contacts into a multichannel sequence.",
        params: [param("workspaceId", "string", true), param("sequenceId", "string", true), param("filters", "object", true), param("limit", "number")],
        request: (a) => sfMc("POST", `${seqPath(a)}/enrollments`, { body: clean(pick(a, ["filters", "limit"])) }),
    }),
    cmd({
        name: "remove_enrollments",
        product: "salesforge",
        group: "enrollments",
        subcommand: "remove",
        description: "Remove contacts from a multichannel sequence.",
        params: [param("workspaceId", "string", true), param("sequenceId", "string", true), param("filters", "object", true)],
        request: (a) => sfMc("POST", `${seqPath(a)}/enrollments/remove`, { body: pick(a, ["filters"]) }),
    }),
    cmd({
        name: "start_email_validation",
        product: "salesforge",
        group: "validations",
        subcommand: "start",
        description: "Start an email validation run.",
        params: [param("workspaceId", "string", true), param("filters", "object")],
        request: (a) => sfMc("POST", `/multichannel/workspaces/${encStr(a.workspaceId)}/validations`, { body: a.filters ? { filters: a.filters } : {} }),
    }),
    cmd({
        name: "get_validation_results",
        product: "salesforge",
        group: "validations",
        subcommand: "results",
        description: "Get email validation run results.",
        params: [param("workspaceId", "string", true), param("runId", "string", true)],
        request: (a) => sfMc("GET", `/multichannel/workspaces/${encStr(a.workspaceId)}/validations/${encStr(a.runId)}/results`),
    }),
    // Product APIs
    ...simpleProductCommands("primeforge"),
    ...primeforgeCommands(),
    ...leadsforgeCommands(),
    ...infraforgeCommands(),
    ...warmforgeCommands(),
    ...simpleProductCommands("mailforge"),
    ...mailforgeCommands(),
];
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
function cmd(input) {
    const aliases = [
        [input.product, input.group, input.subcommand],
        ...(input.product === "salesforge" ? [[input.group, input.subcommand]] : []),
        ...(input.aliases ?? []),
    ];
    return { ...input, aliases };
}
function param(name, type = "string", required = false, description) {
    return {
        name,
        ...(type ? { type } : {}),
        ...(required ? { required } : {}),
        ...(description ? { description } : {}),
    };
}
function sfCore(method, path, options = {}) {
    return { product: "salesforge", salesforgeApi: "core", method, path, ...options };
}
function sfMc(method, path, options = {}) {
    return { product: "salesforge", salesforgeApi: "multichannel", method, path, ...options };
}
function api(product, method, path, options = {}) {
    return { product, method, path, ...options };
}
function simpleProductCommands(product) {
    return [
        cmd({ name: `${product}_list_workspaces`, product, group: "workspaces", subcommand: "list", description: `List ${product} workspaces.`, request: () => api(product, "GET", "/workspaces") }),
        cmd({ name: `${product}_create_workspace`, product, group: "workspaces", subcommand: "create", description: `Create a ${product} workspace.`, params: [param("name", "string", true)], request: (a) => api(product, "POST", "/workspaces", { body: pick(a, ["name"]) }) }),
    ];
}
function primeforgeCommands() {
    const product = "primeforge";
    return [
        cmd({ name: "primeforge_get_workspace", product, group: "workspaces", subcommand: "get", description: "Get a Primeforge workspace.", params: [param("id", "string", true)], request: (a) => api(product, "GET", `/workspaces/${encStr(a.id)}`) }),
        cmd({ name: "primeforge_delete_workspace", product, group: "workspaces", subcommand: "delete", description: "Delete a Primeforge workspace.", params: [param("id", "string", true)], request: (a) => api(product, "DELETE", `/workspaces/${encStr(a.id)}`) }),
        cmd({ name: "primeforge_set_domain_forwarding", product, group: "workspaces", subcommand: "set-domain-forwarding", description: "Set domain forwarding for a Primeforge workspace.", params: [param("workspaceId", "string", true), param("forwardToDomain", "string", true)], request: (a) => api(product, "POST", `/workspaces/${encStr(a.workspaceId)}/domains/forwarding`, { body: pick(a, ["forwardToDomain"]) }) }),
        cmd({ name: "primeforge_export_mailboxes", product, group: "workspaces", subcommand: "export-mailboxes", description: "Export Primeforge mailboxes.", params: [param("workspaceId", "string", true), param("exportType", "string", true), param("search"), param("includedIds", "array"), param("excludedIds", "array")], request: (a) => api(product, "POST", `/workspaces/${encStr(a.workspaceId)}/exports`, { body: omit(a, ["workspaceId"]) }) }),
        cmd({ name: "primeforge_export_to_salesforge", product, group: "workspaces", subcommand: "export-to-salesforge", description: "Export Primeforge mailboxes to Salesforge.", params: [param("workspaceId", "string", true), param("exportType", "string", true), param("includedIds", "array"), param("excludedIds", "array")], request: (a) => api(product, "POST", `/workspaces/${encStr(a.workspaceId)}/exports/salesforge`, { body: omit(a, ["workspaceId"]) }) }),
        cmd({ name: "primeforge_list_domains", product, group: "domains", subcommand: "list", description: "List Primeforge domains.", params: [param("workspaceId")], request: (a) => api(product, "GET", "/domains", { query: pick(a, ["workspaceId"]) }) }),
        cmd({ name: "primeforge_get_domain", product, group: "domains", subcommand: "get", description: "Get a Primeforge domain.", params: [param("id", "string", true)], request: (a) => api(product, "GET", `/domains/${encStr(a.id)}`) }),
        cmd({ name: "primeforge_search_domains", product, group: "domains", subcommand: "search", description: "Search available Primeforge domains.", params: [param("domain", "string", true), param("check_google_workspace", "boolean"), param("check_ms365_workspace", "boolean")], request: (a) => api(product, "GET", "/domains/search-available", { query: pick(a, ["domain", "check_google_workspace", "check_ms365_workspace"]) }) }),
        cmd({ name: "primeforge_buy_domains", product, group: "domains", subcommand: "buy", description: "Purchase Primeforge domains.", params: [param("body", "object", true)], request: (a) => api(product, "POST", "/domains", { body: a.body }) }),
        cmd({ name: "primeforge_delete_domain", product, group: "domains", subcommand: "delete", description: "Delete a Primeforge domain.", params: [param("id", "string", true)], request: (a) => api(product, "DELETE", `/domains/${encStr(a.id)}`) }),
        cmd({ name: "primeforge_get_domain_dns", product, group: "domains", subcommand: "dns", description: "Get Primeforge domain DNS records.", params: [param("domainId", "string", true)], request: (a) => api(product, "GET", `/domains/${encStr(a.domainId)}/dns`) }),
        cmd({ name: "primeforge_bulk_dns_update", product, group: "domains", subcommand: "bulk-dns", description: "Bulk update Primeforge DNS records.", params: [param("domains", "array", true), param("dmarcEmail"), param("forwardToDomain")], request: (a) => api(product, "PUT", "/domains/bulk-dns", { body: a }) }),
        cmd({ name: "primeforge_create_mailboxes_for_domain", product, group: "domains", subcommand: "create-mailboxes", description: "Create mailboxes for a Primeforge domain.", params: [param("domainId", "string", true), param("workspaceId", "string", true), param("mailboxes", "array", true)], request: (a) => api(product, "POST", `/domains/${encStr(a.domainId)}/mailboxes`, { body: pick(a, ["workspaceId", "mailboxes"]) }) }),
        cmd({ name: "primeforge_list_mailboxes", product, group: "mailboxes", subcommand: "list", description: "List Primeforge mailboxes.", params: [param("workspaceId")], request: (a) => api(product, "GET", "/mailboxes", { query: pick(a, ["workspaceId"]) }) }),
        cmd({ name: "primeforge_get_mailbox", product, group: "mailboxes", subcommand: "get", description: "Get a Primeforge mailbox.", params: [param("id", "string", true)], request: (a) => api(product, "GET", `/mailboxes/${encStr(a.id)}`) }),
        cmd({ name: "primeforge_update_mailbox", product, group: "mailboxes", subcommand: "update", description: "Update a Primeforge mailbox.", params: [param("id", "string", true), param("firstName"), param("lastName"), param("signature"), param("forwardingEmail"), param("profilePictureUrl")], request: (a) => api(product, "PATCH", `/mailboxes/${encStr(a.id)}`, { body: omit(a, ["id"]) }) }),
        cmd({ name: "primeforge_delete_mailbox", product, group: "mailboxes", subcommand: "delete", description: "Delete a Primeforge mailbox.", params: [param("id", "string", true)], request: (a) => api(product, "DELETE", `/mailboxes/${encStr(a.id)}`) }),
        cmd({ name: "primeforge_list_prewarmed_mailboxes", product, group: "mailboxes", subcommand: "prewarmed", description: "List pre-warmed Primeforge mailboxes.", request: () => api(product, "GET", "/mailboxes/pre-warmed") }),
        cmd({ name: "primeforge_purchase_prewarmed_mailboxes", product, group: "mailboxes", subcommand: "purchase-prewarmed", description: "Purchase pre-warmed Primeforge mailboxes.", params: [param("body", "object", true)], request: (a) => api(product, "POST", "/mailboxes/pre-warmed", { body: a.body }) }),
    ];
}
function leadsforgeCommands() {
    const product = "leadsforge";
    return [
        cmd({ name: "leadsforge_get_balance", product, group: "credits", subcommand: "balance", description: "Get Leadsforge credit balance.", request: () => api(product, "GET", "/balance") }),
        cmd({ name: "leadsforge_search", product, group: "search", subcommand: "leads", description: "Search for leads in Leadsforge.", params: [param("cursor"), param("limit", "number"), param("leadLocations", "object"), param("companyLocations", "object"), param("companyIndustries", "object"), param("leadSeniorities", "object"), param("leadDepartments", "object"), param("leadJobTitles", "object"), param("leadIDs", "object"), param("companyIDs", "object"), param("companyDomains", "object"), param("companyNames", "object"), param("companyFundingRounds", "object"), param("companyTypes", "object"), param("companyRequired", "boolean"), param("companyKeywords", "object"), param("companyTechnologies", "object"), param("companyEmployeeNumberRange", "object"), param("leadTenure", "object"), param("companyFoundedYearRange", "object"), param("companyYearsInBusinessRange", "object"), param("companyRevenueRanges", "array"), param("maxContactsPerCompany", "number")], request: (a) => api(product, "POST", "/search", { query: pick(a, ["cursor"]), body: a.cursor ? {} : omit(a, ["cursor"]) }) }),
        ...["emails", "phones", "linkedin"].map((kind) => cmd({ name: `leadsforge_enrich_${kind}`, product, group: "enrichment", subcommand: `enrich-${kind}`, description: `Start Leadsforge ${kind} enrichment.`, params: enrichmentParams, request: (a) => api(product, "POST", `/enrichment/${kind}`, { body: assertEnrichment(a) }) })),
        cmd({ name: "leadsforge_get_enrichment_job", product, group: "enrichment", subcommand: "job", description: "Get enrichment job status.", params: [param("jobID", "string", true)], request: (a) => api(product, "GET", `/enrichment/jobs/${encStr(a.jobID)}`) }),
        cmd({ name: "leadsforge_get_enrichment_results", product, group: "enrichment", subcommand: "results", description: "Get enrichment job results.", params: [param("jobID", "string", true), param("limit", "number"), param("offset", "number")], request: (a) => api(product, "GET", `/enrichment/jobs/${encStr(a.jobID)}/results`, { query: { limit: a.limit ?? 100, offset: num(a.offset) } }) }),
        cmd({ name: "leadsforge_search_lookalikes", product, group: "lookalikes", subcommand: "search", description: "Search for company lookalikes.", params: [param("domains", "array", true), param("locations", "array"), param("employeeRanges", "array"), param("fundingStages", "array"), param("categories", "array"), param("page", "number"), param("pageSize", "number")], request: (a) => api(product, "POST", "/lookalikes/search", { body: { ...a, page: a.page ?? 1, pageSize: a.pageSize ?? 25 } }) }),
        cmd({ name: "leadsforge_get_seniority_filters", product, group: "lookalikes", subcommand: "seniorities", description: "Get seniority filters.", request: () => api(product, "GET", "/lookalikes/filters/seniorities") }),
        cmd({ name: "leadsforge_get_department_filters", product, group: "lookalikes", subcommand: "departments", description: "Get department filters.", request: () => api(product, "GET", "/lookalikes/filters/departments") }),
        cmd({ name: "leadsforge_get_employee_range_filters", product, group: "lookalikes", subcommand: "employee-ranges", description: "Get employee range filters.", request: () => api(product, "GET", "/lookalikes/filters/employee-ranges") }),
    ];
}
function infraforgeCommands() {
    const product = "infraforge";
    return [
        cmd({ name: "infraforge_list_workspaces", product, group: "workspaces", subcommand: "list", description: "List Infraforge workspaces.", request: () => api(product, "GET", "/workspaces") }),
        cmd({ name: "infraforge_create_workspace", product, group: "workspaces", subcommand: "create", description: "Create an Infraforge workspace.", params: [param("name", "string", true), param("attachUniqueIp", "boolean")], request: (a) => api(product, "POST", "/workspaces", { body: a }) }),
        cmd({ name: "infraforge_update_workspace", product, group: "workspaces", subcommand: "update", description: "Update an Infraforge workspace.", params: [param("workspaceID", "string", true), param("name")], request: (a) => api(product, "PATCH", `/workspaces/${encStr(a.workspaceID)}`, { body: omit(a, ["workspaceID"]) }) }),
        cmd({ name: "infraforge_delete_workspace", product, group: "workspaces", subcommand: "delete", description: "Delete an Infraforge workspace.", params: [param("workspaceID", "string", true)], request: (a) => api(product, "DELETE", `/workspaces/${encStr(a.workspaceID)}`) }),
        cmd({ name: "infraforge_export_mailboxes", product, group: "workspaces", subcommand: "export-mailboxes", description: "Export Infraforge mailboxes.", params: [param("workspaceID", "string", true), param("body", "object", true)], request: (a) => api(product, "POST", `/workspaces/${encStr(a.workspaceID)}/mailboxes/export`, { body: a.body }) }),
        cmd({ name: "infraforge_export_to_salesforge", product, group: "workspaces", subcommand: "export-to-salesforge", description: "Export Infraforge mailboxes to Salesforge.", params: [param("body", "object", true)], request: (a) => api(product, "POST", "/mailboxes/export-to-salesforge", { body: a.body }) }),
        cmd({ name: "infraforge_check_domain_availability", product, group: "domains", subcommand: "check", description: "Check domain availability.", params: [param("domain", "string", true)], request: (a) => api(product, "GET", "/check-domain-availability", { query: pick(a, ["domain"]) }) }),
        cmd({ name: "infraforge_check_domain_availability_bulk", product, group: "domains", subcommand: "check-bulk", description: "Check domain availability in bulk.", params: [param("domains", "array", true)], request: (a) => api(product, "POST", "/check-domain-availability-bulk", { body: pick(a, ["domains"]) }) }),
        cmd({ name: "infraforge_list_domains", product, group: "domains", subcommand: "list", description: "List Infraforge domains.", params: [param("workspaceId")], request: (a) => api(product, "GET", "/domains", { query: pick(a, ["workspaceId"]) }) }),
        cmd({ name: "infraforge_purchase_domains", product, group: "domains", subcommand: "purchase", description: "Purchase Infraforge domains.", params: [param("body", "object", true)], request: (a) => api(product, "POST", "/domains", { body: a.body }) }),
        cmd({ name: "infraforge_get_domain_dns", product, group: "domains", subcommand: "dns", description: "Get Infraforge domain DNS.", params: [param("domainID", "string", true)], request: (a) => api(product, "GET", `/domains/${encStr(a.domainID)}/dns`) }),
        cmd({ name: "infraforge_update_domain_dns", product, group: "domains", subcommand: "update-dns", description: "Update Infraforge domain DNS.", params: [param("domainID", "string", true), param("records", "array", true)], request: (a) => api(product, "PUT", `/domains/${encStr(a.domainID)}/dns`, { body: pick(a, ["records"]) }) }),
        cmd({ name: "infraforge_bulk_dns_update", product, group: "domains", subcommand: "bulk-dns", description: "Bulk update Infraforge DNS.", params: [param("domains", "array", true), param("dmarcEmail"), param("dmarcPolicy"), param("forwardToDomain")], request: (a) => api(product, "PUT", "/domains/bulk-dns", { body: a }) }),
        cmd({ name: "infraforge_get_alternative_domains", product, group: "domains", subcommand: "alternatives", description: "Generate alternative domain suggestions.", params: [param("body", "object", true)], request: (a) => api(product, "POST", "/domains/alternative-domains", { body: a.body }) }),
        cmd({ name: "infraforge_enable_autorenew", product, group: "domains", subcommand: "enable-autorenew", description: "Enable domain auto-renewal.", params: [param("domainID", "string", true)], request: (a) => api(product, "PUT", `/domains/${encStr(a.domainID)}/enable-autorenew`, { body: {} }) }),
        cmd({ name: "infraforge_disable_autorenew", product, group: "domains", subcommand: "disable-autorenew", description: "Disable domain auto-renewal.", params: [param("domainID", "string", true)], request: (a) => api(product, "PUT", `/domains/${encStr(a.domainID)}/disable-autorenew`, { body: {} }) }),
        cmd({ name: "infraforge_list_mailboxes", product, group: "mailboxes", subcommand: "list", description: "List Infraforge mailboxes.", params: [param("workspaceId"), param("page", "number"), param("size", "number"), param("search")], request: (a) => api(product, "GET", "/mailboxes", { query: pick(a, ["workspaceId", "page", "size", "search"]) }) }),
        cmd({ name: "infraforge_get_mailbox", product, group: "mailboxes", subcommand: "get", description: "Get an Infraforge mailbox.", params: [param("mailboxID", "string", true)], request: (a) => api(product, "GET", `/mailboxes/${encStr(a.mailboxID)}`) }),
        cmd({ name: "infraforge_update_mailbox", product, group: "mailboxes", subcommand: "update", description: "Update an Infraforge mailbox.", params: [param("mailboxID", "string", true), param("firstName"), param("lastName"), param("signature"), param("forwardingEmail")], request: (a) => api(product, "PATCH", `/mailboxes/${encStr(a.mailboxID)}`, { body: omit(a, ["mailboxID"]) }) }),
        cmd({ name: "infraforge_purchase_mailboxes", product, group: "mailboxes", subcommand: "purchase", description: "Purchase Infraforge mailboxes.", params: [param("body", "object", true)], request: (a) => api(product, "POST", "/mailboxes", { body: a.body }) }),
        cmd({ name: "infraforge_delete_mailbox", product, group: "mailboxes", subcommand: "delete", description: "Delete an Infraforge mailbox.", params: [param("mailboxID", "string", true)], request: (a) => api(product, "DELETE", `/mailboxes/${encStr(a.mailboxID)}`) }),
        cmd({ name: "infraforge_generate_mailboxes", product, group: "mailboxes", subcommand: "generate", description: "Generate mailbox configurations.", params: [param("body", "object", true)], request: (a) => api(product, "POST", "/mailboxes/generate", { body: a.body }) }),
        cmd({ name: "infraforge_bulk_forward_mailboxes", product, group: "mailboxes", subcommand: "bulk-forward", description: "Bulk set mailbox forwarding.", params: [param("body", "object", true)], request: (a) => api(product, "POST", "/mailboxes/bulk-forward", { body: a.body }) }),
        cmd({ name: "infraforge_get_credit_balance", product, group: "credits", subcommand: "balance", description: "Get Infraforge credit balance.", request: () => api(product, "GET", "/credits/balance") }),
        cmd({ name: "infraforge_create_credit_balance", product, group: "credits", subcommand: "create", description: "Create or top up Infraforge credit balance.", params: [param("amount", "number", true), param("isEnabled", "boolean", true), param("topupThreshold", "number", true)], request: (a) => api(product, "POST", "/credits/balance", { body: a }) }),
        cmd({ name: "infraforge_update_credit_balance", product, group: "credits", subcommand: "update", description: "Update Infraforge credit balance settings.", params: [param("amount", "number"), param("isEnabled", "boolean"), param("topupThreshold", "number")], request: (a) => api(product, "PATCH", "/credits/balance", { body: a }) }),
    ];
}
function warmforgeCommands() {
    const product = "warmforge";
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
function mailforgeCommands() {
    const product = "mailforge";
    return [
        cmd({ name: "mailforge_update_workspace", product, group: "workspaces", subcommand: "update", description: "Update a Mailforge workspace.", params: [param("workspaceID", "string", true), param("name", "string", true)], request: (a) => api(product, "PATCH", `/workspaces/${encStr(a.workspaceID)}`, { body: pick(a, ["name"]) }) }),
        cmd({ name: "mailforge_delete_workspace", product, group: "workspaces", subcommand: "delete", description: "Delete a Mailforge workspace.", params: [param("workspaceID", "string", true)], request: (a) => api(product, "DELETE", `/workspaces/${encStr(a.workspaceID)}`) }),
        cmd({ name: "mailforge_list_mailboxes", product, group: "mailboxes", subcommand: "list", description: "List Mailforge mailboxes.", request: () => api(product, "GET", "/mailboxes") }),
        cmd({ name: "mailforge_get_mailbox", product, group: "mailboxes", subcommand: "get", description: "Get a Mailforge mailbox.", params: [param("mailboxID", "string", true)], request: (a) => api(product, "GET", `/mailboxes/${encStr(a.mailboxID)}`) }),
        cmd({ name: "mailforge_purchase_mailboxes", product, group: "mailboxes", subcommand: "purchase", description: "Purchase Mailforge mailboxes.", params: [param("mailboxes", "array", true)], request: (a) => api(product, "POST", "/mailboxes", { body: pick(a, ["mailboxes"]) }) }),
        cmd({ name: "mailforge_update_mailbox", product, group: "mailboxes", subcommand: "update", description: "Update a Mailforge mailbox.", params: [param("mailboxID", "string", true), param("firstName"), param("lastName"), param("password"), param("signature"), param("forwardingEmail")], request: (a) => api(product, "PATCH", `/mailboxes/${encStr(a.mailboxID)}`, { body: omit(a, ["mailboxID"]) }) }),
        cmd({ name: "mailforge_delete_mailbox", product, group: "mailboxes", subcommand: "delete", description: "Delete a Mailforge mailbox.", params: [param("mailboxID", "string", true)], request: (a) => api(product, "DELETE", `/mailboxes/${encStr(a.mailboxID)}`) }),
        cmd({ name: "mailforge_bulk_forward_mailboxes", product, group: "mailboxes", subcommand: "bulk-forward", description: "Bulk set Mailforge mailbox forwarding.", params: [param("forwardingEmail", "string", true), param("search"), param("includedIds", "array"), param("excludedIds", "array")], request: (a) => api(product, "POST", "/mailboxes/bulk-forward", { body: a }) }),
        cmd({ name: "mailforge_adjust_topup_amount", product, group: "mailboxes", subcommand: "adjust-topup", description: "Adjust Mailforge mailbox top-up amount.", params: [param("amount", "number", true)], request: (a) => api(product, "POST", "/adjust-mailbox-topup-amount", { body: pick(a, ["amount"]) }) }),
        cmd({ name: "mailforge_list_domains", product, group: "domains", subcommand: "list", description: "List Mailforge domains.", params: [param("status")], request: (a) => api(product, "GET", "/domains", { query: pick(a, ["status"]) }) }),
        cmd({ name: "mailforge_purchase_domains", product, group: "domains", subcommand: "purchase", description: "Purchase Mailforge domains.", params: [param("domains", "array", true), param("workspaceId", "string", true), param("contactDetails", "object", true)], request: (a) => api(product, "POST", "/domains", { body: pick(a, ["domains", "workspaceId", "contactDetails"]) }) }),
        cmd({ name: "mailforge_check_domain_availability", product, group: "domains", subcommand: "check", description: "Check Mailforge domain availability.", params: [param("domain", "string", true)], request: (a) => api(product, "GET", "/check-domain-availability", { query: pick(a, ["domain"]) }) }),
        cmd({ name: "mailforge_check_domain_availability_bulk", product, group: "domains", subcommand: "check-bulk", description: "Check Mailforge domain availability in bulk.", params: [param("domains", "array", true)], request: (a) => api(product, "POST", "/check-domain-availability-bulk", { body: pick(a, ["domains"]) }) }),
        cmd({ name: "mailforge_transfer_domains", product, group: "domains", subcommand: "transfer", description: "Transfer domains into Mailforge.", params: [param("domains", "array", true), param("workspaceId", "string", true), param("dmarcEmail"), param("forwardToDomain")], request: (a) => api(product, "POST", "/domains/transfer", { body: a }) }),
        cmd({ name: "mailforge_get_domain_dns", product, group: "domains", subcommand: "dns", description: "Get Mailforge domain DNS.", params: [param("domainID", "string", true)], request: (a) => api(product, "GET", `/domains/${encStr(a.domainID)}/dns`) }),
        cmd({ name: "mailforge_update_domain_dns", product, group: "domains", subcommand: "update-dns", description: "Update Mailforge domain DNS.", params: [param("domainID", "string", true), param("records", "array", true)], request: (a) => api(product, "PUT", `/domains/${encStr(a.domainID)}/dns`, { body: pick(a, ["records"]) }) }),
        cmd({ name: "mailforge_bulk_dns_update", product, group: "domains", subcommand: "bulk-dns", description: "Bulk update Mailforge DNS.", params: [param("domains", "array", true), param("dmarcEmail"), param("dmarcPolicy"), param("forwardToDomain"), param("removeENOMRecords", "boolean")], request: (a) => api(product, "PUT", "/domains/bulk-dns", { body: a }) }),
        cmd({ name: "mailforge_enable_autorenew", product, group: "domains", subcommand: "enable-autorenew", description: "Enable Mailforge domain auto-renewal.", params: [param("domainID", "string", true)], request: (a) => api(product, "PUT", `/domains/${encStr(a.domainID)}/enable-autorenew`, { body: {} }) }),
        cmd({ name: "mailforge_disable_autorenew", product, group: "domains", subcommand: "disable-autorenew", description: "Disable Mailforge domain auto-renewal.", params: [param("domainID", "string", true)], request: (a) => api(product, "PUT", `/domains/${encStr(a.domainID)}/disable-autorenew`, { body: {} }) }),
        cmd({ name: "mailforge_bulk_enable_autorenew", product, group: "domains", subcommand: "bulk-enable-autorenew", description: "Enable auto-renewal for multiple domains.", params: [param("domainIds", "array", true)], request: (a) => api(product, "POST", "/domains/bulk-enable-autorenew", { body: pick(a, ["domainIds"]) }) }),
        cmd({ name: "mailforge_bulk_disable_autorenew", product, group: "domains", subcommand: "bulk-disable-autorenew", description: "Disable auto-renewal for multiple domains.", params: [param("domainIds", "array", true)], request: (a) => api(product, "POST", "/domains/bulk-disable-autorenew", { body: pick(a, ["domainIds"]) }) }),
        cmd({ name: "mailforge_update_domain_forwards", product, group: "domains", subcommand: "update-forwards", description: "Update Mailforge domain forwards.", params: [param("forwards", "array", true)], request: (a) => api(product, "PATCH", "/domains/forwards", { body: a.forwards }) }),
        cmd({ name: "mailforge_purchase_domain_masking", product, group: "domains", subcommand: "purchase-masking", description: "Purchase domain masking.", params: [param("domainIds", "array", true), param("purchaseMasking", "boolean", true), param("isYearly", "boolean")], request: (a) => api(product, "POST", "/domains/masking", { body: a }) }),
        cmd({ name: "mailforge_delete_domain_masking", product, group: "domains", subcommand: "delete-masking", description: "Delete domain masking.", params: [param("domainID", "string", true)], request: (a) => api(product, "DELETE", `/domains/${encStr(a.domainID)}/masking`) }),
    ];
}
function seqPath(args) {
    return `/multichannel/workspaces/${encStr(args.workspaceId)}/sequences/${encStr(args.sequenceId)}`;
}
function senderProfilesPath(args, idKey) {
    const base = `/multichannel/workspaces/${encStr(args.workspaceId)}/sender-profiles`;
    return idKey ? `${base}/${encStr(args[idKey])}` : base;
}
function pick(args, keys) {
    const result = {};
    for (const key of keys) {
        if (args[key] !== undefined)
            result[key] = args[key];
    }
    return result;
}
function omit(args, keys) {
    const blocked = new Set(keys);
    const result = {};
    for (const [key, value] of Object.entries(args)) {
        if (!blocked.has(key) && value !== undefined)
            result[key] = value;
    }
    return result;
}
function clean(object) {
    const result = {};
    for (const [key, value] of Object.entries(object)) {
        if (value !== undefined)
            result[key] = value;
    }
    return result;
}
function encStr(value) {
    return enc(String(value));
}
function appendArrayQuery(query, key, value) {
    if (!Array.isArray(value))
        return;
    query[key] = value.map(String);
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
function assertEnrichment(args) {
    const hasIDs = Array.isArray(args.personIDs) && args.personIDs.length > 0;
    const hasPeople = Array.isArray(args.people) && args.people.length > 0;
    if (hasIDs === hasPeople)
        throw new Error("Provide exactly one of personIDs or people.");
    return args;
}
function num(value) {
    return typeof value === "number" ? value : undefined;
}
//# sourceMappingURL=registry.js.map