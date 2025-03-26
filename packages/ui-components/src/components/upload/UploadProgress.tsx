import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Progress } from "../data-display/Progress"
import { X } from "lucide-react"

const uploadProgressVariants = cva(
  "flex flex-col gap-2 rounded-lg border bg-background p-4",
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

export interface UploadProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof uploadProgressVariants> {
  file: File
  progress: number
  onCancel?: () => void
  error?: string
}

const UploadProgress = React.forwardRef<HTMLDivElement, UploadProgressProps>(
  ({ className, variant, file, progress, onCancel, error, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(uploadProgressVariants({ variant }), className)}
        {...props}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{file.name}</p>
          {onCancel && (
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground"
              onClick={onCancel}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Progress value={progress} showValue />
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    )
  }
)

UploadProgress.displayName = "UploadProgress"

export { UploadProgress, uploadProgressVariants } 