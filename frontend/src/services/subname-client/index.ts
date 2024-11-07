import type {
  CreateSubnameDTO,
  SubnameResponseDTO,
  UpdateSubnameDTO,
} from "@/types/subname.types";
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const subnameClient = {
  getAll: async (): Promise<SubnameResponseDTO[]> => {
    const { data } = await api.get<SubnameResponseDTO[]>("/subnames");
    return data;
  },

  getById: async (id: string): Promise<SubnameResponseDTO> => {
    const { data } = await api.get<SubnameResponseDTO>(`/subnames/${id}`);
    return data;
  },

  create: async (payload: CreateSubnameDTO): Promise<SubnameResponseDTO> => {
    const { data } = await api.post<SubnameResponseDTO>(
      "/subnames/new",
      payload,
    );
    return data;
  },

  update: async (
    id: string,
    payload: UpdateSubnameDTO,
  ): Promise<SubnameResponseDTO> => {
    const { data } = await api.put<SubnameResponseDTO>(
      `/subnames/${id}`,
      payload,
    );
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/subnames/${id}`);
  },
};