import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  isLoading?: boolean;
  showPageSize?: boolean;
  className?: string;
}

export function Pagination({
  meta,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  isLoading = false,
  showPageSize = true,
  className,
}: PaginationProps) {
  const currentPage = meta.page;
  const hasMore = meta.hasMore;
  const start = (currentPage - 1) * meta.pageSize + 1;
  const end = Math.min(currentPage * meta.pageSize, meta.total);

  return (
    <div
      className={cn("mt-4 flex items-center justify-between flex-1", className)}
    >
      {showPageSize && onPageSizeChange && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Show</span>
          <Select
            value={meta.pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder={meta.pageSize} />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">per page</span>
        </div>
      )}

      <div className="flex items-center gap-4 ml-auto">
        <span className="text-sm text-muted-foreground">
          {meta.total > 0
            ? `Showing ${start}-${end} of ${meta.total}`
            : "No results"}
        </span>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasMore || isLoading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
