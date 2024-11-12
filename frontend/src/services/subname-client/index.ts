import type {
  CreateSubnameDTO,
  PaginatedResponse,
  SubnameResponseDTO,
  UpdateSubnameDTO,
} from "@/types/subname.types";

const api = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  if (response.status === 204) {
    return null;
  }
  return response.json();
};

export const subnameClient = {
  getAll: async (
    isConnected: boolean,
    page = 1,
    pageSize = 10,
    parentNames?: string[],
  ): Promise<PaginatedResponse<SubnameResponseDTO>> => {
    if (!isConnected) {
      throw new Error("Please connect your wallet first");
    }

    if (!parentNames?.length) {
      return {
        data: [],
        meta: {
          total: 0,
          page,
          pageSize,
          totalPages: 0,
          hasMore: false,
        },
      };
    }

    const parentNamesParam = `parentNames=${parentNames.join(",")}`;
    return api(
      `/api/subnames?page=${page}&pageSize=${pageSize}&${parentNamesParam}`,
    );
  },

  getById: async (id: string): Promise<SubnameResponseDTO> => {
    return api(`/api/subnames/${id}`);
  },

  create: async (payload: CreateSubnameDTO): Promise<SubnameResponseDTO> => {
    return api("/api/subnames/new", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update: async (
    id: string,
    payload: UpdateSubnameDTO,
  ): Promise<SubnameResponseDTO> => {
    return api(`/api/subnames/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  delete: async (id: string): Promise<void> => {
    await api(`/api/subnames/${id}`, {
      method: "DELETE",
    });
  },
};
