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
  const currentPage = pagination.page ?? 1;
  const totalPages = pagination.totalPages ?? 1;
  const hasMore = pagination.hasMore ?? false;

  return (
    <div className={cn("flex justify-between items-center mt-4", className)}>
      <div className="text-sm text-muted-foreground">
        Showing page {currentPage} of {totalPages}
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
        >
          Previous
        </Button>
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasMore || isLoading}
        >
          Next
        </Button>
      </div>
    </div>
  );
}