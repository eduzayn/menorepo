import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        success: "border-green-500/50 text-green-900 dark:border-green-500 [&>svg]:text-green-900",
        error: "border-red-500/50 text-red-900 dark:border-red-500 [&>svg]:text-red-900",
        warning: "border-yellow-500/50 text-yellow-900 dark:border-yellow-500 [&>svg]:text-yellow-900",
        info: "border-blue-500/50 text-blue-900 dark:border-blue-500 [&>svg]:text-blue-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const alertIcons = {
  default: Info,
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
} as const

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string
  description?: string
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", title, description, ...props }, ref) => {
    const Icon = alertIcons[variant || "default"]

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        <Icon className="h-4 w-4" />
        <div className="grid gap-1">
          {title && (
            <h5 className="font-medium leading-none tracking-tight">{title}</h5>
          )}
          {description && (
            <div className="text-sm [&_p]:leading-relaxed">{description}</div>
          )}
        </div>
      </div>
    )
  }
)

Alert.displayName = "Alert"

export { Alert, alertVariants } 