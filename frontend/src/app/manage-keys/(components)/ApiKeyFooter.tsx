import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type React from "react";

interface ApiKeyFooterProps {
  onOpenChange: (isOpen: boolean) => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
  newKeyName: string;
}

export const ApiKeyFooter: React.FC<ApiKeyFooterProps> = ({
  onOpenChange,
  handleSubmit,
  isSubmitting,
  newKeyName,
}) => {
  return (
    <div>
      <Button variant="outline" onClick={() => onOpenChange(false)}>
        Cancel
      </Button>
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || !newKeyName.trim()}
        loading={isSubmitting}
      >
        Create
      </Button>
    </div>
  );
};
