import { CopyableField } from "@/components/copyableField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import type { CreateKeyDialogProps } from "../types";

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
          <div className="space-y-4">
            <div className="rounded-md bg-yellow-50 p-4">
              <p className="text-sm text-yellow-700">
                Make sure to copy your API key now. You won't be able to see it
                again!
              </p>
            </div>
            <CopyableField
              label="API Key"
              value={newApiKey}
              className="font-mono"
            />
            <DialogFooter>
              <Button onClick={handleDone}>Done</Button>
            </DialogFooter>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <label htmlFor="keyName" className="text-sm font-medium">
                  Key Name
                </label>
                <Input
                  id="keyName"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="Enter a name for your API key"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !newKeyName.trim()}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
