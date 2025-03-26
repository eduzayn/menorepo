import { ReactNode, createContext, useContext, useState } from "react"

// Define tipos para o Toast
export interface Toast {
  id: string
  title?: string
  description?: string
  action?: ToastActionElement
  variant?: "default" | "destructive" | "success"
}

export type ToastActionElement = React.ReactNode

// Tipo para as propriedades da função toast
export interface ToastProps {
  title?: string
  description?: string
  action?: ToastActionElement
  variant?: "default" | "destructive" | "success"
}

// Tipo para o Contexto
interface ToastContextType {
  toasts: Toast[]
  addToast: (props: ToastProps) => void
  removeToast: (id: string) => void
}

// Criando o contexto
const ToastContext = createContext<ToastContextType | undefined>(undefined)

// Provider
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (props: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prevToasts) => [...prevToasts, { id, ...props }])

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeToast(id)
    }, 5000)
  }

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  )
}

// Hook para usar o toast
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

// Função de utilidade para adicionar um toast
export const toast = (props: ToastProps) => {
  // Versão simplificada para implementação posterior
  console.log("Toast:", props)
  
  // Simulação de notificação no console
  console.log("%c 🍞 Toast Notification ", "background: #333; color: white; padding: 4px; border-radius: 4px;")
  console.log(`%c ${props.title || ''} `, "font-weight: bold;")
  console.log(`%c ${props.description || ''} `, "color: #666;")
  
  // Retornando um objeto simulado (será implementado completamente depois)
  return {
    id: Math.random().toString(36).substring(2, 9),
    dismiss: () => {},
    update: () => {}
  }
} 