import { apiClient } from "@/lib/api/client";
import type {
  ApiKeyResponse,
  PaginatedApiKeyResponse,
} from "@/types/api-keys.type";

export const apiKeyClient = {
  getAll: async (page = 1, pageSize = 10): Promise<PaginatedApiKeyResponse> => {
    return apiClient(`/api/keys?page=${page}&pageSize=${pageSize}`);
  },

  create: async (name: string): Promise<ApiKeyResponse> => {
    return apiClient("/api/keys", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  },

  revoke: async (id: string): Promise<void> => {
    return apiClient(`/api/keys/${id}`, {
      method: "PUT",
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiClient(`/api/keys/${id}`, {
      method: "DELETE",
    });
  },

  sendApiKeyToEmail: async (to: string, apiKey: string): Promise<void> => {
    return apiClient("/api/email/apikey", {
      method: "POST",
      body: JSON.stringify({ to, apiKey }),
    });
  },
};
