import type { ApiKey, ApiKeyResponse } from "@/types/api-keys.type";

export interface ManageKeysProps {
  isLoading: boolean;
  apiKeys: ApiKey[];
  isSubmitting: boolean;
  isConnected: boolean;
  isAuthenticated: boolean;
  showCreateDialog: boolean;
  setShowCreateDialog: (show: boolean) => void;
  onCreateKey: (name: string) => Promise<ApiKeyResponse | null>;
  onRevokeKey: (id: string) => Promise<void>;
  onDeleteKey: (id: string) => Promise<void>;
}

export interface KeysListProps {
  keys: ApiKey[];
  onRevoke: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export interface KeyRowProps {
  apiKey: ApiKey;
  onRevoke: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export interface CreateKeyDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string) => Promise<ApiKeyResponse | null>;
  isSubmitting: boolean;
}