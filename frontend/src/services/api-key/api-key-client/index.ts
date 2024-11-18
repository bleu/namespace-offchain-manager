import type { ApiKey, ApiKeyResponse } from "@/types/api-keys.type";

const api = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (response.status === 401) {
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    throw new Error(response.statusText || "An error occurred");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const apiKeyClient = {
  getAll: async (): Promise<ApiKey[]> => {
    return api("/api/keys");
  },

  create: async (name: string): Promise<ApiKeyResponse> => {
    return api("/api/keys", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  },

  revoke: async (id: string): Promise<void> => {
    return api(`/api/keys/${id}`, {
      method: "PUT",
    });
  },

  delete: async (id: string): Promise<void> => {
    return api(`/api/keys/${id}`, {
      method: "DELETE",
    });
  },
};
