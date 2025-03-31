/**
 * @deprecated Este arquivo está sendo mantido apenas para compatibilidade temporária.
 * 
 * O contexto de autenticação foi centralizado no pacote @edunexia/auth
 * 
 * Para usar a autenticação, importe diretamente:
 * import { useAuth, AuthProvider } from '@edunexia/auth';
 * 
 * E use o AuthProvider com o módulo específico:
 * <AuthProvider moduleName="MATRICULAS">
 *   {children}
 * </AuthProvider>
 * 
 * Este arquivo será removido em futuras versões.
 */

// Re-exportando a implementação centralizada
import { AuthProvider as CentralizedAuthProvider, useAuth as useCentralizedAuth } from '@edunexia/auth'
import React from 'react'

export const AuthContext = React.createContext<any>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <CentralizedAuthProvider moduleName="MATRICULAS">
      {children}
    </CentralizedAuthProvider>
  )
}

export function useAuth() {
  return useCentralizedAuth()
} 