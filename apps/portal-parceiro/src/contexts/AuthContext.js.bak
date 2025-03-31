/**
 * @deprecated Este arquivo está sendo mantido apenas para compatibilidade temporária.
 * 
 * O contexto de autenticação foi centralizado no pacote @edunexia/auth
 * 
 * Para usar a autenticação, importe diretamente:
 * import { useAuth, AuthProvider } from '@edunexia/auth';
 * 
 * E use o AuthProvider com o módulo específico:
 * <AuthProvider moduleName="PORTAL_PARCEIRO">
 *   {children}
 * </AuthProvider>
 * 
 * Este arquivo será removido em futuras versões.
 */

// Re-exportando a implementação centralizada
import { AuthProvider as CentralizedAuthProvider, useAuth as useCentralizedAuth } from '@edunexia/auth';

export const AuthContext = {
  Provider: ({ children }) => (
    <CentralizedAuthProvider moduleName="PORTAL_PARCEIRO">
      {children}
    </CentralizedAuthProvider>
  ),
  Consumer: ({ children }) => children(useCentralizedAuth())
};

export const AuthProvider = ({ children }) => (
  <CentralizedAuthProvider moduleName="PORTAL_PARCEIRO">
    {children}
  </CentralizedAuthProvider>
);

export const useAuth = useCentralizedAuth;
