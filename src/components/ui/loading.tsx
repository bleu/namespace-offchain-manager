import { Loader2 } from "lucide-react";

interface LoadingProps {
  text?: string;
  className?: string;
}

export const Loading = ({
  text = "Loading...",
  className = "min-h-[400px]",
}: LoadingProps) => (
  <div
    className={`flex flex-col items-center justify-center gap-2 ${className}`}
  >
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <p className="text-muted-foreground text-sm">{text}</p>
  </div>
);
