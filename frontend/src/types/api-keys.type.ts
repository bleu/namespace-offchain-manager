import type { createApiKeySchema } from "@/schemas/api-key.schema";
import type { ApiKey } from "@prisma/client";
import type { z } from "zod";

export type CreateApiKeyDTO = z.infer<typeof createApiKeySchema>;

export interface ApiKeyResponse extends ApiKey {
  apiKey?: string;
}

export interface ApiKeyResponseDTO
  extends Omit<ApiKey, "createdAt" | "expiresAt"> {
  createdAt: Date;
  expiresAt: Date | null;
  apiKey?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

export interface PaginatedApiKeyResponse {
  data: ApiKeyResponse[];
  meta: PaginationMeta;
}
