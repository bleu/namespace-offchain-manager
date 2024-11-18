import type { createApiKeySchema } from "@/schemas/api-key.schema";
import type { z } from "zod";

export type CreateApiKeyDTO = z.infer<typeof createApiKeySchema>;

export interface ApiKey {
  id: string;
  name: string;
  createdAt: string;
  expiresAt: string | null;
}

export interface ApiKeyResponse extends ApiKey {
  apiKey?: string;
}

export interface ApiKeyResponseDTO
  extends Omit<ApiKey, "createdAt" | "expiresAt"> {
  createdAt: Date;
  expiresAt: Date | null;
  apiKey?: string;
}
