import * as React from "react"
import { Chat } from "./Chat"
import { ChatMessage } from "./ChatMessage"
import { ChatInput } from "./ChatInput"
import { Avatar } from "../data-display/Avatar"
import { Button } from "../layout/Button"
import { MoreVertical, Phone, Video } from "lucide-react"

export function ChatExample() {
  const [messages, setMessages] = React.useState([
    {
      id: 1,
      type: "assistant" as const,
      avatar: "https://github.com/shadcn.png",
      name: "Assistente",
      content: "Olá! Como posso ajudar você hoje?",
      timestamp: "10:00",
      status: "sent" as const,
    },
    {
      id: 2,
      type: "user" as const,
      avatar: "https://github.com/radix-ui.png",
      name: "Usuário",
      content: "Preciso de ajuda com meu projeto.",
      timestamp: "10:01",
      status: "sent" as const,
    },
  ])

  const handleSend = (message: string) => {
    const newMessage = {
      id: messages.length + 1,
      type: "user" as const,
      avatar: "https://github.com/radix-ui.png",
      name: "Usuário",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent" as const,
    }
    setMessages([...messages, newMessage])
  }

  const header = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar src="https://github.com/shadcn.png" alt="Avatar" />
        <div>
          <h3 className="font-medium">Assistente</h3>
          <p className="text-sm text-muted-foreground">Online</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Phone className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Video className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  return (
    <Chat header={header} className="h-[600px]">
      <div className="flex flex-col gap-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            type={message.type}
            avatar={message.avatar}
            name={message.name}
            content={message.content}
            timestamp={message.timestamp}
            status={message.status}
          />
        ))}
      </div>
      <ChatInput
        onSend={handleSend}
        onAttach={() => console.log("Attach")}
        onEmoji={() => console.log("Emoji")}
        onVoice={() => console.log("Voice")}
        placeholder="Digite sua mensagem..."
      />
    </Chat>
  )
} 