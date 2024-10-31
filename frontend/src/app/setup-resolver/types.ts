import type { GetNamesForAddressReturnType } from "@ensdomains/ensjs/subgraph";

type NameWithRelation = GetNamesForAddressReturnType[0];

export interface SetupResolverProps {
  error: string;
  handleSubmit: (event: React.FormEvent) => void;
  isLoading: boolean;
  isWriteContractLoading: boolean;
  selectedEns: NameWithRelation | undefined;
  currentResolver: string | null;
  setupComplete: boolean;
  onEnsSelect?: (ensName: string) => void;
}
