import { z } from "zod";
import type { CommandDefinition, JsonObject } from "../../types.js";
import { cmd, encStr, multichannelApi, param } from "../common.js";

/** Create the MCP-compatible create/assign/trigger workflow with cleanup on partial failure. */
export function createSubsequenceCommand(commands: CommandDefinition[]): CommandDefinition {
  const create = commands.find((command) => command.name === "create_sequence")!;
  const inputSchema = z.object({
    workspaceId: z.string().min(1), parentSequenceId: z.string().min(1), name: z.string().min(1),
    labelId: z.string().min(1), description: z.string().optional(), timezone: z.string().optional(), priority: z.number().int().optional(),
  }).strict();
  /** Reuse sequence creation while fixing the new sequence kind. */
  const request = (args: JsonObject) => create.request({ ...args, kind: "subsequence" });
  return cmd({
    name: "create_subsequence", product: "salesforge", group: "subsequences", subcommand: "create",
    description: "Create a subsequence, assign it to a parent, and add a Primebox label trigger. On assignment or trigger failure, attempt to delete the newly created subsequence. Configure nodes and senders before launching.",
    inputSchema,
    params: [param("workspaceId", "string", true), param("parentSequenceId", "string", true), param("name", "string", true), param("labelId", "string", true), param("description"), param("timezone"), param("priority", "number")],
    request,
    execute: async (args, execute) => {
      const subsequence = await execute(request(args)) as { id?: unknown };
      if (!subsequence || (typeof subsequence.id !== "number" && typeof subsequence.id !== "string")) {
        throw new Error("Subsequence creation returned no ID; inspect sequences before retrying");
      }
      const base = `/multichannel/workspaces/${encStr(args.workspaceId)}`;
      const priority = args.priority === undefined ? {} : { priority: args.priority };
      try {
        const assignment = await execute(multichannelApi("POST", `${base}/sequences/${encStr(args.parentSequenceId)}/subsequence-assignments`, { body: { childSequenceId: Number(subsequence.id), ...priority } }));
        const trigger = await execute(multichannelApi("POST", `${base}/subsequences/${encStr(subsequence.id)}/triggers`, { body: { labelId: args.labelId, ...priority } }));
        return { subsequence, assignment, trigger };
      } catch (error) {
        try {
          await execute(multichannelApi("DELETE", `${base}/sequences/${encStr(subsequence.id)}`));
        } catch {
          throw new Error(`Subsequence ${subsequence.id} was created but cleanup failed; inspect it before retrying. ${error instanceof Error ? error.message : String(error)}`);
        }
        throw error;
      }
    },
  });
}
