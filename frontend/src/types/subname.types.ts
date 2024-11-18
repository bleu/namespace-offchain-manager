import type {
  createSubnameSchema,
  updateSubnameSchema,
} from "@/schemas/subname.schema";
import type { Prisma } from "@prisma/client";
import type { z } from "zod";

export type CreateSubnameDTO = z.infer<typeof createSubnameSchema>;
export type UpdateSubnameDTO = z.infer<typeof updateSubnameSchema>;

export interface PaginationMeta {
  page: number | undefined;
  pageSize: number | undefined;
  total: number | undefined;
  totalPages: number | undefined;
  hasMore: boolean | undefined;
}
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
export interface SubnameResponseDTO {
  id: string;
  parentName: string;
  label: string;
  name: string;
  contenthash: string | null;
  texts: SubnameTextResponseDTO[];
  addresses: SubnameAddressResponseDTO[];
  subscriptionPack: SubscriptionPackResponseDTO;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubnameTextResponseDTO {
  id: string;
  key: string;
  value: string;
}

export interface SubnameAddressResponseDTO {
  id: string;
  coin: number;
  value: string;
}

export interface SubscriptionPackResponseDTO {
  id: string;
  name: string;
  price: Prisma.Decimal | number;
  duration: number;
  maxSubnames: number;
  createdAt: Date;
  updatedAt: Date;
}
