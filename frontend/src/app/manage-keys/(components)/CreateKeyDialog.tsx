import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import type { CreateKeyDialogProps } from "../types";
import { ApiKeyDialogContent } from "./ApiKeyDialogContent";
import { ApiKeyFooter } from "./ApiKeyFooter";
import { NewApiKeyDialogContent } from "./NewApiKeyDialogContent";

export function CreateKeyDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: CreateKeyDialogProps) {
  const [newKeyName, setNewKeyName] = useState("");
  const [newApiKey, setNewApiKey] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!newKeyName.trim()) return;

    const response = await onSubmit(newKeyName);
    if (response?.apiKey) {
      setNewApiKey(response.apiKey);
    }
  };

  const handleDone = () => {
    onOpenChange(false);
    setNewApiKey(null);
    setNewKeyName("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create API Key</DialogTitle>
        </DialogHeader>
        {newApiKey ? (
          <NewApiKeyDialogContent
            newApiKey={newApiKey}
            handleDone={handleDone}
          />
        ) : (
          <>
            <ApiKeyDialogContent
              newKeyName={newKeyName}
              onChangeKeyName={(e) => setNewKeyName(e.target.value)}
            />
            <DialogFooter>
              <ApiKeyFooter
                newKeyName={newKeyName}
                isSubmitting={isSubmitting}
                onOpenChange={onOpenChange}
                handleSubmit={handleSubmit}
              />
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
