import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const chatVariants = cva(
  "flex h-full w-full flex-col rounded-lg border bg-background",
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

export interface ChatProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatVariants> {
  header?: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode
}

const Chat = React.forwardRef<HTMLDivElement, ChatProps>(
  ({ className, variant, header, footer, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(chatVariants({ variant }), className)} {...props}>
        {header && (
          <div className="flex items-center justify-between border-b p-4">
            {header}
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
        {footer && (
          <div className="border-t p-4">
            {footer}
          </div>
        )}
      </div>
    )
  }
)

Chat.displayName = "Chat"

export { Chat, chatVariants } 