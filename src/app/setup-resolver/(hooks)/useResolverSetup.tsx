import { ENS_REGISTRY_ABI } from "@/constants/abi";
import {
  ENS_REGISTRY_ADDRESS,
  NAMESPACE_RESOLVER_ADDRESS,
} from "@/constants/constants";
import { useEnsStore } from "@/states/useEnsStore";
import { useEffect, useMemo, useState } from "react";
import { namehash, normalize } from "viem/ens";
import {
  useAccount,
  useChainId,
  useEnsResolver,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { goerli, mainnet, sepolia } from "wagmi/chains";
import { config } from "@/lib/wagmi";

export const useEnsResolverSetup = () => {
  const chainId = useChainId();
  const { isConnecting } = useAccount();
  const { selectedEns, ensNames, setSelectedEns } = useEnsStore();
  const [error, setError] = useState("");

  const {
    data: currentResolver,
    refetch: refetchResolver,
    isLoading: isCurrentResolverLoading,
  } = useEnsResolver({
    chainId,
    name: normalize(selectedEns?.name || ""),
    config,
  });

  const {
    data: hash,
    writeContract,
    isPending,
    isError,
    reset,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

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

  const handleSubmit = () => {
    if (!selectedEns?.name || !currentResolver) {
      setError("Please select an ENS name");
      return;
    }

    if (
      chainId !== mainnet.id &&
      chainId !== goerli.id &&
      chainId !== sepolia.id
    ) {
      setError(
        "Unsupported chain, please connected to mainnet, goerli or sepolia"
      );
      return;
    }

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
        error instanceof Error ? error.message : "Failed to set resolver"
      );
    }
  };

  useEffect(() => {
    // Reset form when selectedEns changes
    if (selectedEns?.name) {
      setError("");
      reset();
    }
  }, [selectedEns, reset]);

  return {
    ensNames,
    setSelectedEns,
    chainId,
    error,
    selectedEns,
    currentResolver,
    isPageLoading,
    isPending,
    isError,
    isConfirming,
    isConfirmed,
    setupComplete,
    transactionHash: hash,
    setError,
    handleSubmit,
    refetchResolver,
  };
};
