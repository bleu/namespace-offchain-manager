import type { GetNamesForAddressReturnType } from "@ensdomains/ensjs/subgraph";

type NameWithRelation = GetNamesForAddressReturnType[0];

export interface SetupResolverProps {
  error: string;
  isLoading: boolean;
  selectedEns: NameWithRelation | undefined;
  currentResolver: string | null;
  setupComplete: boolean;
  chainId: number;
  isConfirming: boolean;
  isConfirmed: boolean;
  transactionHash?: string;
  isTransactionPending: boolean;
  isDialogOpen: boolean;
  isConnected: boolean;
  handleOpenDialog: () => void;
  handleCloseDialog: () => void;
  handleConfirmUpdate: () => void;
}

export interface TransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentResolver: string | null;
  chainId: number;
  isConfirming: boolean;
  isConfirmed: boolean;
  transactionHash?: string;
  isTransactionPending: boolean;
  ensName: string | undefined;
}
