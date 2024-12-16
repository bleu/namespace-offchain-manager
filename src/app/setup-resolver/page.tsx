"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import SetupResolver from "./(components)/SetupResolver";
import { useEnsResolverSetup } from "./(hooks)/useResolverSetup";

const Page = () => {
  const {
    error,
    chainId,
    currentResolver,
    isPageLoading,
    isPending,
    setupComplete,
    handleSubmit,
    selectedEns,
    isConfirming,
    isConfirmed,
    refetchResolver,
    transactionHash,
  } = useEnsResolverSetup();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isConnected } = useAccount();

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    if (isConfirmed) {
      setIsDialogOpen(false);
      refetchResolver();
    } else if (!isConfirming) {
      setIsDialogOpen(false);
    }
  };

  const handleConfirmUpdate = () => {
    handleSubmit();
  };

  useEffect(() => {
    // Close dialog when selectedEns changes
    setIsDialogOpen(false);
  }, [selectedEns]);

  return (
    <SetupResolver
      error={error}
      chainId={chainId}
      isConfirming={isConfirming}
      isConfirmed={isConfirmed}
      isLoading={isPageLoading}
      isTransactionPending={isPending}
      selectedEns={selectedEns}
      currentResolver={currentResolver as string | null}
      setupComplete={setupComplete}
      isDialogOpen={isDialogOpen}
      isConnected={isConnected}
      handleOpenDialog={handleOpenDialog}
      handleCloseDialog={handleCloseDialog}
      handleConfirmUpdate={handleConfirmUpdate}
      transactionHash={transactionHash}
    />
  );
};

export default Page;
