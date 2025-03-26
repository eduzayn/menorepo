import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

import { UploadDropzone } from "./UploadDropzone"
import { UploadProgress } from "./UploadProgress"

const uploadVariants = cva(
  "flex flex-col gap-4",
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

export interface UploadProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof uploadVariants> {
  children?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
}

const Upload = React.forwardRef<HTMLDivElement, UploadProps>(
  ({ className, variant, children, header, footer, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(uploadVariants({ variant }), className)}
        {...props}
      >
        {header}
        {children}
        {footer}
      </div>
    )
  }
)

Upload.displayName = "Upload"

export {
  Upload,
  UploadDropzone,
  UploadProgress,
  uploadVariants,
} 