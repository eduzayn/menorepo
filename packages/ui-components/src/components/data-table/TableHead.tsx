import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const tableHeadVariants = cva(
  "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
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

export interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement>,
    VariantProps<typeof tableHeadVariants> {
  children: React.ReactNode
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <th
        ref={ref}
        className={cn(tableHeadVariants({ variant }), className)}
        {...props}
      />
    )
  }
)

TableHead.displayName = "TableHead"

export { TableHead, tableHeadVariants } 