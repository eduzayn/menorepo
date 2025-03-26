import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const tableHeaderVariants = cva(
  "border-b bg-muted/50 font-medium [&>tr]:last:border-b-0",
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

export interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement>,
    VariantProps<typeof tableHeaderVariants> {
  children: React.ReactNode
}

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <thead
        ref={ref}
        className={cn(tableHeaderVariants({ variant }), className)}
        {...props}
      />
    )
  }
)

TableHeader.displayName = "TableHeader"

export { TableHeader, tableHeaderVariants } 