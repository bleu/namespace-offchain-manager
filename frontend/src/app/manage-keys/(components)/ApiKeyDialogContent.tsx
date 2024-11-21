import { Input } from "@/components/ui/input";
import type React from "react";

interface ApiKeyDialogContentProps {
  newKeyName: string;
  onChangeKeyName: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ApiKeyDialogContent: React.FC<ApiKeyDialogContentProps> = ({
  newKeyName,
  onChangeKeyName,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="keyName" className="text-sm font-medium">
          Key Name
        </label>
        <Input
          id="keyName"
          value={newKeyName}
          onChange={onChangeKeyName}
          placeholder="Enter a name for your API key"
        />
      </div>
    </div>
  );
};
