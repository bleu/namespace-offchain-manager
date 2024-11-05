import { CopyableField } from "@/components/copyableField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NAMESPACE_RESOLVER_ADDRESS } from "@/constants/constants";
import { Check, ExternalLink, Loader2 } from "lucide-react";
import type { TransactionDialogProps } from "../types";

export const TransactionDialog = ({
  isOpen,
  onClose,
  onConfirm,
  currentResolver,
  chainId,
  isConfirming,
  isConfirmed,
  isTransactionPending,
  transactionHash,
  ensName,
}: TransactionDialogProps) => {
  const getContent = () => {
    if (isConfirmed) {
      return (
        <>
          <DialogHeader>
            <DialogTitle>Transaction Successful!</DialogTitle>
          </DialogHeader>
          <div className="py-6 flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center">
              <Check className="h-6 w-6 text-success" />
            </div>
            <p className="text-center text-muted-foreground">
              Your resolver has been successfully updated
            </p>
            {transactionHash && (
              <a
                href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                View on Etherscan
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
          <DialogFooter>
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </DialogFooter>
        </>
      );
    }

    if (isConfirming) {
      return (
        <>
          <DialogHeader>
            <DialogTitle>Transaction in Progress</DialogTitle>
          </DialogHeader>
          <div className="py-6 flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-center text-muted-foreground">
              Please wait while your transaction is being confirmed...
            </p>
            {transactionHash && (
              <a
                href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                View on Etherscan
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </>
      );
    }

    return (
      <>
        <DialogHeader>
          <DialogTitle>Confirm Resolver Update</DialogTitle>
        </DialogHeader>
        <div className="py-6 space-y-4">
          <CopyableField
            label="Ens Name"
            value={ensName || ""}
            className="text-xs"
          />
          <CopyableField
            label="Current Resolver"
            value={currentResolver || ""}
            className="text-xs"
          />
          <CopyableField
            label="New Resolver"
            value={NAMESPACE_RESOLVER_ADDRESS[chainId]}
            className="text-xs"
          />
          <p className="text-sm text-muted-foreground">
            Please confirm that you want to update your ENS resolver.
          </p>
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={onClose} className="w-full">
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="w-full"
            isLoading={isTransactionPending}
          >
            {isTransactionPending
              ? "Please confirm the transaction"
              : "Confirm Update"}
          </Button>
        </DialogFooter>
      </>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>{getContent()}</DialogContent>
    </Dialog>
  );
};
