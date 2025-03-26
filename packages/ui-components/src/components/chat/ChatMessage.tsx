import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Avatar } from "../data-display/Avatar"
import { Check, Clock, AlertCircle } from "lucide-react"

const chatMessageVariants = cva(
  "flex w-full gap-3 p-4",
  {
    variants: {
      variant: {
        default: "",
        ghost: "bg-transparent",
      },
      type: {
        user: "flex-row-reverse",
        assistant: "flex-row",
      },
    },
    defaultVariants: {
      variant: "default",
      type: "user",
    },
  }
)

const messageContentVariants = cva(
  "flex flex-col gap-2 rounded-lg px-4 py-2 max-w-[80%]",
  {
    variants: {
      type: {
        user: "bg-primary text-primary-foreground",
        assistant: "bg-muted",
      },
    },
    defaultVariants: {
      type: "user",
    },
  }
)

export interface ChatMessageProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "content">,
    VariantProps<typeof chatMessageVariants> {
  type: "user" | "assistant"
  avatar?: string
  name?: string
  content: React.ReactNode
  timestamp?: string
  status?: "sending" | "sent" | "error"
  error?: string
}

const ChatMessage = React.forwardRef<HTMLDivElement, ChatMessageProps>(
  (
    {
      className,
      variant,
      type,
      avatar,
      name,
      content,
      timestamp,
      status,
      error,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(chatMessageVariants({ variant, type }), className)}
        {...props}
      >
        {avatar && (
          <Avatar
            src={avatar}
            alt={name || "Avatar"}
            className="h-8 w-8"
          />
        )}
        <div className="flex flex-col gap-1">
          {name && (
            <span className="text-sm font-medium text-muted-foreground">
              {name}
            </span>
          )}
          <div
            className={cn(messageContentVariants({ type }), {
              "animate-pulse": status === "sending",
            })}
          >
            {content}
            <div className="flex items-center gap-1 text-xs opacity-70">
              {timestamp && <span>{timestamp}</span>}
              {status === "sending" && (
                <>
                  <Clock className="h-3 w-3" />
                  <span>Enviando...</span>
                </>
              )}
              {status === "sent" && (
                <>
                  <Check className="h-3 w-3" />
                  <span>Enviado</span>
                </>
              )}
              {status === "error" && (
                <>
                  <AlertCircle className="h-3 w-3" />
                  <span>{error || "Erro ao enviar"}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
)

ChatMessage.displayName = "ChatMessage"

export { ChatMessage, chatMessageVariants, messageContentVariants } 