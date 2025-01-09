import { config } from "@/lib/wagmi";
import type { ClientWithEns } from "@ensdomains/ensjs/contracts";
import type { GetNamesForAddressReturnType } from "@ensdomains/ensjs/subgraph";
import { getNamesForAddress } from "@ensdomains/ensjs/subgraph";
import { getEnsAvatar } from "@wagmi/core";
import { normalize } from "viem/ens";
import { create } from "zustand";

interface EnsState {
  address: string | null;
  chainId: number | undefined;
  ensNames: GetNamesForAddressReturnType | null;
  selectedEns: GetNamesForAddressReturnType[0] | undefined;
  setSelectedEns: (ens: GetNamesForAddressReturnType[0]) => Promise<void>;
  avatar: string | null;
}

interface EnsActions {
  setAddress: (address: string, chainId: number) => void;
  fetchEnsNames: () => Promise<void>;
}

export const useEnsStore = create<EnsState & EnsActions>((set, get) => ({
  address: null,
  chainId: undefined,
  ensNames: null,
  selectedEns: undefined,
  avatar: null,

  setAddress: (address, chainId) => set({ address, chainId }),

  setSelectedEns: async (ens) => {
    set({ selectedEns: ens });
    const normalizedEnsName = normalize(ens.name || "");

    if (normalizedEnsName) {
      try {
        const { chainId } = get();
        const avatarUrl = await getEnsAvatar(config, {
          name: normalizedEnsName,
          chainId,
        });
        set({ avatar: avatarUrl });
      } catch (error) {
        console.error("Failed to fetch ENS avatar", error);
      }
    } else {
      set({ avatar: null });
    }
  },

  fetchEnsNames: async () => {
    const { address, chainId } = get();
    const client = config.getClient({ chainId }) as ClientWithEns;

    if (address && client) {
      try {
        const names = await getNamesForAddress(client, {
          address: address as `0x${string}`,
        });

        if (!names.length) {
          set({ ensNames: null, selectedEns: undefined });
          return;
        }

        const selectedEns = names[0];
        const normalizedEnsName = normalize(selectedEns.name as string);

        set({
          ensNames: names,
          selectedEns,
        });

        if (normalizedEnsName) {
          try {
            const { chainId } = get();
            const avatarUrl = await getEnsAvatar(config, {
              name: normalizedEnsName,
              chainId,
            });

            set({ avatar: avatarUrl });
          } catch (error) {
            console.error("Failed to fetch ENS avatar", error);
          }
        } else {
          set({ avatar: null });
        }
      } catch (error) {
        console.error("Failed to fetch ENS names", error);
      }
    }
  },
}));
