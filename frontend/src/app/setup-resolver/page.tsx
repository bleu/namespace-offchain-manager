"use client";

import type React from "react";
import { useEffect } from "react";
import SetupResolver from "./(components)/SetupResolver";
import { useEnsResolverSetup } from "./(hooks)/useResolverSetup";

const Page = () => {
  const {
    error,
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
    selectedEns,
  } = useEnsResolverSetup();

  useEffect(() => {
    if (isSuccess) {
      console.log("Transaction successful: Resolver updated");
      refetchResolver();
    }

    if (isError) {
      console.error("Transaction error:", writeError);
      setError(
        writeError instanceof Error ? writeError.message : "Transaction failed",
      );
    }
  }, [isSuccess, isError, writeError, refetchResolver, setError]);

  return (
    <SetupResolver
      error={error}
      handleSubmit={handleSubmit}
      isLoading={isPageLoading}
      isWriteContractLoading={isPending}
      selectedEns={selectedEns}
      currentResolver={currentResolver as string | null}
      setupComplete={setupComplete}
    />
  );
};

export default Page;
