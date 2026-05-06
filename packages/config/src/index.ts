export const nodeVersion = "24.12.0";
export const nextVersion = "16.2.4";
export const nestVersion = "11.1.19";
export const prismaVersion = "7.8.0";

export const requiredEnv = [
  "DATABASE_URL",
  "REDIS_URL",
  "QDRANT_URL",
  "OLLAMA_BASE_URL",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET"
] as const;
