import { useEffect, useState } from "react";
import { getNamesForAddress } from "@ensdomains/ensjs/subgraph";
import type { GetNamesForAddressReturnType } from "@ensdomains/ensjs/subgraph";
import type { ClientWithEns } from "@ensdomains/ensjs/contracts";
import { useConfig } from "wagmi";

export function useEnsNames(address?: string, chainId?: number) {
  const config = useConfig();
  const client = config.getClient({ chainId }) as ClientWithEns;
  const [ensNames, setEnsNames] = useState<GetNamesForAddressReturnType | null>(
    null,
  );

  useEffect(() => {
    if (address) {
      const fetchEnsNames = async () => {
        try {
          const names = await getNamesForAddress(client, {
            address: address as `0x${string}`,
          });
          setEnsNames(names);
          console.log(names.sort);
        } catch (error) {
          console.error("Failed to fetch ENS names", error);
        }
      };
      fetchEnsNames();
    }
  }, [address, client]);

  return ensNames;
}
