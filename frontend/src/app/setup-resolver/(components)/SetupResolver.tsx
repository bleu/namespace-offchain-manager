import { CopyableField } from "@/components/copyableField";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import { StatusBadge } from "@/components/ui/statusBadge";
import { NAMESPACE_RESOLVER_ADDRESS } from "@/constants/constants";
import { cn } from "@/lib/utils";
import { AlertTriangle, Check } from "lucide-react";
import type { SetupResolverProps } from "../types";
import { TransactionDialog } from "./TransactionDialog";

const SetupResolver: React.FC<SetupResolverProps> = ({
  error,
  chainId,
  isLoading,
  selectedEns,
  currentResolver,
  setupComplete,
  isConfirmed,
  isConfirming,
  transactionHash,
  isTransactionPending,
  isDialogOpen,
  handleCloseDialog,
  handleOpenDialog,
  handleConfirmUpdate,
}) => {
  if (isLoading) return <Loading />;
  return (
    <>
      <div className="w-full max-w-3xl mx-auto space-y-6">
        <Card className="p-6 border bg-card">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-card-foreground">
                Setup resolver
              </h3>
              <p className="text-sm text-muted-foreground">
                Current ENS Configuration
              </p>
            </div>
            <StatusBadge
              type={setupComplete ? "success" : "warning"}
              text={
                setupComplete
                  ? "Resolver Configured"
                  : "Resolver Update Required"
              }
              icon={
                setupComplete ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )
              }
            />
          </div>

          <div className="space-y-4">
            <CopyableField
              label="Name"
              value={selectedEns?.name || ""}
              helpText="You can change the current ens by selecting it on top right header"
            />

            <CopyableField
              label="Current Resolver"
              value={currentResolver || ""}
              className="text-xs"
            />
          </div>
        </Card>

        <Card className="p-6 border bg-card">
          <div className="space-y-4">
            <CopyableField
              label="Namespace Offchain Resolver"
              value={NAMESPACE_RESOLVER_ADDRESS[chainId]}
              className="text-sm"
            />

            {error && (
              <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                {error}
              </div>
            )}

            <Button
              onClick={handleOpenDialog}
              className={cn(
                setupComplete
                  ? "bg-success text-success-foreground hover:bg-success/90"
                  : "bg-primary text-primary-foreground hover:bg-primary/90",
                "w-full",
              )}
              disabled={isLoading || setupComplete || isConfirming}
            >
              {setupComplete ? (
                <span className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  Resolver Configured
                </span>
              ) : (
                "Update Resolver"
              )}
            </Button>
          </div>
        </Card>
      </div>

      <TransactionDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmUpdate}
        currentResolver={currentResolver}
        chainId={chainId}
        isConfirming={isConfirming}
        isConfirmed={isConfirmed}
        transactionHash={transactionHash}
        isTransactionPending={isTransactionPending}
      />
    </>
  );
};

export default SetupResolver;
