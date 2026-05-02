import { infraforgeCommands } from "./infraforge/index.js";
import { leadsforgeCommands } from "./leadsforge/index.js";
import { mailforgeCommands } from "./mailforge/index.js";
import { primeforgeCommands } from "./primeforge/index.js";
import { salesforgeCommands } from "./salesforge/index.js";
import { warmforgeCommands } from "./warmforge/index.js";
import type { CommandDefinition } from "../types.js";

export const commands: readonly CommandDefinition[] = [
  ...salesforgeCommands(),
  ...primeforgeCommands(),
  ...leadsforgeCommands(),
  ...infraforgeCommands(),
  ...warmforgeCommands(),
  ...mailforgeCommands(),
];
