import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "../layout/Button"
import { Textarea } from "../form/Textarea"
import { Send, Paperclip, Smile, Mic } from "lucide-react"

const chatInputVariants = cva(
  "flex w-full items-end gap-2 rounded-lg border bg-background p-2",
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

export interface ChatInputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof chatInputVariants> {
  onSend?: (message: string) => void
  onAttach?: () => void
  onEmoji?: () => void
  onVoice?: () => void
  isLoading?: boolean
  placeholder?: string
  minRows?: number
}

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
  (
    {
      className,
      variant,
      onSend,
      onAttach,
      onEmoji,
      onVoice,
      isLoading,
      placeholder = "Digite sua mensagem...",
      minRows = 1,
      ...props
    },
    ref
  ) => {
    const [message, setMessage] = React.useState("")

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (message.trim() && onSend) {
        onSend(message.trim())
        setMessage("")
      }
    }

    return (
      <form onSubmit={handleSubmit} className={cn(chatInputVariants({ variant }), className)}>
        <div className="flex flex-1 items-end gap-2">
          <Textarea
            ref={ref}
            value={message}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
            placeholder={placeholder}
            rows={minRows}
            className="min-h-[40px] resize-none border-0 bg-transparent p-0 focus-visible:ring-0"
            {...props}
          />
          <div className="flex items-center gap-1">
            {onAttach && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onAttach}
                disabled={isLoading}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            )}
            {onEmoji && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onEmoji}
                disabled={isLoading}
              >
                <Smile className="h-4 w-4" />
              </Button>
            )}
            {onVoice && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onVoice}
                disabled={isLoading}
              >
                <Mic className="h-4 w-4" />
              </Button>
            )}
            <Button
              type="submit"
              size="icon"
              disabled={!message.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
    )
  }
)

ChatInput.displayName = "ChatInput"

export { ChatInput, chatInputVariants } 