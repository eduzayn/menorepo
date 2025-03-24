/// <reference types="vite/client" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare module '@edunexia/ui-components' {
  import { ComponentType, ReactNode } from 'react'

  export interface ButtonProps {
    variant?: 'primary' | 'secondary'
    className?: string
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    children: ReactNode
  }

  export interface TextFieldProps {
    id?: string
    type?: string
    label?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    required?: boolean
    placeholder?: string
    error?: string
    className?: string
  }

  export const Button: ComponentType<ButtonProps>
  export const TextField: ComponentType<TextFieldProps>
}

declare module '@edunexia/auth' {
  export interface AuthContextType {
    user: any
    loading: boolean
    error: string | null
    signIn: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
  }

  export function useAuth(): AuthContextType
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_URL: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_SUPABASE_SERVICE_ROLE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 