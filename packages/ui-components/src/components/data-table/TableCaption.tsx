import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const tableCaptionVariants = cva(
  "mt-4 text-sm text-muted-foreground",
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

export interface TableCaptionProps
  extends React.HTMLAttributes<HTMLTableCaptionElement>,
    VariantProps<typeof tableCaptionVariants> {
  children: React.ReactNode
}

const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <caption
        ref={ref}
        className={cn(tableCaptionVariants({ variant }), className)}
        {...props}
      />
    )
  }
)

TableCaption.displayName = "TableCaption"

export { TableCaption, tableCaptionVariants } 