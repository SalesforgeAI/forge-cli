import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { ApiExecutor } from "./api.js";
import { resolveRuntimeConfig, type Env } from "./config.js";
import { commands, validateCommandArgs } from "./registry.js";
import { CLI_VERSION, type CommandDefinition, type JsonObject, type ParamDefinition } from "./types.js";
import type { GlobalOptions } from "./args.js";

export async function startMcpServer(options: { env?: Env } = {}): Promise<void> {
  const globals: GlobalOptions = {
    help: false,
    version: false,
    pretty: false,
    quiet: false,
    raw: false,
    productKeys: {},
  };
  const runtime = await resolveRuntimeConfig(globals, options.env ?? process.env);
  const configuredProducts = new Set(Object.keys(runtime.keys));
  if (configuredProducts.size === 0) {
    throw new Error("At least one product API key is required to start Forge MCP.");
  }

  const executor = new ApiExecutor({ keys: runtime.keys });
  const server = new McpServer({
    name: "forge-cli",
    version: CLI_VERSION,
  });

  let registeredCount = 0;
  for (const command of commands) {
    if (!configuredProducts.has(command.product)) continue;
    registeredCount += 1;
    server.registerTool(
      command.name,
      {
        description: command.description,
        inputSchema: zodShape(command),
      },
      async (args) => {
        try {
          const input = args as JsonObject;
          validateCommandArgs(command, input);
          const result = await executor.execute(command.request(input));
          return {
            content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
          };
        } catch (error) {
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify({
                  error: error instanceof Error ? error.message : String(error),
                }),
              },
            ],
            isError: true,
          };
        }
      },
    );
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`Forge MCP server started from forge-cli with ${registeredCount} command definitions.`);
}

function zodShape(command: CommandDefinition): Record<string, z.ZodType> {
  const shape: Record<string, z.ZodType> = {};
  for (const input of command.params ?? []) {
    let schema = zodForParam(input);
    if (!input.required) schema = schema.optional();
    shape[input.name] = schema;
  }
  return shape;
}

function zodForParam(input: ParamDefinition): z.ZodType {
  if (input.type === "number") return z.number();
  if (input.type === "boolean") return z.boolean();
  if (input.type === "array") return z.array(z.any());
  if (input.type === "object" || input.type === "json") return z.record(z.string(), z.any());
  return z.string();
}
