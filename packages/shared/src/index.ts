export * from "./types";
export * from "./contracts";
export * from "./seed";
export * from "./ai-tools";
export * from "./commerce";
export * from "./api";
export * from "./enums";

export function envelope<T>(data: T, message = "OK", meta: Record<string, unknown> = {}) {
  return { success: true, data, message, meta };
}
