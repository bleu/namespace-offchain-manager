import type { CreateSubnameDTO, SubnameResponseDTO, UpdateSubnameDTO } from "@/types/subname.types";

export interface SubnameRowProps {
  subname: SubnameResponseDTO;
  onEdit: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
}
export interface SubnameListProps {
  subnames: SubnameResponseDTO[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
}

export interface CreateSubnameFormProps {
    subname?: SubnameResponseDTO | null;
    onSubmit: (data: any) => Promise<void>;
    onCancel?: () => void;
    isSubmitting?: boolean;
  }

export interface ManageSubnamesProps {
    isLoading: boolean;
    subnames: SubnameResponseDTO[];
    selectedSubname: SubnameResponseDTO | null;
    isCreating: boolean;
    onBack: () => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => Promise<void>;
    onUpdate: (id: string, data: UpdateSubnameDTO) => Promise<void>;
    onCreate: (data: CreateSubnameDTO) => Promise<void>;
  }