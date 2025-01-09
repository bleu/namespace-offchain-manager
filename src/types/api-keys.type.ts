import type { createApiKeySchema } from "@/schemas/api-key.schema";
import type { ApiToken } from "@prisma/client";
import type { z } from "zod";

export type CreateApiKeyDTO = z.infer<typeof createApiKeySchema>;

export interface ApiKeyResponse extends ApiToken {
  apiKey?: string;
}

export interface ApiKeyResponseDTO
  extends Omit<ApiToken, "createdAt" | "expiresAt"> {
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
