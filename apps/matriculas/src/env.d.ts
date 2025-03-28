/// <reference types="vite/client" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare module '@edunexia/ui-components' {
  import { ComponentType, ReactNode } from 'react'

  export interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger'
    size?: 'default' | 'sm' | 'lg' | 'icon'
    className?: string
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    children: ReactNode
    onClick?: () => void
  }

  export interface TextFieldProps {
    id?: string
    type?: string
    label?: string
    value?: string | number
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    required?: boolean
    placeholder?: string
    error?: string
    className?: string
  }

  export interface InputProps {
    id?: string
    name?: string
    type?: string
    value?: string | number
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    required?: boolean
    placeholder?: string
    className?: string
  }

  export interface TextareaProps {
    id?: string
    name?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    required?: boolean
    placeholder?: string
    className?: string
    rows?: number
  }

  export interface SelectProps {
    id?: string
    name?: string
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
    required?: boolean
    placeholder?: string
    className?: string
    children: ReactNode
  }

  export const Button: ComponentType<ButtonProps>
  export const TextField: ComponentType<TextFieldProps>
  export const Input: ComponentType<InputProps>
  export const Textarea: ComponentType<TextareaProps>
  export const Select: ComponentType<SelectProps>
}

declare module '@edunexia/auth' {
  import { ReactNode } from 'react'
  import { SupabaseClient, User, Session } from '@supabase/supabase-js'
  import type { Database } from '@edunexia/database-schema'

  export interface AuthContextType {
    user: User | null
    loading: boolean
    error: string | null
    signIn: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
  }

  export interface AuthProviderProps {
    children: ReactNode
    supabaseUrl: string
    supabaseAnonKey: string
  }

  export function useAuth(): AuthContextType
  export const AuthProvider: ComponentType<AuthProviderProps>
  export function createSupabaseClient(url: string, anonKey: string): SupabaseClient<Database>
  export type { Database } from '@edunexia/database-schema'
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