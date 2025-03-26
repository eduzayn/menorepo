import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const tableFooterVariants = cva(
  "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
  {
    variants: {
      variant: {
        default: "",
        striped: "[&_tr:nth-child(even)]:bg-muted/50",
        bordered: "border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface TableFooterProps
  extends React.HTMLAttributes<HTMLTableSectionElement>,
    VariantProps<typeof tableFooterVariants> {
  children: React.ReactNode
}

const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <tfoot
        ref={ref}
        className={cn(tableFooterVariants({ variant }), className)}
        {...props}
      />
    )
  }
)

TableFooter.displayName = "TableFooter"

export { TableFooter, tableFooterVariants } 