import type {
  CreateSubnameDTO,
  PaginationMeta,
  SubnameResponseDTO,
  UpdateSubnameDTO,
} from "@/types/subname.types";

export interface SubnameRowProps {
  subname: SubnameResponseDTO;
  onEdit: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
  isAuthenticated: boolean;
}
export interface SubnameListProps {
  subnames: SubnameResponseDTO[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
  isAuthenticated: boolean;
}

export interface CreateSubnameFormProps {
  subname?: SubnameResponseDTO | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  isAuthenticated: boolean;
}

export interface ManageSubnamesProps {
  isLoading: boolean;
  subnames: SubnameResponseDTO[];
  selectedSubname: SubnameResponseDTO | null;
  isSubmitting: boolean;
  pagination: PaginationMeta;
  activeTab: string;
  isConnected: boolean;
  isAuthenticated: boolean;
  onTabChange: (tab: string) => void;
  onChangePage: (page: number) => void;
  onBack: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, data: UpdateSubnameDTO) => Promise<void>;
  onCreate: (data: CreateSubnameDTO) => Promise<void>;
}
