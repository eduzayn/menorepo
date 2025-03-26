import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input",
        error: "border-red-500 focus-visible:ring-red-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface TextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string
  error?: string
  icon?: React.ReactNode
  helperText?: string
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ className, variant, label, error, icon, helperText, type = "text", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        <div className="relative mt-2">
          {icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              inputVariants({ variant: error ? "error" : variant }),
              icon && "pl-10",
              className
            )}
            ref={ref}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
            {...props}
          />
        </div>
        {error && (
          <p
            className="mt-1 text-sm text-red-500"
            id={`${props.id}-error`}
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            className="mt-1 text-sm text-muted-foreground"
            id={`${props.id}-helper`}
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

TextField.displayName = "TextField"

export { TextField, inputVariants } 