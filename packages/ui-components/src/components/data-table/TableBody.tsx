import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const tableBodyVariants = cva(
  "[&>tr:last-child]:border-0",
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

export interface TableBodyProps
  extends React.HTMLAttributes<HTMLTableSectionElement>,
    VariantProps<typeof tableBodyVariants> {
  children: React.ReactNode
}

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <tbody
        ref={ref}
        className={cn(tableBodyVariants({ variant }), className)}
        {...props}
      />
    )
  }
)

TableBody.displayName = "TableBody"

export { TableBody, tableBodyVariants } 