export const publicApiContracts = {
    "salesforge GET /me": {
        "description": "Validates the provided API key and returns basic information about it.",
        "parameters": []
    },
    "salesforge GET /workspaces": {
        "description": "Get workspaces associated with the account.",
        "parameters": [
            {
                "name": "limit",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Limit"
                }
            },
            {
                "name": "offset",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Offset"
                }
            }
        ]
    },
    "salesforge POST /workspaces": {
        "description": "Create a new workspace for the account.",
        "parameters": [],
        "body": {
            "type": "object",
            "required": [
                "name"
            ],
            "properties": {
                "name": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 100
                }
            }
        }
    },
    "salesforge GET /workspaces/{workspaceID}": {
        "description": "Get workspace information.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            }
        ]
    },
    "salesforge GET /workspaces/{workspaceID}/contacts": {
        "description": "Get contacts associated with the workspace. Supported filters: tag_ids[] (aliases: tagIds), validation_statuses[] (aliases: validationStatus, validationStatuses; valid is accepted as safe), not_in_sequence_id (alias: notInSequenceId). Unknown query parameters return 400.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "limit",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Limit"
                }
            },
            {
                "name": "offset",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Offset"
                }
            },
            {
                "name": "tag_ids[]",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    },
                    "description": "Filter by tag ids"
                }
            },
            {
                "name": "tagIds",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    },
                    "description": "Alias for tag_ids[]"
                }
            },
            {
                "name": "not_in_sequence_id",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Filter by contacts not in sequence"
                }
            },
            {
                "name": "notInSequenceId",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Alias for not_in_sequence_id"
                }
            },
            {
                "name": "validation_statuses[]",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "array",
                    "items": {
                        "type": "string",
                        "enum": [
                            "safe",
                            "valid",
                            "invalid",
                            "disabled",
                            "disposable",
                            "inbox_full",
                            "catch_all",
                            "role_account",
                            "spamtrap",
                            "unknown",
                            "unvalidated"
                        ]
                    },
                    "description": "Filter by validation statuses"
                }
            },
            {
                "name": "validationStatus",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "array",
                    "items": {
                        "type": "string",
                        "enum": [
                            "safe",
                            "valid",
                            "invalid",
                            "disabled",
                            "disposable",
                            "inbox_full",
                            "catch_all",
                            "role_account",
                            "spamtrap",
                            "unknown",
                            "unvalidated"
                        ]
                    },
                    "description": "Alias for validation_statuses[]"
                }
            }
        ]
    },
    "salesforge POST /workspaces/{workspaceID}/contacts": {
        "description": "Create a new contact. Requires at least one of email or linkedinUrl. If no tag is provided, a default date-based tag is applied automatically.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "firstName"
            ],
            "properties": {
                "company": {
                    "type": "string",
                    "minLength": 1
                },
                "customVars": {
                    "type": "object",
                    "additionalProperties": {
                        "type": "string"
                    }
                },
                "email": {
                    "type": "string",
                    "description": "Email of the contact. Either email or linkedinUrl must be provided."
                },
                "firstName": {
                    "type": "string"
                },
                "lastName": {
                    "type": "string"
                },
                "linkedinUrl": {
                    "type": "string",
                    "description": "LinkedInUrl of the contact. Either email or linkedinUrl must be provided."
                },
                "position": {
                    "type": "string"
                },
                "tagIds": {
                    "type": "array",
                    "description": "TagIDs are existing tag IDs to apply to the contact. The bulk create endpoint requires at least one tag (tags or tagIds).",
                    "items": {
                        "type": "string"
                    }
                },
                "tags": {
                    "type": "array",
                    "description": "TagNames are tag names to apply to the contact. The bulk create endpoint requires at least one tag (tags or tagIds).",
                    "items": {
                        "type": "string"
                    }
                }
            }
        }
    },
    "salesforge POST /workspaces/{workspaceID}/contacts/bulk": {
        "description": "Create up to 100 contacts in bulk. Each contact requires firstName, at least one of email or linkedinUrl, and at least one tag (tags or tagIds). The request fails entirely if any contact is invalid.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "properties": {
                "contacts": {
                    "type": "array",
                    "minItems": 1,
                    "maxItems": 100,
                    "items": {
                        "type": "object",
                        "required": [
                            "firstName"
                        ],
                        "properties": {
                            "company": {
                                "type": "string",
                                "minLength": 1
                            },
                            "customVars": {
                                "type": "object",
                                "additionalProperties": {
                                    "type": "string"
                                }
                            },
                            "email": {
                                "type": "string",
                                "description": "Email of the contact. Either email or linkedinUrl must be provided."
                            },
                            "firstName": {
                                "type": "string"
                            },
                            "lastName": {
                                "type": "string"
                            },
                            "linkedinUrl": {
                                "type": "string",
                                "description": "LinkedInUrl of the contact. Either email or linkedinUrl must be provided."
                            },
                            "position": {
                                "type": "string"
                            },
                            "tagIds": {
                                "type": "array",
                                "description": "TagIDs are existing tag IDs to apply to the contact. The bulk create endpoint requires at least one tag (tags or tagIds).",
                                "items": {
                                    "type": "string"
                                }
                            },
                            "tags": {
                                "type": "array",
                                "description": "TagNames are tag names to apply to the contact. The bulk create endpoint requires at least one tag (tags or tagIds).",
                                "items": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "salesforge POST /workspaces/{workspaceID}/contacts/bulk-delete": {
        "description": "Delete up to 1000 contacts from the workspace by ID.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "contactIds"
            ],
            "properties": {
                "contactIds": {
                    "type": "array",
                    "description": "ContactIDs are the contacts to delete, at most 1000 per request. IDs that do not belong to\nthe workspace are ignored rather than rejected.",
                    "minItems": 1,
                    "maxItems": 1000,
                    "items": {
                        "type": "string"
                    }
                }
            }
        }
    },
    "salesforge DELETE /workspaces/{workspaceID}/contacts/{contactID}": {
        "description": "Delete a contact from the workspace.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "contactID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Contact ID"
                }
            }
        ]
    },
    "salesforge GET /workspaces/{workspaceID}/contacts/{contactID}": {
        "description": "Get contact information, including tag IDs and sequence enrollment status.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "contactID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Contact ID"
                }
            }
        ]
    },
    "salesforge GET /workspaces/{workspaceID}/custom-vars": {
        "description": "Get a list of custom variables associated to a workspace.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "limit",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Limit"
                }
            },
            {
                "name": "offset",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Offset"
                }
            }
        ]
    },
    "salesforge GET /workspaces/{workspaceID}/dnc": {
        "description": "Get a paginated list of DNC entries for a workspace. Use this to sync a full DNC list into an external system.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "limit",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "maximum": 1000,
                    "description": "Limit"
                }
            },
            {
                "name": "offset",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Offset"
                }
            }
        ]
    },
    "salesforge POST /workspaces/{workspaceID}/dnc/bulk": {
        "description": "Create multiple DNC entries for a workspace.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "dncs"
            ],
            "properties": {
                "dncs": {
                    "type": "array",
                    "minItems": 1,
                    "maxItems": 1000,
                    "items": {
                        "type": "string"
                    }
                }
            }
        }
    },
    "salesforge POST /workspaces/{workspaceID}/dnc/bulk/remove": {
        "description": "Remove multiple DNC entries from a workspace using their values.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "dncs"
            ],
            "properties": {
                "dncs": {
                    "type": "array",
                    "minItems": 1,
                    "maxItems": 1000,
                    "items": {
                        "type": "string"
                    }
                }
            }
        }
    },
    "salesforge GET /workspaces/{workspaceID}/integrations/webhooks": {
        "description": "Get registered webhooks associated with the workspace.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "limit",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Limit"
                }
            },
            {
                "name": "offset",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Offset"
                }
            }
        ]
    },
    "salesforge POST /workspaces/{workspaceID}/integrations/webhooks": {
        "description": "Create a new webhook.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "name",
                "type",
                "url"
            ],
            "properties": {
                "name": {
                    "type": "string",
                    "description": "Label identifying this webhook in the workspace."
                },
                "sequenceID": {
                    "type": "string",
                    "description": "Deprecated: use sequenceIds. Ignored when sequenceIds is non-empty.",
                    "minLength": 1
                },
                "sequenceIds": {
                    "type": "array",
                    "description": "Sequences whose events this webhook receives. Omit or leave empty to\nreceive events for every sequence in the workspace.",
                    "items": {
                        "type": "string"
                    }
                },
                "type": {
                    "type": "string",
                    "description": "Event that triggers a delivery. A webhook subscribes to exactly one\ntype, so receiving several events means registering several webhooks.",
                    "enum": [
                        "email_sent",
                        "email_opened",
                        "link_clicked",
                        "email_replied",
                        "linkedin_replied",
                        "contact_unsubscribed",
                        "email_bounced",
                        "positive_reply",
                        "negative_reply",
                        "label_changed",
                        "dnc_added",
                        "meeting_booked",
                        "meeting_completed",
                        "linkedin_message_sent",
                        "linkedin_inmail_sent",
                        "linkedin_connection_request_sent",
                        "linkedin_connection_request_accepted",
                        "linkedin_connection_request_withdrawn",
                        "linkedin_profile_viewed",
                        "linkedin_post_liked",
                        "linkedin_contact_followed",
                        "email_sent",
                        "email_opened",
                        "link_clicked",
                        "email_replied",
                        "linkedin_replied",
                        "contact_unsubscribed",
                        "email_bounced",
                        "positive_reply",
                        "negative_reply",
                        "label_changed",
                        "dnc_added",
                        "meeting_booked",
                        "meeting_completed",
                        "linkedin_message_sent",
                        "linkedin_inmail_sent",
                        "linkedin_connection_request_sent",
                        "linkedin_connection_request_accepted",
                        "linkedin_connection_request_withdrawn",
                        "linkedin_profile_viewed",
                        "linkedin_post_liked",
                        "linkedin_contact_followed"
                    ]
                },
                "url": {
                    "type": "string",
                    "description": "Endpoint receiving the POST. Must be publicly reachable and answer 2xx:\na failed delivery is not retried."
                }
            }
        }
    },
    "salesforge DELETE /workspaces/{workspaceID}/integrations/webhooks/{webhookID}": {
        "description": "Delete a registered webhook. A webhook's signing secret cannot be rotated or retrieved, so deleting and recreating the webhook is how a lost or leaked secret is replaced.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "webhookID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Webhook ID"
                }
            }
        ]
    },
    "salesforge GET /workspaces/{workspaceID}/integrations/webhooks/{webhookID}": {
        "description": "Get webhook information.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "webhookID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Webhook ID"
                }
            }
        ]
    },
    "salesforge GET /workspaces/{workspaceID}/mailboxes": {
        "description": "Get mailboxes associated with the workspace.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "limit",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Limit"
                }
            },
            {
                "name": "offset",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Offset"
                }
            },
            {
                "name": "statuses[]",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "array",
                    "items": {
                        "type": "string",
                        "enum": [
                            "active",
                            "access_lost",
                            "pending"
                        ]
                    },
                    "description": "Filter by status"
                }
            },
            {
                "name": "mailbox_ids[]",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    },
                    "description": "Filter by mailbox IDs"
                }
            },
            {
                "name": "excluded_mailbox_ids[]",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    },
                    "description": "Exclude mailbox IDs"
                }
            },
            {
                "name": "search",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Search query"
                }
            },
            {
                "name": "tag_ids[]",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    },
                    "description": "Filter by tag IDs"
                }
            },
            {
                "name": "not_tag_ids[]",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    },
                    "description": "Exclude tag IDs"
                }
            },
            {
                "name": "addresses[]",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    },
                    "description": "Filter by mailbox addresses"
                }
            },
            {
                "name": "status_criteria",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "enum": [
                        "all",
                        "active",
                        "warm",
                        "pending",
                        "suspended",
                        "disconnected",
                        "recommendations"
                    ],
                    "description": "Status criteria"
                }
            },
            {
                "name": "statuses_criteria",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "array",
                    "items": {
                        "type": "string",
                        "enum": [
                            "all",
                            "active",
                            "warm",
                            "pending",
                            "suspended",
                            "disconnected",
                            "recommendations"
                        ]
                    },
                    "description": "Statuses criteria"
                }
            }
        ]
    },
    "salesforge POST /workspaces/{workspaceID}/mailboxes": {
        "description": "Connect an SMTP/IMAP mailbox to the workspace. Send the outgoing server credentials under \"smtp\" and the incoming server credentials under \"imap\". Both are verified against the mail provider before anything is stored, so a bad host, port or password fails with 400 and creates nothing; the message names the failing protocol and, where the reason is recognized (wrong credentials, unreachable host, TLS mismatch, ...), a short cause. On success the mailbox is returned with status \"pending\": registration with the mail infrastructure finishes moments later and flips it to \"active\", or to \"access_lost\" if it fails. Poll GET /workspaces/{workspaceID}/mailboxes/{mailboxID} to observe the final status. Connecting is idempotent by address: a second request for an address already mid-connect returns 409 instead of racing the first. Google and Outlook mailboxes connect through /mailboxes/oauth-link instead.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "address",
                "firstName",
                "imap",
                "lastName",
                "smtp"
            ],
            "properties": {
                "address": {
                    "type": "string",
                    "description": "Email address to send from. It must not already be connected to another workspace."
                },
                "dailyEmailLimit": {
                    "type": "integer",
                    "description": "Maximum emails this mailbox may send per day. Defaults to 30 when omitted. Values above the\nlimit permitted for the workspace are rejected.",
                    "minimum": 1
                },
                "firstName": {
                    "type": "string",
                    "description": "First name of the sender, used in the From header of outgoing emails."
                },
                "imap": {
                    "type": "object",
                    "required": [
                        "host",
                        "password",
                        "port",
                        "username"
                    ],
                    "properties": {
                        "host": {
                            "type": "string",
                            "description": "Hostname of the mail server. Your mail provider publishes this; it is usually of the form\nimap.yourprovider.com or smtp.yourprovider.com."
                        },
                        "password": {
                            "type": "string",
                            "description": "Password or provider-issued app password for the username above. Sent over TLS, stored\nencrypted, and never returned by any endpoint. Where your provider supports app passwords,\nprefer one over the account password so it can be revoked independently."
                        },
                        "port": {
                            "type": "integer",
                            "description": "Port the mail server listens on. It also selects how the connection is encrypted: 993 (IMAP)\nand 465 (SMTP) use implicit TLS, 587 (SMTP) uses STARTTLS. Any other port is attempted with\nTLS first and retried without strict certificate verification.",
                            "minimum": 1,
                            "maximum": 65535
                        },
                        "username": {
                            "type": "string",
                            "description": "Username the mail server authenticates with. Often, but not always, the mailbox address —\ncheck your provider, as some issue a separate login."
                        }
                    }
                },
                "lastName": {
                    "type": "string",
                    "description": "Last name of the sender, used in the From header of outgoing emails."
                },
                "signature": {
                    "type": "string",
                    "description": "HTML signature appended to outgoing emails. Scored for spam potential on connect; the result\nis reported on the mailbox rather than blocking the request."
                },
                "smtp": {
                    "type": "object",
                    "required": [
                        "host",
                        "password",
                        "port",
                        "username"
                    ],
                    "properties": {
                        "host": {
                            "type": "string",
                            "description": "Hostname of the mail server. Your mail provider publishes this; it is usually of the form\nimap.yourprovider.com or smtp.yourprovider.com."
                        },
                        "password": {
                            "type": "string",
                            "description": "Password or provider-issued app password for the username above. Sent over TLS, stored\nencrypted, and never returned by any endpoint. Where your provider supports app passwords,\nprefer one over the account password so it can be revoked independently."
                        },
                        "port": {
                            "type": "integer",
                            "description": "Port the mail server listens on. It also selects how the connection is encrypted: 993 (IMAP)\nand 465 (SMTP) use implicit TLS, 587 (SMTP) uses STARTTLS. Any other port is attempted with\nTLS first and retried without strict certificate verification.",
                            "minimum": 1,
                            "maximum": 65535
                        },
                        "username": {
                            "type": "string",
                            "description": "Username the mail server authenticates with. Often, but not always, the mailbox address —\ncheck your provider, as some issue a separate login."
                        }
                    }
                },
                "trackingDomain": {
                    "type": "string",
                    "description": "Custom domain used to rewrite tracked links and open pixels. It must already have a CNAME\npointing at Salesforge"
                }
            }
        }
    },
    "salesforge POST /workspaces/{workspaceID}/mailboxes/oauth-link": {
        "description": "Returns a Google or Outlook OAuth URL for connecting a mailbox. After the user authorizes, they are redirected to redirectUrl. The mailbox is auto-provisioned in Warmforge under the matching workspace.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "provider",
                "redirectUrl"
            ],
            "properties": {
                "email": {
                    "type": "string",
                    "description": "Address to pre-select on the provider's consent screen. Optional; the user can still choose a\ndifferent account, so treat the address returned on the redirect as authoritative."
                },
                "provider": {
                    "type": "string",
                    "description": "Mail provider to connect: \"google\" or \"outlook\". Mailboxes on any other provider connect with\ntheir own credentials through POST /workspaces/{workspaceID}/mailboxes instead.",
                    "enum": [
                        "google",
                        "outlook"
                    ]
                },
                "redirectUrl": {
                    "type": "string",
                    "description": "Absolute https URL the user returns to once they have authorized the mailbox. It must be\nregistered with Salesforge beforehand — ask support to add it — and may carry a path and query\nbut no fragment or embedded credentials.\n\nSalesforge appends the result to it: mailboxId and address on success, or\nconnection_status=failed and an error code on failure. Query parameters already present are\npreserved, so state can be round-tripped through this URL."
                }
            }
        }
    },
    "salesforge DELETE /workspaces/{workspaceID}/mailboxes/{mailboxID}": {
        "description": "Removes the connected account from Salesforge and marks the mailbox deleted. Does not delete the email account at its provider.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "mailboxID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Mailbox ID"
                }
            }
        ]
    },
    "salesforge GET /workspaces/{workspaceID}/mailboxes/{mailboxID}": {
        "description": "Get mailbox information.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "mailboxID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Mailbox ID"
                }
            }
        ]
    },
    "salesforge PATCH /workspaces/{workspaceID}/mailboxes/{mailboxID}": {
        "description": "Update mailbox operational settings.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "mailboxID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Mailbox ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "properties": {
                "dailyEmailLimit": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 100
                },
                "firstName": {
                    "type": "string"
                },
                "lastName": {
                    "type": "string"
                },
                "signature": {
                    "type": "string"
                },
                "trackingDomain": {
                    "type": "string"
                }
            }
        }
    },
    "salesforge PATCH /workspaces/{workspaceID}/mailboxes/{mailboxID}/connection-settings": {
        "description": "Updates SMTP and/or IMAP credentials without recreating or disconnecting the mailbox. Each supplied leg requires host, port, username and password; omitted legs and mailbox metadata are unchanged. Both supplied legs are verified before saving. Uses the same TLS settings and fallback as mailbox connection. OAuth mailboxes require provider reauthorization.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "mailboxID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Mailbox ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "properties": {
                "imap": {
                    "type": "object",
                    "required": [
                        "host",
                        "password",
                        "port",
                        "username"
                    ],
                    "properties": {
                        "host": {
                            "type": "string",
                            "description": "Hostname of the mail server. Your mail provider publishes this; it is usually of the form\nimap.yourprovider.com or smtp.yourprovider.com."
                        },
                        "password": {
                            "type": "string",
                            "description": "Password or provider-issued app password for the username above. Sent over TLS, stored\nencrypted, and never returned by any endpoint. Where your provider supports app passwords,\nprefer one over the account password so it can be revoked independently."
                        },
                        "port": {
                            "type": "integer",
                            "description": "Port the mail server listens on. It also selects how the connection is encrypted: 993 (IMAP)\nand 465 (SMTP) use implicit TLS, 587 (SMTP) uses STARTTLS. Any other port is attempted with\nTLS first and retried without strict certificate verification.",
                            "minimum": 1,
                            "maximum": 65535
                        },
                        "username": {
                            "type": "string",
                            "description": "Username the mail server authenticates with. Often, but not always, the mailbox address —\ncheck your provider, as some issue a separate login."
                        }
                    }
                },
                "smtp": {
                    "type": "object",
                    "required": [
                        "host",
                        "password",
                        "port",
                        "username"
                    ],
                    "properties": {
                        "host": {
                            "type": "string",
                            "description": "Hostname of the mail server. Your mail provider publishes this; it is usually of the form\nimap.yourprovider.com or smtp.yourprovider.com."
                        },
                        "password": {
                            "type": "string",
                            "description": "Password or provider-issued app password for the username above. Sent over TLS, stored\nencrypted, and never returned by any endpoint. Where your provider supports app passwords,\nprefer one over the account password so it can be revoked independently."
                        },
                        "port": {
                            "type": "integer",
                            "description": "Port the mail server listens on. It also selects how the connection is encrypted: 993 (IMAP)\nand 465 (SMTP) use implicit TLS, 587 (SMTP) uses STARTTLS. Any other port is attempted with\nTLS first and retried without strict certificate verification.",
                            "minimum": 1,
                            "maximum": 65535
                        },
                        "username": {
                            "type": "string",
                            "description": "Username the mail server authenticates with. Often, but not always, the mailbox address —\ncheck your provider, as some issue a separate login."
                        }
                    }
                }
            }
        }
    },
    "salesforge GET /workspaces/{workspaceID}/mailboxes/{mailboxID}/emails/{emailID}/attachments": {
        "description": "Downloads all attachments of a thread email as a ZIP file.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "mailboxID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Mailbox ID"
                }
            },
            {
                "name": "emailID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Email ID"
                }
            }
        ]
    },
    "salesforge GET /workspaces/{workspaceID}/mailboxes/{mailboxID}/emails/{emailID}/attachments/{contentID}": {
        "description": "Streams a single attachment by content ID.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "mailboxID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Mailbox ID"
                }
            },
            {
                "name": "emailID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Email ID"
                }
            },
            {
                "name": "contentID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Attachment content ID (as returned in email attachments metadata)"
                }
            }
        ]
    },
    "salesforge POST /workspaces/{workspaceID}/mailboxes/{mailboxID}/emails/{emailID}/reply": {
        "description": "Create a new Email Reply.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "mailboxID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Mailbox ID"
                }
            },
            {
                "name": "emailID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Email ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "properties": {
                "attachments": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "contentBase64": {
                                "type": "string"
                            },
                            "contentType": {
                                "type": "string"
                            },
                            "filename": {
                                "type": "string"
                            }
                        }
                    }
                },
                "bccs": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "ccs": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "content": {
                    "type": "string"
                },
                "includeHistory": {
                    "type": "boolean"
                }
            }
        }
    },
    "salesforge GET /workspaces/{workspaceID}/mailboxes/{mailboxID}/threads/{threadID}": {
        "description": "Get thread information.\nDeprecated: use GET /workspaces/{workspaceID}/threads/{threadID} instead, which also supports mailbox-less (LinkedIn-only) threads.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "mailboxID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Mailbox ID"
                }
            },
            {
                "name": "threadID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Thread ID"
                }
            }
        ]
    },
    "salesforge PUT /workspaces/{workspaceID}/mailboxes/{mailboxID}/threads/{threadID}/label": {
        "description": "Update the label of a thread.\nDeprecated: use PUT /workspaces/{workspaceID}/threads/{threadID}/label instead, which also supports mailbox-less (LinkedIn-only) threads.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "mailboxID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Mailbox ID"
                }
            },
            {
                "name": "threadID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Thread ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "labelId"
            ],
            "properties": {
                "labelId": {
                    "type": "string",
                    "description": "LabelID is the primebox label to apply to the thread."
                }
            }
        }
    },
    "salesforge GET /workspaces/{workspaceID}/primebox-labels": {
        "description": "Get a paginated list of primebox labels associated with the workspace.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "limit",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Limit"
                }
            },
            {
                "name": "offset",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Offset"
                }
            }
        ]
    },
    "salesforge GET /workspaces/{workspaceID}/products": {
        "description": "Get products associated with the workspace.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "limit",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Limit"
                }
            },
            {
                "name": "offset",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Offset"
                }
            }
        ]
    },
    "salesforge POST /workspaces/{workspaceID}/products": {
        "description": "Create a new product.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "properties": {
                "product": {
                    "type": "object",
                    "properties": {
                        "costOfInaction": {
                            "type": "string"
                        },
                        "idealCustomerProfile": {
                            "type": "string"
                        },
                        "industry": {
                            "type": "string"
                        },
                        "internalName": {
                            "type": "string"
                        },
                        "language": {
                            "type": "string",
                            "enum": [
                                "russian",
                                "ukrainian",
                                "finnish",
                                "american_english",
                                "british_english",
                                "french",
                                "spanish",
                                "polish",
                                "romanian",
                                "german",
                                "lithuanian",
                                "dutch",
                                "latvian",
                                "italian",
                                "czech",
                                "hungarian",
                                "japanese",
                                "brazilian_portugese",
                                "swedish",
                                "danish",
                                "norwegian",
                                "estonian"
                            ]
                        },
                        "name": {
                            "type": "string"
                        },
                        "pain": {
                            "type": "string"
                        },
                        "proofPoints": {
                            "type": "string"
                        },
                        "solution": {
                            "type": "string"
                        }
                    }
                },
                "translation": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "costOfInaction": {
                                "type": "string"
                            },
                            "idealCustomerProfile": {
                                "type": "string"
                            },
                            "industry": {
                                "type": "string"
                            },
                            "internalName": {
                                "type": "string"
                            },
                            "language": {
                                "type": "string",
                                "enum": [
                                    "russian",
                                    "ukrainian",
                                    "finnish",
                                    "american_english",
                                    "british_english",
                                    "french",
                                    "spanish",
                                    "polish",
                                    "romanian",
                                    "german",
                                    "lithuanian",
                                    "dutch",
                                    "latvian",
                                    "italian",
                                    "czech",
                                    "hungarian",
                                    "japanese",
                                    "brazilian_portugese",
                                    "swedish",
                                    "danish",
                                    "norwegian",
                                    "estonian"
                                ]
                            },
                            "name": {
                                "type": "string"
                            },
                            "pain": {
                                "type": "string"
                            },
                            "proofPoints": {
                                "type": "string"
                            },
                            "solution": {
                                "type": "string"
                            }
                        }
                    }
                }
            }
        }
    },
    "salesforge GET /workspaces/{workspaceID}/products/{productID}": {
        "description": "Get product information.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "productID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Product ID"
                }
            }
        ]
    },
    "salesforge GET /workspaces/{workspaceID}/sending-data": {
        "description": "Get sending data for sequences in a workspace.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "limit",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "maximum": 1000,
                    "description": "Limit"
                }
            },
            {
                "name": "offset",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Offset"
                }
            },
            {
                "name": "sequence_ids[]",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    },
                    "description": "Filter by sequences"
                }
            }
        ]
    },
    "salesforge GET /workspaces/{workspaceID}/sequence-metrics": {
        "description": "Get sequence metrics associated with the workspace.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "product_id",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Filter by product ID"
                }
            },
            {
                "name": "sequence_ids[]",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    },
                    "description": "Filter by sequence IDs"
                }
            }
        ]
    },
    "salesforge GET /workspaces/{workspaceID}/sequences": {
        "description": "Returns every sequence in the workspace. Multichannel sequences are listed first, followed by legacy sequences to fill the requested page size.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "limit",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Limit"
                }
            },
            {
                "name": "offset",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Offset"
                }
            },
            {
                "name": "statuses[]",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "array",
                    "items": {
                        "type": "string",
                        "enum": [
                            "active",
                            "paused",
                            "draft",
                            "completed"
                        ]
                    },
                    "description": "Filter by status"
                }
            },
            {
                "name": "product_id",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Filter by product ID"
                }
            },
            {
                "name": "sequence_ids[]",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    },
                    "description": "Filter by sequence IDs"
                }
            },
            {
                "name": "type",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "enum": [
                        "legacy",
                        "multichannel"
                    ],
                    "description": "Filter by sequence type"
                }
            }
        ]
    },
    "salesforge POST /workspaces/{workspaceID}/sequences": {
        "description": "Create a new sequence.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "language",
                "name",
                "productId",
                "timezone"
            ],
            "properties": {
                "language": {
                    "type": "string",
                    "enum": [
                        "russian",
                        "ukrainian",
                        "finnish",
                        "american_english",
                        "british_english",
                        "french",
                        "spanish",
                        "polish",
                        "romanian",
                        "german",
                        "lithuanian",
                        "dutch",
                        "latvian",
                        "italian",
                        "czech",
                        "hungarian",
                        "japanese",
                        "brazilian_portugese",
                        "swedish",
                        "danish",
                        "norwegian",
                        "estonian"
                    ]
                },
                "name": {
                    "type": "string"
                },
                "productId": {
                    "type": "string"
                },
                "timezone": {
                    "type": "string"
                }
            }
        }
    },
    "salesforge DELETE /workspaces/{workspaceID}/sequences/{sequenceID}": {
        "description": "Delete a sequence.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Sequence ID"
                }
            }
        ]
    },
    "salesforge GET /workspaces/{workspaceID}/sequences/{sequenceID}": {
        "description": "Get a specific sequence by ID.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Sequence ID"
                }
            }
        ]
    },
    "salesforge PUT /workspaces/{workspaceID}/sequences/{sequenceID}": {
        "description": "Update an existing sequence.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Sequence ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "properties": {
                "bcc": {
                    "type": "string"
                },
                "bounceProtectorEnabled": {
                    "type": "boolean"
                },
                "cc": {
                    "type": "string"
                },
                "clickTrackingEnabled": {
                    "type": "boolean"
                },
                "companyOutreachLimitCount": {
                    "type": "integer"
                },
                "companyOutreachLimitEnabled": {
                    "type": "boolean"
                },
                "espMatchingEnabled": {
                    "type": "boolean"
                },
                "finishOnClick": {
                    "type": "boolean"
                },
                "finishOnOpen": {
                    "type": "boolean"
                },
                "language": {
                    "type": "string"
                },
                "listUnsubscribeEnabled": {
                    "type": "boolean"
                },
                "localizedOptOutEnabled": {
                    "type": "boolean"
                },
                "name": {
                    "type": "string",
                    "minLength": 1
                },
                "openTrackingEnabled": {
                    "type": "boolean"
                },
                "opportunitiesValue": {
                    "type": "number"
                },
                "optOutText": {
                    "type": "string"
                },
                "plainTextEmailsEnabled": {
                    "type": "boolean"
                },
                "productId": {
                    "type": "string",
                    "minLength": 1
                },
                "sequentialCompanySendingEnabled": {
                    "type": "boolean"
                },
                "status": {
                    "type": "string",
                    "enum": [
                        "active",
                        "draft",
                        "paused",
                        "deleted",
                        "completed",
                        "video_pending",
                        "active",
                        "paused"
                    ]
                },
                "stopOnDomainReplyEnabled": {
                    "type": "boolean"
                },
                "subsequencePrimeboxLabelId": {
                    "type": "string"
                },
                "timezone": {
                    "type": "string",
                    "minLength": 1
                },
                "trackOpportunitiesEnabled": {
                    "type": "boolean"
                },
                "trackingDomainEnabled": {
                    "type": "string"
                },
                "unsubscribeLinkEnabled": {
                    "type": "boolean"
                },
                "unsubscribeLinkText": {
                    "type": "string"
                }
            }
        }
    },
    "salesforge GET /workspaces/{workspaceID}/sequences/{sequenceID}/analytics": {
        "description": "Get analytics for a sequence.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Sequence ID"
                }
            },
            {
                "name": "from_date",
                "location": "query",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "From date"
                }
            },
            {
                "name": "to_date",
                "location": "query",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "To date"
                }
            },
            {
                "name": "timezone",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Timezone"
                }
            }
        ]
    },
    "salesforge PUT /workspaces/{workspaceID}/sequences/{sequenceID}/contacts": {
        "description": "Assign contacts to a sequence.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Sequence ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "contactIds"
            ],
            "properties": {
                "contactIds": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                        "type": "string"
                    }
                }
            }
        }
    },
    "salesforge GET /workspaces/{workspaceID}/sequences/{sequenceID}/contacts/count": {
        "description": "Get the number of contacts assigned to a sequence.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Sequence ID"
                }
            },
            {
                "name": "statuses[]",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "array",
                    "items": {
                        "type": "string",
                        "enum": [
                            "ooo",
                            "bounced",
                            "replied",
                            "failed",
                            "active",
                            "paused",
                            "finished",
                            "dnc",
                            "deleted",
                            "unsubscribed"
                        ]
                    },
                    "description": "Filter by status"
                }
            }
        ]
    },
    "salesforge POST /workspaces/{workspaceID}/sequences/{sequenceID}/contacts/validation/confirm": {
        "description": "Confirm validation results for contacts assigned to a sequence.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Sequence ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "esps"
            ],
            "properties": {
                "esps": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                        "type": "string",
                        "enum": [
                            "empty",
                            "gmail",
                            "gsuite",
                            "icloud",
                            "outlook",
                            "ms365",
                            "yandex",
                            "yahoo",
                            "unknown",
                            "mailcom",
                            "proofpoint",
                            "antispamsoftware"
                        ]
                    }
                },
                "statuses": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                        "type": "string",
                        "enum": [
                            "safe",
                            "invalid",
                            "disabled",
                            "disposable",
                            "inbox_full",
                            "catch_all",
                            "role_account",
                            "spamtrap",
                            "unknown",
                            "unvalidated"
                        ]
                    }
                }
            }
        }
    },
    "salesforge GET /workspaces/{workspaceID}/sequences/{sequenceID}/contacts/validation/result": {
        "description": "Get sequence contact validation results.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Sequence ID"
                }
            }
        ]
    },
    "salesforge POST /workspaces/{workspaceID}/sequences/{sequenceID}/contacts/validation/skip": {
        "description": "Skip validation results for contacts assigned to a sequence.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Sequence ID"
                }
            }
        ]
    },
    "salesforge POST /workspaces/{workspaceID}/sequences/{sequenceID}/contacts/validation/start": {
        "description": "Start sequence contact validation.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Sequence ID"
                }
            }
        ]
    },
    "salesforge POST /workspaces/{workspaceID}/sequences/{sequenceID}/contacts/validation/validate": {
        "description": "Validate contacts assigned to a sequence.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Sequence ID"
                }
            }
        ]
    },
    "salesforge PUT /workspaces/{workspaceID}/sequences/{sequenceID}/import-lead": {
        "description": "Import lead to a sequence. Requires at least one of email or linkedinUrl. If no tag is provided, a default date-based tag is applied automatically.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Sequence ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "firstName"
            ],
            "properties": {
                "company": {
                    "type": "string",
                    "minLength": 1
                },
                "customVars": {
                    "type": "object",
                    "additionalProperties": {
                        "type": "string"
                    }
                },
                "email": {
                    "type": "string",
                    "description": "Email of the contact. Either email or linkedinUrl must be provided."
                },
                "firstName": {
                    "type": "string"
                },
                "lastName": {
                    "type": "string"
                },
                "linkedinUrl": {
                    "type": "string",
                    "description": "LinkedInUrl of the contact. Either email or linkedinUrl must be provided."
                },
                "position": {
                    "type": "string"
                },
                "tagIds": {
                    "type": "array",
                    "description": "TagIDs are existing tag IDs to apply to the contact. The bulk create endpoint requires at least one tag (tags or tagIds).",
                    "items": {
                        "type": "string"
                    }
                },
                "tags": {
                    "type": "array",
                    "description": "TagNames are tag names to apply to the contact. The bulk create endpoint requires at least one tag (tags or tagIds).",
                    "items": {
                        "type": "string"
                    }
                }
            }
        }
    },
    "salesforge PUT /workspaces/{workspaceID}/sequences/{sequenceID}/mailboxes": {
        "description": "Assign mailboxes to a sequence.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Sequence ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "mailboxIds"
            ],
            "properties": {
                "mailboxIds": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            }
        }
    },
    "salesforge PUT /workspaces/{workspaceID}/sequences/{sequenceID}/schedules": {
        "description": "Update an existing sequence's schedules.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Sequence ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "properties": {
                "schedules": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                        "type": "object",
                        "properties": {
                            "fromHour": {
                                "type": "integer",
                                "minimum": 0,
                                "maximum": 23
                            },
                            "toHour": {
                                "type": "integer",
                                "minimum": 1,
                                "maximum": 24
                            },
                            "weekday": {
                                "type": "integer",
                                "minimum": 0,
                                "maximum": 6
                            }
                        }
                    }
                }
            }
        }
    },
    "salesforge PUT /workspaces/{workspaceID}/sequences/{sequenceID}/status": {
        "description": "Update a sequence's status.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Sequence ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "status"
            ],
            "properties": {
                "status": {
                    "type": "string",
                    "enum": [
                        "active",
                        "paused"
                    ]
                }
            }
        }
    },
    "salesforge PUT /workspaces/{workspaceID}/sequences/{sequenceID}/steps": {
        "description": "Update an existing sequence's steps.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Sequence ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "properties": {
                "steps": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                        "type": "object",
                        "required": [
                            "id"
                        ],
                        "properties": {
                            "distributionStrategy": {
                                "type": "string",
                                "enum": [
                                    "equal",
                                    "custom",
                                    "equal",
                                    "custom"
                                ]
                            },
                            "id": {
                                "type": "string"
                            },
                            "name": {
                                "type": "string"
                            },
                            "order": {
                                "type": "integer",
                                "minimum": 0
                            },
                            "variants": {
                                "type": "array",
                                "minItems": 1,
                                "items": {
                                    "type": "object",
                                    "required": [
                                        "label"
                                    ],
                                    "properties": {
                                        "contactInformationSource": {
                                            "type": "string",
                                            "enum": [
                                                "linkedin",
                                                "website",
                                                "all",
                                                "linkedin",
                                                "website",
                                                "all"
                                            ]
                                        },
                                        "distributionWeight": {
                                            "type": "number",
                                            "minimum": 0,
                                            "maximum": 100
                                        },
                                        "dynamicLanguageEnabled": {
                                            "type": "boolean"
                                        },
                                        "emailContent": {
                                            "type": "string"
                                        },
                                        "emailSubject": {
                                            "type": "string"
                                        },
                                        "id": {
                                            "type": "string",
                                            "minLength": 1
                                        },
                                        "isGenerated": {
                                            "type": "boolean"
                                        },
                                        "label": {
                                            "type": "string"
                                        },
                                        "order": {
                                            "type": "integer",
                                            "minimum": 0
                                        },
                                        "overdriveEnabled": {
                                            "type": "boolean"
                                        },
                                        "status": {
                                            "type": "string",
                                            "enum": [
                                                "active",
                                                "paused",
                                                "deleted",
                                                "active",
                                                "paused"
                                            ]
                                        },
                                        "tonality": {
                                            "type": "string",
                                            "enum": [
                                                "playful",
                                                "hilarious",
                                                "formal",
                                                "curious",
                                                "urgent",
                                                "appreciative",
                                                "polite",
                                                "enthusiastic",
                                                "warm",
                                                "empathetic",
                                                "direct",
                                                "persuasive",
                                                "confident",
                                                "respectful",
                                                "helpful",
                                                "sincere",
                                                "encouraging",
                                                "informal",
                                                "caring",
                                                "diplomatic",
                                                "assertive",
                                                "reassuring",
                                                "authoritative"
                                            ],
                                            "minLength": 1
                                        }
                                    }
                                }
                            },
                            "waitDays": {
                                "type": "integer",
                                "minimum": 0
                            }
                        }
                    }
                }
            }
        }
    },
    "salesforge GET /workspaces/{workspaceID}/tags": {
        "description": "Returns the non-hidden tags in the workspace, with their IDs and names. Results are ordered by name. Use these IDs with contacts filters (tag_ids[] / tagIds) and when creating contacts (tagIds).",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "limit",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Limit (max 100)"
                }
            },
            {
                "name": "offset",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Offset"
                }
            },
            {
                "name": "search",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Return only tags whose name contains this value"
                }
            },
            {
                "name": "caseSensitive",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "boolean",
                    "description": "Match search exactly instead of ignoring case"
                }
            }
        ]
    },
    "salesforge GET /workspaces/{workspaceID}/threads": {
        "description": "Get a list of threads associated with the workspace.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "limit",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Limit"
                }
            },
            {
                "name": "offset",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Offset"
                }
            },
            {
                "name": "mailbox_ids[]",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    },
                    "description": "Filter by mailboxes"
                }
            },
            {
                "name": "agent_ids[]",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    },
                    "description": "Filter by agents"
                }
            },
            {
                "name": "sequence_ids[]",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    },
                    "description": "Filter by sequences"
                }
            },
            {
                "name": "positive",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "boolean",
                    "description": "Filter by positive/negative sentiment"
                }
            },
            {
                "name": "filter",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Filter criteria (e.g. all, unread, archived)"
                }
            },
            {
                "name": "labels[]",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    },
                    "description": "Filter by label IDs"
                }
            },
            {
                "name": "exclude_labels[]",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    },
                    "description": "Exclude label IDs"
                }
            },
            {
                "name": "q",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Search query"
                }
            }
        ]
    },
    "salesforge GET /workspaces/{workspaceID}/threads/{threadID}": {
        "description": "Get thread information for a workspace thread. Supports both mailbox (email)\nthreads and mailbox-less (LinkedIn-only) threads created through multichannel\nsequence execution.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "threadID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Thread ID"
                }
            }
        ]
    },
    "salesforge PUT /workspaces/{workspaceID}/threads/{threadID}/label": {
        "description": "Update the label of a workspace thread. Supports both mailbox (email) threads\nand mailbox-less (LinkedIn-only) threads created through multichannel sequence execution.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "threadID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Thread ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "labelId"
            ],
            "properties": {
                "labelId": {
                    "type": "string",
                    "description": "LabelID is the primebox label to apply to the thread."
                }
            }
        }
    },
    "salesforge GET /workspaces/{workspaceID}/threads/{threadID}/linkedin/messages/{messageID}/attachments": {
        "description": "Downloads all attachments for a LinkedIn message as a ZIP archive.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "threadID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Thread ID"
                }
            },
            {
                "name": "messageID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "LinkedIn message ID"
                }
            }
        ]
    },
    "salesforge GET /workspaces/{workspaceID}/threads/{threadID}/linkedin/messages/{messageID}/attachments/{attachmentID}": {
        "description": "Streams a single LinkedIn attachment by attachment ID.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "threadID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Thread ID"
                }
            },
            {
                "name": "messageID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "LinkedIn message ID"
                }
            },
            {
                "name": "attachmentID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "LinkedIn attachment ID"
                }
            }
        ]
    },
    "salesforge POST /workspaces/{workspaceID}/threads/{threadID}/linkedin/reply": {
        "description": "Sends a LinkedIn reply for the contact associated with the thread.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "threadID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Thread ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "accountId"
            ],
            "properties": {
                "accountId": {
                    "type": "integer"
                },
                "attachments": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "contentBase64": {
                                "type": "string"
                            },
                            "contentType": {
                                "type": "string"
                            },
                            "filename": {
                                "type": "string"
                            }
                        }
                    }
                },
                "message": {
                    "type": "string"
                }
            }
        }
    },
    "multichannel GET /multichannel/actions": {
        "description": "List actions",
        "parameters": [
            {
                "name": "channel",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "enum": [
                        "email",
                        "linkedin"
                    ],
                    "description": "Channel"
                }
            },
            {
                "name": "name",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Name"
                }
            },
            {
                "name": "page",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "description": "Page"
                }
            },
            {
                "name": "limit",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 100,
                    "description": "Limit (max 100)"
                }
            }
        ]
    },
    "multichannel GET /multichannel/conditions": {
        "description": "List conditions",
        "parameters": [
            {
                "name": "channel",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "enum": [
                        "email",
                        "linkedin"
                    ],
                    "description": "Channel"
                }
            },
            {
                "name": "name",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Name"
                }
            },
            {
                "name": "page",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "description": "Page"
                }
            },
            {
                "name": "limit",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 100,
                    "description": "Limit (max 100)"
                }
            }
        ]
    },
    "multichannel GET /multichannel/workspaces/{workspaceID}/linkedin-magic-links": {
        "description": "Returns the active LinkedIn magic link for the workspace, or null when none exists. Share the `url` with someone to let them connect a LinkedIn account without handing over credentials to your integration.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            }
        ]
    },
    "multichannel POST /multichannel/workspaces/{workspaceID}/linkedin-magic-links": {
        "description": "Creates a LinkedIn magic link for the workspace (replacing any active link). Share the returned `url` so a recipient can connect their LinkedIn account. Links expire after 7 days.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            }
        ]
    },
    "multichannel DELETE /multichannel/workspaces/{workspaceID}/linkedin-magic-links/{token}": {
        "description": "Deactivates a LinkedIn magic link so it can no longer be used to connect an account.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "token",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Magic link token"
                }
            }
        ]
    },
    "multichannel POST /multichannel/workspaces/{workspaceID}/linkedin-magic-links/{token}/extend": {
        "description": "Extends the expiry of an active LinkedIn magic link by 7 days from now.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "token",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Magic link token"
                }
            }
        ]
    },
    "multichannel POST /multichannel/workspaces/{workspaceID}/linkedin/accounts": {
        "description": "Connects a LinkedIn account to the workspace using credentials and an optional proxy. A matching sender profile is created automatically. If LinkedIn issues a 2FA challenge, the response carries `requires2fa: true` and the caller must submit the code via the OTP endpoint.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "email",
                "password"
            ],
            "properties": {
                "email": {
                    "type": "string",
                    "description": "LinkedIn login email."
                },
                "firstName": {
                    "type": "string",
                    "description": "First name recorded on the account."
                },
                "lastName": {
                    "type": "string",
                    "description": "Last name recorded on the account."
                },
                "linkedinUrl": {
                    "type": "string",
                    "description": "Public LinkedIn profile URL of the account."
                },
                "password": {
                    "type": "string",
                    "description": "LinkedIn login password."
                },
                "proxy": {
                    "type": "object",
                    "description": "Proxy to route the LinkedIn session through. Recommended for account stability.",
                    "required": [
                        "host",
                        "port"
                    ],
                    "properties": {
                        "host": {
                            "type": "string",
                            "description": "Proxy hostname. An explicit scheme (e.g. socks5://) selects the protocol; otherwise http is used.",
                            "minLength": 1
                        },
                        "password": {
                            "type": "string",
                            "description": "Proxy password, when the proxy requires authentication."
                        },
                        "port": {
                            "type": "integer",
                            "description": "Proxy port."
                        },
                        "username": {
                            "type": "string",
                            "description": "Proxy username, when the proxy requires authentication."
                        }
                    }
                },
                "skipSenderProfile": {
                    "type": "boolean",
                    "description": "Connect the account without creating a sender profile for it. By default a draft sender\nprofile is created and linked automatically. Set this to true to connect the account\nstandalone, then attach it via POST /sender-profiles or PATCH /sender-profiles/{id} with linkedinAccountId."
                }
            }
        }
    },
    "multichannel GET /multichannel/workspaces/{workspaceID}/linkedin/accounts/{linkedinAccountID}": {
        "description": "Returns the current state of a LinkedIn account. Useful while polling a connection that is waiting on OTP.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "linkedinAccountID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "LinkedIn account ID"
                }
            }
        ]
    },
    "multichannel POST /multichannel/workspaces/{workspaceID}/linkedin/accounts/{linkedinAccountID}/disconnect": {
        "description": "Removes the provider connection while preserving the local account, history, and sender-profile association. Supports standalone accounts. Repeated disconnects succeed when the provider account is already absent.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "linkedinAccountID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "LinkedIn account ID"
                }
            }
        ]
    },
    "multichannel POST /multichannel/workspaces/{workspaceID}/linkedin/accounts/{linkedinAccountID}/otp": {
        "description": "Submits a one-time password to complete a LinkedIn account connection that is waiting on 2FA verification.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "linkedinAccountID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "LinkedIn account ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "code"
            ],
            "properties": {
                "code": {
                    "type": "string",
                    "description": "One-time code from the challenge.",
                    "minLength": 4,
                    "maxLength": 10
                }
            }
        }
    },
    "multichannel POST /multichannel/workspaces/{workspaceID}/linkedin/accounts/{linkedinAccountID}/reconnect": {
        "description": "Reconnects an existing LinkedIn account with new credentials, preserving its ID, limits, history and any sender-profile association. Supports standalone accounts without creating a profile. An optional email must match the existing account. Complete any returned checkpoint through the existing account OTP endpoint.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "linkedinAccountID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "LinkedIn account ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "password"
            ],
            "properties": {
                "email": {
                    "type": "string",
                    "description": "Optional login email; if supplied it must match the existing account's email."
                },
                "firstName": {
                    "type": "string"
                },
                "lastName": {
                    "type": "string"
                },
                "password": {
                    "type": "string"
                },
                "proxy": {
                    "type": "object",
                    "description": "Proxy to route the LinkedIn session through. Recommended for account stability.",
                    "required": [
                        "host",
                        "port"
                    ],
                    "properties": {
                        "host": {
                            "type": "string",
                            "description": "Proxy hostname. An explicit scheme (e.g. socks5://) selects the protocol; otherwise http is used.",
                            "minLength": 1
                        },
                        "password": {
                            "type": "string",
                            "description": "Proxy password, when the proxy requires authentication."
                        },
                        "port": {
                            "type": "integer",
                            "description": "Proxy port."
                        },
                        "username": {
                            "type": "string",
                            "description": "Proxy username, when the proxy requires authentication."
                        }
                    }
                }
            }
        }
    },
    "multichannel GET /multichannel/workspaces/{workspaceID}/sender-profiles": {
        "description": "List sender profiles",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "page",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "description": "Page"
                }
            },
            {
                "name": "limit",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 100,
                    "description": "Limit (max 100)"
                }
            }
        ]
    },
    "multichannel POST /multichannel/workspaces/{workspaceID}/sender-profiles": {
        "description": "Creates a sender profile from mailboxes and/or an already-connected LinkedIn account. A profile with no sender attached is created in draft status.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "name"
            ],
            "properties": {
                "linkedinAccountId": {
                    "type": "integer",
                    "description": "ID of an already-connected LinkedIn account to attach. The account must belong to the\nworkspace and must not already be attached to another sender profile. Connect an account\nstandalone via POST /linkedin/accounts with skipSenderProfile set to true."
                },
                "mailboxIds": {
                    "type": "array",
                    "description": "Mailbox IDs to attach to the profile. Mailboxes must already exist in the workspace.",
                    "items": {
                        "type": "string"
                    }
                },
                "name": {
                    "type": "string",
                    "description": "Display name of the sender profile."
                }
            }
        }
    },
    "multichannel POST /multichannel/workspaces/{workspaceID}/sender-profiles/bulk": {
        "description": "Creates up to 100 sender profiles in one call. Entries are applied independently: the response reports per-entry success or failure, and a failing entry does not prevent the others from being created.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "profiles"
            ],
            "properties": {
                "profiles": {
                    "type": "array",
                    "description": "Sender profiles to create. Entries are applied independently: a failing entry is reported in\nits own result and does not prevent the others from being created.",
                    "minItems": 1,
                    "maxItems": 100,
                    "items": {
                        "type": "object",
                        "required": [
                            "name"
                        ],
                        "properties": {
                            "linkedinAccountId": {
                                "type": "integer",
                                "description": "ID of an already-connected LinkedIn account to attach. The account must belong to the\nworkspace and must not already be attached to another sender profile. Connect an account\nstandalone via POST /linkedin/accounts with skipSenderProfile set to true."
                            },
                            "mailboxIds": {
                                "type": "array",
                                "description": "Mailbox IDs to attach to the profile. Mailboxes must already exist in the workspace.",
                                "items": {
                                    "type": "string"
                                }
                            },
                            "name": {
                                "type": "string",
                                "description": "Display name of the sender profile."
                            }
                        }
                    }
                }
            }
        }
    },
    "multichannel DELETE /multichannel/workspaces/{workspaceID}/sender-profiles/{senderProfileID}": {
        "description": "Delete sender profile",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "senderProfileID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Sender profile ID"
                }
            }
        ]
    },
    "multichannel PATCH /multichannel/workspaces/{workspaceID}/sender-profiles/{senderProfileID}": {
        "description": "Update name/mailboxes or attach an existing LinkedIn account to an unlinked profile. Repeating the same account ID is allowed; replacement returns 409. Omitted/null linkedinAccountId and omitted mailboxIds leave existing associations unchanged.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "senderProfileID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Sender profile ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "properties": {
                "linkedinAccountId": {
                    "type": "integer",
                    "description": "Attach an existing account from this workspace to an unlinked profile. Repeating the same\nID is allowed; replacing another account is rejected. Omitted or null leaves it unchanged."
                },
                "mailboxIds": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "name": {
                    "type": "string"
                }
            }
        }
    },
    "multichannel GET /multichannel/workspaces/{workspaceID}/sequences": {
        "description": "List sequences",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "page",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "description": "Page"
                }
            },
            {
                "name": "limit",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 100,
                    "description": "Limit (max 100)"
                }
            },
            {
                "name": "status",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "enum": [
                        "draft",
                        "active",
                        "completed",
                        "paused"
                    ],
                    "description": "Status"
                }
            }
        ]
    },
    "multichannel POST /multichannel/workspaces/{workspaceID}/sequences": {
        "description": "Create sequence",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "name"
            ],
            "properties": {
                "description": {
                    "type": "string"
                },
                "kind": {
                    "type": "string",
                    "enum": [
                        "primary",
                        "subsequence"
                    ]
                },
                "name": {
                    "type": "string"
                },
                "timezone": {
                    "type": "string"
                }
            }
        }
    },
    "multichannel DELETE /multichannel/workspaces/{workspaceID}/sequences/{sequenceID}": {
        "description": "Delete sequence",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Sequence ID"
                }
            }
        ]
    },
    "multichannel GET /multichannel/workspaces/{workspaceID}/sequences/{sequenceID}": {
        "description": "Get sequence details",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Sequence ID"
                }
            }
        ]
    },
    "multichannel PATCH /multichannel/workspaces/{workspaceID}/sequences/{sequenceID}": {
        "description": "Update sequence",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Sequence ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "properties": {
                "description": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                },
                "timezone": {
                    "type": "string"
                }
            }
        }
    },
    "multichannel GET /multichannel/workspaces/{workspaceID}/sequences/{sequenceID}/analytics": {
        "description": "Returns per-day and aggregate email sending and engagement metrics for a multichannel sequence. Query dates are interpreted in `timezone` when provided (IANA name), otherwise UTC. Open and click metrics are zeroed when the sequence has those tracking modes disabled.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Sequence ID"
                }
            },
            {
                "name": "from_date",
                "location": "query",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Start date (inclusive, YYYY-MM-DD)"
                }
            },
            {
                "name": "to_date",
                "location": "query",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "End date (inclusive, YYYY-MM-DD)"
                }
            },
            {
                "name": "timezone",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "IANA timezone for day boundaries (default UTC)"
                }
            }
        ]
    },
    "multichannel GET /multichannel/workspaces/{workspaceID}/sequences/{sequenceID}/branches": {
        "description": "List sequence branches",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Sequence ID"
                }
            },
            {
                "name": "page",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "description": "Page"
                }
            },
            {
                "name": "limit",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 100,
                    "description": "Limit (max 100)"
                }
            }
        ]
    },
    "multichannel POST /multichannel/workspaces/{workspaceID}/sequences/{sequenceID}/enrollments": {
        "description": "Deprecated. Enrolls matching contacts immediately without conflict review. Use the enrollment preflight and confirmation endpoints for new integrations.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Sequence ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "properties": {
                "filters": {
                    "type": "object",
                    "description": "Contact filters.",
                    "properties": {
                        "customVarIds": {
                            "type": "array",
                            "description": "Custom variable IDs to include.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "customVars": {
                            "type": "array",
                            "description": "Custom variable values to include.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "esps": {
                            "type": "array",
                            "description": "Email service providers to include.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "excludeContacted": {
                            "type": "boolean",
                            "description": "Whether to exclude contacts that have already been contacted."
                        },
                        "hasEmail": {
                            "type": "boolean",
                            "description": "Whether to require an email address."
                        },
                        "hasValidLinkedIn": {
                            "type": "boolean",
                            "description": "Whether to require a valid LinkedIn profile."
                        },
                        "leadIds": {
                            "type": "array",
                            "description": "Contact IDs to include. Intersected with validationRunId when both are provided.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "notInCustomVarIds": {
                            "type": "array",
                            "description": "Custom variable IDs to exclude.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "notInCustomVars": {
                            "type": "array",
                            "description": "Custom variable values to exclude.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "notInESPs": {
                            "type": "array",
                            "description": "Email service providers to exclude.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "notInLeadIds": {
                            "type": "array",
                            "description": "Contact IDs to exclude.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "notInTagIds": {
                            "type": "array",
                            "description": "Tag IDs to exclude.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "searchQuery": {
                            "type": "string",
                            "description": "Contact search query."
                        },
                        "tagIds": {
                            "type": "array",
                            "description": "Tag IDs to include.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "validationRunId": {
                            "type": "string",
                            "description": "Completed validation run ID. The run must contain at least one contact."
                        },
                        "validationStatuses": {
                            "type": "array",
                            "description": "Email validation statuses to include.",
                            "items": {
                                "type": "string",
                                "enum": [
                                    "safe",
                                    "invalid",
                                    "disabled",
                                    "disposable",
                                    "inbox_full",
                                    "catch_all",
                                    "role_account",
                                    "spamtrap",
                                    "unknown",
                                    "unvalidated",
                                    "linkedin_only"
                                ]
                            }
                        }
                    }
                },
                "limit": {
                    "type": "integer",
                    "description": "Maximum number of contacts to enroll."
                }
            }
        }
    },
    "multichannel POST /multichannel/workspaces/{workspaceID}/sequences/{sequenceID}/enrollments/preflight": {
        "description": "Analyzes matching contacts before enrollment and creates a preflight that expires after 15 minutes. Returns candidate totals, conflicts, available source cleanup groups, and replied-contact information. validationRunId must reference a completed validation run containing at least one contact.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Sequence ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "properties": {
                "filters": {
                    "type": "object",
                    "description": "Contact filters.",
                    "properties": {
                        "customVarIds": {
                            "type": "array",
                            "description": "Custom variable IDs to include.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "customVars": {
                            "type": "array",
                            "description": "Custom variable values to include.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "esps": {
                            "type": "array",
                            "description": "Email service providers to include.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "excludeContacted": {
                            "type": "boolean",
                            "description": "Whether to exclude contacts that have already been contacted."
                        },
                        "hasEmail": {
                            "type": "boolean",
                            "description": "Whether to require an email address."
                        },
                        "hasValidLinkedIn": {
                            "type": "boolean",
                            "description": "Whether to require a valid LinkedIn profile."
                        },
                        "leadIds": {
                            "type": "array",
                            "description": "Contact IDs to include. Intersected with validationRunId when both are provided.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "notInCustomVarIds": {
                            "type": "array",
                            "description": "Custom variable IDs to exclude.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "notInCustomVars": {
                            "type": "array",
                            "description": "Custom variable values to exclude.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "notInESPs": {
                            "type": "array",
                            "description": "Email service providers to exclude.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "notInLeadIds": {
                            "type": "array",
                            "description": "Contact IDs to exclude.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "notInTagIds": {
                            "type": "array",
                            "description": "Tag IDs to exclude.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "searchQuery": {
                            "type": "string",
                            "description": "Contact search query."
                        },
                        "tagIds": {
                            "type": "array",
                            "description": "Tag IDs to include.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "validationRunId": {
                            "type": "string",
                            "description": "Completed validation run ID. The run must contain at least one contact."
                        },
                        "validationStatuses": {
                            "type": "array",
                            "description": "Email validation statuses to include.",
                            "items": {
                                "type": "string",
                                "enum": [
                                    "safe",
                                    "invalid",
                                    "disabled",
                                    "disposable",
                                    "inbox_full",
                                    "catch_all",
                                    "role_account",
                                    "spamtrap",
                                    "unknown",
                                    "unvalidated",
                                    "linkedin_only"
                                ]
                            }
                        }
                    }
                },
                "limit": {
                    "type": "integer",
                    "description": "Maximum number of candidate contacts."
                },
                "selectionScope": {
                    "type": "string",
                    "description": "Sequence decision-membership scope. in_sequence includes contacts with any draft-sequence enrollment or an enrollment whose status is active, paused, out_of_office, failed, company_limit_reached, or replied. not_in_sequence includes all other contacts, including contacts whose only enrollments are completed, dnc, unsubscribed, or bounced. Defaults to all.",
                    "enum": [
                        "all",
                        "not_in_sequence",
                        "in_sequence"
                    ]
                }
            }
        }
    },
    "multichannel POST /multichannel/workspaces/{workspaceID}/sequences/{sequenceID}/enrollments/preflight/{preflightID}/confirm": {
        "description": "Applies a skip or move decision to a saved preflight. For each selected source, a draft enrollment is deleted; any other enrollment is set to completed and its pending steps are canceled. skipReplied is required for move decisions; true leaves replied contacts unenrolled. Contacts suppressed elsewhere by do-not-contact, unsubscribe, or bounce shield are enrolled with that status, are not contacted, and remain included in enrolledLeadIds and enrolledCount. A stale preflight returns 409 with a replacement preflight. A concurrent confirmation returns 423.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Sequence ID"
                }
            },
            {
                "name": "preflightID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Preflight ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "action"
            ],
            "properties": {
                "action": {
                    "type": "string",
                    "description": "Conflict resolution action. skip excludes conflicts; move resolves selected source conflicts.",
                    "enum": [
                        "skip",
                        "move"
                    ]
                },
                "moveSourceSequenceIds": {
                    "type": "array",
                    "description": "Source sequence IDs to clean before enrollment.",
                    "items": {
                        "type": "integer"
                    }
                },
                "skipReplied": {
                    "type": "boolean",
                    "description": "Whether to exclude contacts with replies. Required for move decisions."
                }
            }
        }
    },
    "multichannel POST /multichannel/workspaces/{workspaceID}/sequences/{sequenceID}/enrollments/preflight/{preflightID}/move-preview": {
        "description": "Calculates the projected outcome of a move decision without changing enrollments. Returns projected enrollment, skip, and source cleanup counts with a skip-reason breakdown. A stale preflight returns 409 with a replacement preflight.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Sequence ID"
                }
            },
            {
                "name": "preflightID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Preflight ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "skipReplied"
            ],
            "properties": {
                "moveSourceSequenceIds": {
                    "type": "array",
                    "description": "Source sequence IDs to clean before enrollment.",
                    "items": {
                        "type": "integer"
                    }
                },
                "skipReplied": {
                    "type": "boolean",
                    "description": "Whether to exclude contacts with replies."
                }
            }
        }
    },
    "multichannel POST /multichannel/workspaces/{workspaceID}/sequences/{sequenceID}/enrollments/remove": {
        "description": "Removes matching contacts from the sequence. Enrollment preflight is not required.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Sequence ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "properties": {
                "filters": {
                    "type": "object",
                    "description": "Contact filters.",
                    "properties": {
                        "customVarIds": {
                            "type": "array",
                            "description": "Custom variable IDs to include.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "customVars": {
                            "type": "array",
                            "description": "Custom variable values to include.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "esps": {
                            "type": "array",
                            "description": "Email service providers to include.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "excludeContacted": {
                            "type": "boolean",
                            "description": "Whether to exclude contacts that have already been contacted."
                        },
                        "hasEmail": {
                            "type": "boolean",
                            "description": "Whether to require an email address."
                        },
                        "hasValidLinkedIn": {
                            "type": "boolean",
                            "description": "Whether to require a valid LinkedIn profile."
                        },
                        "leadIds": {
                            "type": "array",
                            "description": "Contact IDs to include. Intersected with validationRunId when both are provided.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "notInCustomVarIds": {
                            "type": "array",
                            "description": "Custom variable IDs to exclude.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "notInCustomVars": {
                            "type": "array",
                            "description": "Custom variable values to exclude.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "notInESPs": {
                            "type": "array",
                            "description": "Email service providers to exclude.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "notInLeadIds": {
                            "type": "array",
                            "description": "Contact IDs to exclude.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "notInTagIds": {
                            "type": "array",
                            "description": "Tag IDs to exclude.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "searchQuery": {
                            "type": "string",
                            "description": "Contact search query."
                        },
                        "tagIds": {
                            "type": "array",
                            "description": "Tag IDs to include.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "validationRunId": {
                            "type": "string",
                            "description": "Completed validation run ID. The run must contain at least one contact."
                        },
                        "validationStatuses": {
                            "type": "array",
                            "description": "Email validation statuses to include.",
                            "items": {
                                "type": "string",
                                "enum": [
                                    "safe",
                                    "invalid",
                                    "disabled",
                                    "disposable",
                                    "inbox_full",
                                    "catch_all",
                                    "role_account",
                                    "spamtrap",
                                    "unknown",
                                    "unvalidated",
                                    "linkedin_only"
                                ]
                            }
                        }
                    }
                },
                "limit": {
                    "type": "integer",
                    "description": "Maximum number of contacts to remove."
                }
            }
        }
    },
    "multichannel PATCH /multichannel/workspaces/{workspaceID}/sequences/{sequenceID}/launch": {
        "description": "Launch sequence",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Sequence ID"
                }
            }
        ]
    },
    "multichannel GET /multichannel/workspaces/{workspaceID}/sequences/{sequenceID}/nodes": {
        "description": "List nodes",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Sequence ID"
                }
            },
            {
                "name": "type",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "enum": [
                        "action",
                        "condition",
                        "root",
                        "terminal"
                    ],
                    "description": "Node type"
                }
            },
            {
                "name": "channel",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "enum": [
                        "email",
                        "linkedin",
                        "inmail"
                    ],
                    "description": "Channel"
                }
            },
            {
                "name": "name",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Name"
                }
            },
            {
                "name": "page",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "description": "Page"
                }
            },
            {
                "name": "limit",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 100,
                    "description": "Limit (max 100)"
                }
            }
        ]
    },
    "multichannel POST /multichannel/workspaces/{workspaceID}/sequences/{sequenceID}/nodes/actions": {
        "description": "Create action node",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Sequence ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "actionId",
                "branchId"
            ],
            "properties": {
                "actionId": {
                    "type": "integer"
                },
                "branchId": {
                    "type": "integer"
                },
                "distributionStrategy": {
                    "type": "string",
                    "enum": [
                        "equal",
                        "custom"
                    ]
                },
                "variants": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "exposureInPercentage": {
                                "type": "integer",
                                "minimum": 0,
                                "maximum": 100
                            },
                            "id": {
                                "type": "integer"
                            },
                            "isEnabled": {
                                "type": "boolean"
                            },
                            "metadata": {
                                "type": "object",
                                "properties": {
                                    "allowed_validation_statuses": {
                                        "type": "array",
                                        "items": {
                                            "type": "string"
                                        }
                                    },
                                    "message": {
                                        "type": "string"
                                    },
                                    "name": {
                                        "type": "string"
                                    },
                                    "subject": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                },
                "waitDays": {
                    "type": "integer",
                    "minimum": 0
                }
            }
        }
    },
    "multichannel PATCH /multichannel/workspaces/{workspaceID}/sequences/{sequenceID}/nodes/actions/{nodeID}": {
        "description": "Update action node",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Sequence ID"
                }
            },
            {
                "name": "nodeID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Node ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "properties": {
                "distributionStrategy": {
                    "type": "string",
                    "enum": [
                        "equal",
                        "custom"
                    ]
                },
                "variants": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "exposureInPercentage": {
                                "type": "integer",
                                "minimum": 0,
                                "maximum": 100
                            },
                            "id": {
                                "type": "integer"
                            },
                            "isEnabled": {
                                "type": "boolean"
                            },
                            "metadata": {
                                "type": "object",
                                "properties": {
                                    "allowed_validation_statuses": {
                                        "type": "array",
                                        "items": {
                                            "type": "string"
                                        }
                                    },
                                    "message": {
                                        "type": "string"
                                    },
                                    "name": {
                                        "type": "string"
                                    },
                                    "subject": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                },
                "wait_in_minutes": {
                    "type": "integer"
                }
            }
        }
    },
    "multichannel POST /multichannel/workspaces/{workspaceID}/sequences/{sequenceID}/nodes/conditions": {
        "description": "Create condition node",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Sequence ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "branchId",
                "conditionId"
            ],
            "properties": {
                "branchId": {
                    "type": "integer"
                },
                "conditionId": {
                    "type": "integer"
                },
                "distributionStrategy": {
                    "type": "string",
                    "enum": [
                        "equal",
                        "custom"
                    ]
                },
                "metadata": {
                    "type": "object",
                    "properties": {
                        "allowedValidationStatuses": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    }
                },
                "minutesToWait": {
                    "type": "integer"
                }
            }
        }
    },
    "multichannel DELETE /multichannel/workspaces/{workspaceID}/sequences/{sequenceID}/nodes/{nodeID}": {
        "description": "Delete node",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Sequence ID"
                }
            },
            {
                "name": "nodeID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Node ID"
                }
            }
        ]
    },
    "multichannel GET /multichannel/workspaces/{workspaceID}/sequences/{sequenceID}/nodes/{nodeID}": {
        "description": "Get node",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Sequence ID"
                }
            },
            {
                "name": "nodeID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Node ID"
                }
            }
        ]
    },
    "multichannel GET /multichannel/workspaces/{workspaceID}/sequences/{sequenceID}/schedule": {
        "description": "Get sequence schedule",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Sequence ID"
                }
            }
        ]
    },
    "multichannel PUT /multichannel/workspaces/{workspaceID}/sequences/{sequenceID}/schedule": {
        "description": "Update sequence schedule",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Sequence ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "schedule",
                "timezone"
            ],
            "properties": {
                "schedule": {
                    "type": "object",
                    "properties": {
                        "friday": {
                            "type": "object",
                            "properties": {
                                "enabled": {
                                    "type": "boolean"
                                },
                                "from": {
                                    "type": "integer",
                                    "minimum": 0,
                                    "maximum": 23
                                },
                                "to": {
                                    "type": "integer",
                                    "minimum": 0,
                                    "maximum": 23
                                }
                            }
                        },
                        "monday": {
                            "type": "object",
                            "properties": {
                                "enabled": {
                                    "type": "boolean"
                                },
                                "from": {
                                    "type": "integer",
                                    "minimum": 0,
                                    "maximum": 23
                                },
                                "to": {
                                    "type": "integer",
                                    "minimum": 0,
                                    "maximum": 23
                                }
                            }
                        },
                        "saturday": {
                            "type": "object",
                            "properties": {
                                "enabled": {
                                    "type": "boolean"
                                },
                                "from": {
                                    "type": "integer",
                                    "minimum": 0,
                                    "maximum": 23
                                },
                                "to": {
                                    "type": "integer",
                                    "minimum": 0,
                                    "maximum": 23
                                }
                            }
                        },
                        "sunday": {
                            "type": "object",
                            "properties": {
                                "enabled": {
                                    "type": "boolean"
                                },
                                "from": {
                                    "type": "integer",
                                    "minimum": 0,
                                    "maximum": 23
                                },
                                "to": {
                                    "type": "integer",
                                    "minimum": 0,
                                    "maximum": 23
                                }
                            }
                        },
                        "thursday": {
                            "type": "object",
                            "properties": {
                                "enabled": {
                                    "type": "boolean"
                                },
                                "from": {
                                    "type": "integer",
                                    "minimum": 0,
                                    "maximum": 23
                                },
                                "to": {
                                    "type": "integer",
                                    "minimum": 0,
                                    "maximum": 23
                                }
                            }
                        },
                        "tuesday": {
                            "type": "object",
                            "properties": {
                                "enabled": {
                                    "type": "boolean"
                                },
                                "from": {
                                    "type": "integer",
                                    "minimum": 0,
                                    "maximum": 23
                                },
                                "to": {
                                    "type": "integer",
                                    "minimum": 0,
                                    "maximum": 23
                                }
                            }
                        },
                        "wednesday": {
                            "type": "object",
                            "properties": {
                                "enabled": {
                                    "type": "boolean"
                                },
                                "from": {
                                    "type": "integer",
                                    "minimum": 0,
                                    "maximum": 23
                                },
                                "to": {
                                    "type": "integer",
                                    "minimum": 0,
                                    "maximum": 23
                                }
                            }
                        }
                    }
                },
                "timezone": {
                    "type": "string"
                }
            }
        }
    },
    "multichannel GET /multichannel/workspaces/{workspaceID}/sequences/{sequenceID}/sender-profiles": {
        "description": "List sequence sender profiles",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Sequence ID"
                }
            },
            {
                "name": "page",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "description": "Page"
                }
            },
            {
                "name": "limit",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 100,
                    "description": "Limit (max 100)"
                }
            }
        ]
    },
    "multichannel POST /multichannel/workspaces/{workspaceID}/sequences/{sequenceID}/sender-profiles": {
        "description": "Upsert sequence sender profiles",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Sequence ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "senderProfileIds"
            ],
            "properties": {
                "senderProfileIds": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                        "type": "integer"
                    }
                }
            }
        }
    },
    "multichannel POST /multichannel/workspaces/{workspaceID}/sequences/{sequenceID}/sender-profiles/remove": {
        "description": "Remove sequence sender profiles",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Sequence ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "senderProfileIds"
            ],
            "properties": {
                "senderProfileIds": {
                    "type": "array",
                    "minItems": 1,
                    "maxItems": 50,
                    "items": {
                        "type": "integer"
                    }
                }
            }
        }
    },
    "multichannel GET /multichannel/workspaces/{workspaceID}/sequences/{sequenceID}/settings": {
        "description": "Get sequence settings",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Sequence ID"
                }
            }
        ]
    },
    "multichannel PATCH /multichannel/workspaces/{workspaceID}/sequences/{sequenceID}/settings": {
        "description": "Update sequence settings",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Sequence ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "properties": {
                "bcc": {
                    "type": "string"
                },
                "cc": {
                    "type": "string"
                },
                "ccAndBccEnabled": {
                    "type": "boolean"
                },
                "clickTrackingEnabled": {
                    "type": "boolean"
                },
                "companyOutreachLimitCount": {
                    "type": "integer"
                },
                "companyOutreachLimitEnabled": {
                    "type": "boolean"
                },
                "localizedOptOutEnabled": {
                    "type": "boolean"
                },
                "openTrackingEnabled": {
                    "type": "boolean"
                },
                "opportunitiesValue": {
                    "type": "number"
                },
                "optOutLinkEnabled": {
                    "type": "boolean"
                },
                "optOutLinkText": {
                    "type": "string"
                },
                "optOutText": {
                    "type": "string"
                },
                "optOutTextEnabled": {
                    "type": "boolean"
                },
                "pauseOnClick": {
                    "type": "boolean"
                },
                "pauseOnOpen": {
                    "type": "boolean"
                },
                "plainTextEmailsEnabled": {
                    "type": "boolean"
                },
                "sequentialCompanySendingEnabled": {
                    "type": "boolean"
                },
                "taskPriorityPolicy": {
                    "type": "string"
                },
                "trackOpportunitiesEnabled": {
                    "type": "boolean"
                }
            }
        }
    },
    "multichannel PATCH /multichannel/workspaces/{workspaceID}/sequences/{sequenceID}/status": {
        "description": "Update sequence status",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Sequence ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "status"
            ],
            "properties": {
                "status": {
                    "type": "string",
                    "enum": [
                        "active",
                        "paused"
                    ]
                }
            }
        }
    },
    "multichannel POST /multichannel/workspaces/{workspaceID}/sequences/{sequenceID}/subsequence-assignments": {
        "description": "Assign subsequence to parent sequence",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "sequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Parent sequence ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "childSequenceId"
            ],
            "properties": {
                "childSequenceId": {
                    "type": "integer"
                },
                "priority": {
                    "type": "integer"
                }
            }
        }
    },
    "multichannel GET /multichannel/workspaces/{workspaceID}/subsequences/{subsequenceID}/members": {
        "description": "Returns current multichannel subsequence members with enrollment and latest handoff timestamps. Use leadId to check one contact without changing state.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "subsequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Subsequence ID"
                }
            },
            {
                "name": "leadId",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Filter by contact lead ID"
                }
            },
            {
                "name": "page",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Page number (default 1)"
                }
            },
            {
                "name": "limit",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Page size (default 100, max 100)"
                }
            }
        ]
    },
    "multichannel GET /multichannel/workspaces/{workspaceID}/subsequences/{subsequenceID}/parents": {
        "description": "Returns every active parent-sequence assignment for a multichannel subsequence.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "subsequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Subsequence ID"
                }
            }
        ]
    },
    "multichannel GET /multichannel/workspaces/{workspaceID}/subsequences/{subsequenceID}/triggers": {
        "description": "List subsequence triggers",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "subsequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Subsequence ID"
                }
            }
        ]
    },
    "multichannel POST /multichannel/workspaces/{workspaceID}/subsequences/{subsequenceID}/triggers": {
        "description": "Create subsequence trigger",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "subsequenceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Subsequence ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "labelId"
            ],
            "properties": {
                "labelId": {
                    "type": "string"
                },
                "priority": {
                    "type": "integer"
                }
            }
        }
    },
    "multichannel POST /multichannel/workspaces/{workspaceID}/validations": {
        "description": "Starts email validation for the contacts the filters resolve to.\n\nWhen the filters match contacts but every one is filtered out before validation, for\nexample by a selectionScope of in_sequence or not_in_sequence or by excludedLeadIds,\nthe default response is 400 with data.code \"validation-all-contacts-excluded\". Send\n\"strict\": false to receive 201 with an already completed empty run instead, where\n\"started\" is false, \"selected\" is 0 and \"message\" explains why. A scope that resolves\nto no contact with an email address returns 400 with data.code\n\"validation-scope-empty\" either way. 402 means insufficient credits.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "filters"
            ],
            "properties": {
                "filters": {
                    "type": "object",
                    "properties": {
                        "customVarIds": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "customVars": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "deleted": {
                            "type": "boolean"
                        },
                        "esps": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "excludeContacted": {
                            "type": "boolean"
                        },
                        "hasEmail": {
                            "type": "boolean"
                        },
                        "hasValidLinkedIn": {
                            "type": "boolean"
                        },
                        "leadIds": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "notInCustomVarIds": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "notInCustomVars": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "notInESPs": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "notInLeadIds": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "notInTagIds": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "numberOfContactsToAdd": {
                            "type": "integer"
                        },
                        "searchQuery": {
                            "type": "string"
                        },
                        "selectionScope": {
                            "type": "string"
                        },
                        "tagIds": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "validationStatuses": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "withEmailOnly": {
                            "type": "boolean"
                        }
                    }
                },
                "limit": {
                    "type": "integer"
                },
                "strict": {
                    "type": "boolean",
                    "description": "Strict decides what happens when the filters match contacts but none can be validated, for\nexample because a selectionScope filtered them all out. Default is true, which fails the\nrequest. Set it to false to get a completed empty run instead. A scope that matches no\ncontacts always fails."
                }
            }
        }
    },
    "multichannel GET /multichannel/workspaces/{workspaceID}/validations/{runID}/results": {
        "description": "Get validation run results",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "runID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Validation run ID"
                }
            }
        ]
    },
    "warmforge GET /workspaces": {
        "description": "Get workspaces for the account associated with the API key",
        "parameters": [
            {
                "name": "page",
                "location": "query",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Page number"
                }
            },
            {
                "name": "page_size",
                "location": "query",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Page size"
                }
            }
        ]
    },
    "warmforge POST /workspaces": {
        "description": "Create a new workspace for the account associated with the API key",
        "parameters": [],
        "body": {
            "type": "object",
            "required": [
                "name"
            ],
            "properties": {
                "name": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 50
                }
            }
        }
    },
    "warmforge GET /workspaces/{workspaceID}/mailboxes": {
        "description": "Get mailboxes",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "search",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Search"
                }
            },
            {
                "name": "external_reference",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "External reference"
                }
            },
            {
                "name": "status",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "enum": [
                        "warm",
                        "pending",
                        "disconnected",
                        "suspended",
                        "all"
                    ],
                    "description": "Status"
                }
            },
            {
                "name": "page",
                "location": "query",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Page number"
                }
            },
            {
                "name": "page_size",
                "location": "query",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Page size"
                }
            }
        ]
    },
    "warmforge POST /workspaces/{workspaceID}/mailboxes/bulk-update": {
        "description": "Update mailboxes",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "object",
                    "properties": {
                        "emailRampUp": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 20
                        },
                        "firstName": {
                            "type": "string",
                            "minLength": 1,
                            "maxLength": 255
                        },
                        "lastName": {
                            "type": "string",
                            "minLength": 1,
                            "maxLength": 255
                        },
                        "maxEmailsPerDay": {
                            "type": "integer",
                            "maximum": 20
                        },
                        "minEmailsPerDay": {
                            "type": "integer",
                            "minimum": 1,
                            "maximum": 20
                        },
                        "replyRatePercent": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 50
                        },
                        "signature": {
                            "type": "string",
                            "maxLength": 1000
                        },
                        "warmupEnabled": {
                            "type": "boolean"
                        },
                        "warmupEndDate": {
                            "type": "string"
                        },
                        "warmupStartDate": {
                            "type": "string"
                        }
                    }
                },
                "filters": {
                    "type": "object",
                    "properties": {
                        "excludedIds": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "includedIds": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "search": {
                            "type": "string"
                        },
                        "specialStatus": {
                            "type": "string",
                            "enum": [
                                "warm",
                                "pending",
                                "disconnected",
                                "suspended",
                                "all"
                            ]
                        }
                    }
                }
            }
        }
    },
    "warmforge POST /workspaces/{workspaceID}/mailboxes/connect-oauth2": {
        "description": "Connect a mailbox using OAuth2",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "accessToken",
                "clientId",
                "clientSecret",
                "email",
                "expiresIn",
                "provider",
                "refreshToken"
            ],
            "properties": {
                "accessToken": {
                    "type": "string"
                },
                "clientId": {
                    "type": "string"
                },
                "clientSecret": {
                    "type": "string"
                },
                "email": {
                    "type": "string"
                },
                "expiresIn": {
                    "type": "integer"
                },
                "externalReference": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 255
                },
                "provider": {
                    "type": "string",
                    "enum": [
                        "gmail",
                        "outlook"
                    ]
                },
                "refreshToken": {
                    "type": "string"
                }
            }
        }
    },
    "warmforge POST /workspaces/{workspaceID}/mailboxes/connect-smtp": {
        "description": "Connect an SMTP mailbox to Warmforge",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "address",
                "firstName",
                "imapHost",
                "imapPassword",
                "imapPort",
                "imapUsername",
                "lastName",
                "smtpHost",
                "smtpPassword",
                "smtpPort",
                "smtpUsername"
            ],
            "properties": {
                "address": {
                    "type": "string"
                },
                "externalReference": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 255
                },
                "firstName": {
                    "type": "string"
                },
                "imapHost": {
                    "type": "string"
                },
                "imapPassword": {
                    "type": "string"
                },
                "imapPort": {
                    "type": "integer"
                },
                "imapUsername": {
                    "type": "string"
                },
                "lastName": {
                    "type": "string"
                },
                "signature": {
                    "type": "string",
                    "maxLength": 1000
                },
                "smtpHost": {
                    "type": "string"
                },
                "smtpPassword": {
                    "type": "string"
                },
                "smtpPort": {
                    "type": "integer"
                },
                "smtpUsername": {
                    "type": "string"
                },
                "warmupEnabled": {
                    "type": "boolean"
                }
            }
        }
    },
    "warmforge POST /workspaces/{workspaceID}/mailboxes/placement-results/latest": {
        "description": "Get the latest completed placement test result for each requested mailbox",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "mailboxIds"
            ],
            "properties": {
                "mailboxIds": {
                    "type": "array",
                    "minItems": 1,
                    "maxItems": 100,
                    "items": {
                        "type": "string"
                    }
                }
            }
        }
    },
    "warmforge GET /workspaces/{workspaceID}/mailboxes/{address}": {
        "description": "Get a mailbox",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "address",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Mailbox address"
                }
            }
        ]
    },
    "warmforge DELETE /workspaces/{workspaceID}/mailboxes/{address}": {
        "description": "Delete a mailbox",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "address",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Mailbox address"
                }
            }
        ]
    },
    "warmforge PATCH /workspaces/{workspaceID}/mailboxes/{address}": {
        "description": "Update a mailbox",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "address",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Mailbox address"
                }
            }
        ],
        "body": {
            "type": "object",
            "properties": {
                "emailRampUp": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 20
                },
                "firstName": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 255
                },
                "lastName": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 255
                },
                "maxEmailsPerDay": {
                    "type": "integer",
                    "maximum": 20
                },
                "minEmailsPerDay": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 20
                },
                "replyRatePercent": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 50
                },
                "signature": {
                    "type": "string",
                    "maxLength": 1000
                },
                "warmupEnabled": {
                    "type": "boolean"
                },
                "warmupEndDate": {
                    "type": "string"
                },
                "warmupStartDate": {
                    "type": "string"
                }
            }
        }
    },
    "warmforge GET /workspaces/{workspaceID}/mailboxes/{address}/warmup/stats": {
        "description": "Get warmup stats",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "address",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Mailbox address"
                }
            },
            {
                "name": "from",
                "location": "query",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "From date"
                }
            },
            {
                "name": "to",
                "location": "query",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "To date"
                }
            }
        ]
    },
    "warmforge GET /workspaces/{workspaceID}/placement-tests": {
        "description": "Get all placement tests",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "page",
                "location": "query",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Page number"
                }
            },
            {
                "name": "size",
                "location": "query",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Page size"
                }
            },
            {
                "name": "search",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Search"
                }
            },
            {
                "name": "external_reference",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "External reference"
                }
            }
        ]
    },
    "warmforge POST /workspaces/{workspaceID}/placement-tests": {
        "description": "Create a placement test",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "body",
                "subject"
            ],
            "properties": {
                "body": {
                    "type": "string"
                },
                "externalReference": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 255
                },
                "mailboxes": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                        "type": "string"
                    }
                },
                "name": {
                    "type": "string"
                },
                "subject": {
                    "type": "string"
                }
            }
        }
    },
    "warmforge GET /workspaces/{workspaceID}/placement-tests/{placementTestID}": {
        "description": "Get a placement test",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "placementTestID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Placement test ID"
                }
            }
        ]
    },
    "warmforge DELETE /workspaces/{workspaceID}/placement-tests/{placementTestID}": {
        "description": "Delete a placement test",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            },
            {
                "name": "placementTestID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Placement test ID"
                }
            }
        ]
    },
    "infraforge POST /adjust-mailbox-topup-amount": {
        "description": "if mailbox slots topup amount is set, when running out of slots, the system will automatically topup the account with the given amount",
        "parameters": [],
        "body": {
            "type": "object",
            "required": [
                "amount"
            ],
            "properties": {
                "amount": {
                    "type": "integer",
                    "minimum": 10
                }
            }
        }
    },
    "infraforge GET /check-domain-availability": {
        "description": "Check if a domain is available for purchase",
        "parameters": [
            {
                "name": "domain",
                "location": "query",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Domain to check"
                }
            }
        ]
    },
    "infraforge POST /check-domain-availability-bulk": {
        "description": "Check if a list of domains are available for purchase, maximum 100 domains are allowed at once",
        "parameters": [],
        "body": {
            "type": "object",
            "properties": {
                "domains": {
                    "type": "array",
                    "minItems": 1,
                    "maxItems": 100,
                    "items": {
                        "type": "string"
                    }
                }
            }
        }
    },
    "infraforge GET /credits/balance": {
        "description": "Get credit balance settings that are defined by the user, used for topping up the account's balance",
        "parameters": []
    },
    "infraforge POST /credits/balance": {
        "description": "Create a credit balance for the user, amount is in us dollars and after calling this endpoint, the user will be charged with the given amount",
        "parameters": [],
        "body": {
            "type": "object",
            "required": [
                "amount",
                "topupThreshold"
            ],
            "properties": {
                "amount": {
                    "type": "integer",
                    "minimum": 100
                },
                "isEnabled": {
                    "type": "boolean"
                },
                "topupThreshold": {
                    "type": "integer",
                    "minimum": 50
                }
            }
        }
    },
    "infraforge PATCH /credits/balance": {
        "description": "Update credit balance settings that are defined by the user, used for topping up the account's balance",
        "parameters": [],
        "body": {
            "type": "object",
            "properties": {
                "amount": {
                    "type": "integer",
                    "minimum": 100
                },
                "isEnabled": {
                    "type": "boolean"
                },
                "topupThreshold": {
                    "type": "integer",
                    "minimum": 50
                }
            }
        }
    },
    "infraforge GET /domains": {
        "description": "List domains purchased by the user",
        "parameters": [
            {
                "name": "search",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "query to filter domains"
                }
            }
        ]
    },
    "infraforge POST /domains": {
        "description": "Buy domains and add them to the workspace",
        "parameters": [],
        "body": {
            "type": "object",
            "required": [
                "contactDetails",
                "domains",
                "workspaceId"
            ],
            "properties": {
                "contactDetails": {
                    "type": "object",
                    "required": [
                        "address1",
                        "city",
                        "country",
                        "email",
                        "firstName",
                        "lastName",
                        "organization",
                        "phone",
                        "postalCode",
                        "province"
                    ],
                    "properties": {
                        "address1": {
                            "type": "string"
                        },
                        "address2": {
                            "type": "string"
                        },
                        "city": {
                            "type": "string"
                        },
                        "country": {
                            "type": "string"
                        },
                        "dmarcEmail": {
                            "type": "string"
                        },
                        "email": {
                            "type": "string"
                        },
                        "firstName": {
                            "type": "string"
                        },
                        "forwardToDomain": {
                            "type": "string"
                        },
                        "jobTitle": {
                            "type": "string"
                        },
                        "lastName": {
                            "type": "string"
                        },
                        "organization": {
                            "type": "string"
                        },
                        "phone": {
                            "type": "string"
                        },
                        "postalCode": {
                            "type": "string"
                        },
                        "province": {
                            "type": "string"
                        }
                    }
                },
                "domains": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "workspaceId": {
                    "type": "string"
                }
            }
        }
    },
    "infraforge POST /domains/alternative-domains": {
        "description": "Generate alternative domains for the given domain",
        "parameters": [],
        "body": {
            "type": "object",
            "required": [
                "count",
                "inputSld",
                "outputTld"
            ],
            "properties": {
                "count": {
                    "type": "integer",
                    "minimum": 1
                },
                "exclude": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "inputSld": {
                    "type": "string"
                },
                "outputTld": {
                    "type": "string"
                }
            }
        }
    },
    "infraforge POST /domains/bulk-disable-autorenew": {
        "description": "Bulk disable auto renew for the given domains",
        "parameters": [],
        "body": {
            "type": "object",
            "properties": {
                "domainIds": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                        "type": "string"
                    }
                }
            }
        }
    },
    "infraforge PUT /domains/bulk-dns": {
        "description": "Bulk update DNS parameters for the given domains",
        "parameters": [],
        "body": {
            "type": "object",
            "properties": {
                "cnameRecords": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "address": {
                                "type": "string"
                            },
                            "hostName": {
                                "type": "string"
                            }
                        }
                    }
                },
                "dmarcEmail": {
                    "type": "string"
                },
                "dmarcPolicy": {
                    "type": "string",
                    "enum": [
                        "none",
                        "quarantine",
                        "reject"
                    ]
                },
                "domains": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "forwardToDomain": {
                    "type": "string"
                }
            }
        }
    },
    "infraforge POST /domains/bulk-enable-autorenew": {
        "description": "Bulk enable auto renew for the given domains",
        "parameters": [],
        "body": {
            "type": "object",
            "properties": {
                "domainIds": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                        "type": "string"
                    }
                }
            }
        }
    },
    "infraforge PATCH /domains/forwards": {
        "description": "Updates forwarding settings and SSL/masking configuration for domains.\nFor new domain forwards, omit the `domainMasking` flag.\nThe `domainMasking` flag is only used when modifying existing forwarding settings:\n- When `true`: Enables domain masking and SSL (visitors see your domain while viewing forwarded content)\n- When `false`: Disables masking and sets up a permanent 301 redirect with SSL (visitors see the destination URL)",
        "parameters": [],
        "body": {
            "type": "array",
            "items": {
                "type": "object",
                "required": [
                    "domainId",
                    "forwardToDomain"
                ],
                "properties": {
                    "domainId": {
                        "type": "string"
                    },
                    "domainMasking": {
                        "type": "boolean"
                    },
                    "forwardToDomain": {
                        "type": "string"
                    }
                }
            }
        }
    },
    "infraforge POST /domains/masking": {
        "description": "Purchase domain masking SSL for the given domain\n- When `purchaseMasking` is `true`: Enables domain masking and SSL (visitors see your domain while viewing forwarded content)\n- When `purchaseMasking` is `false`: Disables masking and sets up a permanent 301 redirect with SSL (visitors see the destination URL)",
        "parameters": [],
        "body": {
            "type": "object",
            "required": [
                "domainIds"
            ],
            "properties": {
                "domainIds": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                        "type": "string"
                    }
                },
                "purchaseMasking": {
                    "type": "boolean"
                }
            }
        }
    },
    "infraforge POST /domains/pre-warmed": {
        "description": "Purchase pre-warmed domains and attach them to the workspace. Charges the account directly (no checkout redirect). Requires an active subscription. If the requested workspace uses a different mailserver than the pre-warmed pool, a new workspace is created (named \"{workspaceName} prewarmed\") and domains are attached there; the response includes both requestedWorkspaceId and workspaceId.",
        "parameters": [],
        "body": {
            "type": "object",
            "required": [
                "domainIds",
                "workspaceId"
            ],
            "properties": {
                "dmarcEmail": {
                    "type": "string"
                },
                "domainIds": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                        "type": "string"
                    }
                },
                "forwardToDomain": {
                    "type": "string"
                },
                "workspaceId": {
                    "type": "string"
                }
            }
        }
    },
    "infraforge POST /domains/transfer": {
        "description": "Transfer domains to Infraforge",
        "parameters": [],
        "body": {
            "type": "object",
            "required": [
                "domains",
                "workspaceId"
            ],
            "properties": {
                "dmarcEmail": {
                    "type": "string"
                },
                "domains": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "forwardToDomain": {
                    "type": "string"
                },
                "workspaceId": {
                    "type": "string"
                }
            }
        }
    },
    "infraforge GET /domains/transfer-ns-info": {
        "description": "Get nameservers for domain transfer, user would need to update their domain nameservers to these values",
        "parameters": []
    },
    "infraforge PUT /domains/{domainID}/disable-autorenew": {
        "description": "Disable auto renew for the given domain",
        "parameters": [
            {
                "name": "domainID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Domain ID"
                }
            }
        ]
    },
    "infraforge GET /domains/{domainID}/dns": {
        "description": "Get DNS records for the given domain",
        "parameters": [
            {
                "name": "domainID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Domain ID"
                }
            }
        ]
    },
    "infraforge PUT /domains/{domainID}/dns": {
        "description": "Update DNS records for the given domain, Should be in the same order as the returned records from the \"Get domain DNS\" request",
        "parameters": [
            {
                "name": "domainID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Domain ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "records"
            ],
            "properties": {
                "records": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "required": [
                            "name",
                            "type",
                            "value"
                        ],
                        "properties": {
                            "editable": {
                                "type": "boolean"
                            },
                            "name": {
                                "type": "string"
                            },
                            "type": {
                                "type": "string"
                            },
                            "value": {
                                "type": "string"
                            }
                        }
                    }
                }
            }
        }
    },
    "infraforge PUT /domains/{domainID}/enable-autorenew": {
        "description": "Enable auto renew for the given domain",
        "parameters": [
            {
                "name": "domainID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Domain ID"
                }
            }
        ]
    },
    "infraforge DELETE /domains/{domainID}/masking": {
        "description": "Delete domain masking SSL for the given domain",
        "parameters": [
            {
                "name": "domainID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Domain ID"
                }
            }
        ]
    },
    "infraforge GET /domains/{domainID}/renewal-price": {
        "description": "Get renewal price for the given domain",
        "parameters": [
            {
                "name": "domainID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Domain ID"
                }
            }
        ]
    },
    "infraforge POST /domains/{domainID}/transfer-out": {
        "description": "Transfer domain out to another registrar",
        "parameters": [
            {
                "name": "domainID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Domain ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "nameservers"
            ],
            "properties": {
                "nameservers": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            }
        }
    },
    "infraforge GET /mailboxes": {
        "description": "List mailboxes purchased by the user",
        "parameters": [
            {
                "name": "workspace_id",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID to filter mailboxes"
                }
            },
            {
                "name": "with_credentials",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "boolean",
                    "description": "Include credentials in the response"
                }
            },
            {
                "name": "search",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Query to filter mailboxes by a name or an email"
                }
            }
        ]
    },
    "infraforge POST /mailboxes": {
        "description": "Buy mailboxes and add them to the workspace",
        "parameters": [],
        "body": {
            "type": "object",
            "required": [
                "domains"
            ],
            "properties": {
                "domains": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "required": [
                            "domain",
                            "mailboxes"
                        ],
                        "properties": {
                            "domain": {
                                "type": "string"
                            },
                            "mailboxes": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "required": [
                                        "email",
                                        "firstName",
                                        "lastName"
                                    ],
                                    "properties": {
                                        "email": {
                                            "type": "string"
                                        },
                                        "firstName": {
                                            "type": "string"
                                        },
                                        "forwardingEmail": {
                                            "type": "string"
                                        },
                                        "lastName": {
                                            "type": "string"
                                        },
                                        "signature": {
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "infraforge POST /mailboxes/bulk-forward": {
        "description": "Bulk forward mailboxes to the given email",
        "parameters": [],
        "body": {
            "type": "object",
            "required": [
                "forwardingEmail",
                "id"
            ],
            "properties": {
                "forwardingEmail": {
                    "type": "string"
                },
                "id": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            }
        }
    },
    "infraforge POST /mailboxes/export-to-salesforge": {
        "description": "Export mailboxes to Salesforge",
        "parameters": [],
        "body": {
            "type": "object",
            "required": [
                "fromWorkspaceId",
                "tagName",
                "toWorkspaceId"
            ],
            "properties": {
                "excludedIds": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "fromWorkspaceId": {
                    "type": "string"
                },
                "includedIds": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "search": {
                    "type": "string"
                },
                "tagName": {
                    "type": "string"
                },
                "toWarmforgeWorkspaceId": {
                    "type": "string"
                },
                "toWorkspaceId": {
                    "type": "string"
                },
                "warmupActivated": {
                    "type": "boolean"
                }
            }
        }
    },
    "infraforge POST /mailboxes/generate": {
        "description": "Generate mailboxes for the given parameters",
        "parameters": [],
        "body": {
            "type": "object",
            "required": [
                "count",
                "domains",
                "type"
            ],
            "properties": {
                "count": {
                    "type": "integer",
                    "minimum": 1
                },
                "domains": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "forwardingEmail": {
                    "type": "string"
                },
                "predefinedNames": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                        "type": "object",
                        "required": [
                            "firstName",
                            "lastName"
                        ],
                        "properties": {
                            "firstName": {
                                "type": "string"
                            },
                            "lastName": {
                                "type": "string"
                            },
                            "signature": {
                                "type": "string"
                            }
                        }
                    }
                },
                "signature": {
                    "type": "string"
                },
                "type": {
                    "type": "string",
                    "enum": [
                        "predefined",
                        "female",
                        "male",
                        "combo"
                    ]
                }
            }
        }
    },
    "infraforge GET /mailboxes/pre-warmed": {
        "description": "List available pre-warmed domains with mailboxes and prices. Supports search by domain name and pagination. Omit limit to use the default of 100.",
        "parameters": [
            {
                "name": "search",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Search by domain name"
                }
            },
            {
                "name": "limit",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Maximum number of domains to return (1-100). Defaults to 100 when omitted."
                }
            },
            {
                "name": "offset",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Number of domains to skip"
                }
            }
        ]
    },
    "infraforge GET /mailboxes/{mailboxID}": {
        "description": "Get a mailbox by its ID",
        "parameters": [
            {
                "name": "mailboxID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Mailbox ID"
                }
            },
            {
                "name": "with_credentials",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "boolean",
                    "description": "Include credentials in the response"
                }
            }
        ]
    },
    "infraforge DELETE /mailboxes/{mailboxID}": {
        "description": "Delete a mailbox by its ID",
        "parameters": [
            {
                "name": "mailboxID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Mailbox ID"
                }
            }
        ]
    },
    "infraforge PATCH /mailboxes/{mailboxID}": {
        "description": "Update a mailbox attributes by its ID",
        "parameters": [
            {
                "name": "mailboxID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Mailbox ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "properties": {
                "firstName": {
                    "type": "string"
                },
                "forwardingEmail": {
                    "type": "string"
                },
                "lastName": {
                    "type": "string"
                },
                "password": {
                    "type": "string"
                },
                "signature": {
                    "type": "string"
                }
            }
        }
    },
    "infraforge GET /postal-code-details": {
        "description": "Get postal code details for a given country code",
        "parameters": [
            {
                "name": "countryCode",
                "location": "query",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Country code"
                }
            }
        ]
    },
    "infraforge GET /workspaces": {
        "description": "List workspaces created by the user",
        "parameters": []
    },
    "infraforge POST /workspaces": {
        "description": "Create a new workspace",
        "parameters": [],
        "body": {
            "type": "object",
            "required": [
                "name"
            ],
            "properties": {
                "attachUniqueIp": {
                    "type": "boolean"
                },
                "name": {
                    "type": "string"
                }
            }
        }
    },
    "infraforge POST /workspaces/{workspaceID}/domains/transfer-to-workspace": {
        "description": "Transfer domains to a different workspace",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [],
            "properties": {
                "domainIds": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                        "type": "string"
                    }
                }
            }
        }
    },
    "infraforge GET /workspaces/domains/core": {
        "description": "Get available core domains for an IP",
        "parameters": []
    },
    "infraforge POST /workspaces/domains/core": {
        "description": "Update core domain of an IP",
        "parameters": [],
        "body": {
            "type": "object",
            "required": [
                "coreDomainId",
                "ip"
            ],
            "properties": {
                "coreDomainId": {
                    "type": "string"
                },
                "ip": {
                    "type": "string"
                }
            }
        }
    },
    "infraforge DELETE /workspaces/ips/{ip}": {
        "description": "Delete workspace IP, Cancels subscription to the IP",
        "parameters": [
            {
                "name": "ip",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "IP"
                }
            }
        ]
    },
    "infraforge DELETE /workspaces/{workspaceID}": {
        "description": "Delete a workspace by its ID, if it has IP attached, it would be deleted as well",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            }
        ]
    },
    "infraforge PATCH /workspaces/{workspaceID}": {
        "description": "Update a workspace by its ID",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [],
            "properties": {
                "ip": {
                    "type": "string"
                },
                "name": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 50
                },
                "preserveSpf": {
                    "type": "boolean"
                }
            }
        }
    },
    "infraforge GET /workspaces/{workspaceID}/eligible-ips": {
        "description": "Get eligible IPs for a workspace",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            }
        ]
    },
    "infraforge POST /workspaces/{workspaceID}/mailboxes/export": {
        "description": "Export mailboxes for the given parameters, returns a csv string\nExport types: sf, sl, inst, first_quadrant, luna, reply_io, mailivery, woodpecker, superagi, pipelime, masterinbox",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "exportType"
            ],
            "properties": {
                "excludedIds": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "exportType": {
                    "type": "string",
                    "enum": [
                        "reach",
                        "sl",
                        "inst",
                        "sf",
                        "first_quadrant",
                        "luna",
                        "reply_io",
                        "mailivery",
                        "woodpecker",
                        "superagi",
                        "pipelime",
                        "masterinbox"
                    ]
                },
                "includedIds": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            }
        }
    },
    "infraforge PATCH /domains/{domainID}/max-mailboxes": {
        "description": "Adjust the maximum mailboxes on a domain",
        "parameters": [
            {
                "name": "domainID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "maxMailboxesPerDomain"
            ],
            "properties": {
                "maxMailboxesPerDomain": {
                    "type": "integer",
                    "minimum": 11,
                    "maximum": 50
                }
            }
        }
    },
    "primeforge GET /check-domain-availability": {
        "description": "Check if a single domain is available for purchase",
        "parameters": [
            {
                "name": "domain",
                "location": "query",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Domain to check (e.g. example.com)"
                }
            }
        ]
    },
    "primeforge GET /domains": {
        "description": "Retrieve all domains associated with the API Key account",
        "parameters": [
            {
                "name": "limit",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Pagination limit"
                }
            },
            {
                "name": "offset",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Pagination offset"
                }
            },
            {
                "name": "workspaceId",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID to filter by"
                }
            },
            {
                "name": "search",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Search domains by name or ID"
                }
            }
        ]
    },
    "primeforge POST /domains": {
        "description": "Buy domains and add them to the workspace.\n\n**Phone format:** `contactDetails.phone` must be in E.164-compatible format including country code (e.g. `+18134682910`). A number without a country code will be rejected.\n\n**Async registration:** A `202 Accepted` response means the purchase has been recorded and payment charged. Actual domain registration with the registrar happens asynchronously, triggered by a Chargebee payment webhook. Use `GET /public/setups/{id}` (where `id` is `setup.id` from this response) to poll registration status.",
        "parameters": [],
        "body": {
            "type": "object",
            "required": [
                "domains",
                "platform",
                "workspaceId"
            ],
            "properties": {
                "contactDetails": {
                    "type": "object",
                    "required": [
                        "address1",
                        "city",
                        "country",
                        "email",
                        "firstName",
                        "lastName",
                        "phone",
                        "postalCode",
                        "province"
                    ],
                    "properties": {
                        "address1": {
                            "type": "string",
                            "description": "Address line 1 for contact"
                        },
                        "address2": {
                            "type": "string"
                        },
                        "city": {
                            "type": "string",
                            "description": "City for contact"
                        },
                        "country": {
                            "type": "string",
                            "description": "Country for contact"
                        },
                        "dmarcEmail": {
                            "type": "string"
                        },
                        "email": {
                            "type": "string",
                            "description": "Email address for domain registration"
                        },
                        "firstName": {
                            "type": "string",
                            "description": "First name of the contact person"
                        },
                        "forwardToDomain": {
                            "type": "string"
                        },
                        "jobTitle": {
                            "type": "string"
                        },
                        "lastName": {
                            "type": "string",
                            "description": "Last name of the contact person"
                        },
                        "organization": {
                            "type": "string"
                        },
                        "phone": {
                            "type": "string",
                            "description": "Phone number for contact"
                        },
                        "postalCode": {
                            "type": "string",
                            "description": "Postal code for contact"
                        },
                        "province": {
                            "type": "string",
                            "description": "Province or state for contact"
                        }
                    }
                },
                "domains": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                        "type": "object",
                        "required": [
                            "domain"
                        ],
                        "properties": {
                            "domain": {
                                "type": "string"
                            },
                            "mailboxes": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "required": [
                                        "firstName",
                                        "lastName",
                                        "username"
                                    ],
                                    "properties": {
                                        "firstName": {
                                            "type": "string",
                                            "description": "First name for the mailbox"
                                        },
                                        "lastName": {
                                            "type": "string",
                                            "description": "Last name for the mailbox"
                                        },
                                        "signature": {
                                            "type": "string"
                                        },
                                        "username": {
                                            "type": "string",
                                            "description": "Username for the mailbox"
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "platform": {
                    "type": "string",
                    "enum": [
                        "google",
                        "microsoft"
                    ]
                },
                "workspaceId": {
                    "type": "string",
                    "description": "ID of the workspace to which the domain will be added"
                }
            }
        }
    },
    "primeforge POST /domains/bulk-disable-autorenew": {
        "description": "Bulk disable auto renew for the given domains",
        "parameters": [],
        "body": {
            "type": "object",
            "properties": {
                "domainIds": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                        "type": "string"
                    }
                }
            }
        }
    },
    "primeforge PUT /domains/bulk-dns": {
        "description": "Update DNS records (DMARC, forwarding, CNAME) for multiple existing domains in bulk. The \"domains\" field must contain domain IDs (e.g. \"dom_...\") of domains that already exist in your account, as returned by GET /domains. This endpoint does NOT create or connect new/external domains; unknown IDs result in a 404.",
        "parameters": [],
        "body": {
            "type": "object",
            "properties": {
                "cnameRecords": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "required": [
                            "address",
                            "hostName",
                            "type"
                        ],
                        "properties": {
                            "address": {
                                "type": "string"
                            },
                            "hostName": {
                                "type": "string"
                            },
                            "type": {
                                "type": "string"
                            }
                        }
                    }
                },
                "dmarcEmail": {
                    "type": "string"
                },
                "dmarcPolicy": {
                    "type": "string",
                    "enum": [
                        "none",
                        "quarantine",
                        "reject"
                    ]
                },
                "domains": {
                    "type": "array",
                    "description": "Domains is the list of domain IDs (e.g. \"dom_...\") to update. These must be\nIDs of domains that already exist (as returned by GET /domains), not domain names.",
                    "minItems": 1,
                    "items": {
                        "type": "string"
                    }
                },
                "forwardToDomain": {
                    "type": "string"
                }
            }
        }
    },
    "primeforge POST /domains/bulk-enable-autorenew": {
        "description": "Bulk enable auto renew for the given domains",
        "parameters": [],
        "body": {
            "type": "object",
            "properties": {
                "domainIds": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                        "type": "string"
                    }
                }
            }
        }
    },
    "primeforge POST /domains/forwarding": {
        "description": "Set forwarding URL for multiple domains",
        "parameters": [],
        "body": {
            "type": "object",
            "required": [
                "domainIds"
            ],
            "properties": {
                "domainIds": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                        "type": "string"
                    }
                },
                "forwardingUrl": {
                    "type": "string"
                }
            }
        }
    },
    "primeforge GET /domains/search-available": {
        "description": "Search for available domains with various filters",
        "parameters": [
            {
                "name": "domain",
                "location": "query",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Domain keyword to search for"
                }
            },
            {
                "name": "check_google_workspace",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "boolean",
                    "description": "Check Google Workspace availability"
                }
            },
            {
                "name": "check_ms365_workspace",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "boolean",
                    "description": "Check Microsoft 365 availability"
                }
            }
        ]
    },
    "primeforge POST /domains/transfer": {
        "description": "Transfer existing domains into Primeforge. The domains stay registered with their\ncurrent registrar — Primeforge takes over their DNS.\n\n**No charge:** transferring a domain in is free. The workspace account must have an\nactive subscription, otherwise the request is rejected with `402`.\n\n**Async completion:** the response returns the nameservers the domains must be pointed\nat. Update them at your registrar; the domain becomes `active` once propagation is\ndetected. Use `GET /public/domains` to poll the status.",
        "parameters": [],
        "body": {
            "type": "object",
            "required": [
                "workspaceId"
            ],
            "properties": {
                "dmarcEmail": {
                    "type": "string"
                },
                "domains": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                        "type": "object",
                        "required": [
                            "domain",
                            "platform"
                        ],
                        "properties": {
                            "domain": {
                                "type": "string"
                            },
                            "platform": {
                                "type": "string",
                                "enum": [
                                    "microsoft",
                                    "google"
                                ]
                            }
                        }
                    }
                },
                "forwardToDomain": {
                    "type": "string"
                },
                "workspaceId": {
                    "type": "string"
                }
            }
        }
    },
    "primeforge PUT /domains/{domainID}/disable-autorenew": {
        "description": "Disable auto renew for the given domain",
        "parameters": [
            {
                "name": "domainID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Domain ID"
                }
            }
        ]
    },
    "primeforge PUT /domains/{domainID}/enable-autorenew": {
        "description": "Enable auto renew for the given domain",
        "parameters": [
            {
                "name": "domainID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Domain ID"
                }
            }
        ]
    },
    "primeforge GET /domains/{id}": {
        "description": "Retrieve specific domain by its Id",
        "parameters": [
            {
                "name": "id",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "domain Id"
                }
            }
        ]
    },
    "primeforge DELETE /domains/{id}": {
        "description": "Schedule a domain for cancellation by its ID",
        "parameters": [
            {
                "name": "id",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Domain ID"
                }
            }
        ]
    },
    "primeforge POST /domains/{id}/cancel-deletion": {
        "description": "Cancel scheduled deletion for a single domain by its ID. Also clears scheduled\ndeletion on mailboxes belonging to the domain (scheduling domain deletion marks them all).",
        "parameters": [
            {
                "name": "id",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Domain ID"
                }
            }
        ]
    },
    "primeforge GET /domains/{id}/dns": {
        "description": "Retrieve DNS records for a specific domain by its Id",
        "parameters": [
            {
                "name": "id",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "domain Id"
                }
            }
        ]
    },
    "primeforge POST /domains/{id}/dns": {
        "description": "Create a new DNS record for a domain",
        "parameters": [
            {
                "name": "id",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Domain ID or Domain Name"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "content",
                "name",
                "type"
            ],
            "properties": {
                "content": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                },
                "ttl": {
                    "type": "integer",
                    "description": "Time to live for the DNS record in seconds"
                },
                "type": {
                    "type": "string",
                    "enum": [
                        "A",
                        "AAAA",
                        "CNAME",
                        "MX",
                        "TXT",
                        "SRV",
                        "NS",
                        "PRT"
                    ]
                }
            }
        }
    },
    "primeforge DELETE /domains/{id}/dns/{dnsId}": {
        "description": "Delete a DNS record for a domain",
        "parameters": [
            {
                "name": "id",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Domain ID"
                }
            },
            {
                "name": "dnsId",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "DNS ID"
                }
            }
        ]
    },
    "primeforge PATCH /domains/{id}/dns/{dnsId}": {
        "description": "Update a DNS record for a domain",
        "parameters": [
            {
                "name": "dnsId",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string"
                }
            },
            {
                "name": "id",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "content"
            ],
            "properties": {
                "content": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                },
                "ttl": {
                    "type": "integer",
                    "description": "Time to live for the DNS record in seconds"
                },
                "type": {
                    "type": "string",
                    "enum": [
                        "A",
                        "AAAA",
                        "CNAME",
                        "MX",
                        "TXT",
                        "SRV",
                        "NS",
                        "PRT"
                    ]
                }
            }
        }
    },
    "primeforge POST /domains/{id}/mailboxes": {
        "description": "Create multiple mailboxes for a specific domain",
        "parameters": [
            {
                "name": "id",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Domain ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "mailboxes",
                "workspaceId"
            ],
            "properties": {
                "mailboxes": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "required": [
                            "firstName",
                            "lastName",
                            "username"
                        ],
                        "properties": {
                            "firstName": {
                                "type": "string"
                            },
                            "lastName": {
                                "type": "string"
                            },
                            "profilePictureUrl": {
                                "type": "string"
                            },
                            "signature": {
                                "type": "string"
                            },
                            "username": {
                                "type": "string"
                            }
                        }
                    }
                },
                "workspaceId": {
                    "type": "string"
                }
            }
        }
    },
    "primeforge GET /mailboxes": {
        "description": "Retrieve all mailboxes associated with the API Key account",
        "parameters": [
            {
                "name": "limit",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Pagination limit"
                }
            },
            {
                "name": "offset",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Pagination offset"
                }
            },
            {
                "name": "workspaceId",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Workspace Id to filter by"
                }
            },
            {
                "name": "domainId",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Domain Id to filter by"
                }
            },
            {
                "name": "email",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Mailbox email address to filter by"
                }
            }
        ]
    },
    "primeforge POST /mailboxes/get-by-addresses": {
        "description": "Retrieve mailboxes by email addresses for the API Key account",
        "parameters": [],
        "body": {
            "type": "object",
            "required": [
                "addresses"
            ],
            "properties": {
                "addresses": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            }
        }
    },
    "primeforge POST /mailboxes/get-by-ids": {
        "description": "Retrieve mailboxes by IDs for the API Key account",
        "parameters": [],
        "body": {
            "type": "object",
            "required": [
                "mailboxIds"
            ],
            "properties": {
                "mailboxIds": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            }
        }
    },
    "primeforge POST /mailboxes/adjust-mailbox-topup-amount": {
        "description": "If mailbox slots topup amount is set, when running out of slots, the system will automatically topup the account with the given amount",
        "parameters": [],
        "body": {
            "type": "object",
            "required": [
                "amount"
            ],
            "properties": {
                "amount": {
                    "type": "integer",
                    "description": "Mailbox topup amount in dollars",
                    "minimum": 10
                }
            }
        }
    },
    "primeforge GET /mailboxes/pre-warmed": {
        "description": "Get available pre-warmed mailboxes",
        "parameters": []
    },
    "primeforge POST /mailboxes/pre-warmed": {
        "description": "Purchase pre-warmed mailboxes",
        "parameters": [],
        "body": {
            "type": "object",
            "required": [
                "domains",
                "workspaceID"
            ],
            "properties": {
                "dmarcEmail": {
                    "type": "string"
                },
                "domains": {
                    "type": "array",
                    "minItems": 4,
                    "items": {
                        "type": "object",
                        "required": [
                            "domain",
                            "id",
                            "mailboxes",
                            "platform",
                            "uid"
                        ],
                        "properties": {
                            "domain": {
                                "type": "string"
                            },
                            "id": {
                                "type": "string"
                            },
                            "mailboxes": {
                                "type": "array",
                                "minItems": 3,
                                "items": {
                                    "type": "object",
                                    "required": [
                                        "email",
                                        "firstName",
                                        "lastName",
                                        "profilePicture",
                                        "uid",
                                        "username"
                                    ],
                                    "properties": {
                                        "email": {
                                            "type": "string"
                                        },
                                        "firstName": {
                                            "type": "string"
                                        },
                                        "lastName": {
                                            "type": "string"
                                        },
                                        "profilePicture": {
                                            "type": "string"
                                        },
                                        "uid": {
                                            "type": "string"
                                        },
                                        "username": {
                                            "type": "string"
                                        }
                                    }
                                }
                            },
                            "platform": {
                                "type": "string",
                                "enum": [
                                    "GOOGLE",
                                    "MICROSOFT"
                                ]
                            },
                            "uid": {
                                "type": "string"
                            }
                        }
                    }
                },
                "forwardToDomain": {
                    "type": "string"
                },
                "workspaceID": {
                    "type": "string"
                }
            }
        }
    },
    "primeforge GET /mailboxes/{id}": {
        "description": "Retrieve specific mailbox by its Id",
        "parameters": [
            {
                "name": "id",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "mailbox Id"
                }
            }
        ]
    },
    "primeforge DELETE /mailboxes/{id}": {
        "description": "Schedules mailbox deletion by its ID",
        "parameters": [
            {
                "name": "id",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Mailbox ID"
                }
            }
        ]
    },
    "primeforge PATCH /mailboxes/{id}": {
        "description": "Update mailbox details after creation, including profile picture and personal details",
        "parameters": [
            {
                "name": "id",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Mailbox ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "properties": {
                "firstName": {
                    "type": "string"
                },
                "forwardingEmail": {
                    "type": "string"
                },
                "lastName": {
                    "type": "string"
                },
                "password": {
                    "type": "string"
                },
                "profilePictureUrl": {
                    "type": "string"
                },
                "signature": {
                    "type": "string"
                },
                "username": {
                    "type": "string"
                }
            }
        }
    },
    "primeforge GET /mailboxes/{id}/analytics/activity": {
        "description": "Headline tiles and the email activity chart for one mailbox",
        "parameters": [
            {
                "name": "id",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Mailbox Id"
                }
            },
            {
                "name": "period",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "One of 24h, 7d, 30d, 90d, 1y, all"
                }
            }
        ]
    },
    "primeforge GET /mailboxes/{id}/analytics/bounced-emails": {
        "description": "Bounce-back messages and the attributed bounce metrics for one mailbox",
        "parameters": [
            {
                "name": "id",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Mailbox Id"
                }
            },
            {
                "name": "period",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "One of 24h, 7d, 30d, 90d, 1y, all"
                }
            },
            {
                "name": "offset",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Pagination offset"
                }
            },
            {
                "name": "limit",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Rows per page, max 50"
                }
            },
            {
                "name": "bounceType",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Filter by hard or soft"
                }
            }
        ]
    },
    "primeforge GET /mailboxes/{id}/analytics/recipients": {
        "description": "Recipient tiles, ESP breakdown, most contacted recipients and top recipient domains for one mailbox",
        "parameters": [
            {
                "name": "id",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Mailbox Id"
                }
            },
            {
                "name": "period",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "One of 24h, 7d, 30d, 90d, 1y, all"
                }
            },
            {
                "name": "recipientsOffset",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Most contacted pagination offset"
                }
            },
            {
                "name": "recipientsLimit",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Most contacted rows per page, max 50"
                }
            },
            {
                "name": "domainsLimit",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Top recipient domains to return, max 50"
                }
            }
        ]
    },
    "primeforge GET /mailboxes/{id}/analytics/sending-ips": {
        "description": "MTA IPs the mailbox relayed through, with reverse-DNS hostname and blacklist status",
        "parameters": [
            {
                "name": "id",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Mailbox Id"
                }
            },
            {
                "name": "period",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "One of 24h, 7d, 30d, 90d, 1y, all"
                }
            },
            {
                "name": "offset",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Pagination offset"
                }
            },
            {
                "name": "limit",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Rows per page, max 50"
                }
            }
        ]
    },
    "primeforge POST /mailboxes/{id}/cancel-deletion": {
        "description": "Cancel scheduled deletion for a single mailbox by its ID",
        "parameters": [
            {
                "name": "id",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Mailbox ID"
                }
            }
        ]
    },
    "primeforge GET /mailboxes/{id}/otp-code": {
        "description": "Retrieve the OTP code for a mailbox",
        "parameters": [
            {
                "name": "id",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "mailbox Id"
                }
            },
            {
                "name": "includeDeleted",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "boolean",
                    "description": "include soft-deleted mailbox"
                }
            }
        ]
    },
    "primeforge GET /workspaces": {
        "description": "Retrieve all workspaces associated with the API Key account",
        "parameters": [
            {
                "name": "limit",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Pagination limit"
                }
            },
            {
                "name": "offset",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Pagination offset"
                }
            }
        ]
    },
    "primeforge POST /workspaces": {
        "description": "Create a new workspace",
        "parameters": [],
        "body": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "minLength": 1,
                    "maxLength": 50
                }
            }
        }
    },
    "primeforge GET /workspaces/{id}": {
        "description": "Retrieve specific workspace by its Id",
        "parameters": [
            {
                "name": "id",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "workspace Id"
                }
            }
        ]
    },
    "primeforge DELETE /workspaces/{id}": {
        "description": "Delete a workspace",
        "parameters": [
            {
                "name": "id",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace Id"
                }
            }
        ]
    },
    "primeforge POST /workspaces/{id}/exports": {
        "description": "Export mailboxes to a third-party platform. Supports multiple platforms including Salesforge, Warmforge, Instantly, Smartlead, EmailBison, Lemlist, Reply.io, Snov.io, and Woodpecker. Some platforms may require additional fields like workspace, appUrl, or clientId.",
        "parameters": [
            {
                "name": "id",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "email",
                "password",
                "platform"
            ],
            "properties": {
                "appUrl": {
                    "type": "string"
                },
                "clientId": {
                    "type": "string"
                },
                "email": {
                    "type": "string"
                },
                "excludedIds": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "includedIds": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "password": {
                    "type": "string"
                },
                "platform": {
                    "type": "string",
                    "enum": [
                        "salesforge",
                        "warmforge",
                        "instantly",
                        "smartlead",
                        "emailbison",
                        "lemlist",
                        "replyio",
                        "snovio",
                        "woodpecker"
                    ]
                },
                "workspace": {
                    "type": "string"
                }
            }
        }
    },
    "primeforge POST /workspaces/{id}/exports/salesforge": {
        "description": "Export mailboxes to Salesforge platform",
        "parameters": [
            {
                "name": "id",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "email",
                "password",
                "workspaceSlug"
            ],
            "properties": {
                "email": {
                    "type": "string"
                },
                "excludedIds": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "includedIds": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "password": {
                    "type": "string"
                },
                "workspaceSlug": {
                    "type": "string"
                }
            }
        }
    },
    "primeforge POST /workspaces/{id}/exports/warmforge": {
        "description": "Export mailboxes to Warmforge platform",
        "parameters": [
            {
                "name": "id",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "email",
                "password",
                "workspaceSlug"
            ],
            "properties": {
                "email": {
                    "type": "string"
                },
                "excludedIds": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "includedIds": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "password": {
                    "type": "string"
                },
                "workspaceSlug": {
                    "type": "string"
                }
            }
        }
    },
    "primeforge GET /workspaces/{id}/mailboxes/analytics/summary": {
        "description": "Per-mailbox sent, received, reply rate and activity trend for every mailbox in the workspace",
        "parameters": [
            {
                "name": "id",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace Id"
                }
            },
            {
                "name": "period",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "One of 24h, 7d, 30d, 90d, 1y, all"
                }
            },
            {
                "name": "page",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Page of the mailbox list, 1-based"
                }
            },
            {
                "name": "size",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Mailboxes per page, 25 or 50"
                }
            },
            {
                "name": "search",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Restrict to mailboxes matching this search"
                }
            }
        ]
    },
    "primeforge POST /workspaces/{id}/domains/forwarding": {
        "description": "Set domain forwarding in a workspace",
        "parameters": [
            {
                "name": "id",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "domainIds"
            ],
            "properties": {
                "domainIds": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                        "type": "string"
                    }
                },
                "forwardingUrl": {
                    "type": "string"
                }
            }
        }
    },
    "mailforge POST /adjust-mailbox-topup-amount": {
        "description": "Sets the number of mailbox slots to automatically purchase when the account runs out. Set to 0 to disable auto-topup.",
        "parameters": [],
        "body": {
            "type": "object",
            "properties": {
                "amount": {
                    "type": "integer"
                }
            }
        }
    },
    "mailforge GET /check-domain-availability": {
        "description": "Checks whether a single domain name is available for registration and returns its price.",
        "parameters": [
            {
                "name": "domain",
                "location": "query",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Domain name (e.g. example.com)"
                }
            }
        ]
    },
    "mailforge POST /check-domain-availability-bulk": {
        "description": "Checks availability and pricing for up to 100 domain names at once.",
        "parameters": [],
        "body": {
            "type": "object",
            "properties": {
                "domains": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            }
        }
    },
    "mailforge GET /domains": {
        "description": "Returns all domains belonging to the account. Optionally filtered by status or search query.",
        "parameters": [
            {
                "name": "status",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "enum": [
                        "active",
                        "pending",
                        "failed",
                        "expired",
                        "scheduled_for_deletion",
                        "not_paid"
                    ],
                    "description": "Filter by status"
                }
            },
            {
                "name": "search",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Search domains by id, workspace id, domain name, forward-to domain, or status"
                }
            }
        ]
    },
    "mailforge POST /domains": {
        "description": "Purchases one or more domain names, creates DNS records, and triggers registration. Contact details are used for WHOIS registration.\nFor some ccTLDs (e.g. .eu), pass required Enom extended attributes in contactDetails.extra (discover via GET /public/domains/extra-fields).\nTemporary rollout: missing-required-extras 400 before charge is enforced only for global admin users (ADMIN_USER_IDS); other callers keep the legacy path.",
        "parameters": [],
        "body": {
            "type": "object",
            "properties": {
                "contactDetails": {
                    "type": "object",
                    "properties": {
                        "address1": {
                            "type": "string"
                        },
                        "address2": {
                            "type": "string"
                        },
                        "city": {
                            "type": "string"
                        },
                        "country": {
                            "type": "string"
                        },
                        "dmarcEmail": {
                            "type": "string"
                        },
                        "email": {
                            "type": "string"
                        },
                        "extra": {
                            "type": "object",
                            "description": "Extra holds TLD-specific Enom extended attributes (e.g. eu_whoispolicy for .eu).\nOptional overall; required keys depend on the TLDs being purchased — discover via GET /public/domains/extra-fields.",
                            "additionalProperties": {
                                "type": "string"
                            }
                        },
                        "firstName": {
                            "type": "string"
                        },
                        "forwardToDomain": {
                            "type": "string"
                        },
                        "jobTitle": {
                            "type": "string"
                        },
                        "lastName": {
                            "type": "string"
                        },
                        "organization": {
                            "type": "string"
                        },
                        "phone": {
                            "type": "string"
                        },
                        "postalCode": {
                            "type": "string"
                        },
                        "province": {
                            "type": "string"
                        }
                    }
                },
                "domains": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "workspaceId": {
                    "type": "string"
                }
            }
        }
    },
    "mailforge POST /domains/alternative-domains": {
        "description": "Proposes up to `count` available alternative domain names for the given SLD and TLD. Does not create or reserve domains. Excludes domains already active on the account.",
        "parameters": [],
        "body": {
            "type": "object",
            "properties": {
                "count": {
                    "type": "integer"
                },
                "inputSld": {
                    "type": "string"
                },
                "outputTld": {
                    "type": "string"
                }
            }
        }
    },
    "mailforge POST /domains/bulk-disable-autorenew": {
        "description": "Disables automatic renewal for multiple domains.",
        "parameters": [],
        "body": {
            "type": "object",
            "properties": {
                "domainIds": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            }
        }
    },
    "mailforge PUT /domains/bulk-dns": {
        "description": "Updates DNS records for multiple domains at once.",
        "parameters": [],
        "body": {
            "type": "object",
            "properties": {
                "cnameRecords": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "address": {
                                "type": "string"
                            },
                            "hostName": {
                                "type": "string"
                            }
                        }
                    }
                },
                "dmarcEmail": {
                    "type": "string"
                },
                "dmarcPolicy": {
                    "type": "string"
                },
                "domainRecords": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "editable": {
                                "type": "boolean"
                            },
                            "name": {
                                "type": "string"
                            },
                            "type": {
                                "type": "string"
                            },
                            "value": {
                                "type": "string"
                            }
                        }
                    }
                },
                "domains": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "forwardToDomain": {
                    "type": "string"
                },
                "removeENOMRecords": {
                    "type": "boolean"
                },
                "replacementDKIMRecord": {
                    "type": "object",
                    "properties": {
                        "editable": {
                            "type": "boolean"
                        },
                        "name": {
                            "type": "string"
                        },
                        "type": {
                            "type": "string"
                        },
                        "value": {
                            "type": "string"
                        }
                    }
                },
                "replacementMXRecord": {
                    "type": "object",
                    "properties": {
                        "editable": {
                            "type": "boolean"
                        },
                        "name": {
                            "type": "string"
                        },
                        "type": {
                            "type": "string"
                        },
                        "value": {
                            "type": "string"
                        }
                    }
                },
                "replacementSPFRecord": {
                    "type": "object",
                    "properties": {
                        "editable": {
                            "type": "boolean"
                        },
                        "name": {
                            "type": "string"
                        },
                        "type": {
                            "type": "string"
                        },
                        "value": {
                            "type": "string"
                        }
                    }
                }
            }
        }
    },
    "mailforge POST /domains/bulk-enable-autorenew": {
        "description": "Enables automatic renewal for multiple domains.",
        "parameters": [],
        "body": {
            "type": "object",
            "properties": {
                "domainIds": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            }
        }
    },
    "mailforge GET /domains/extra-fields": {
        "description": "Returns Enom-required extended attributes for the given TLDs (union across all requested TLDs). Use the returned field names/values in contactDetails.extra when purchasing domains via POST /public/domains.\nTemporary rollout: available only to global admin users (ADMIN_USER_IDS).",
        "parameters": [
            {
                "name": "tlds",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Comma-separated TLDs (e.g. eu,de)"
                }
            },
            {
                "name": "domains",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Comma-separated FQDNs; TLDs are derived (e.g. example.eu,foo.de)"
                }
            }
        ]
    },
    "mailforge PATCH /domains/forwards": {
        "description": "Sets or updates the forwarding address for one or more domains.",
        "parameters": [],
        "body": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "domainId": {
                        "type": "string"
                    },
                    "domainMasking": {
                        "type": "boolean"
                    },
                    "forwardToDomain": {
                        "type": "string"
                    }
                }
            }
        }
    },
    "mailforge POST /domains/masking": {
        "description": "Purchases domain masking/SSL redirect for one or more domains.",
        "parameters": [],
        "body": {
            "type": "object",
            "properties": {
                "domainIds": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "isYearly": {
                    "type": "boolean"
                },
                "purchaseMasking": {
                    "type": "boolean"
                }
            }
        }
    },
    "mailforge POST /domains/pre-warmed": {
        "description": "Purchase pre-warmed domains (and their bundled mailboxes) and attach them to the workspace. Charges the account directly (no checkout redirect) and requires an active subscription. Returns the attached domains, mailboxes, setup and the resulting invoice.",
        "parameters": [],
        "body": {
            "type": "object",
            "properties": {
                "dmarcEmail": {
                    "type": "string"
                },
                "domainIds": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "forwardToDomain": {
                    "type": "string"
                },
                "workspaceId": {
                    "type": "string"
                }
            }
        }
    },
    "mailforge POST /domains/transfer": {
        "description": "Initiates transfer of existing domains into the account. Response matches Infraforge (domains + optional invoice object). If every domain already exists in the workspace, no invoice is created (allDomainsAlreadyInWorkspace=true) and non-active domains are registered when possible.",
        "parameters": [],
        "body": {
            "type": "object",
            "properties": {
                "dmarcEmail": {
                    "type": "string"
                },
                "domains": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "forwardToDomain": {
                    "type": "string"
                },
                "workspaceId": {
                    "type": "string"
                }
            }
        }
    },
    "mailforge PUT /domains/{domainID}/disable-autorenew": {
        "description": "Disables automatic renewal for the specified domain.",
        "parameters": [
            {
                "name": "domainID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Domain ID"
                }
            }
        ]
    },
    "mailforge GET /domains/{domainID}/dns": {
        "description": "Returns all DNS records for a domain.",
        "parameters": [
            {
                "name": "domainID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Domain ID"
                }
            }
        ]
    },
    "mailforge PUT /domains/{domainID}/dns": {
        "description": "Replaces DNS records for a domain.",
        "parameters": [
            {
                "name": "domainID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Domain ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "properties": {
                "records": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "editable": {
                                "type": "boolean"
                            },
                            "name": {
                                "type": "string"
                            },
                            "type": {
                                "type": "string"
                            },
                            "value": {
                                "type": "string"
                            }
                        }
                    }
                }
            }
        }
    },
    "mailforge PUT /domains/{domainID}/enable-autorenew": {
        "description": "Enables automatic renewal for the specified domain.",
        "parameters": [
            {
                "name": "domainID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Domain ID"
                }
            }
        ]
    },
    "mailforge DELETE /domains/{domainID}/masking": {
        "description": "Removes domain masking/SSL redirect from a domain.",
        "parameters": [
            {
                "name": "domainID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Domain ID"
                }
            }
        ]
    },
    "mailforge GET /mailboxes": {
        "description": "Returns all mailboxes belonging to the account.",
        "parameters": [
            {
                "name": "with_credentials",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "boolean",
                    "description": "Include IMAP/SMTP credentials in the response"
                }
            }
        ]
    },
    "mailforge POST /mailboxes": {
        "description": "Creates one or more mailboxes. Additional slots are purchased automatically if the account's limit is reached.",
        "parameters": [],
        "body": {
            "type": "object",
            "properties": {
                "mailboxes": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "email": {
                                "type": "string"
                            },
                            "firstName": {
                                "type": "string"
                            },
                            "forwardingEmail": {
                                "type": "string"
                            },
                            "lastName": {
                                "type": "string"
                            },
                            "signature": {
                                "type": "string"
                            }
                        }
                    }
                }
            }
        }
    },
    "mailforge POST /mailboxes/bulk-forward": {
        "description": "Sets a forwarding email address for multiple mailboxes matching the given filter.",
        "parameters": [],
        "body": {
            "type": "object",
            "properties": {
                "excludedIds": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "forwardingEmail": {
                    "type": "string"
                },
                "includedIds": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "search": {
                    "type": "string"
                }
            }
        }
    },
    "mailforge GET /mailboxes/pre-warmed": {
        "description": "List available pre-warmed domains with their bundled mailboxes and flat per-domain price. Supports search by domain name and pagination. Omit limit to use the default of 100.",
        "parameters": [
            {
                "name": "search",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Search by domain name"
                }
            },
            {
                "name": "limit",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Maximum number of domains to return (1-100). Defaults to 100 when omitted."
                }
            },
            {
                "name": "offset",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Number of domains to skip"
                }
            }
        ]
    },
    "mailforge GET /mailboxes/{mailboxID}": {
        "description": "Returns a single mailbox by ID.",
        "parameters": [
            {
                "name": "mailboxID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Mailbox ID"
                }
            },
            {
                "name": "with_credentials",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "boolean",
                    "description": "Include IMAP/SMTP credentials in the response"
                }
            }
        ]
    },
    "mailforge DELETE /mailboxes/{mailboxID}": {
        "description": "Permanently deletes a mailbox.",
        "parameters": [
            {
                "name": "mailboxID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Mailbox ID"
                }
            }
        ]
    },
    "mailforge PATCH /mailboxes/{mailboxID}": {
        "description": "Updates mailbox fields such as name, signature, password, or forwarding email.",
        "parameters": [
            {
                "name": "mailboxID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Mailbox ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "properties": {
                "firstName": {
                    "type": "string"
                },
                "forwardingEmail": {
                    "type": "string"
                },
                "lastName": {
                    "type": "string"
                },
                "password": {
                    "type": "string"
                },
                "signature": {
                    "type": "string"
                },
                "username": {
                    "type": "string"
                }
            }
        }
    },
    "mailforge GET /workspaces": {
        "description": "Returns all workspaces belonging to the account.",
        "parameters": []
    },
    "mailforge POST /workspaces": {
        "description": "Creates a new workspace under the account.",
        "parameters": [],
        "body": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string"
                }
            }
        }
    },
    "mailforge DELETE /workspaces/{workspaceID}": {
        "description": "Permanently deletes a workspace and all its associated resources.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            }
        ]
    },
    "mailforge PATCH /workspaces/{workspaceID}": {
        "description": "Updates the name of an existing workspace.",
        "parameters": [
            {
                "name": "workspaceID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Workspace ID"
                }
            }
        ],
        "body": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string"
                }
            }
        }
    },
    "leadsforge GET /balance": {
        "description": "Get credit balance",
        "parameters": []
    },
    "leadsforge GET /company-followers/filters/countries": {
        "description": "Get list of supported country values",
        "parameters": []
    },
    "leadsforge GET /company-followers/filters/departments": {
        "description": "Get list of supported department values",
        "parameters": []
    },
    "leadsforge GET /company-followers/filters/job-titles": {
        "description": "Get paginated list of supported job title values with optional search",
        "parameters": [
            {
                "name": "search",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Search query"
                }
            },
            {
                "name": "page",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "description": "Page number"
                }
            },
            {
                "name": "page_size",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 20,
                    "description": "Page size"
                }
            }
        ]
    },
    "leadsforge GET /company-followers/filters/levels": {
        "description": "Get list of supported seniority level values",
        "parameters": []
    },
    "leadsforge GET /company-followers/filters/states": {
        "description": "Get list of supported state/region values",
        "parameters": []
    },
    "leadsforge GET /company-followers/jobs": {
        "description": "List the caller's company-followers jobs, most recent first. Use the filters (status, clientRequestID, from/to) to recover a job when the job ID is unknown.",
        "parameters": [
            {
                "name": "offset",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Offset"
                }
            },
            {
                "name": "limit",
                "location": "query",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Page size (max 100)"
                }
            },
            {
                "name": "status",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "enum": [
                        "in_progress",
                        "completed",
                        "failed",
                        "no_results"
                    ],
                    "description": "Filter by status"
                }
            },
            {
                "name": "clientRequestID",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Filter by your clientRequestID"
                }
            },
            {
                "name": "from",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Created-at lower bound (RFC3339)"
                }
            },
            {
                "name": "to",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Created-at upper bound (RFC3339)"
                }
            }
        ]
    },
    "leadsforge GET /company-followers/jobs/{jobID}": {
        "description": "Fetch company followers job status.",
        "parameters": [
            {
                "name": "jobID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Job ID"
                }
            }
        ]
    },
    "leadsforge GET /company-followers/jobs/{jobID}/results": {
        "description": "Fetch company followers job results with pagination.",
        "parameters": [
            {
                "name": "jobID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Job ID"
                }
            },
            {
                "name": "offset",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Offset"
                }
            },
            {
                "name": "limit",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Page size"
                }
            }
        ]
    },
    "leadsforge POST /company-followers/search": {
        "description": "Starts an async company followers search for a LinkedIn company page, limit is required and capped at 50000, supports idempotency via Idempotency-Key header (if a job with the same key already exists for this account the existing job is returned), supports webhook notifications via webhookURL field (POST with JSON body on completion/failure, 2xx = success; a failed delivery is retried immediately and then redelivered in the background for up to 24h, every attempt carrying the same X-Webhook-Delivery-Id header so repeated deliveries can be deduplicated), webhook payload: jobID (string), status (completed|failed), linkedinUrl (string), companyName (string), followerCount (int), total (int), processed (int), error (string, failure only). The webhook omits companyLogoUrl to avoid sending a raw upstream image URL; fetch it from GET /company-followers/jobs/{jobID}.",
        "parameters": [
            {
                "name": "Idempotency-Key",
                "location": "header",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Idempotency key - if a job with this key already exists for this account, the existing job is returned as-is, use a new key to start a new search"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "limit",
                "linkedinUrl"
            ],
            "properties": {
                "clientRequestID": {
                    "type": "string",
                    "maxLength": 128
                },
                "countries": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "departments": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "jobTitles": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "levels": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "limit": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 50000
                },
                "linkedinUrl": {
                    "type": "string"
                },
                "states": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "webhookURL": {
                    "type": "string"
                }
            }
        }
    },
    "leadsforge POST /enrichment/email": {
        "description": "Enrich a single person's work email and return the result in the same response, no polling. Provide personID (from POST /search), linkedinURL, or firstName + lastName + a company signal (companyDomain preferred over company name). Costs 1 credit on a hit; a miss is free. Optional externalID (max 128 chars) is echoed back.",
        "parameters": [],
        "body": {
            "type": "object",
            "properties": {
                "company": {
                    "type": "string"
                },
                "companyDomain": {
                    "type": "string"
                },
                "externalID": {
                    "type": "string",
                    "maxLength": 128
                },
                "firstName": {
                    "type": "string"
                },
                "lastName": {
                    "type": "string"
                },
                "linkedinURL": {
                    "type": "string"
                },
                "personID": {
                    "type": "string"
                }
            }
        }
    },
    "leadsforge POST /enrichment/emails": {
        "description": "Request email finding. Two input modes (mutually exclusive): (1) personIDs - array of IDs obtained from POST /search, (2) people - array of objects, each with either linkedinURL (e.g. \"https://www.linkedin.com/in/john-doe\") or firstName + lastName + company name (e.g. \"Salesforge\", not a URL). Max 500 items. Original input fields are echoed back on each result for correlation. People array entries are deduplicated by normalized linkedinURL or by case-insensitive firstName+lastName+company; only one result is returned per unique person, so duplicate entries (e.g. two CRM records pointing at the same person with different externalIDs) will lose the externalIDs of the duplicates - send unique people if you need each externalID echoed back. Each person in the people array may include an optional externalID (max 128 chars), a pure passthrough value persisted with the result and echoed back in the webhook payload and GET /results response for client-side correlation; externalID is not supported in personIDs mode. Example with people: {\"people\": [{\"linkedinURL\": \"https://www.linkedin.com/in/john-doe\", \"externalID\": \"crm-42\"}, {\"firstName\": \"Jane\", \"lastName\": \"Smith\", \"company\": \"Salesforge\"}], \"webhookURL\": \"https://example.com/webhook\"}. Example with personIDs: {\"personIDs\": [\"p_abc123\", \"p_def456\"]}. Webhook delivery: 2xx = success; a failed delivery is retried immediately and then redelivered in the background for up to 24h, every attempt carrying the same X-Webhook-Delivery-Id header so repeated deliveries can be deduplicated.",
        "parameters": [
            {
                "name": "Idempotency-Key",
                "location": "header",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Idempotency key"
                }
            }
        ],
        "body": {
            "type": "object",
            "properties": {
                "clientRequestID": {
                    "type": "string",
                    "maxLength": 128
                },
                "people": {
                    "type": "array",
                    "minItems": 1,
                    "maxItems": 500,
                    "items": {
                        "type": "object",
                        "properties": {
                            "company": {
                                "type": "string"
                            },
                            "companyDomain": {
                                "type": "string"
                            },
                            "externalID": {
                                "type": "string",
                                "maxLength": 128
                            },
                            "firstName": {
                                "type": "string"
                            },
                            "lastName": {
                                "type": "string"
                            },
                            "linkedinURL": {
                                "type": "string"
                            }
                        }
                    }
                },
                "personIDs": {
                    "type": "array",
                    "minItems": 1,
                    "maxItems": 500,
                    "items": {
                        "type": "string"
                    }
                },
                "saveToList": {
                    "type": "boolean"
                },
                "webhookURL": {
                    "type": "string"
                }
            }
        }
    },
    "leadsforge GET /enrichment/jobs": {
        "description": "List the caller's enrichment jobs, most recent first. Use the filters (status, channel, clientRequestID, from/to) to recover a job when the job ID is unknown.",
        "parameters": [
            {
                "name": "offset",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Offset"
                }
            },
            {
                "name": "limit",
                "location": "query",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Page size (max 100)"
                }
            },
            {
                "name": "status",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "enum": [
                        "in_progress",
                        "completed",
                        "failed"
                    ],
                    "description": "Filter by status"
                }
            },
            {
                "name": "channel",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "enum": [
                        "email",
                        "phone",
                        "linkedin"
                    ],
                    "description": "Filter by channel"
                }
            },
            {
                "name": "clientRequestID",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Filter by your clientRequestID"
                }
            },
            {
                "name": "from",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Created-at lower bound (RFC3339)"
                }
            },
            {
                "name": "to",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Created-at upper bound (RFC3339)"
                }
            }
        ]
    },
    "leadsforge GET /enrichment/jobs/{jobID}": {
        "description": "Fetch enrichment job status",
        "parameters": [
            {
                "name": "jobID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Job ID"
                }
            }
        ]
    },
    "leadsforge GET /enrichment/jobs/{jobID}/results": {
        "description": "Fetch enrichment job results",
        "parameters": [
            {
                "name": "jobID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Job ID"
                }
            },
            {
                "name": "offset",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Offset"
                }
            },
            {
                "name": "limit",
                "location": "query",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Page size"
                }
            }
        ]
    },
    "leadsforge POST /enrichment/linkedin": {
        "description": "Request linkedin profile finding. Two input modes (mutually exclusive): (1) personIDs - array of IDs obtained from POST /search, (2) people - array of objects, each with either linkedinURL (e.g. \"https://www.linkedin.com/in/john-doe\") or firstName + lastName + company name (e.g. \"Salesforge\", not a URL). Max 500 items. Original input fields are echoed back on each result for correlation. People array entries are deduplicated by normalized linkedinURL or by case-insensitive firstName+lastName+company; only one result is returned per unique person, so duplicate entries (e.g. two CRM records pointing at the same person with different externalIDs) will lose the externalIDs of the duplicates - send unique people if you need each externalID echoed back. Each person in the people array may include an optional externalID (max 128 chars), a pure passthrough value persisted with the result and echoed back in the webhook payload and GET /results response for client-side correlation; externalID is not supported in personIDs mode. Example with people: {\"people\": [{\"linkedinURL\": \"https://www.linkedin.com/in/john-doe\", \"externalID\": \"crm-42\"}, {\"firstName\": \"Jane\", \"lastName\": \"Smith\", \"company\": \"Salesforge\"}], \"webhookURL\": \"https://example.com/webhook\"}. Example with personIDs: {\"personIDs\": [\"p_abc123\", \"p_def456\"]}. Webhook delivery: 2xx = success; a failed delivery is retried immediately and then redelivered in the background for up to 24h, every attempt carrying the same X-Webhook-Delivery-Id header so repeated deliveries can be deduplicated.",
        "parameters": [
            {
                "name": "Idempotency-Key",
                "location": "header",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Idempotency key"
                }
            }
        ],
        "body": {
            "type": "object",
            "properties": {
                "clientRequestID": {
                    "type": "string",
                    "maxLength": 128
                },
                "people": {
                    "type": "array",
                    "minItems": 1,
                    "maxItems": 500,
                    "items": {
                        "type": "object",
                        "properties": {
                            "company": {
                                "type": "string"
                            },
                            "companyDomain": {
                                "type": "string"
                            },
                            "externalID": {
                                "type": "string",
                                "maxLength": 128
                            },
                            "firstName": {
                                "type": "string"
                            },
                            "lastName": {
                                "type": "string"
                            },
                            "linkedinURL": {
                                "type": "string"
                            }
                        }
                    }
                },
                "personIDs": {
                    "type": "array",
                    "minItems": 1,
                    "maxItems": 500,
                    "items": {
                        "type": "string"
                    }
                },
                "saveToList": {
                    "type": "boolean"
                },
                "webhookURL": {
                    "type": "string"
                }
            }
        }
    },
    "leadsforge POST /enrichment/phone": {
        "description": "Enrich a single person's phone number and return the result in the same response, no polling. Provide personID (from POST /search), linkedinURL, or firstName + lastName + a company signal (companyDomain preferred over company name). Costs 10 credits on a hit; a miss is free. Optional externalID (max 128 chars) is echoed back.",
        "parameters": [],
        "body": {
            "type": "object",
            "properties": {
                "company": {
                    "type": "string"
                },
                "companyDomain": {
                    "type": "string"
                },
                "externalID": {
                    "type": "string",
                    "maxLength": 128
                },
                "firstName": {
                    "type": "string"
                },
                "lastName": {
                    "type": "string"
                },
                "linkedinURL": {
                    "type": "string"
                },
                "personID": {
                    "type": "string"
                }
            }
        }
    },
    "leadsforge POST /enrichment/phones": {
        "description": "Request phone number finding. Two input modes (mutually exclusive): (1) personIDs - array of IDs obtained from POST /search, (2) people - array of objects, each with either linkedinURL (e.g. \"https://www.linkedin.com/in/john-doe\") or firstName + lastName + company name (e.g. \"Salesforge\", not a URL). Max 500 items. Original input fields are echoed back on each result for correlation. People array entries are deduplicated by normalized linkedinURL or by case-insensitive firstName+lastName+company; only one result is returned per unique person, so duplicate entries (e.g. two CRM records pointing at the same person with different externalIDs) will lose the externalIDs of the duplicates - send unique people if you need each externalID echoed back. Each person in the people array may include an optional externalID (max 128 chars), a pure passthrough value persisted with the result and echoed back in the webhook payload and GET /results response for client-side correlation; externalID is not supported in personIDs mode. Example with people: {\"people\": [{\"linkedinURL\": \"https://www.linkedin.com/in/john-doe\", \"externalID\": \"crm-42\"}, {\"firstName\": \"Jane\", \"lastName\": \"Smith\", \"company\": \"Salesforge\"}], \"webhookURL\": \"https://example.com/webhook\"}. Example with personIDs: {\"personIDs\": [\"p_abc123\", \"p_def456\"]}. Webhook delivery: 2xx = success; a failed delivery is retried immediately and then redelivered in the background for up to 24h, every attempt carrying the same X-Webhook-Delivery-Id header so repeated deliveries can be deduplicated.",
        "parameters": [
            {
                "name": "Idempotency-Key",
                "location": "header",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Idempotency key"
                }
            }
        ],
        "body": {
            "type": "object",
            "properties": {
                "clientRequestID": {
                    "type": "string",
                    "maxLength": 128
                },
                "people": {
                    "type": "array",
                    "minItems": 1,
                    "maxItems": 500,
                    "items": {
                        "type": "object",
                        "properties": {
                            "company": {
                                "type": "string"
                            },
                            "companyDomain": {
                                "type": "string"
                            },
                            "externalID": {
                                "type": "string",
                                "maxLength": 128
                            },
                            "firstName": {
                                "type": "string"
                            },
                            "lastName": {
                                "type": "string"
                            },
                            "linkedinURL": {
                                "type": "string"
                            }
                        }
                    }
                },
                "personIDs": {
                    "type": "array",
                    "minItems": 1,
                    "maxItems": 500,
                    "items": {
                        "type": "string"
                    }
                },
                "saveToList": {
                    "type": "boolean"
                },
                "webhookURL": {
                    "type": "string"
                }
            }
        }
    },
    "leadsforge GET /lookalikes/filters/departments": {
        "description": "Get list of available department values for filtering",
        "parameters": []
    },
    "leadsforge GET /lookalikes/filters/employee-ranges": {
        "description": "Get list of available employee range values for filtering",
        "parameters": []
    },
    "leadsforge GET /lookalikes/filters/locations": {
        "description": "Get list of country ISO 3166-1 alpha-2 codes and region IDs accepted by the locations filter on /lookalikes/search.",
        "parameters": []
    },
    "leadsforge GET /lookalikes/filters/seniorities": {
        "description": "Get list of available seniority values for filtering",
        "parameters": []
    },
    "leadsforge POST /lookalikes/preview": {
        "description": "Free, uncharged preview of companies similar to the provided domains. Returns company metadata only (no credits, no people). To turn these into enrichable people, pass a returned company domain into POST /search companyDomains.include to get personIDs, then send those to /enrichment/*.",
        "parameters": [],
        "body": {
            "type": "object",
            "required": [
                "domains"
            ],
            "properties": {
                "categories": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "domains": {
                    "type": "array",
                    "minItems": 1,
                    "maxItems": 10,
                    "items": {
                        "type": "string"
                    }
                },
                "employeeRanges": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "fundingStages": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "locations": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "required": [
                            "id",
                            "type"
                        ],
                        "properties": {
                            "id": {
                                "type": "string"
                            },
                            "type": {
                                "type": "string",
                                "enum": [
                                    "region",
                                    "country"
                                ]
                            }
                        }
                    }
                }
            }
        }
    },
    "leadsforge POST /lookalikes/search": {
        "description": "Search for companies similar to the provided domains. Costs 1 credit per company returned. Credits are reserved before the search and charged based on actual results. Page max: 100, pageSize max: 100. To find and enrich people at these companies, pass a returned company domain into POST /search companyDomains.include to get personIDs, then send those to /enrichment/*. Use POST /lookalikes/preview for a free (uncharged) look first.",
        "parameters": [
            {
                "name": "Idempotency-Key",
                "location": "header",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Idempotency key - a retried request with the same key returns the original result without charging credits again"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "domains"
            ],
            "properties": {
                "categories": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "domains": {
                    "type": "array",
                    "minItems": 1,
                    "maxItems": 10,
                    "items": {
                        "type": "string"
                    }
                },
                "employeeRanges": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "fundingStages": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "locations": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "required": [
                            "id",
                            "type"
                        ],
                        "properties": {
                            "id": {
                                "type": "string"
                            },
                            "type": {
                                "type": "string",
                                "enum": [
                                    "region",
                                    "country"
                                ]
                            }
                        }
                    }
                },
                "page": {
                    "type": "integer",
                    "minimum": 1
                },
                "pageSize": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 100
                }
            }
        }
    },
    "leadsforge POST /maps-discovery/enrich-owners": {
        "description": "Starts an async owner search for up to 200 businesses of one search job, looking for up to maxResults owners per business and the requested contact channels (email and/or phone). Credits are reserved for the upper bound (maps owner email/phone price x maxResults per business) and settled per contact found; a business with no owner costs nothing, and businesses enriched recently are served from cache at no cost. Owner contacts the maps providers miss are backfilled by the standard email/phone waterfall at the same price; consumedCredits on the job includes that backfill. Only one owner job per search runs at a time - a second one while the first is in progress is refused with 409. Businesses not found or not owned by the account are reported as skipped in the businesses list without failing the call. Supports the Idempotency-Key header and webhookURL as the search endpoint does. Webhook payload: jobID (string), status (completed|failed|no_results), searchJobID (string), total (int), processed (int), ownersFound (int), consumedCredits (number), error (string; present on failed jobs, and on completed jobs whose email/phone backfill stopped early for insufficient credits).",
        "parameters": [
            {
                "name": "Idempotency-Key",
                "location": "header",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Idempotency key - if a job with this key already exists for this account, the existing job is returned as-is"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "businessIDs",
                "maxResults",
                "searchJobID"
            ],
            "properties": {
                "businessIDs": {
                    "type": "array",
                    "minItems": 1,
                    "maxItems": 200,
                    "items": {
                        "type": "string"
                    }
                },
                "clientRequestID": {
                    "type": "string",
                    "maxLength": 128
                },
                "maxResults": {
                    "type": "integer",
                    "description": "MaxResults is the number of owners to look for per business.",
                    "minimum": 1,
                    "maximum": 8
                },
                "searchJobID": {
                    "type": "string"
                },
                "wantEmail": {
                    "type": "boolean"
                },
                "wantPhone": {
                    "type": "boolean"
                },
                "webhookURL": {
                    "type": "string"
                }
            }
        }
    },
    "leadsforge GET /maps-discovery/filters/categories": {
        "description": "Get the curated list of Google Maps business categories the app offers. Recommended values for the search categories field; free text is accepted too.",
        "parameters": []
    },
    "leadsforge GET /maps-discovery/jobs": {
        "description": "List the caller's local business search jobs, most recent first. Use the filters (status, clientRequestID, from/to) to recover a job when the job ID is unknown.",
        "parameters": [
            {
                "name": "offset",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Offset"
                }
            },
            {
                "name": "limit",
                "location": "query",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Page size (max 100)"
                }
            },
            {
                "name": "status",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "enum": [
                        "in_progress",
                        "completed",
                        "failed",
                        "no_results"
                    ],
                    "description": "Filter by status"
                }
            },
            {
                "name": "clientRequestID",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Filter by your clientRequestID"
                }
            },
            {
                "name": "from",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Created-at lower bound (RFC3339)"
                }
            },
            {
                "name": "to",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Created-at upper bound (RFC3339)"
                }
            }
        ]
    },
    "leadsforge GET /maps-discovery/jobs/{jobID}": {
        "description": "Fetch the status of a local business search job.",
        "parameters": [
            {
                "name": "jobID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Job ID"
                }
            }
        ]
    },
    "leadsforge GET /maps-discovery/jobs/{jobID}/results": {
        "description": "Page the businesses found by the search job. Businesses are stored as the search progresses, so the page is readable while the job runs and is complete once the job status is completed.",
        "parameters": [
            {
                "name": "jobID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Job ID"
                }
            },
            {
                "name": "offset",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Offset (max 5000)"
                }
            },
            {
                "name": "limit",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Page size (max 200, default 50)"
                }
            }
        ]
    },
    "leadsforge GET /maps-discovery/owner-jobs": {
        "description": "List the caller's owner enrichment jobs, most recent first. Use the filters (status, clientRequestID, from/to) to recover a job when the job ID is unknown.",
        "parameters": [
            {
                "name": "offset",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Offset"
                }
            },
            {
                "name": "limit",
                "location": "query",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Page size (max 100)"
                }
            },
            {
                "name": "status",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "enum": [
                        "in_progress",
                        "completed",
                        "failed",
                        "no_results"
                    ],
                    "description": "Filter by status"
                }
            },
            {
                "name": "clientRequestID",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Filter by your clientRequestID"
                }
            },
            {
                "name": "from",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Created-at lower bound (RFC3339)"
                }
            },
            {
                "name": "to",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Created-at upper bound (RFC3339)"
                }
            }
        ]
    },
    "leadsforge GET /maps-discovery/owner-jobs/{jobID}": {
        "description": "Fetch the status of an owner enrichment job. While in progress, processed counts the businesses whose owner search has finished.",
        "parameters": [
            {
                "name": "jobID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Job ID"
                }
            }
        ]
    },
    "leadsforge GET /maps-discovery/owner-jobs/{jobID}/results": {
        "description": "Page the owners found for the job's businesses, each carrying the businessID it belongs to. Owners are added as each business's search finishes, so the page is readable while the job runs; email/phone statuses settle once the job status is completed.",
        "parameters": [
            {
                "name": "jobID",
                "location": "path",
                "required": true,
                "schema": {
                    "type": "string",
                    "description": "Job ID"
                }
            },
            {
                "name": "offset",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Offset"
                }
            },
            {
                "name": "limit",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Page size (max 200, default 50)"
                }
            }
        ]
    },
    "leadsforge POST /maps-discovery/search": {
        "description": "Starts an async Google Maps search for businesses of the given categories within radiusKm of the coordinates. Credits are reserved for the limit (maps discovery price per business) and settled for the businesses actually found. Supports idempotency via the Idempotency-Key header (a repeat with the same key returns the existing job) and webhook notifications via webhookURL (POST with JSON body on completion or failure, retried up to 10 times with exponential backoff, 2xx = success). Webhook payload: jobID (string), status (completed|failed|no_results), foundCount (int), limit (int), consumedCredits (number), error (string, failure only). The search creates a list named \"Public API: Local Businesses\" in the app.",
        "parameters": [
            {
                "name": "Idempotency-Key",
                "location": "header",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Idempotency key - if a job with this key already exists for this account, the existing job is returned as-is, use a new key to start a new search"
                }
            }
        ],
        "body": {
            "type": "object",
            "required": [
                "categories",
                "limit",
                "radiusKm"
            ],
            "properties": {
                "categories": {
                    "type": "array",
                    "description": "Categories are OR-combined. Recommended values: GET /maps-discovery/filters/categories; free text is accepted too.",
                    "minItems": 1,
                    "maxItems": 100,
                    "items": {
                        "type": "string"
                    }
                },
                "clientRequestID": {
                    "type": "string",
                    "maxLength": 128
                },
                "language": {
                    "type": "string",
                    "maxLength": 10
                },
                "lat": {
                    "type": "number",
                    "minimum": -90,
                    "maximum": 90
                },
                "limit": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 5000
                },
                "lng": {
                    "type": "number",
                    "minimum": -180,
                    "maximum": 180
                },
                "radiusKm": {
                    "type": "number",
                    "maximum": 500
                },
                "webhookURL": {
                    "type": "string"
                }
            }
        }
    },
    "leadsforge POST /search": {
        "description": "Search leads. Accepts the full person filter set. Beyond the documented fields the body also accepts exclusion filters to skip contacts you already own: excludeEmails ([]string), excludeDomains ([]string), excludeLinkedInURLs ([]string). Use companyDomains.include to target specific companies (e.g. domains returned by /lookalikes/preview or /lookalikes/search). Free-text fields (jobTitles, leadLocations, companyLocations, technologies, keywords, companyNames) accept any value (casing and partial terms are matched), so there is no value list to fetch. Controlled fields must use exact values from their discovery endpoints under /search/filters (industries, seniorities, departments, companyTypes, fundingTypes, revenueRanges).",
        "parameters": [
            {
                "name": "cursor",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Cursor"
                }
            }
        ],
        "body": {
            "type": "object",
            "properties": {
                "companyBusinessModels": {
                    "type": "object",
                    "properties": {
                        "exclude": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "include": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    }
                },
                "companyDomains": {
                    "type": "object",
                    "properties": {
                        "exclude": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "include": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    }
                },
                "companyEmployeeNumberRange": {
                    "type": "object",
                    "properties": {
                        "max": {
                            "type": "integer"
                        },
                        "min": {
                            "type": "integer"
                        }
                    }
                },
                "companyFoundedYearRange": {
                    "type": "object",
                    "properties": {
                        "max": {
                            "type": "integer"
                        },
                        "min": {
                            "type": "integer"
                        }
                    }
                },
                "companyFundingRounds": {
                    "type": "object",
                    "properties": {
                        "exclude": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "include": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    }
                },
                "companyIDs": {
                    "type": "object",
                    "properties": {
                        "exclude": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "include": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    }
                },
                "companyIndustries": {
                    "type": "object",
                    "properties": {
                        "exclude": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "include": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    }
                },
                "companyKeywords": {
                    "type": "object",
                    "properties": {
                        "exclude": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "include": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "matchAll": {
                            "type": "boolean"
                        }
                    }
                },
                "companyLocations": {
                    "type": "object",
                    "properties": {
                        "exclude": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "include": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    }
                },
                "companyNames": {
                    "type": "object",
                    "properties": {
                        "exclude": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "include": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    }
                },
                "companyNiches": {
                    "type": "object",
                    "properties": {
                        "exclude": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "include": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    }
                },
                "companyRequired": {
                    "type": "boolean"
                },
                "companyRevenueRanges": {
                    "type": "array",
                    "items": {
                        "type": "string",
                        "enum": [
                            "very_small",
                            "small_lower",
                            "small_upper",
                            "lower_mid_sized",
                            "mid_sized_lower",
                            "mid_sized_upper",
                            "large_lower",
                            "large_upper",
                            "enterprise_lower",
                            "enterprise_upper",
                            "global_giants_lower",
                            "global_giants_upper",
                            "super_enterprises"
                        ]
                    }
                },
                "companyTechnologies": {
                    "type": "object",
                    "properties": {
                        "all": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "any": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    }
                },
                "companyTypes": {
                    "type": "object",
                    "properties": {
                        "exclude": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "include": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    }
                },
                "companyYearsInBusinessRange": {
                    "type": "object",
                    "properties": {
                        "max": {
                            "type": "integer"
                        },
                        "min": {
                            "type": "integer"
                        }
                    }
                },
                "leadDepartments": {
                    "type": "object",
                    "properties": {
                        "exclude": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "include": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    }
                },
                "leadIDs": {
                    "type": "object",
                    "properties": {
                        "exclude": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "include": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    }
                },
                "leadJobTitles": {
                    "type": "object",
                    "properties": {
                        "exactMatch": {
                            "type": "boolean"
                        },
                        "exclude": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "include": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    }
                },
                "leadLanguages": {
                    "type": "object",
                    "properties": {
                        "exclude": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "include": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "primaryOnly": {
                            "type": "boolean"
                        }
                    }
                },
                "leadLocations": {
                    "type": "object",
                    "properties": {
                        "exclude": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "include": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    }
                },
                "leadSeniorities": {
                    "type": "object",
                    "properties": {
                        "exclude": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "include": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    }
                },
                "leadTenure": {
                    "type": "object",
                    "properties": {
                        "max": {
                            "type": "integer"
                        },
                        "min": {
                            "type": "integer"
                        }
                    }
                },
                "limit": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 2000
                },
                "maxContactsPerCompany": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 100
                }
            }
        }
    },
    "leadsforge POST /search/count": {
        "description": "Count leads matching a filter set. Accepts the same filter payload as POST /search except the limit field, and returns the total number of matches without paginating results. Useful for sizing the audience before launching a search.",
        "parameters": [],
        "body": {
            "type": "object",
            "properties": {
                "companyBusinessModels": {
                    "type": "object",
                    "properties": {
                        "exclude": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "include": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    }
                },
                "companyDomains": {
                    "type": "object",
                    "properties": {
                        "exclude": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "include": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    }
                },
                "companyEmployeeNumberRange": {
                    "type": "object",
                    "properties": {
                        "max": {
                            "type": "integer"
                        },
                        "min": {
                            "type": "integer"
                        }
                    }
                },
                "companyFoundedYearRange": {
                    "type": "object",
                    "properties": {
                        "max": {
                            "type": "integer"
                        },
                        "min": {
                            "type": "integer"
                        }
                    }
                },
                "companyFundingRounds": {
                    "type": "object",
                    "properties": {
                        "exclude": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "include": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    }
                },
                "companyIDs": {
                    "type": "object",
                    "properties": {
                        "exclude": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "include": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    }
                },
                "companyIndustries": {
                    "type": "object",
                    "properties": {
                        "exclude": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "include": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    }
                },
                "companyKeywords": {
                    "type": "object",
                    "properties": {
                        "exclude": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "include": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "matchAll": {
                            "type": "boolean"
                        }
                    }
                },
                "companyLocations": {
                    "type": "object",
                    "properties": {
                        "exclude": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "include": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    }
                },
                "companyNames": {
                    "type": "object",
                    "properties": {
                        "exclude": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "include": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    }
                },
                "companyNiches": {
                    "type": "object",
                    "properties": {
                        "exclude": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "include": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    }
                },
                "companyRequired": {
                    "type": "boolean"
                },
                "companyRevenueRanges": {
                    "type": "array",
                    "items": {
                        "type": "string",
                        "enum": [
                            "very_small",
                            "small_lower",
                            "small_upper",
                            "lower_mid_sized",
                            "mid_sized_lower",
                            "mid_sized_upper",
                            "large_lower",
                            "large_upper",
                            "enterprise_lower",
                            "enterprise_upper",
                            "global_giants_lower",
                            "global_giants_upper",
                            "super_enterprises"
                        ]
                    }
                },
                "companyTechnologies": {
                    "type": "object",
                    "properties": {
                        "all": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "any": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    }
                },
                "companyTypes": {
                    "type": "object",
                    "properties": {
                        "exclude": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "include": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    }
                },
                "companyYearsInBusinessRange": {
                    "type": "object",
                    "properties": {
                        "max": {
                            "type": "integer"
                        },
                        "min": {
                            "type": "integer"
                        }
                    }
                },
                "leadDepartments": {
                    "type": "object",
                    "properties": {
                        "exclude": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "include": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    }
                },
                "leadIDs": {
                    "type": "object",
                    "properties": {
                        "exclude": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "include": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    }
                },
                "leadJobTitles": {
                    "type": "object",
                    "properties": {
                        "exactMatch": {
                            "type": "boolean"
                        },
                        "exclude": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "include": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    }
                },
                "leadLanguages": {
                    "type": "object",
                    "properties": {
                        "exclude": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "include": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "primaryOnly": {
                            "type": "boolean"
                        }
                    }
                },
                "leadLocations": {
                    "type": "object",
                    "properties": {
                        "exclude": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "include": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    }
                },
                "leadSeniorities": {
                    "type": "object",
                    "properties": {
                        "exclude": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        },
                        "include": {
                            "type": "array",
                            "items": {
                                "type": "string"
                            }
                        }
                    }
                },
                "leadTenure": {
                    "type": "object",
                    "properties": {
                        "max": {
                            "type": "integer"
                        },
                        "min": {
                            "type": "integer"
                        }
                    }
                },
                "maxContactsPerCompany": {
                    "type": "integer",
                    "minimum": 0,
                    "maximum": 100
                }
            }
        }
    },
    "leadsforge GET /search/filters/company-types": {
        "description": "Get the company type values accepted by companyTypes on /search.",
        "parameters": []
    },
    "leadsforge GET /search/filters/departments": {
        "description": "Get the department values accepted by leadDepartments on /search.",
        "parameters": []
    },
    "leadsforge GET /search/filters/funding-types": {
        "description": "Get the funding type values accepted by companyFundingRounds on /search.",
        "parameters": []
    },
    "leadsforge GET /search/filters/industries": {
        "description": "Search the industry filter values accepted by companyIndustries on /search. These are exact, case-sensitive values, send them verbatim.",
        "parameters": [
            {
                "name": "search",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "string",
                    "description": "Search query"
                }
            },
            {
                "name": "offset",
                "location": "query",
                "required": false,
                "schema": {
                    "type": "integer",
                    "description": "Offset"
                }
            },
            {
                "name": "limit",
                "location": "query",
                "required": true,
                "schema": {
                    "type": "integer",
                    "description": "Limit (1-100)"
                }
            }
        ]
    },
    "leadsforge GET /search/filters/revenue-ranges": {
        "description": "Get the revenue range values accepted by companyRevenueRanges on /search.",
        "parameters": []
    },
    "leadsforge GET /search/filters/seniorities": {
        "description": "Get the seniority values accepted by leadSeniorities on /search.",
        "parameters": []
    }
};
//# sourceMappingURL=contracts.js.map