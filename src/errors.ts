export class CliError extends Error {
  readonly code: string;
  readonly exitCode: number;
  readonly details?: unknown;

  constructor(message: string, options: { code: string; exitCode?: number; details?: unknown }) {
    super(message);
    this.name = "CliError";
    this.code = options.code;
    this.exitCode = options.exitCode ?? 1;
    this.details = options.details;
  }
}

export function usageError(message: string, details?: unknown): CliError {
  return new CliError(message, { code: "USAGE_ERROR", exitCode: 2, details });
}

export function authError(message: string, details?: unknown): CliError {
  return new CliError(message, { code: "AUTH_ERROR", exitCode: 3, details });
}

export function asCliError(error: unknown): CliError {
  if (error instanceof CliError) return error;
  if (error instanceof Error) {
    return new CliError(error.message, {
      code: "UNEXPECTED_ERROR",
      exitCode: 1,
      details: error.stack,
    });
  }
  return new CliError(String(error), { code: "UNEXPECTED_ERROR", exitCode: 1 });
}
