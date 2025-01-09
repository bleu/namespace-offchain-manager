import { CopyableField } from "@/components/copyableField";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import type React from "react";

interface NewApiKeyDialogContentProps {
  newApiKey: string;
  handleDone: () => void;
}

export const NewApiKeyDialogContent: React.FC<NewApiKeyDialogContentProps> = ({
  newApiKey,
  handleDone,
}) => {
  return (
    <div className="space-y-4">
      <div className="rounded-md bg-yellow-50 p-4">
        <p className="text-sm text-yellow-700">
          Make sure to copy your API key now. You won't be able to see it again!
        </p>
      </div>
      <CopyableField label="API Key" value={newApiKey} className="font-mono" />
      <DialogFooter>
        <Button onClick={handleDone}>Done</Button>
      </DialogFooter>
    </div>
  );
};
