import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PaginationMeta } from "@/types/subname.types";

interface PaginationProps {
  pagination: PaginationMeta;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  pagination,
  isLoading = false,
  onPageChange,
  className,
}: PaginationProps) {
  return (
    <div className={cn("flex justify-between items-center mt-4", className)}>
      <div className="text-sm text-muted-foreground">
        Showing page {pagination.page} of {pagination.totalPages}
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page === 1 || isLoading}
        >
          Previous
        </Button>
        <Button
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={!pagination.hasMore || isLoading}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
