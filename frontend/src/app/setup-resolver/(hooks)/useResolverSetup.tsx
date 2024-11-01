import { ENS_REGISTRY_ABI } from "@/constants/abi";
import { ENS_REGISTRY_ADDRESS, NAMESPACE_RESOLVER_ADDRESS } from "@/constants/constants";

import { useEnsStore } from "@/states/useEnsStore";
import { useMemo, useState } from "react";
import { namehash } from "viem/ens";
import {
  useAccount,
  useChainId,
  useEnsResolver,
  useWriteContract,
} from "wagmi";

export const useEnsResolverSetup = () => {
  const chainId = useChainId();

  const { isConnecting } = useAccount();
  const { selectedEns } = useEnsStore();
  const [error, setError] = useState("");
  const {
    data: currentResolver,
    refetch: refetchResolver,
    isLoading: isCurrentResolverLoading,
  } = useEnsResolver({
    name: selectedEns?.name || undefined,
  });

  const {
    writeContract,
    isPending,
    isSuccess,
    isError,
    error: writeError,
  } = useWriteContract();
  


  const isPageLoading = useMemo(() => {
    return isCurrentResolverLoading || isConnecting || !selectedEns;
  }, [isCurrentResolverLoading, isConnecting, selectedEns]);


  const setupComplete = useMemo(() => {
    if (!currentResolver) return false;
    try {
      return currentResolver === NAMESPACE_RESOLVER_ADDRESS[chainId];
    } catch (error) {
      console.error("Error comparing addresses:", error);
      return false;
    }
  }, [currentResolver, chainId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chainId !== 11155111) {
      setError("Please connect to Sepolia testnet");
      return;
    }
    if (!selectedEns?.name || !currentResolver) {
      setError("Please select an ENS name");
      return;
    }

    setError("");
    const node = namehash(selectedEns.name);
    try {
      writeContract({
        address: ENS_REGISTRY_ADDRESS[chainId] as `0x${string}`,
        abi: ENS_REGISTRY_ABI,
        functionName: "setResolver",
        args: [node, NAMESPACE_RESOLVER_ADDRESS[chainId]],
      });
    } catch (error) {
      console.error("Error setting resolver:", error);
      setError(
        error instanceof Error ? error.message : "Failed to set resolver",
      );
    }
  };

  return {
    error,
    chainId,
    selectedEns,
    setError,
    currentResolver,
    isPageLoading,
    isPending,
    isSuccess,
    isError,
    writeError,
    setupComplete,
    handleSubmit,
    refetchResolver,
  };
};
