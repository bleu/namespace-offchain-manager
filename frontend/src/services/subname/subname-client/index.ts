import { apiClient } from "@/lib/api/client";
import type {
  CreateSubnameDTO,
  PaginatedResponse,
  SubnameResponseDTO,
  UpdateSubnameDTO,
} from "@/types/subname.types";

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
    return apiClient(
      `/api/subnames?page=${page}&pageSize=${pageSize}&${parentNamesParam}`,
    );
  },

  getById: async (id: string): Promise<SubnameResponseDTO> => {
    return apiClient(`/api/subnames/${id}`);
  },

  create: async (payload: CreateSubnameDTO): Promise<SubnameResponseDTO> => {
    return apiClient("/api/subnames/new", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update: async (
    id: string,
    payload: UpdateSubnameDTO,
  ): Promise<SubnameResponseDTO> => {
    return apiClient(`/api/subnames/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  delete: async (id: string): Promise<void> => {
    await apiClient(`/api/subnames/${id}`, {
      method: "DELETE",
    });
  },
};
