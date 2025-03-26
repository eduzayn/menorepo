import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "../layout/Button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const tablePaginationVariants = cva(
  "flex items-center justify-between px-2",
  {
    variants: {
      variant: {
        default: "",
        ghost: "border-0 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface TablePaginationProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tablePaginationVariants> {
  pageIndex: number
  pageSize: number
  pageCount: number
  totalCount: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: number[]
}

const TablePagination = React.forwardRef<HTMLDivElement, TablePaginationProps>(
  (
    {
      className,
      variant,
      pageIndex,
      pageSize,
      pageCount,
      totalCount,
      onPageChange,
      onPageSizeChange,
      pageSizeOptions = [10, 20, 30, 40, 50],
      ...props
    },
    ref
  ) => {
    const handlePreviousPage = () => {
      if (pageIndex > 0) {
        onPageChange?.(pageIndex - 1)
      }
    }

    const handleNextPage = () => {
      if (pageIndex < pageCount - 1) {
        onPageChange?.(pageIndex + 1)
      }
    }

    return (
      <div
        ref={ref}
        className={cn(tablePaginationVariants({ variant }), className)}
        {...props}
      >
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {pageSize} por página
          </p>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
            className="h-8 rounded-md border border-input bg-background px-3 py-1 text-sm"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {pageIndex * pageSize + 1} -{" "}
            {Math.min((pageIndex + 1) * pageSize, totalCount)} de {totalCount}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePreviousPage}
              disabled={pageIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextPage}
              disabled={pageIndex === pageCount - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }
)

TablePagination.displayName = "TablePagination"

export { TablePagination, tablePaginationVariants } 