import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";
import { Button } from "./ui/button";

interface CopyableFieldProps {
  label: string;
  value: string;
  className?: string;
  helpText?: string;
}

export const CopyableField = ({
  label,
  value,
  className = "",
  helpText,
}: CopyableFieldProps) => {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div>
      <span className="block text-sm font-medium text-muted-foreground mb-1">
        {label}
      </span>
      <div className="flex items-center">
        <div className="flex-col flex-1">
          <div
            className={cn(
              { className },
              "bg-muted p-3 rounded-lg font-mono text-sm break-all",
            )}
          >
            {value}
          </div>
          {helpText && (
            <span className="text-sm font-medium text-muted-foreground mt-1">
              {helpText}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-2"
          onClick={() => handleCopy(value)}
        >
          <Copy className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
};
